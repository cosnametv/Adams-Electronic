import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Smartphone,
  Tv,
  Speaker,
  Home,
  Network,
  Laptop,
  Cpu,
  Headphones,
  ArrowLeftIcon,
} from 'lucide-react';

const categories = [
  {
    id: 'phones',
    name: 'Phones',
    icon: Smartphone,
    description: 'Latest smartphones and mobile devices from top brands',
    productCount: 50,
    image:
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1315&q=80',
    color: 'from-blue-500 to-blue-600',
  },
  {
    id: 'tvs',
    name: 'TVs',
    icon: Tv,
    description: 'Smart and high-definition televisions for home entertainment',
    productCount: 30,
    image:
      'https://images.unsplash.com/photo-1646861039459-fd9e3aabf3fb?auto=format&fit=crop&w=1315&q=80',
    color: 'from-red-500 to-red-600',
  },
  {
    id: 'sound-systems',
    name: 'Sound Systems',
    icon: Speaker,
    description: 'Premium speakers and home sound systems',
    productCount: 25,
    image:
      'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=1315&q=80',
    color: 'from-green-500 to-green-600',
  },
  {
    id: 'house-appliances',
    name: 'House Appliances',
    icon: Home,
    description: 'Essential and smart home appliances for everyday comfort',
    productCount: 20,
    image:
      'https://images.unsplash.com/photo-1543512214-318c7553f230?auto=format&fit=crop&w=1315&q=80',
    color: 'from-yellow-500 to-yellow-600',
  },
  {
    id: 'network-accessories',
    name: 'Network Accessories',
    icon: Network,
    description: 'Routers, switches, and reliable networking devices',
    productCount: 18,
    image:
      'https://images.unsplash.com/photo-1726033589589-c4628bbba368?auto=format&fit=crop&w=1315&q=80',
    color: 'from-indigo-500 to-indigo-600',
  },
  {
    id: 'laptops',
    name: 'Laptops',
    icon: Laptop,
    description: 'High-performance laptops for work, study, and gaming',
    productCount: 35,
    image:
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1315&q=80',
    color: 'from-purple-500 to-purple-600',
  },
  {
    id: 'electronics',
    name: 'Electronics',
    icon: Cpu,
    description: 'Quality electronic gadgets and components',
    productCount: 40,
    image:
      'https://plus.unsplash.com/premium_photo-1679079456083-9f288e224e96?auto=format&fit=crop&w=1315&q=80',
    color: 'from-cyan-500 to-cyan-600',
  },
  {
    id: 'accessories',
    name: 'Accessories',
    icon: Headphones,
    description: 'Headphones, chargers, and electronic accessories',
    productCount: 22,
    image:
      'https://images.unsplash.com/photo-1758779529327-4cbf5f8989b5?auto=format&fit=crop&w=1315&q=80',
    color: 'from-pink-500 to-pink-600',
  },
];

export function Categories() {
  const { id } = useParams();
  const navigate = useNavigate();

  const filteredCategories = id
    ? categories.filter((category) => category.id === id)
    : categories;

  const handleCategoryClick = (categoryName: string) => {
    // ✅ Navigate using query parameter instead of /categories/:id
    navigate(`/shop/products?category=${encodeURIComponent(categoryName)}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-800 mb-4"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back
          </button>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {id ? 'Category Details' : 'Product Categories'}
          </h1>
          <p className="text-gray-600">
            {id
              ? 'Explore products in this category'
              : 'Browse our wide range of electronic products by category'
            }
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCategories.map((category) => {
            const IconComponent = category.icon;
            return (
              <div
                key={category.id}
                onClick={() => handleCategoryClick(category.name)}
                className="group bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-20`} />
                  <div className="absolute top-4 right-4">
                    <div className="bg-white/90 backdrop-blur-sm rounded-full p-2">
                      <IconComponent className="w-6 h-6 text-gray-700" />
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {category.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {category.productCount} products
                    </span>
                    <span className="text-blue-600 text-sm font-medium group-hover:text-blue-700">
                      View Products →
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* No categories found message */}
        {filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Network className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Category Not Found
            </h3>
            <p className="text-gray-600 mb-6">
              The category you're looking for doesn't exist or has been removed.
            </p>
            <button
              onClick={() => navigate('/shop/categories')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              View All Categories
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
