import { useState, useEffect } from "react";
import { Navbar } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";
import { useAuth } from "../contexts/AuthContext";
import {
  PackageIcon,
  TruckIcon,
  CheckCircleIcon,
  ClockIcon,
  EyeIcon,
  StarIcon,
  RefreshCwIcon,
} from "lucide-react";
import { db } from "../config/firebase";
import { collection, getDocs, query, orderBy, onSnapshot } from "firebase/firestore";

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Pending Payment":
      return <ClockIcon className="h-5 w-5 text-yellow-500" />;
    case "Received":
      return <PackageIcon className="h-5 w-5 text-blue-500" />;
    case "Delivered":
      return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
    default:
      return <PackageIcon className="h-5 w-5 text-gray-500" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Pending Payment":
      return "bg-yellow-100 text-yellow-800";
    case "Received":
      return "bg-blue-100 text-blue-800";
    case "Delivered":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case "Pending Payment":
      return "Pending Payment";
    case "Received":
      return "Received";
    case "Delivered":
      return "Delivered";
    default:
      return "Unknown";
  }
};

export const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("🛒 Setting up real-time listener for user:", user?.email);
    
    if (!user?.email) {
      console.log("🛒 No user email, stopping loading");
      setLoading(false);
      return;
    }

    // Set a timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      console.log("🛒 Timeout reached, stopping loading");
      setLoading(false);
    }, 10000); // 10 seconds timeout

    try {
      console.log("🛒 Setting up real-time listener...");
      const ordersRef = collection(db, "users", user.email, "orders");
      const q = query(ordersRef, orderBy("createdAt", "desc"));
      
      // Use onSnapshot for real-time updates instead of getDocs
      const unsubscribe = onSnapshot(q, (snapshot) => {
        console.log("🛒 Real-time update received:", snapshot.docs.length, "documents");

        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        console.log("🛒 Processed orders:", data);
        setOrders(data);
        setLoading(false);
        clearTimeout(timeoutId);
      }, (error) => {
        console.error("🛒 Error in real-time listener:", error);
        setLoading(false);
        clearTimeout(timeoutId);
      });

      // Cleanup function to unsubscribe when component unmounts
      return () => {
        console.log("🛒 Cleaning up real-time listener");
        unsubscribe();
      };
    } catch (error) {
      console.error("🛒 Error setting up listener:", error);
      setLoading(false);
      clearTimeout(timeoutId);
    }
  }, [user?.email]);

  const filteredOrders =
    selectedStatus === "all"
      ? orders
      : orders.filter((order) => order.status === selectedStatus);

  // Show login prompt if user is not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <PackageIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Please log in to view your orders
            </h3>
            <p className="text-gray-600 mb-6">
              You need to be logged in to see your order history.
            </p>
            <a
              href="/login"
              className="inline-flex items-center px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors duration-200"
            >
              Log In
            </a>
          </div>
        </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              My Orders
            </h1>
            <p className="text-gray-600">
              View your recent orders and delivery status
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex flex-wrap gap-4">
              {["all", "Pending Payment", "Received", "Delivered"].map((status) => (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                    selectedStatus === status
                      ? "bg-primary-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {status === "all"
                    ? `All Orders (${orders.length})`
                    : `${getStatusText(status)} (${
                        orders.filter((o) => o.status === status).length
                      })`}
                </button>
              ))}
            </div>
          </div>

          {/* Loading */}
          {loading ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <ClockIcon className="h-16 w-16 text-gray-400 mx-auto mb-4 animate-spin" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Loading your orders...
              </h3>
              <p className="text-gray-600">Please wait a moment.</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <PackageIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No orders found
              </h3>
              <p className="text-gray-600 mb-6">
                You don’t have any orders yet.
              </p>
              <a
                href="/shop/products"
                className="inline-flex items-center px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors duration-200"
              >
                Start Shopping
              </a>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-lg shadow-sm overflow-hidden"
                >
                  {/* Order Header */}
                  <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(order.status)}
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {getStatusText(order.status)}
                          </span>
                        </div>
                        <div className="text-sm text-gray-500">
                          Order #{order.id} •{" "}
                          {order.createdAt?.toDate
                            ? order.createdAt.toDate().toLocaleDateString()
                            : "Pending"}
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="text-sm text-gray-500">Total</div>
                          <div className="text-lg font-semibold text-gray-900">
                            KSh {order.total?.toLocaleString()}
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
                      {order.items?.map((item: any, index: number) => (
                        <div
                          key={index}
                          className="flex items-center space-x-4"
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-16 w-16 object-cover rounded-lg"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-gray-900 truncate">
                              {item.name}
                            </h4>
                            <p className="text-sm text-gray-500">
                              Quantity: {item.quantity}
                            </p>
                          </div>
                          <div className="text-sm font-medium text-gray-900">
                            KSh {(item.price * item.quantity).toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Footer */}
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      Status: {getStatusText(order.status)}
                    </span>
                    <div className="flex items-center space-x-3">
                      {order.status === "Delivered" && (
                        <>
                          <button className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                            <StarIcon className="h-4 w-4 mr-2" />
                            Rate Product
                          </button>
                          <button className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                            <RefreshCwIcon className="h-4 w-4 mr-2" />
                            Reorder
                          </button>
                        </>
                      )}
                      <button className="px-4 py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};
