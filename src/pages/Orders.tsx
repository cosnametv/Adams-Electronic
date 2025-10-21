import React, { useState } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { PackageIcon, TruckIcon, CheckCircleIcon, ClockIcon, EyeIcon, StarIcon, RefreshCwIcon } from 'lucide-react';

const orders = [
  {
    id: 'ORD-001',
    date: '2024-01-15',
    status: 'delivered',
    total: 129900,
    items: [
      {
        id: 1,
        name: 'iPhone 13 Pro Max - 256GB',
        image: 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1315&q=80',
        quantity: 1,
        price: 129900
      }
    ],
    trackingNumber: 'TRK123456789',
    estimatedDelivery: '2024-01-16'
  },
  {
    id: 'ORD-002',
    date: '2024-01-10',
    status: 'shipped',
    total: 79900,
    items: [
      {
        id: 4,
        name: 'Samsung 55" QLED 4K Smart TV',
        image: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1474&q=80',
        quantity: 1,
        price: 79900
      }
    ],
    trackingNumber: 'TRK987654321',
    estimatedDelivery: '2024-01-18'
  },
  {
    id: 'ORD-003',
    date: '2024-01-08',
    status: 'processing',
    total: 34900,
    items: [
      {
        id: 3,
        name: 'Sony WH-1000XM4 Wireless Headphones',
        image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=688&q=80',
        quantity: 1,
        price: 34900
      }
    ],
    trackingNumber: null,
    estimatedDelivery: '2024-01-20'
  },
  {
    id: 'ORD-004',
    date: '2024-01-05',
    status: 'delivered',
    total: 49900,
    items: [
      {
        id: 8,
        name: 'PlayStation 5 Console',
        image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
        quantity: 1,
        price: 49900
      }
    ],
    trackingNumber: 'TRK456789123',
    estimatedDelivery: '2024-01-07'
  }
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'delivered':
      return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
    case 'shipped':
      return <TruckIcon className="h-5 w-5 text-blue-500" />;
    case 'processing':
      return <ClockIcon className="h-5 w-5 text-yellow-500" />;
    default:
      return <PackageIcon className="h-5 w-5 text-gray-500" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'delivered':
      return 'bg-green-100 text-green-800';
    case 'shipped':
      return 'bg-blue-100 text-blue-800';
    case 'processing':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'delivered':
      return 'Delivered';
    case 'shipped':
      return 'Shipped';
    case 'processing':
      return 'Processing';
    default:
      return 'Unknown';
  }
};

export const Orders = () => {
  const [selectedStatus, setSelectedStatus] = useState('all');

  const filteredOrders = selectedStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === selectedStatus);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
            <p className="text-gray-600">Track and manage your orders</p>
          </div>

          {/* Filter Tabs */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => setSelectedStatus('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                  selectedStatus === 'all'
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Orders ({orders.length})
              </button>
              <button
                onClick={() => setSelectedStatus('processing')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                  selectedStatus === 'processing'
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Processing ({orders.filter(o => o.status === 'processing').length})
              </button>
              <button
                onClick={() => setSelectedStatus('shipped')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                  selectedStatus === 'shipped'
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Shipped ({orders.filter(o => o.status === 'shipped').length})
              </button>
              <button
                onClick={() => setSelectedStatus('delivered')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                  selectedStatus === 'delivered'
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Delivered ({orders.filter(o => o.status === 'delivered').length})
              </button>
            </div>
          </div>

          {/* Orders List */}
          <div className="space-y-6">
            {filteredOrders.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <PackageIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
                <p className="text-gray-600 mb-6">You don't have any orders matching the selected filter.</p>
                <a
                  href="/shop/products"
                  className="inline-flex items-center px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors duration-200"
                >
                  Start Shopping
                </a>
              </div>
            ) : (
              filteredOrders.map((order) => (
                <div key={order.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  {/* Order Header */}
                  <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(order.status)}
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                            {getStatusText(order.status)}
                          </span>
                        </div>
                        <div className="text-sm text-gray-500">
                          Order #{order.id} • {new Date(order.date).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="text-sm text-gray-500">Total</div>
                          <div className="text-lg font-semibold text-gray-900">
                            KSh {order.total.toLocaleString()}
                          </div>
                        </div>
                        <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200">
                          <EyeIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="px-6 py-4">
                    <div className="space-y-4">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center space-x-4">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-16 w-16 object-cover object-center rounded-lg"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-gray-900 truncate">
                              {item.name}
                            </h4>
                            <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                          </div>
                          <div className="text-sm font-medium text-gray-900">
                            KSh {item.price.toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Actions */}
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        {order.trackingNumber ? (
                          <span>Tracking: {order.trackingNumber}</span>
                        ) : (
                          <span>Estimated delivery: {new Date(order.estimatedDelivery).toLocaleDateString()}</span>
                        )}
                      </div>
                      <div className="flex items-center space-x-3">
                        {order.status === 'delivered' && (
                          <button className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                            <StarIcon className="h-4 w-4 mr-2" />
                            Rate Product
                          </button>
                        )}
                        {order.status === 'delivered' && (
                          <button className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                            <RefreshCwIcon className="h-4 w-4 mr-2" />
                            Reorder
                          </button>
                        )}
                        <button className="px-4 py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors duration-200">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
