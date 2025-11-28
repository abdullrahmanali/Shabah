import React, { createContext, useContext, useState } from 'react';

export type User = {
  email: string;
  displayName: string;
};

type AuthContextValue = {
  user: User | null;
  pendingEmail: string | null;
  signInWithEmail: (email: string) => void;
  verifyCode: (code: string) => boolean;
  completeOnboarding: (displayName: string) => void;
  updateProfile: (displayName: string) => void;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);

  const signInWithEmail = (email: string) => {
    setPendingEmail(email);
  };

  const verifyCode = (code: string) => {
    const isValid = code.trim().length === 6;
    return isValid;
  };

  const completeOnboarding = (displayName: string) => {
    if (!pendingEmail) return;
    setUser({ email: pendingEmail, displayName });
    setPendingEmail(null);
  };

  const updateProfile = (displayName: string) => {
    setUser((prev) => (prev ? { ...prev, displayName } : prev));
  };

  const signOut = () => {
    setUser(null);
    setPendingEmail(null);
  };

  return (
    <AuthContext.Provider value={{ user, pendingEmail, signInWithEmail, verifyCode, completeOnboarding, updateProfile, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuthState() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthState must be used inside AuthProvider');
  return ctx;
}
