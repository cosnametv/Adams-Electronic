import React, { useEffect, useMemo, useState } from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { useAuth } from '../../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { getApps, initializeApp } from 'firebase/app';
import { getDatabase, onValue, ref, update, remove } from 'firebase/database';
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

type Order = {
  id: string;
  customer: string;
  email?: string;
  total: number;
  status: 'Paid' | 'Processing' | 'Shipped' | 'Refunded';
  createdAt?: number;
};

export const Orders: React.FC = () => {
  const { role, loading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | Order['status']>('All');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    const db = getDatabase();
    const ordersRef = ref(db, 'orders');
    const off = onValue(ordersRef, (snap) => {
      const val = snap.val() || {};
      const list = Object.entries(val).map(([id, o]: any) => ({ id, ...o })) as Order[];
      list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      setOrders(list);
    });
    return () => off();
  }, []);

  const filtered = useMemo(() => {
    return orders.filter(o => {
      const matchesQuery = query ? (o.customer?.toLowerCase().includes(query.toLowerCase()) || o.email?.toLowerCase().includes(query.toLowerCase()) || o.id.toLowerCase().includes(query.toLowerCase())) : true;
      const matchesStatus = statusFilter === 'All' ? true : o.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [orders, query, statusFilter]);

  const updateStatus = async (orderId: string, newStatus: Order['status']) => {
    setUpdatingId(orderId);
    try {
      const db = getDatabase();
      await update(ref(db, `orders/${orderId}`), { status: newStatus });
    } finally {
      setUpdatingId(null);
    }
  };

  const deleteOrder = async (orderId: string) => {
    if (!confirm('Delete this order?')) return;
    const db = getDatabase();
    await remove(ref(db, `orders/${orderId}`));
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
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Orders</h1>

          {/* Filters */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
            <div className="relative w-full md:max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by order ID, customer or email"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div className="flex items-center gap-2">
              {(['All', 'Paid', 'Processing', 'Shipped', 'Refunded'] as const).map(s => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s as any)}
                  className={`px-3 py-1.5 rounded-full text-sm ${statusFilter === s ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  {s}
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3" />
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filtered.map(o => (
                    <tr key={o.id} className="hover:bg-gray-50">
                      <td className="px-6 py-3 font-mono text-sm text-gray-900">{o.id}</td>
                      <td className="px-6 py-3 text-sm text-gray-900">{o.customer}</td>
                      <td className="px-6 py-3 text-sm text-gray-700">{o.email || '—'}</td>
                      <td className="px-6 py-3 text-sm text-gray-900">KSh {Number(o.total || 0).toLocaleString()}</td>
                      <td className="px-6 py-3 text-sm">
                        <select
                          value={o.status}
                          onChange={(e) => updateStatus(o.id, e.target.value as Order['status'])}
                          className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                          disabled={updatingId === o.id}
                        >
                          <option>Paid</option>
                          <option>Processing</option>
                          <option>Shipped</option>
                          <option>Refunded</option>
                        </select>
                      </td>
                      <td className="px-6 py-3 text-right">
                        <button onClick={() => deleteOrder(o.id)} className="px-3 py-1 border border-red-300 text-red-700 rounded hover:bg-red-50 text-sm">Delete</button>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-sm text-gray-500">No orders found.</td>
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


