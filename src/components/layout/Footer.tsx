import React from 'react';
import { FacebookIcon, InstagramIcon, TwitterIcon } from 'lucide-react';
export const Footer = () => {
  return <footer className="bg-white border-t border-gray-200 text-gray-700">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <h3 className="text-2xl font-bold text-primary-600 mb-3">Cosname</h3>
            <p className="text-gray-600 mb-4">
              Fresh deals, fast delivery, secure checkout. Your everyday marketplace.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="text-gray-500 hover:text-primary-600">
                <FacebookIcon className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-primary-600">
                <InstagramIcon className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-primary-600">
                <TwitterIcon className="h-5 w-5" />
              </a>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/shop/products" className="hover:text-primary-600">All products</a></li>
              <li><a href="/shop/products?category=Smartphones" className="hover:text-primary-600">Smartphones</a></li>
              <li><a href="/shop/products?category=Laptops" className="hover:text-primary-600">Laptops</a></li>
              <li><a href="/shop/products?category=Audio" className="hover:text-primary-600">Audio</a></li>
              <li><a href="/shop/products?category=TVs" className="hover:text-primary-600">TVs</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/contact" className="hover:text-primary-600">Contact</a></li>
              <li><a href="/faqs" className="hover:text-primary-600">FAQs</a></li>
              <li><a href="/shipping" className="hover:text-primary-600">Shipping</a></li>
              <li><a href="/returns" className="hover:text-primary-600">Returns</a></li>
              <li><a href="/warranty" className="hover:text-primary-600">Warranty</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">Newsletter</h4>
            <p className="text-sm text-gray-600 mb-3">Get updates on new deals.</p>
            <form className="flex gap-2">
              <input type="email" placeholder="Email address" className="flex-1 px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500" />
              <button className="px-4 py-2 rounded-md bg-primary-600 text-white text-sm font-medium hover:bg-primary-700">Join</button>
            </form>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between text-sm text-gray-600">
          <p>© {new Date().getFullYear()} Cosname. All rights reserved.</p>
          <div className="flex gap-4 mt-3 sm:mt-0">
            <a href="/privacy" className="hover:text-primary-600">Privacy</a>
            <a href="/terms" className="hover:text-primary-600">Terms</a>
          </div>
        </div>
      </div>
    </footer>;
};