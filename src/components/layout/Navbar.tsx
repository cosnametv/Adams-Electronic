import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../config/firebase';

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, role, logout } = useAuth();
  const { items } = useCart();
  const navigate = useNavigate();

  const cartItemsCount = items.reduce((total, item) => total + item.quantity, 0);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!searchQuery.trim()) return;

    try {
      const productsRef = collection(db, 'products');
      const q = query(
        productsRef,
        where('name', '>=', searchQuery),
        where('name', '<=', searchQuery + '\uf8ff')
      );
      const snapshot = await getDocs(q);

      const results = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      navigate(`/shop/products?search=${encodeURIComponent(searchQuery)}`, {
        state: { results },
      });

      setSearchQuery('');
      setIsMenuOpen(false);
    } catch (error) {
      console.error('Error searching products:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <>
      {/* Top Navbar */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            {/* Logo */}
            <Link
              to="/"
              className="text-xl sm:text-2xl font-bold text-primary-600 hover:text-primary-700 transition"
            >
              Adams Electronic
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {[
                { name: 'Shop', path: '/shop/products' },
                { name: 'Categories', path: '/shop/categories' },
              ].map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="text-gray-700 hover:text-primary-600 font-medium transition-colors duration-200"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Search Bar (Desktop) */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <form onSubmit={handleSearch} className="w-full">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search by name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none transition-all"
                  />
                </div>
              </form>
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-4">
              {/* Cart */}
              <Link
                to="/shop/cart"
                className="relative text-gray-700 hover:text-primary-600 transition"
              >
                <ShoppingCart className="h-6 w-6" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-2 bg-primary-500 text-white text-xs font-semibold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </Link>

              {/* User Menu */}
              {user ? (
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition">
                    <User className="h-6 w-6" />
                    <span className="hidden sm:block text-sm font-medium">
                      {user.email?.split('@')[0] ?? 'User'}
                    </span>
                  </button>

                  <div className="absolute right-0 mt-3 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="py-1">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm hover:bg-gray-100"
                      >
                        Profile
                      </Link>
                      <Link
                        to="/orders"
                        className="block px-4 py-2 text-sm hover:bg-gray-100"
                      >
                        My Orders
                      </Link>
                      {role === 'admin' && (
                        <Link
                          to="/admin"
                          className="block px-4 py-2 text-sm hover:bg-gray-100"
                        >
                          Admin Panel
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="hidden sm:flex items-center space-x-2 text-sm font-medium">
                  <Link
                    to="/login"
                    className="hover:text-primary-600 transition"
                  >
                    Login
                  </Link>
                  <span className="text-gray-400">|</span>
                  <Link
                    to="/register"
                    className="hover:text-primary-600 transition"
                  >
                    Register
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden text-gray-700 hover:text-primary-600 transition"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Dropdown Menu */}
          <div
            className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out transform ${
              isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="flex flex-col space-y-4 py-4 border-t border-gray-200">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="px-2">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search by name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none transition"
                  />
                </div>
              </form>

              {/* Mobile Links */}
              {['Products', 'Categories', 'About', 'Contact'].map((link) => (
                <Link
                  key={link}
                  to={`/shop/${link.toLowerCase()}`}
                  onClick={() => setIsMenuOpen(false)}
                  className="px-4 text-gray-700 hover:text-primary-600 transition font-medium"
                >
                  {link}
                </Link>
              ))}

              {!user && (
                <div className="flex flex-col space-y-2 px-4">
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="hover:text-primary-600 transition"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="hover:text-primary-600 transition"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Bottom Mobile Activity Navigation */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-inner md:hidden z-50">
        <div className="flex justify-around py-2">
          <Link
            to="/shop/products"
            className="flex flex-col items-center text-gray-700 hover:text-primary-600"
          >
            <Search className="h-5 w-5" />
            <span className="text-xs">Shop</span>
          </Link>

          <Link
            to="/shop/categories"
            className="flex flex-col items-center text-gray-700 hover:text-primary-600"
          >
            <Menu className="h-5 w-5" />
            <span className="text-xs">Categories</span>
          </Link>

          <Link
            to="/shop/cart"
            className="flex flex-col items-center text-gray-700 hover:text-primary-600 relative"
          >
            <ShoppingCart className="h-5 w-5" />
            {cartItemsCount > 0 && (
              <span className="absolute top-0 right-3 bg-primary-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center">
                {cartItemsCount}
              </span>
            )}
            <span className="text-xs">Cart</span>
          </Link>

          <Link
            to={user ? '/profile' : '/login'}
            className="flex flex-col items-center text-gray-700 hover:text-primary-600"
          >
            <User className="h-5 w-5" />
            <span className="text-xs">{user ? 'Profile' : 'Login'}</span>
          </Link>
        </div>
      </div>
    </>
  );
};
