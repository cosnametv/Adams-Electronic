import { Link } from 'react-router-dom';
import { FacebookIcon, InstagramIcon, MailIcon, PhoneIcon, MapPinIcon} from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="text-2xl font-bold text-primary-400">
              Adams Electronic
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Your trusted partner for the latest electronics and gadgets. 
              Quality products at competitive prices with excellent customer service.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/profile.php?id=61574050740862" target="_blank" className="text-gray-400 hover:text-primary-400 transition-colors">
                <FacebookIcon className="h-5 w-5" />
              </a>
                <a
                  href="https://wa.me/254700056557?text=Hello%20Adams%20Electronics%2C%20came%20from%20the%20website%20and%20am%20interested%20in%20your%20products." 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-primary-400 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 32 32"
                    fill="currentColor"
                    className="h-5 w-5"
                  >
                    <path d="M16 .8A15.1 15.1 0 0 0 2.7 22.8L.8 31.2l8.6-1.8A15.1 15.1 0 1 0 16 .8Zm0 27.6a12.4 12.4 0 0 1-6.6-1.9l-.5-.3-5.1 1.1 1.1-5-.3-.5a12.4 12.4 0 1 1 11.4 6.6Zm7.1-9.3c-.4-.2-2.3-1.1-2.7-1.3s-.6-.2-.9.2-.9 1.3-1.1 1.5-.4.3-.8.1a10 10 0 0 1-2.9-1.8 10.9 10.9 0 0 1-2-2.5c-.2-.4 0-.6.1-.8l.7-.8c.1-.2.2-.3.3-.6s0-.5 0-.6 0-.9-.4-1.4-1.1-1-1.5-1.2-.4-.1-.6 0H10a2 2 0 0 0-.6.3c-.2.3-.8.8-.8 1.9s.8 2.1.9 2.2.2.3.4.5a13.6 13.6 0 0 0 5.1 3.8c.7.3 1.2.5 1.7.6s1 .1 1.4.1a3 3 0 0 0 2-1c.2-.3.3-.6.2-.8s-.4-.3-.8-.5Z"/>
                  </svg>
                </a>

              <a href="https://www.instagram.com/adamselectronicgadgets/" target="_blank" className="text-gray-400 hover:text-primary-400 transition-colors">
                <InstagramIcon className="h-5 w-5" />
              </a>
              <a
                href="https://www.tiktok.com/@adamselectronicgadgets"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary-400 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                >
                  <path d="M12.5 2c.7 3 2.7 5.1 5.5 5.5v3.3c-1.7 0-3.3-.5-4.6-1.3v5.7a5.7 5.7 0 1 1-5.7-5.7v3a2.7 2.7 0 1 0 2.7 2.7V2h2.1Z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-primary-400 transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/shop/products" className="text-gray-300 hover:text-primary-400 transition-colors text-sm">
                  Shop
                </Link>
              </li>
              <li>
                <Link to="/shop/categories" className="text-gray-300 hover:text-primary-400 transition-colors text-sm">
                  Categories
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-primary-400 transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-primary-400 transition-colors text-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/orders" className="text-gray-300 hover:text-primary-400 transition-colors text-sm">
                  My Orders
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-gray-300 hover:text-primary-400 transition-colors text-sm">
                  My Account
                </Link>
              </li>
              <li>
                <a href="/contact" className="text-gray-300 hover:text-primary-400 transition-colors text-sm">
                  Shipping Info
                </a>
              </li>
              <li>
                <a href="/about" className="text-gray-300 hover:text-primary-400 transition-colors text-sm">
                  Returns & Exchanges
                </a>
              </li>
              <li>
                <a href="/contact" className="text-gray-300 hover:text-primary-400 transition-colors text-sm">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPinIcon className="h-5 w-5 text-primary-400" />
                <span className="text-gray-300 text-sm">
                  Sagana - Embu Highway<br />
                  Kutus, Kenya
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <PhoneIcon className="h-5 w-5 text-primary-400" />
                <span className="text-gray-300 text-sm">+254700056557</span>
              </div>
              <div className="flex items-center space-x-3">
                <MailIcon className="h-5 w-5 text-primary-400" />
                <span className="text-gray-300 text-sm">info@adamselectronic.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © 2024 Adams Electronic. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
