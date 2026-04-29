'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged
} from 'firebase/auth';
import { getAuthInstance } from '@/services/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isGuest: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  continueAsGuest: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    // Check local storage for guest session
    const guestSession = localStorage.getItem('civicos_guest');
    if (guestSession === 'true') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsGuest(true);
      setLoading(false);
    }

    const auth = getAuthInstance();
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setIsGuest(false);
        localStorage.removeItem('civicos_guest');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    const auth = getAuthInstance();
    if (!auth) throw new Error("Auth not initialized");
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const logout = async () => {
    const auth = getAuthInstance();
    if (auth) await signOut(auth);
    setIsGuest(false);
    localStorage.removeItem('civicos_guest');
  };

  const continueAsGuest = () => {
    setIsGuest(true);
    localStorage.setItem('civicos_guest', 'true');
  };

  return (
    <AuthContext.Provider value={{ user, loading, isGuest, signInWithGoogle, logout, continueAsGuest }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
