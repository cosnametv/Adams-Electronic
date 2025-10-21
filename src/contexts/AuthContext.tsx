import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, User } from 'firebase/auth';
import { getDatabase, ref, get, child } from 'firebase/database';

// Firebase config provided by user
const firebaseConfig = {
  apiKey: 'AIzaSyAdQEzEB9PaSa8S_Jns7GELHrYAPVgJHf0',
  authDomain: 'home-1e420.firebaseapp.com',
  databaseURL: 'https://home-1e420-default-rtdb.firebaseio.com',
  projectId: 'home-1e420',
  storageBucket: 'home-1e420.firebasestorage.app',
  messagingSenderId: '237502846110',
  appId: '1:237502846110:web:68729122ed80d0af7bd78f'
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

type Role = 'admin' | 'user';

type AuthContextValue = {
  user: User | null;
  role: Role | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        setLoading(true);
        try {
          // Prefer role by UID (try common paths: 'users' then 'Users')
          let resolvedRole: Role | null = null;
          const tryPaths = [
            `users/${firebaseUser.uid}/role`,
            `Users/${firebaseUser.uid}/role`,
          ];
          for (const p of tryPaths) {
            const snap = await get(child(ref(db), p));
            if (snap.exists()) {
              const r = String(snap.val()).toLowerCase();
              resolvedRole = r === 'admin' ? 'admin' : 'user';
              break;
            }
          }
          // Fallback: role by email key ('.' not allowed in keys)
          if (!resolvedRole && firebaseUser.email) {
            const safeEmail = firebaseUser.email.replace(/[.#$\[\]]/g, ',');
            const emailPaths = [
              `usersByEmail/${safeEmail}/role`,
              `UsersByEmail/${safeEmail}/role`,
            ];
            for (const p of emailPaths) {
              const snap = await get(child(ref(db), p));
              if (snap.exists()) {
                const r = String(snap.val()).toLowerCase();
                resolvedRole = r === 'admin' ? 'admin' : 'user';
                break;
              }
            }
          }
          setRole(resolvedRole || 'user');
        } catch (e) {
          setRole('user');
        } finally {
          setLoading(false);
        }
      } else {
        setRole(null);
        setLoading(false);
      }
    });
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  const value = useMemo(() => ({ user, role, loading, login, logout }), [user, role, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};


