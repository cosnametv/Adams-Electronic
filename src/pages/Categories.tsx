import React from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { SmartphoneIcon, LaptopIcon, HeadphonesIcon, TvIcon, HomeIcon, DroneIcon, WatchIcon, GamepadIcon, TabletIcon, CameraIcon, ArrowLeftIcon } from 'lucide-react';

const categories = [
  {
    id: 'smartphones',
    name: 'Smartphones',
    icon: SmartphoneIcon,
    description: 'Latest smartphones from top brands',
    productCount: 45,
    image: 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1315&q=80',
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: 'laptops',
    name: 'Laptops',
    icon: LaptopIcon,
    description: 'High-performance laptops for work and gaming',
    productCount: 32,
    image: 'https://images.unsplash.com/photo-1629131726692-1accd0c53ce0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    color: 'from-purple-500 to-purple-600'
  },
  {
    id: 'audio',
    name: 'Audio',
    icon: HeadphonesIcon,
    description: 'Headphones, speakers, and audio equipment',
    productCount: 28,
    image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=688&q=80',
    color: 'from-green-500 to-green-600'
  },
  {
    id: 'tvs',
    name: 'TVs & Displays',
    icon: TvIcon,
    description: 'Smart TVs and display monitors',
    productCount: 18,
    image: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1474&q=80',
    color: 'from-red-500 to-red-600'
  },
  {
    id: 'smart-home',
    name: 'Smart Home',
    icon: HomeIcon,
    description: 'Smart home devices and automation',
    productCount: 24,
    image: 'https://images.unsplash.com/photo-1543512214-318c7553f230?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80',
    color: 'from-yellow-500 to-yellow-600'
  },
  {
    id: 'drones',
    name: 'Drones',
    icon: DroneIcon,
    description: 'Professional and hobby drones',
    productCount: 12,
    image: 'https://images.unsplash.com/photo-1579829366248-204fe8413f31?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    color: 'from-indigo-500 to-indigo-600'
  },
  {
    id: 'wearables',
    name: 'Wearables',
    icon: WatchIcon,
    description: 'Smartwatches and fitness trackers',
    productCount: 21,
    image: 'https://images.unsplash.com/photo-1617043786394-f977fa12eddf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    color: 'from-pink-500 to-pink-600'
  },
  {
    id: 'gaming',
    name: 'Gaming',
    icon: GamepadIcon,
    description: 'Gaming consoles and accessories',
    productCount: 35,
    image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    color: 'from-orange-500 to-orange-600'
  },
  {
    id: 'tablets',
    name: 'Tablets',
    icon: TabletIcon,
    description: 'Tablets and e-readers',
    productCount: 19,
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    color: 'from-teal-500 to-teal-600'
  },
  {
    id: 'cameras',
    name: 'Cameras',
    icon: CameraIcon,
    description: 'Digital cameras and photography equipment',
    productCount: 16,
    image: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    color: 'from-cyan-500 to-cyan-600'
  }
];

export const Categories = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Find the specific category if ID is provided
  const selectedCategory = id ? categories.find(cat => cat.id === id) : null;
  
  if (selectedCategory) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Back button */}
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              Back to categories
            </button>
            
            {/* Category Header */}
            <div className="text-center mb-12">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full overflow-hidden ring-4 ring-white shadow-lg">
                <img
                  src={selectedCategory.image}
                  alt={selectedCategory.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{selectedCategory.name}</h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
                {selectedCategory.description}
              </p>
              <p className="text-gray-500">
                {selectedCategory.productCount} products available
              </p>
            </div>
            
            {/* View Products Button */}
            <div className="text-center">
              <Link
                to={`/shop/products?category=${encodeURIComponent(selectedCategory.name)}`}
                className="inline-flex items-center px-8 py-4 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
              >
                View {selectedCategory.name} Products
              </Link>
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
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Shop by Category</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our wide range of electronics organized by category. Find exactly what you're looking for.
            </p>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Link
                  key={category.id}
                  to={`/shop/categories/${category.id}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
                    <div className="absolute top-4 right-4">
                      <div className={`p-3 rounded-full bg-gradient-to-r ${category.color} text-white shadow-lg`}>
                        <IconComponent className="h-6 w-6" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors duration-200">
                      {category.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {category.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        {category.productCount} products
                      </span>
                      <span className="text-primary-600 text-sm font-medium group-hover:text-primary-700">
                        Shop Now →
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Featured Categories */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Featured Categories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories.slice(0, 3).map((category) => {
                const IconComponent = category.icon;
                return (
                  <div
                    key={`featured-${category.id}`}
                    className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${category.color} flex items-center justify-center mb-6`}>
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{category.name}</h3>
                    <p className="text-gray-600 mb-4">{category.description}</p>
                    <Link
                      to={`/shop/categories/${category.id}`}
                      className={`inline-flex items-center text-sm font-medium text-white bg-gradient-to-r ${category.color} px-4 py-2 rounded-lg hover:shadow-lg transition-shadow duration-200`}
                    >
                      Explore {category.name}
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Can't find what you're looking for?</h2>
            <p className="text-lg mb-6 opacity-90">
              Browse our complete product catalog or contact us for personalized recommendations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/shop/products"
                className="bg-white text-primary-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-200"
              >
                View All Products
              </Link>
              <Link
                to="/contact"
                className="border-2 border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-primary-600 transition-colors duration-200"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
