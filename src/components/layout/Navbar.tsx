import React, { useEffect, useState } from 'react';
import { ShoppingCartIcon, SearchIcon, UserIcon, MenuIcon, XIcon, ChevronDownIcon, GridIcon } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false); // Admin access disabled
  const { state: cartState } = useCart();
  const { user, role } = useAuth();
  // Track scroll position for navbar styling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow' : 'bg-white'}`}>
      <div className="border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center">
                <span className="text-2xl font-bold text-primary-600">Cosname</span>
              </Link>
              <Link to="/shop/categories" className="hidden lg:flex items-center gap-2 text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md transition-colors">
                <GridIcon className="h-5 w-5" />
                <span className="text-sm font-medium">Categories</span>
              </Link>
            </div>
            <div className="hidden md:flex flex-1 max-w-2xl mx-4">
              <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors sm:text-sm" placeholder="Search for products" type="search" />
              </div>
            </div>
            <div className="hidden sm:flex items-center space-x-2">
              <Link to={user ? "/profile" : "/auth/login"} className="px-3 py-2 text-gray-700 hover:text-primary-600 transition-colors rounded-md">
                <UserIcon className="h-6 w-6" />
              </Link>
              <Link to="/shop/cart" className="px-3 py-2 text-gray-700 hover:text-primary-600 transition-colors rounded-md relative">
              <ShoppingCartIcon className="h-6 w-6" />
              {cartState.totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-white bg-primary-600 rounded-full">
                  {cartState.totalItems}
                </span>
              )}
            </Link>
          </div>
          <div className="flex items-center sm:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 transition-colors">
              {isMenuOpen ? <XIcon className="block h-6 w-6" /> : <MenuIcon className="block h-6 w-6" />}
            </button>
            </div>
          </div>
        </div>
      </div>
      <div className="md:hidden border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors sm:text-sm" placeholder="Search for products" type="search" />
          </div>
        </div>
      </div>
      {/* Mobile menu */}
      {isMenuOpen &&         <div className="sm:hidden bg-white shadow-lg rounded-b-2xl overflow-hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link to="/" className="bg-primary-50 border-l-4 border-primary-500 text-primary-700 block pl-3 pr-4 py-2 text-base font-medium">
              Home
            </Link>
            <Link to="/shop/products" className="border-l-4 border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 block pl-3 pr-4 py-2 text-base font-medium transition-colors duration-200">
              Shop
            </Link>
            <Link to="/shop/categories" className="border-l-4 border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 block pl-3 pr-4 py-2 text-base font-medium transition-colors duration-200">
              Categories
            </Link>
            <Link to="/about" className="border-l-4 border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 block pl-3 pr-4 py-2 text-base font-medium transition-colors duration-200">
              About
            </Link>
            <Link to="/contact" className="border-l-4 border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 block pl-3 pr-4 py-2 text-base font-medium transition-colors duration-200">
              Contact
            </Link>
            {isAdmin && <Link to="/admin/dashboard" className="border-l-4 border-transparent text-primary-600 hover:bg-primary-50 hover:border-primary-300 hover:text-primary-800 block pl-3 pr-4 py-2 text-base font-medium transition-colors duration-200">
                Admin
              </Link>}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center px-4">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-primary-600 flex items-center justify-center text-white">
                  <UserIcon className="h-6 w-6" />
                </div>
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-gray-800">
                  Guest User
                </div>
                <div className="text-sm font-medium text-gray-500">
                  <Link to="/auth/login" className="text-primary-600 hover:text-primary-700 transition-colors duration-200">
                    Sign In
                  </Link>{' '}
                  /{' '}
                  <Link to="/auth/register" className="text-primary-600 hover:text-primary-700 transition-colors duration-200">
                    Register
                  </Link>
                </div>
              </div>
              <div className="ml-auto" />
            </div>
            <div className="mt-3 space-y-1">
              <Link to="/profile" className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors duration-200">
                Your Profile
              </Link>
              <Link to="/orders" className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors duration-200">
                Your Orders
              </Link>
              <Link to="/shop/cart" className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors duration-200">
                Your Cart {cartState.totalItems > 0 && `(${cartState.totalItems})`}
              </Link>
            </div>
          </div>
        </div>}
    </nav>;
};