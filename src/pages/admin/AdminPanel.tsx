import React, { useEffect, useState } from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { useAuth } from '../../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { ShoppingCartIcon, UsersIcon, PackageIcon, TrendingUpIcon, PlusCircleIcon, SettingsIcon } from 'lucide-react';
import { getApps, initializeApp } from 'firebase/app';
import { getDatabase, onValue, ref } from 'firebase/database';

// Ensure Firebase app is initialized (reuse same config)
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

export const AdminPanel: React.FC = () => {
  const { role, loading } = useAuth();
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const recentOrders = [
    { id: 'ORD-1024', customer: 'Jane Doe', total: 129900, status: 'Paid', date: '2025-10-15' },
    { id: 'ORD-1023', customer: 'John Smith', total: 34900, status: 'Refunded', date: '2025-10-14' },
    { id: 'ORD-1022', customer: 'Mary Njeri', total: 79900, status: 'Shipped', date: '2025-10-14' },
    { id: 'ORD-1021', customer: 'Ali Hassan', total: 4999, status: 'Processing', date: '2025-10-13' },
  ];
  const recentUsers = [
    { id: 'u_1', name: 'Joseph Waweru', email: 'cosname4967@gmail.com', role: 'admin', joined: '2025-10-12' },
    { id: 'u_2', name: 'Jane Doe', email: 'jane@example.com', role: 'user', joined: '2025-10-11' },
    { id: 'u_3', name: 'John Smith', email: 'john@example.com', role: 'user', joined: '2025-10-10' },
    { id: 'u_4', name: 'Mary Njeri', email: 'mary@example.com', role: 'user', joined: '2025-10-09' },
  ];

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-600">Loading...</div>;
  }

  if (role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  useEffect(() => {
    const db = getDatabase();
    const productsRef = ref(db, 'products');
    const off = onValue(productsRef, (snap) => {
      const val = snap.val() || {};
      const list = Object.entries(val).map(([id, p]: any) => ({ id, ...p }));
      list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      setAllProducts(list);
    });
    return () => off();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin Panel</h1>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">1,284</p>
                </div>
                <ShoppingCartIcon className="h-8 w-8 text-primary-600" />
              </div>
              <div className="text-xs text-green-600 mt-2 flex items-center"><TrendingUpIcon className="h-4 w-4 mr-1" /> +4.2% this week</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">KSh 8.2M</p>
                </div>
                <TrendingUpIcon className="h-8 w-8 text-primary-600" />
              </div>
              <div className="text-xs text-green-600 mt-2">+8.9% this month</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Active Products</p>
                  <p className="text-2xl font-bold text-gray-900">342</p>
                </div>
                <PackageIcon className="h-8 w-8 text-primary-600" />
              </div>
              <div className="text-xs text-gray-500 mt-2">12 low on stock</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Customers</p>
                  <p className="text-2xl font-bold text-gray-900">5,476</p>
                </div>
                <UsersIcon className="h-8 w-8 text-primary-600" />
              </div>
              <div className="text-xs text-green-600 mt-2">+215 new this week</div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <a href="/admin/products" className="bg-white border border-gray-200 rounded-xl p-6 hover:border-primary-200 transition-colors">
              <div className="flex items-center gap-3 text-gray-900 font-semibold"><PlusCircleIcon className="h-5 w-5 text-primary-600" /> Add Product</div>
              <p className="text-sm text-gray-600 mt-2">Create a new product listing</p>
            </a>
            <a href="/admin/orders" className="bg-white border border-gray-200 rounded-xl p-6 hover:border-primary-200 transition-colors">
              <div className="flex items-center gap-3 text-gray-900 font-semibold"><ShoppingCartIcon className="h-5 w-5 text-primary-600" /> View Orders</div>
              <p className="text-sm text-gray-600 mt-2">Review and manage recent orders</p>
            </a>
            <a href="/admin/settings" className="bg-white border border-gray-200 rounded-xl p-6 hover:border-primary-200 transition-colors">
              <div className="flex items-center gap-3 text-gray-900 font-semibold"><SettingsIcon className="h-5 w-5 text-primary-600" /> Store Settings</div>
              <p className="text-sm text-gray-600 mt-2">Update preferences and policies</p>
            </a>
          </div>

          {/* Recent Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Orders */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
                <a href="/admin/orders" className="text-sm text-primary-600 hover:text-primary-700">View all</a>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentOrders.map((o) => (
                      <tr key={o.id} className="hover:bg-gray-50">
                        <td className="px-6 py-3 font-mono text-sm text-gray-900">{o.id}</td>
                        <td className="px-6 py-3 text-sm text-gray-700">{o.customer}</td>
                        <td className="px-6 py-3 text-sm text-gray-900">KSh {o.total.toLocaleString()}</td>
                        <td className="px-6 py-3 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            o.status === 'Paid' ? 'bg-green-100 text-green-700' :
                            o.status === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                            o.status === 'Processing' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>{o.status}</span>
                        </td>
                        <td className="px-6 py-3 text-sm text-gray-500">{o.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Users */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Recent Users</h3>
                <a href="/admin/customers" className="text-sm text-primary-600 hover:text-primary-700">View all</a>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-gray-50">
                        <td className="px-6 py-3 text-sm text-gray-900">{u.name}</td>
                        <td className="px-6 py-3 text-sm text-gray-700">{u.email}</td>
                        <td className="px-6 py-3 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}`}>{u.role}</span>
                        </td>
                        <td className="px-6 py-3 text-sm text-gray-500">{u.joined}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* All Products Added */}
          <div className="mt-8 bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">All Products Added</h3>
              <a href="/admin/products" className="text-sm text-primary-600 hover:text-primary-700">Manage</a>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {allProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-3">
                          {p.image ? <img src={p.image} alt={p.name} className="h-9 w-9 rounded object-cover" /> : <div className="h-9 w-9 rounded bg-gray-100" />}
                          <div>
                            <div className="text-sm font-medium text-gray-900">{p.name}</div>
                            <div className="text-xs text-gray-500">{p.brand || '—'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-700">{p.category}</td>
                      <td className="px-6 py-3 text-sm text-gray-900">KSh {Number(p.price || 0).toLocaleString()}</td>
                      <td className="px-6 py-3 text-sm text-gray-700">{p.stock ?? 0}</td>
                    </tr>
                  ))}
                  {allProducts.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-sm text-gray-500">No products found. Create your first product from the Add Product page.</td>
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


