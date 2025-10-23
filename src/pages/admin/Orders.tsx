import React, { useEffect, useMemo, useState } from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { useAuth } from '../../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import {
  SearchIcon,
  FilterIcon,
  EyeIcon,
  TrashIcon,
  CalendarIcon,
  PackageIcon,
  UserIcon,
  MailIcon,
  PhoneIcon,
  MapPinIcon,
} from 'lucide-react';
import {
  collection,
  getDocs,
  query,
  orderBy,
  updateDoc,
  doc,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '../../config/firebase'; // ✅ Use Firestore like Customers page

type Order = {
  id: string;
  customerId?: string;
  customerName?: string;
  email?: string;
  phone?: string;
  location?: string;
  total: number;
  status: 'Pending Payment' | 'Received' | 'Delivered';
  createdAt?: any;
  items?: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }>;
};

export const Orders: React.FC = () => {
  const { role, loading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [queryText, setQueryText] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | Order['status']>('All');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');

  // ✅ Helper to safely parse Firestore timestamps, ISO strings, or numbers
  const parseDate = (value: any): Date => {
    if (!value) return new Date(0);
    if (typeof value === 'object' && 'seconds' in value) {
      return new Date(value.seconds * 1000);
    }
    if (typeof value === 'string' || typeof value === 'number') {
      return new Date(value);
    }
    return new Date(0);
  };

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        const list = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Order[];
        setOrders(list);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };
    loadOrders();
  }, []);

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const matchesQuery = queryText
        ? o.customerName?.toLowerCase().includes(queryText.toLowerCase()) ||
        o.email?.toLowerCase().includes(queryText.toLowerCase()) ||
        o.customerId?.toLowerCase().includes(queryText.toLowerCase()) ||
        o.id.toLowerCase().includes(queryText.toLowerCase())
        : true;

      const matchesStatus = statusFilter === 'All' ? true : o.status === statusFilter;

      // ✅ Date filtering
      let matchesDate = true;
      if (dateFilter !== 'all' && o.createdAt) {
        const orderDate = parseDate(o.createdAt);
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        switch (dateFilter) {
          case 'today':
            matchesDate = orderDate >= today;
            break;
          case 'week':
            const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
            matchesDate = orderDate >= weekAgo;
            break;
          case 'month':
            const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
            matchesDate = orderDate >= monthAgo;
            break;
        }
      }

      return matchesQuery && matchesStatus && matchesDate;
    });
  }, [orders, queryText, statusFilter, dateFilter]);

  const updateStatus = async (orderId: string, newStatus: Order['status']) => {
    setUpdatingId(orderId);
    try {
      // Find the order to get user email
      const order = orders.find(o => o.id === orderId);
      if (!order) {
        console.error('Order not found');
        return;
      }

      // Update main orders collection (for admin)
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, { status: newStatus });

      // Update user's orders collection (for user panel)
      if (order.email) {
        try {
          // Query user's orders to find the matching order
          const userOrdersRef = collection(db, 'users', order.email, 'orders');
          const userOrdersSnapshot = await getDocs(userOrdersRef);
          
          console.log(`🔍 Looking for matching order for user ${order.email}`);
          console.log(`🔍 Admin order:`, { 
            total: order.total, 
            email: order.email, 
            customerName: order.customerName,
            name: order.name,
            allFields: Object.keys(order)
          });
          
          // Find the order with matching data (since IDs might be different)
          let userOrderId = null;
          userOrdersSnapshot.docs.forEach((docSnapshot) => {
            const userOrder = docSnapshot.data();
            console.log(`🔍 User order ${docSnapshot.id}:`, { 
              total: userOrder.total, 
              email: userOrder.email, 
              name: userOrder.name,
              customerName: userOrder.customerName,
              allFields: Object.keys(userOrder)
            });
            
            // More robust matching: check total, email, and name (try different field combinations)
            if (userOrder.total === order.total && 
                userOrder.email === order.email &&
                (userOrder.name === order.customerName || 
                 userOrder.name === order.name ||
                 userOrder.customerName === order.customerName ||
                 userOrder.customerName === order.name)) {
              userOrderId = docSnapshot.id;
              console.log(`✅ Found matching order: ${docSnapshot.id}`);
            }
          });

          if (userOrderId) {
            const userOrderRef = doc(db, 'users', order.email, 'orders', userOrderId);
            await updateDoc(userOrderRef, { status: newStatus });
            console.log(`✅ Order status synced to user ${order.email}`);
          } else {
            console.log(`❌ No matching order found for user ${order.email}`);
            console.log(`❌ Available user orders:`, userOrdersSnapshot.docs.map(docSnapshot => ({ id: docSnapshot.id, ...docSnapshot.data() })));
            
            // Fallback: try to match by just total and email (in case name field is different)
            userOrdersSnapshot.docs.forEach((docSnapshot) => {
              const userOrder = docSnapshot.data();
              if (userOrder.total === order.total && userOrder.email === order.email) {
                console.log(`🔄 Fallback match found: ${docSnapshot.id}`);
                const userOrderRef = doc(db, 'users', order.email, 'orders', docSnapshot.id);
                updateDoc(userOrderRef, { status: newStatus }).then(() => {
                  console.log(`✅ Order status synced via fallback to user ${order.email}`);
                }).catch(err => {
                  console.error(`❌ Fallback sync failed:`, err);
                });
              }
            });
          }
        } catch (userError) {
          console.error('Error updating user order:', userError);
          // Don't fail the whole operation if user update fails
        }
      }

      // Update local state
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (error) {
      console.error('Error updating order status:', error);
    } finally {
      setUpdatingId(null);
    }
  };

  const deleteOrder = async (orderId: string) => {
    if (!confirm('Delete this order?')) return;
    try {
      await deleteDoc(doc(db, 'orders', orderId));
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  const viewOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const closeOrderDetails = () => {
    setShowOrderDetails(false);
    setSelectedOrder(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading...
      </div>
    );
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

          {/* Filters Section */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
            <div className="flex items-center gap-4 mb-4">
              <FilterIcon className="h-5 w-5 text-gray-500" />
              <h3 className="text-lg font-semibold text-gray-900">Filters & Search</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {/* Search */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  value={queryText}
                  onChange={(e) => setQueryText(e.target.value)}
                  placeholder="Search by order ID, customer or email"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2 flex-wrap">
                {(['All', 'Pending Payment', 'Received', 'Delivered'] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s as any)}
                    className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${statusFilter === s
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    {s}
                  </button>
                ))}
              </div>

              {/* Date Filter */}
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-gray-500" />
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value as any)}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                </select>
              </div>
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Items
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filtered.map((o) => (
                    <tr key={o.id} className="hover:bg-gray-50">
                      <td className="px-6 py-3 font-mono text-sm text-gray-900">
                        {o.id.slice(0, 8)}...
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-900">
                        <div>
                        
                          <div className="font-medium">
                            {o.customerName || (o.items && o.items[0]?.name) || 'Unknown'}
                          </div>

                          {o.location && (
                            <div className="text-xs text-gray-500 flex items-center">
                              <MapPinIcon className="h-3 w-3 mr-1" />
                              {o.location}
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-3 text-sm text-gray-700">
                        <div className="space-y-1">
                          {o.email && (
                            <div className="flex items-center text-xs">
                              <MailIcon className="h-3 w-3 mr-1" />
                              {o.email}
                            </div>
                          )}
                          {o.phone && (
                            <div className="flex items-center text-xs">
                              <PhoneIcon className="h-3 w-3 mr-1" />
                              {o.phone}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-700">
                        <div className="flex items-center">
                          <PackageIcon className="h-4 w-4 mr-1 text-gray-400" />
                          {o.items ? o.items.length : 0} items
                        </div>
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-900 font-medium">
                        KSh {Number(o.total || 0).toLocaleString()}
                      </td>
                      <td className="px-6 py-3 text-sm">
                        <select
                          value={o.status}
                          onChange={(e) => updateStatus(o.id, e.target.value as Order['status'])}
                          className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                          disabled={updatingId === o.id}
                        >
                          <option value="Pending Payment">
                            Pending Payment
                          </option>
                          <option value="Received">Received</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-500">
                        {o.createdAt ? parseDate(o.createdAt).toLocaleDateString() : 'Unknown'}
                      </td>
                      <td className="px-6 py-3 text-right">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => viewOrderDetails(o)}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                            title="View Details"
                          >
                            <EyeIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => deleteOrder(o.id)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                            title="Delete Order"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td
                        colSpan={8}
                        className="px-6 py-8 text-center text-sm text-gray-500"
                      >
                        No orders found.
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
