import React, { useEffect, useMemo, useState } from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { useAuth } from '../../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { getApps, initializeApp } from 'firebase/app';
import { getDatabase, onValue, ref, update } from 'firebase/database';
import { SearchIcon } from 'lucide-react';

const firebaseConfig = {
  apiKey: 'AIzaSyAdQEzEB9PaSa8S_Jns7GELHrYAPVgJHf0',
  authDomain: 'home-1e420.firebaseapp.com',
  databaseURL: 'https://home-1e420-default-rtdb.firebaseio.com',
  projectId: 'home-1e420',
  storageBucket: 'home-1e420.firebasestorage.app',
  messagingSenderId: '237502846110',
  appId: '1:237502846110:web:68729122ed80d0af7bd78f'
};
if (!getApps().length) {
  initializeApp(firebaseConfig);
}

type Customer = {
  uid: string;
  email?: string;
  name?: string;
  phone?: string;
  role?: 'admin' | 'user';
  createdAt?: number;
};

export const Customers: React.FC = () => {
  const { role, loading } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [query, setQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'All' | 'admin' | 'user'>('All');
  const [updatingUid, setUpdatingUid] = useState<string | null>(null);

  useEffect(() => {
    const db = getDatabase();
    const lowerRef = ref(db, 'users');
    const upperRef = ref(db, 'Users');

    const applySnapshot = (val: any) => {
      if (!val) return [] as Customer[];
      return Object.entries(val).map(([uid, u]: any) => ({ uid, ...u })) as Customer[];
    };

    const unsubscribers: Array<() => void> = [];

    unsubscribers.push(onValue(lowerRef, (snap) => {
      const lower = applySnapshot(snap.val());
      setCustomers((prev) => {
        // merge by uid preferring lower-case path data
        const prevMap = new Map(prev.map(c => [c.uid, c]));
        lower.forEach(c => prevMap.set(c.uid, { ...prevMap.get(c.uid), ...c }));
        return Array.from(prevMap.values()).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      });
    }));

    unsubscribers.push(onValue(upperRef, (snap) => {
      const upper = applySnapshot(snap.val());
      setCustomers((prev) => {
        const prevMap = new Map(prev.map(c => [c.uid, c]));
        upper.forEach(c => prevMap.set(c.uid, { ...c, ...prevMap.get(c.uid) }));
        return Array.from(prevMap.values()).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      });
    }));

    return () => unsubscribers.forEach(unsub => unsub());
  }, []);

  const filtered = useMemo(() => {
    return customers.filter(c => {
      const q = query.toLowerCase();
      const matchesQuery = query
        ? (c.email?.toLowerCase().includes(q) || c.name?.toLowerCase().includes(q) || c.uid.toLowerCase().includes(q))
        : true;
      const matchesRole = roleFilter === 'All' ? true : (c.role || 'user') === roleFilter;
      return matchesQuery && matchesRole;
    });
  }, [customers, query, roleFilter]);

  const updateCustomerRole = async (uid: string, newRole: 'admin' | 'user') => {
    setUpdatingUid(uid);
    try {
      const db = getDatabase();
      // write to both possible paths to keep them in sync
      await Promise.all([
        update(ref(db, `users/${uid}`), { role: newRole }),
        update(ref(db, `Users/${uid}`), { role: newRole })
      ]);
    } finally {
      setUpdatingUid(null);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-600">Loading...</div>;
  }
  if (role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Customers</h1>

          {/* Filters */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
            <div className="relative w-full md:max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by UID, name or email"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div className="flex items-center gap-2">
              {(['All', 'user', 'admin'] as const).map(r => (
                <button
                  key={r}
                  onClick={() => setRoleFilter(r)}
                  className={`px-3 py-1.5 rounded-full text-sm ${roleFilter === r ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  {r === 'All' ? 'All Roles' : r}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">UID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filtered.map(u => (
                    <tr key={u.uid} className="hover:bg-gray-50">
                      <td className="px-6 py-3 font-mono text-sm text-gray-900">{u.uid.slice(0, 10)}...</td>
                      <td className="px-6 py-3 text-sm text-gray-900">{u.name || '—'}</td>
                      <td className="px-6 py-3 text-sm text-gray-700">{u.email || '—'}</td>
                      <td className="px-6 py-3 text-sm text-gray-700">{u.phone || '—'}</td>
                      <td className="px-6 py-3 text-sm">
                        <select
                          value={u.role || 'user'}
                          onChange={(e) => updateCustomerRole(u.uid, e.target.value as 'admin' | 'user')}
                          className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                          disabled={updatingUid === u.uid}
                        >
                          <option value="user">user</option>
                          <option value="admin">admin</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-500">No customers found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};


