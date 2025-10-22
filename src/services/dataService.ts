import { ref, onValue, push, set, remove, update, serverTimestamp, get } from 'firebase/database';
import { database } from '../config/firebase';

const db = database;

// Product types
export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  category: string;
  brand?: string;
  description?: string;
  features?: string[];
  rating?: number;
  reviews?: number;
  stock?: number;
  discount?: number;
  isNew?: boolean;
  createdAt?: number;
  updatedAt?: number;
  createdBy?: string;
  updatedBy?: string;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: string;
  createdAt: number;
  updatedAt?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: number;
  lastLogin?: number;
}

// Product service
export const productService = {
  // Get all products
  getProducts: (callback: (products: Product[]) => void) => {
    const productsRef = ref(db, 'products');
    return onValue(productsRef, (snapshot) => {
      const data = snapshot.val() || {};
      const products = Object.entries(data).map(([id, product]: [string, any]) => ({
        id,
        ...product
      }));
      // Sort by creation date (newest first)
      products.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      callback(products);
    });
  },

  // Get single product
  getProduct: async (id: string): Promise<Product | null> => {
    try {
      const productRef = ref(db, `products/${id}`);
      const snapshot = await get(productRef);
      if (snapshot.exists()) {
        return { id, ...snapshot.val() };
      }
      return null;
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  },

  // Create product
  createProduct: async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>, userId?: string) => {
    const productsRef = ref(db, 'products');
    const newRef = push(productsRef);
    await set(newRef, {
      ...product,
      createdAt: serverTimestamp(),
      createdBy: userId || null
    });
    return newRef.key;
  },

  // Update product
  updateProduct: async (id: string, updates: Partial<Product>, userId?: string) => {
    const productRef = ref(db, `products/${id}`);
    await update(productRef, {
      ...updates,
      updatedAt: serverTimestamp(),
      updatedBy: userId || null
    });
  },

  // Delete product
  deleteProduct: async (id: string) => {
    const productRef = ref(db, `products/${id}`);
    await remove(productRef);
  }
};

// Order service
export const orderService = {
  // Get all orders
  getOrders: (callback: (orders: Order[]) => void) => {
    const ordersRef = ref(db, 'orders');
    return onValue(ordersRef, (snapshot) => {
      const data = snapshot.val() || {};
      const orders = Object.entries(data).map(([id, order]: [string, any]) => ({
        id,
        ...order
      }));
      // Sort by creation date (newest first)
      orders.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      callback(orders);
    });
  },

  // Get orders by user
  getOrdersByUser: (userId: string, callback: (orders: Order[]) => void) => {
    const ordersRef = ref(db, 'orders');
    return onValue(ordersRef, (snapshot) => {
      const data = snapshot.val() || {};
      const orders = Object.entries(data)
        .map(([id, order]: [string, any]) => ({ id, ...order }))
        .filter((order: Order) => order.customerId === userId);
      orders.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      callback(orders);
    });
  },

  // Create order
  createOrder: async (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => {
    const ordersRef = ref(db, 'orders');
    const newRef = push(ordersRef);
    await set(newRef, {
      ...order,
      createdAt: serverTimestamp()
    });
    return newRef.key;
  },

  // Update order status
  updateOrderStatus: async (id: string, status: Order['status']) => {
    const orderRef = ref(db, `orders/${id}`);
    await update(orderRef, {
      status,
      updatedAt: serverTimestamp()
    });
  }
};

// User service
export const userService = {
  // Get all users
  getUsers: (callback: (users: User[]) => void) => {
    const usersRef = ref(db, 'users');
    return onValue(usersRef, (snapshot) => {
      const data = snapshot.val() || {};
      const users = Object.entries(data).map(([id, user]: [string, any]) => ({
        id,
        ...user
      }));
      // Sort by creation date (newest first)
      users.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      callback(users);
    });
  },

  // Get user by ID
  getUser: async (id: string): Promise<User | null> => {
    try {
      const userRef = ref(db, `users/${id}`);
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        return { id, ...snapshot.val() };
      }
      return null;
    } catch (error) {
      console.error('Error fetching user:', error);
      return null;
    }
  },

  // Create user
  createUser: async (user: Omit<User, 'id' | 'createdAt'>) => {
    const usersRef = ref(db, 'users');
    const newRef = push(usersRef);
    await set(newRef, {
      ...user,
      createdAt: serverTimestamp()
    });
    return newRef.key;
  },

  // Update user
  updateUser: async (id: string, updates: Partial<User>) => {
    const userRef = ref(db, `users/${id}`);
    await update(userRef, updates);
  }
};

// Statistics service
export const statsService = {
  // Get dashboard statistics
  getStats: async (): Promise<{
    totalOrders: number;
    totalRevenue: number;
    totalProducts: number;
    totalUsers: number;
    recentOrders: Order[];
    recentUsers: User[];
  }> => {
    try {
      const [ordersSnapshot, productsSnapshot, usersSnapshot] = await Promise.all([
        get(ref(db, 'orders')),
        get(ref(db, 'products')),
        get(ref(db, 'users'))
      ]);

      const orders = ordersSnapshot.val() || {};
      const products = productsSnapshot.val() || {};
      const users = usersSnapshot.val() || {};

      const ordersList = Object.entries(orders).map(([id, order]: [string, any]) => ({ id, ...order }));
      const usersList = Object.entries(users).map(([id, user]: [string, any]) => ({ id, ...user }));

      const totalOrders = ordersList.length;
      const totalRevenue = ordersList.reduce((sum, order) => sum + (order.total || 0), 0);
      const totalProducts = Object.keys(products).length;
      const totalUsers = Object.keys(users).length;

      // Get recent orders (last 5)
      const recentOrders = ordersList
        .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
        .slice(0, 5);

      // Get recent users (last 5)
      const recentUsers = usersList
        .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
        .slice(0, 5);

      return {
        totalOrders,
        totalRevenue,
        totalProducts,
        totalUsers,
        recentOrders,
        recentUsers
      };
    } catch (error) {
      console.error('Error fetching stats:', error);
      return {
        totalOrders: 0,
        totalRevenue: 0,
        totalProducts: 0,
        totalUsers: 0,
        recentOrders: [],
        recentUsers: []
      };
    }
  }
};
