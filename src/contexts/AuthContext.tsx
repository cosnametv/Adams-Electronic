import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { cacheService, CACHE_KEYS, CACHE_TTL } from '../services/cacheService';
import { cookieService, COOKIE_KEYS, COOKIE_OPTIONS } from '../services/cookieService';

type Role = 'admin' | 'user';

type AuthContextValue = {
  user: User | null;
  role: Role | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (fullName: string, phoneNumber: string, email: string, password: string) => Promise<void>;
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
          // Check cache first for user role
          const cachedAuth = cacheService.get<{ role: Role }>(`${CACHE_KEYS.AUTH}_${firebaseUser.uid}`, {
            ttl: CACHE_TTL.AUTH,
            storage: 'localStorage'
          });

          if (cachedAuth) {
            console.log('🔐 Auth data loaded from cache');
            setRole(cachedAuth.role);
            setLoading(false);
            return;
          }

          // Check role in Firestore
          const userDoc = await getDoc(doc(db, 'Users', firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            const userRole = userData.role?.toLowerCase();
            const role = userRole === 'admin' ? 'admin' : 'user';
            setRole(role);

            // Cache the auth data
            cacheService.set(`${CACHE_KEYS.AUTH}_${firebaseUser.uid}`, { role }, {
              ttl: CACHE_TTL.AUTH,
              storage: 'localStorage'
            });

            // Also save to cookies for persistence
            cookieService.setJSON(`${COOKIE_KEYS.AUTH}_${firebaseUser.uid}`, { role }, COOKIE_OPTIONS.SESSION_ID);
            
            console.log('🔐 Auth data loaded from Firebase and cached');
          } else {
            setRole('user');
          }
        } catch (e) {
          console.warn('Auth error, using cached data:', e);
          // Try to load from cookies as fallback
          const cookieAuth = cookieService.getJSON<{ role: Role }>(`${COOKIE_KEYS.AUTH}_${firebaseUser.uid}`);
          if (cookieAuth) {
            setRole(cookieAuth.role);
          } else {
            setRole('user');
          }
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

  const register = async (fullName: string, phoneNumber: string, email: string, password: string) => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save user data to Firestore with auto createdAt
      await setDoc(doc(db, 'Users', user.uid), {
        name: fullName,
        phoneNumber,
        email,
        role: 'user',
        uid: user.uid,
        createdAt: new Date().toISOString() // Format: 2025-10-22T06:56:56.207Z
      });

      console.log('✅ User registered successfully:', { fullName, phoneNumber, email });
    } catch (error) {
      console.error('❌ Registration failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    // Clear auth cache and cookies
    if (user) {
      try {
        cacheService.remove(`${CACHE_KEYS.AUTH}_${user.uid}`);
        cookieService.remove(`${COOKIE_KEYS.AUTH}_${user.uid}`);
        console.log('🔐 Auth cache cleared on logout');
      } catch (error) {
        console.warn('Failed to clear auth cache:', error);
      }
    }
    
    await signOut(auth);
  };

  const value = useMemo(() => ({ user, role, loading, login, register, logout }), [user, role, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};


