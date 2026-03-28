
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  User as FirebaseUser 
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
          const adminDoc = await getDoc(doc(db, 'admins', firebaseUser.uid));
          if (adminDoc.exists()) {
            role = 'admin';
          } else {
            const ngoDoc = await getDoc(doc(db, 'ngo_profiles', firebaseUser.uid));
            if (ngoDoc.exists()) {
              role = 'ngo';
            }
          }
        } catch (e) {
          console.warn("Role check failed, defaulting to volunteer:", e);
        }

        setUser({
          id: firebaseUser.uid,
          name: firebaseUser.displayName,
          email: firebaseUser.email,
          role: role,
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
      await signInWithEmailAndPassword(auth, email, password);
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
          role: 'super_admin'
        };

        // Attempt to create the admin document
        await setDoc(adminRef, adminData).catch(async (serverError) => {
          const permissionError = new FirestorePermissionError({
            path: adminRef.path,
            operation: 'create',
            requestResourceData: adminData,
          });
          errorEmitter.emit('permission-error', permissionError);
          throw serverError;
        });
      }

      setUser({
        id: firebaseUser.uid,
        name,
        email,
        role,
      });

      router.push('/dashboard');
    } catch (error: any) {
      // Re-throw if it wasn't already emitted or handled
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
