import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { ArrowLeftIcon, CheckIcon } from "lucide-react";
import { db } from '../config/firebase';
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export const Checkout = () => {
  const { state, clearCart } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
  });

  // Auto-fill email and name when user is logged in
  useEffect(() => {
    if (user?.email) {
      setFormData(prev => ({
        ...prev,
        email: user.email || "",
        name: user.displayName || prev.name // Use display name if available
      }));
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.phone || !formData.location || !formData.name) {
      alert("Please fill in all required fields.");
      return;
    }

    setLoading(true);

    try {
      // Build order object
      const orderData = {
        ...formData,
        total: state.totalPrice,
        items: state.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        status: "Pending Payment Confirmation",
        createdAt: serverTimestamp(),
      };

      // ✅ Save to "orders" collection (for admin)
      await addDoc(collection(db, "orders"), orderData);

      // ✅ Also save under user’s email (for user viewing)
      await addDoc(collection(db, "users", formData.email, "orders"), orderData);

      setSubmitted(true);
      clearCart();

      setTimeout(() => {
        navigate("/orders");
      }, 3000);
    } catch (error) {
      console.error("Error saving order:", error);
      alert("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-16 text-center py-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Your cart is empty
          </h1>
          <p className="text-gray-600 mb-8">
            Add some items to your cart before checking out.
          </p>
          <Link
            to="/shop/products"
            className="inline-flex items-center px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Continue Shopping
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const total = state.totalPrice;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-16 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                Checkout Information
              </h2>
              {user?.email && (
                <div className="flex items-center text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
                  <CheckIcon className="h-4 w-4 mr-1" />
                  Logged in as {user.email}
                </div>
              )}
            </div>

            {submitted ? (
              <div className="text-center py-8">
                <CheckIcon className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Order Received!
                </h3>
                <p className="text-gray-600">
                  Thank you, {formData.name}. You’ll be redirected shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                    {user?.displayName && (
                      <span className="ml-2 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                        ✓ Auto-filled
                      </span>
                    )}
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder={user?.displayName ? "Name from your account" : "Enter your full name"}
                  />
                  {user?.displayName && (
                    <p className="mt-1 text-xs text-gray-500">
                      Using name from your logged-in account
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                    {user?.email && (
                      <span className="ml-2 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                        ✓ Auto-filled
                      </span>
                    )}
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    readOnly={!!user?.email}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 ${
                      user?.email ? 'bg-gray-50 cursor-not-allowed' : ''
                    }`}
                    placeholder={user?.email ? "Email from your account" : "Enter your email"}
                  />
                  {user?.email && (
                    <div className="mt-1 flex items-center justify-between">
                      <p className="text-xs text-gray-500">
                        Using email from your logged-in account
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          logout();
                          setFormData(prev => ({ ...prev, email: "", name: "" }));
                        }}
                        className="text-xs text-red-600 hover:text-red-700 underline"
                      >
                        Use different email
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    placeholder="07XXXXXXXX"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., Nairobi CBD, Rongai"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors duration-200 font-medium"
                >
                  {loading ? "Placing Order..." : "Confirm & Place Order"}
                </button>
              </form>
            )}
          </div>

          {/* Order Summary */}
          <div className="bg-white p-6 rounded-lg shadow-sm h-fit">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Order Summary
            </h2>

            <div className="space-y-4 mb-6">
              {state.items.map((item) => (
                <div key={item.id} className="flex items-center space-x-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-12 w-12 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {item.name}
                    </h4>
                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    KSh {(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span className="font-medium">
                  KSh {state.totalPrice.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span>Shipping</span>
                <span className="font-medium text-green-600">Free</span>
              </div>

              <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-2">
                <span>Total</span>
                <span>KSh {total.toLocaleString()}</span>
              </div>
            </div>

                <div className="mt-8 p-4 bg-yellow-50 border border-yellow-300 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Payment Instructions (M-Pesa)
                  </h3>
                  <p className="text-gray-700 text-sm">
                    Kindly make your payment via <b>M-Pesa Paybill</b> before
                    placing your order:
                  </p>
                  <ul className="mt-2 text-sm text-gray-800 space-y-1">
                    <li>
                      <b>Business Number:</b> 247247
                    </li>
                    <li>
                      <b>Account Number:</b> 0700056557
                    </li>
                    <li>
                      <b>Amount:</b> KSh {total.toLocaleString()}
                    </li>
                  </ul>
                  <p className="mt-3 text-xs text-gray-600 italic">
                    After payment, confirm by placing your order below.
                  </p>
                </div>
                
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center text-sm text-gray-600">
                <CheckIcon className="h-5 w-5 text-green-500 mr-2" />
                Secure checkout via M-Pesa
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
