'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  getIdToken,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useAuth as useFirebaseAuth, useFirestore } from '@/firebase';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

type UserRole = 'admin' | 'ngo' | 'volunteer';

interface User {
  id: string;
  name: string | null;
  email: string | null;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const auth = useFirebaseAuth();
  const db = useFirestore();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        let role: UserRole = 'volunteer';

        try {
          // Force refresh the token to ensure auth is fully ready
          await getIdToken(firebaseUser, true);

          // Retry role detection up to 3 times with a small delay
          // This handles the race condition where auth token is not yet propagated
          for (let attempt = 0; attempt < 3; attempt++) {
            try {
              const adminDoc = await getDoc(doc(db, 'admins', firebaseUser.uid));
              if (adminDoc.exists()) {
                role = 'admin';
                break;
              }
              const ngoDoc = await getDoc(doc(db, 'ngo_profiles', firebaseUser.uid));
              if (ngoDoc.exists()) {
                role = 'ngo';
                break;
              }
              break;
            } catch (e: any) {
              if (attempt < 2) {
                // Wait 500ms before retrying
                await new Promise(res => setTimeout(res, 500));
              } else {
                console.warn('Role detection failed after 3 attempts:', e);
              }
            }
          }
        } catch (e) {
          console.warn('Token refresh failed:', e);
        }

       // Read name from admins collection if admin, otherwise use displayName
let displayName = firebaseUser.displayName;
if (role === 'admin') {
  try {
    const adminDoc = await getDoc(doc(db, 'admins', firebaseUser.uid));
    if (adminDoc.exists()) {
      displayName = adminDoc.data().name || firebaseUser.displayName;
    }
  } catch {}
}

setUser({
  id: firebaseUser.uid,
  name: displayName,
  email: firebaseUser.email,
  role,
});
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [auth, db]);

  const login = async (email: string, password: string) => {
    try {
      const credential = await signInWithEmailAndPassword(auth, email, password);
      
      // Force token refresh immediately after login
      await getIdToken(credential.user, true);
      
      // Check admin role right after login with fresh token
      let role: UserRole = 'volunteer';
      try {
        const adminDoc = await getDoc(doc(db, 'admins', credential.user.uid));
        if (adminDoc.exists()) {
          role = 'admin';
        } else {
          const ngoDoc = await getDoc(doc(db, 'ngo_profiles', credential.user.uid));
          if (ngoDoc.exists()) role = 'ngo';
        }
      } catch (e) {
        console.warn('Role check after login failed:', e);
      }

    let adminName = credential.user.displayName;
try {
  const adminDoc = await getDoc(doc(db, 'admins', credential.user.uid));
  if (adminDoc.exists()) {
    adminName = adminDoc.data().name || credential.user.displayName;
  }
} catch {}

setUser({
  id: credential.user.uid,
  name: adminName,
  email: credential.user.email,
  role,
});

      router.push('/dashboard');
    } catch (error: any) {
      throw new Error(error.message || 'Failed to authenticate.');
    }
  };

  const signup = async (name: string, email: string, password: string, role: UserRole) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      await updateProfile(firebaseUser, { displayName: name });

      if (role === 'admin') {
        const adminRef = doc(db, 'admins', firebaseUser.uid);
        const adminData = {
          id: firebaseUser.uid,
          name,
          email,
          role: 'super_admin',
          createdAt: new Date().toISOString(),
        };
        await setDoc(adminRef, adminData).catch(async (serverError) => {
          errorEmitter.emit('permission-error', new FirestorePermissionError({
            path: adminRef.path,
            operation: 'create',
            requestResourceData: adminData,
          }));
          throw serverError;
        });
      }

      setUser({ id: firebaseUser.uid, name, email, role });
      router.push('/dashboard');
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create account.');
    }
  };

  const logout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
