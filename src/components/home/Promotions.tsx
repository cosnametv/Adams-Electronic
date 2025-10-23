import { Link } from 'react-router-dom';
import { ArrowRightIcon, GiftIcon, TruckIcon, ShieldIcon } from 'lucide-react';

export const Promotions = () => {
  const promotions = [
    {
      id: 1,
      title: 'Free Shipping',
      description: 'Free shipping on orders over KSh 10,000',
      icon: TruckIcon,
      color: 'bg-blue-500',
      link: '/shop/products'
    },
    {
      id: 2,
      title: '2-Year Warranty',
      description: 'All products come with 2-year warranty',
      icon: ShieldIcon,
      color: 'bg-green-500',
      link: '/about'
    },
    {
      id: 3,
      title: 'Special Offers',
      description: 'Check out our latest deals and discounts',
      icon: GiftIcon,
      color: 'bg-purple-500',
      link: '/shop/products?category=All'
    }
  ];

  return (
    <section className="py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Us?</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          We're committed to providing the best shopping experience with quality products, 
          excellent service, and unbeatable value.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {promotions.map((promotion) => {
          const IconComponent = promotion.icon;
          return (
            <Link
              key={promotion.id}
              to={promotion.link}
              className="group bg-white rounded-xl p-8 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 hover:border-primary-200"
            >
              <div className="flex items-start space-x-4">
                <div className={`${promotion.color} p-3 rounded-lg group-hover:scale-110 transition-transform duration-200`}>
                  <IconComponent className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                    {promotion.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {promotion.description}
                  </p>
                  <div className="flex items-center text-primary-600 text-sm font-medium group-hover:text-primary-700">
                    <span>Learn more</span>
                    <ArrowRightIcon className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};
