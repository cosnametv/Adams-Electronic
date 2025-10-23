import React, { useEffect, useState } from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { useAuth } from '../../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import {
  ShoppingCartIcon,
  PackageIcon,
  TrendingUpIcon,
  PlusCircleIcon,
  SettingsIcon,
  DollarSignIcon,
  ActivityIcon,
  ClockIcon,
  CheckCircleIcon,
  AlertCircleIcon
} from 'lucide-react';
import { statsService, Order, User } from '../../services/dataService';
import { ref, onValue } from 'firebase/database';
import { database } from '../../config/firebase';
import { db } from "../../config/firebase";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";

export const AdminPanel: React.FC = () => {
  const { role, loading } = useAuth();
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalUsers: 0,
    recentOrders: [] as Order[],
    recentUsers: [] as User[]
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const [recentUsers, setRecentUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [realtimeStats, setRealtimeStats] = useState({
    pendingOrders: 0,
    processingOrders: 0,
    shippedOrders: 0,
    deliveredOrders: 0,
    todayRevenue: 0,
    weeklyRevenue: 0,
    monthlyRevenue: 0
  });

  useEffect(() => {
    const loadRecentUsers = async () => {
      try {
        const usersRef = collection(db, "Users");
        const q = query(usersRef, orderBy("createdAt", "desc"), limit(5));
        const snapshot = await getDocs(q);

        const users = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as User[];

        setRecentUsers(users);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setUsersLoading(false);
      }
    };

    loadRecentUsers();
  }, []);

  useEffect(() => {
    const parseDate = (value: any): Date => {
      if (!value) return new Date(0);
      if (typeof value === "object" && "seconds" in value) {
        return new Date(value.seconds * 1000);
      }
      if (typeof value === "string" || typeof value === "number") {
        return new Date(value);
      }
      return new Date(0);
    };

    const productsRef = ref(database, "products");
    const productsOff = onValue(productsRef, (snap) => {
      const val = snap.val() || {};
      const list = Object.entries(val).map(([id, p]: any) => ({ id, ...p }));
      list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      setAllProducts(list);
    });

    const loadOrders = async () => {
      try {
        const ordersRef = collection(db, "orders");
        const q = query(ordersRef, orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);

        const orders = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Order[];

        setAllOrders(orders);

        // 🧮 Calculate real-time stats
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

        const todayRevenue = orders
          .filter((o) => o.createdAt && parseDate(o.createdAt) >= today)
          .reduce((sum, o) => sum + (o.total || 0), 0);

        const weeklyRevenue = orders
          .filter((o) => o.createdAt && parseDate(o.createdAt) >= weekAgo)
          .reduce((sum, o) => sum + (o.total || 0), 0);

        const monthlyRevenue = orders
          .filter((o) => o.createdAt && parseDate(o.createdAt) >= monthAgo)
          .reduce((sum, o) => sum + (o.total || 0), 0);

        setRealtimeStats({
          pendingOrders: orders.filter(
            (o) => o.status === "Pending Payment Confirmation"
          ).length,
          processingOrders: 0,
          shippedOrders: 0,
          deliveredOrders: orders.filter((o) => o.status === "Delivered").length,
          todayRevenue,
          weeklyRevenue,
          monthlyRevenue,
        });
      } catch (error) {
        console.error("Error loading orders:", error);
      }
    };

    loadOrders();
    statsService.getStats().then((statsData) => {
      setStats(statsData);
      setStatsLoading(false);
    });

    return () => {
      productsOff();
    };
  }, []);



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
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin Panel</h1>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Orders */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {statsLoading ? '...' : allOrders.length.toLocaleString()}
                  </p>
                </div>
                <ShoppingCartIcon className="h-8 w-8 text-primary-600" />
              </div>
              <div className="text-xs text-blue-600 mt-2 flex items-center">
                <ActivityIcon className="h-4 w-4 mr-1" />
                {realtimeStats.pendingOrders} pending
              </div>
            </div>

            {/* Today's Revenue */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Today's Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">
                    KSh {realtimeStats.todayRevenue.toLocaleString()}
                  </p>
                </div>
                <DollarSignIcon className="h-8 w-8 text-green-600" />
              </div>
              <div className="text-xs text-green-600 mt-2 flex items-center">
                <TrendingUpIcon className="h-4 w-4 mr-1" />
                KSh {realtimeStats.weeklyRevenue.toLocaleString()} this week
              </div>
            </div>

            {/* Active Products */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Active Products</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {allProducts.length.toLocaleString()}
                  </p>
                </div>
                <PackageIcon className="h-8 w-8 text-primary-600" />
              </div>
              <div className="text-xs text-orange-600 mt-2 flex items-center">
                <AlertCircleIcon className="h-4 w-4 mr-1" />
                {allProducts.filter(p => (p.stock || 0) < 10).length} low stock
              </div>
            </div>

            {/* Order Status Overview */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Delivered Orders</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {realtimeStats.deliveredOrders}
                  </p>
                  <p className="text-xs text-gray-500">completed</p>
                </div>
                <CheckCircleIcon className="h-8 w-8 text-green-600" />
              </div>
              <div className="text-xs text-gray-600 mt-2">
                {realtimeStats.pendingOrders} pending payment
              </div>
            </div>
          </div>

          {/* Revenue Analytics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Revenue Analytics</h3>
                <DollarSignIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Today</span>
                  <span className="text-lg font-bold text-gray-900">KSh {realtimeStats.todayRevenue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">This Week</span>
                  <span className="text-lg font-bold text-gray-900">KSh {realtimeStats.weeklyRevenue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">This Month</span>
                  <span className="text-lg font-bold text-gray-900">KSh {realtimeStats.monthlyRevenue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center border-t pt-4">
                  <span className="text-sm text-gray-600">Total Revenue</span>
                  <span className="text-xl font-bold text-primary-600">KSh {stats.totalRevenue.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Order Status</h3>
                <ActivityIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <ClockIcon className="h-4 w-4 text-yellow-500 mr-2" />
                    <span className="text-sm text-gray-600">Pending Payment</span>
                  </div>
                  <span className="text-lg font-bold text-yellow-600">{realtimeStats.pendingOrders}</span>
                </div>
                <div className="flex justify-between items-center border-t pt-4">
                  <div className="flex items-center">
                    <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-sm text-gray-600">Delivered</span>
                  </div>
                  <span className="text-lg font-bold text-green-600">{realtimeStats.deliveredOrders}</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Quick Stats</h3>
                <TrendingUpIcon className="h-6 w-6 text-primary-600" />
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Customers</span>
                  <span className="text-lg font-bold text-gray-900">{stats.totalUsers}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Active Products</span>
                  <span className="text-lg font-bold text-gray-900">{allProducts.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Low Stock Items</span>
                  <span className="text-lg font-bold text-orange-600">{allProducts.filter(p => (p.stock || 0) < 10).length}</span>
                </div>
                <div className="flex justify-between items-center border-t pt-4">
                  <span className="text-sm text-gray-600">Avg Order Value</span>
                  <span className="text-lg font-bold text-primary-600">
                    KSh {allOrders.length > 0 ? Math.round(stats.totalRevenue / allOrders.length).toLocaleString() : '0'}
                  </span>
                </div>
              </div>
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
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {allOrders.slice(0, 5).length > 0 ? (
                      allOrders.slice(0, 5).map((o) => {
                        // Safely handle createdAt (string or Timestamp)
                        let dateString: string = "";
                        if (o.createdAt) {
                          if (typeof o.createdAt === "object" && "seconds" in o.createdAt) {
                            // Firestore Timestamp
                            dateString = new Date(o.createdAt.seconds * 1000).toLocaleDateString();
                          } else if (typeof o.createdAt === "number" || typeof o.createdAt === "string") {
                            const parsedDate = new Date(o.createdAt);
                            dateString = isNaN(parsedDate.getTime()) ? "" : parsedDate.toLocaleDateString();
                          }
                        }
                        return (
                          <tr key={o.id} className="hover:bg-gray-50">
                            <td className="px-6 py-3 font-mono text-sm text-gray-900">
                              {o.id?.slice(0, 8)}...
                            </td>

                            <td className="px-6 py-3 text-sm text-gray-700">
                              <div>
                                <div className="font-medium">{o.name || "Unknown Customer"}</div>
                                <div className="text-xs text-gray-500">{o.email || "No email"}</div>
                              </div>
                            </td>

                            <td className="px-6 py-3 text-sm text-gray-700">
                              {Array.isArray(o.items) ? o.items.length : 0} items
                            </td>

                            <td className="px-6 py-3 text-sm text-gray-900 font-medium">
                              KSh {o.total?.toLocaleString() || "0"}
                            </td>

                            <td className="px-6 py-3 text-sm">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${o.status === "Delivered"
                                  ? "bg-green-100 text-green-700"
                                  : o.status === "Pending Payment Confirmation"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-gray-100 text-gray-700"
                                  }`}
                              >
                                {o.status}
                              </span>
                            </td>

                            <td className="px-6 py-3 text-sm text-gray-500">{dateString}</td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-6 py-8 text-center text-sm text-gray-500"
                        >
                          No orders yet
                        </td>
                      </tr>
                    )}
                  </tbody>

                </table>
              </div>
            </div>

            {/* Recent Users */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Recent Users</h3>
                <a href="/admin/customers" className="text-sm text-primary-600 hover:text-primary-700">
                  View all
                </a>
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
                    {usersLoading ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-8 text-center text-sm text-gray-500">
                          Loading users...
                        </td>
                      </tr>
                    ) : recentUsers.length > 0 ? (
                      recentUsers.map((u) => (
                        <tr key={u.id} className="hover:bg-gray-50">
                          <td className="px-6 py-3 text-sm text-gray-900">{u.name}</td>
                          <td className="px-6 py-3 text-sm text-gray-700">{u.email}</td>
                          <td className="px-6 py-3 text-sm">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${u.role?.toLowerCase() === "admin"
                                ? "bg-purple-100 text-purple-700"
                                : "bg-gray-100 text-gray-700"
                                }`}
                            >
                              {u.role}
                            </span>
                          </td>
                          <td className="px-6 py-3 text-sm text-gray-500">
                            {u.createdAt
                              ? new Date(u.createdAt).toLocaleDateString()
                              : "—"}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-6 py-8 text-center text-sm text-gray-500">
                          No users yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* All Products Added */}
          <div className="mt-8 bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">All Products Added</h3>
              <a href="/admin/products" className="text-sm text-primary-600 hover:text-primary-700">
                Manage
              </a>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                  </tr>
                </thead>

                <tbody className="bg-white divide-y divide-gray-200">
                  {allProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-3">
                          {/* ✅ Show first image if exists */}
                          {p.image || (p.images && Object.keys(p.images).length > 0) ? (
                            <img
                              src={p.image || Object.values(p.images)[0]}
                              alt={p.name || 'Product Image'}
                              className="h-9 w-9 rounded object-cover border"
                            />
                          ) : (
                            <div className="h-9 w-9 rounded bg-gray-100" />
                          )}


                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {p.name || 'Unnamed Product'}
                            </div>
                            <div className="text-xs text-gray-500">
                              {p.brand || '—'}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-3 text-sm text-gray-700">{p.category || '—'}</td>
                      <td className="px-6 py-3 text-sm text-gray-900">
                        KSh {Number(p.price || 0).toLocaleString()}
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-700">{p.stock ?? 0}</td>
                    </tr>
                  ))}

                  {/* ✅ If no products */}
                  {allProducts.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-sm text-gray-500">
                        No products found. Create your first product from the Add Product page.
                      </td>
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


