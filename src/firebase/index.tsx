'use client';

import React, { createContext, useContext, type ReactNode } from 'react';
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

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

let app: FirebaseApp;
let auth: Auth;
let firestore: Firestore;

function getFirebaseInstances() {
  if (!app) {
    app = getApps().length === 0 ? initializeApp(getFirebaseConfig()) : getApp();
    auth = getAuth(app);
    firestore = getFirestore(app);
  }
  return { app, auth, firestore };
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
