'use client';

import React, { createContext, useContext, useState, useEffect, useRef, type ReactNode, type DependencyList } from 'react';
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, onSnapshot, type Firestore, type Query, type CollectionReference } from 'firebase/firestore';

function getFirebaseConfig() {
  return {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? '',
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? '',
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? '',
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? '',
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? '',
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? '',
  };
}

let _app: FirebaseApp;
let _auth: Auth;
let _firestore: Firestore;

function getFirebaseInstances() {
  if (!_app) {
    _app = getApps().length === 0 ? initializeApp(getFirebaseConfig()) : getApp();
    _auth = getAuth(_app);
    _firestore = getFirestore(_app);
  }
  return { app: _app, auth: _auth, firestore: _firestore };
}

const FirebaseAuthContext = createContext<Auth | null>(null);
const FirebaseFirestoreContext = createContext<Firestore | null>(null);

export function FirebaseClientProvider({ children }: { children: ReactNode }) {
  const { auth, firestore } = getFirebaseInstances();
  return (
    <FirebaseAuthContext.Provider value={auth}>
      <FirebaseFirestoreContext.Provider value={firestore}>
        {children}
      </FirebaseFirestoreContext.Provider>
    </FirebaseAuthContext.Provider>
  );
}

export function useAuth(): Auth {
  const ctx = useContext(FirebaseAuthContext);
  if (!ctx) throw new Error('useAuth must be used within FirebaseClientProvider');
  return ctx;
}

export function useFirestore(): Firestore {
  const ctx = useContext(FirebaseFirestoreContext);
  if (!ctx) throw new Error('useFirestore must be used within FirebaseClientProvider');
  return ctx;
}

export function useMemoFirebase<T>(
  factory: () => T,
  deps: DependencyList
): T {
  const ref = useRef<T | null>(null);
  const depsRef = useRef<DependencyList>([]);
  const depsChanged = deps.some((dep, i) => dep !== depsRef.current[i]);
  if (ref.current === null || depsChanged) {
    ref.current = factory();
    depsRef.current = deps;
  }
  return ref.current;
}

export function useCollection<T = any>(
  query: Query | CollectionReference | null | undefined
): { data: T[] | null; loading: boolean; error: Error | null } {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!query) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const unsubscribe = onSnapshot(
      query,
      (snapshot) => {
        const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as T[];
        setData(docs);
        setLoading(false);
      },
      (err) => {
        console.error('useCollection error:', err);
        setError(err);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, [query]);

  return { data, loading, error };
}
