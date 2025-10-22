import { Link } from 'react-router-dom';
import {
  Smartphone,
  Tv,
  Speaker,
  Home,
  Network,
  Laptop,
  Cpu,
  Headphones,
} from 'lucide-react';

export const Categories = () => {
  const categories = [
    {
      id: 'phones',
      name: 'Phones',
      icon: Smartphone,
      image:
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80',
      count: '50+ Products',
    },
    {
      id: 'tvs',
      name: 'TVs',
      icon: Tv,
      image:
        'https://images.unsplash.com/photo-1646861039459-fd9e3aabf3fb?auto=format&fit=crop&w=400&q=80',
      count: '30+ Products',
    },
    {
      id: 'sound-systems',
      name: 'Sound Systems',
      icon: Speaker,
      image:
        'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=400&q=80',
      count: '25+ Products',
    },
    {
      id: 'house-appliances',
      name: 'House Appliances',
      icon: Home,
      image:
        'https://images.unsplash.com/photo-1543512214-318c7553f230?auto=format&fit=crop&w=400&q=80',
      count: '20+ Products',
    },
    {
      id: 'network-accessories',
      name: 'Network Accessories',
      icon: Network,
      image:
        'https://images.unsplash.com/photo-1726033589589-c4628bbba368?auto=format&fit=crop&w=400&q=80',
      count: '18+ Products',
    },
    {
      id: 'laptops',
      name: 'Laptops',
      icon: Laptop,
      image:
        'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=400&q=80',
      count: '35+ Products',
    },
    {
      id: 'electronics',
      name: 'Electronics',
      icon: Cpu,
      image:
        'https://plus.unsplash.com/premium_photo-1679079456083-9f288e224e96?auto=format&fit=crop&w=400&q=80',
      count: '40+ Products',
    },
    {
      id: 'accessories',
      name: 'Accessories',
      icon: Headphones,
      image:
        'https://images.unsplash.com/photo-1758779529327-4cbf5f8989b5?auto=format&fit=crop&w=400&q=80',
      count: '22+ Products',
    },
  ];

  return (
    <section className="py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Shop by Category
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Explore top electronics and gadgets across our main categories
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map((category) => {
          const IconComponent = category.icon;
          return (
            <Link
              key={category.id}
              to={`/shop/products?category=${category.name}`}
              className="group bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:shadow-md hover:border-primary-300 transition-all duration-200 text-center"
            >
              <div className="relative mb-4">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                </div>
                <div className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-sm">
                  <IconComponent className="h-5 w-5 text-primary-600" />
                </div>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors">
                {category.name}
              </h3>
              <p className="text-sm text-gray-500">{category.count}</p>
            </Link>
          );
        })}
      </div>

      {/* View All CTA */}
      <div className="text-center mt-12">
        <Link
          to="/categories"
          className="inline-flex items-center px-8 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium"
        >
          View All Categories
        </Link>
      </div>
    </section>
  );
};
