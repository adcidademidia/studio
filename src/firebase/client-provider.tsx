'use client';

import React, { useMemo, useEffect, type ReactNode } from 'react';
import { FirebaseProvider } from '@/firebase/provider';
import { initializeFirebase } from '@/firebase';
import { signInAnonymously } from 'firebase/auth';

interface FirebaseClientProviderProps {
  children: ReactNode;
}

export function FirebaseClientProvider({ children }: FirebaseClientProviderProps) {
  const firebaseServices = useMemo(() => {
    return initializeFirebase();
  }, []);

  useEffect(() => {
    // Automatically sign in the user anonymously when the app loads.
    // This is necessary for Firestore security rules that require authentication.
    const signIn = async () => {
      if (firebaseServices.auth.currentUser) return; // Already signed in
      try {
        await signInAnonymously(firebaseServices.auth);
      } catch (error) {
        console.error("Anonymous sign-in failed:", error);
      }
    };

    signIn();
  }, [firebaseServices.auth]);

  return (
    <FirebaseProvider
      firebaseApp={firebaseServices.firebaseApp}
      auth={firebaseServices.auth}
      firestore={firebaseServices.firestore}
    >
      {children}
    </FirebaseProvider>
  );
}
