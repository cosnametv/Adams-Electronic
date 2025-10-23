import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { AwardIcon, UsersIcon, GlobeIcon, ShieldIcon, TruckIcon, HeadphonesIcon, StarIcon, CheckIcon } from 'lucide-react';

const stats = [
  { icon: UsersIcon, value: '5,000+', label: 'Happy Customers' },
  { icon: GlobeIcon, value: '34+', label: 'Cities Served' },
  { icon: AwardIcon, value: '5+', label: 'Years Experience' },
  { icon: ShieldIcon, value: '99.9%', label: 'Satisfaction Rate' }
];

const values = [
  {
    icon: ShieldIcon,
    title: 'Quality Assurance',
    description: 'We only sell authentic, high-quality electronics from trusted brands with full warranties.'
  },
  {
    icon: TruckIcon,
    title: 'Fast Delivery',
    description: 'Free shipping on orders over KSh 10,000 with same-day delivery in Kirinyaga and next-day nationwide.'
  },
  {
    icon: HeadphonesIcon,
    title: 'Expert Support',
    description: 'Our technical experts are available 24/7 to help you choose the right products and provide support.'
  },
  {
    icon: StarIcon,
    title: 'Customer First',
    description: 'Your satisfaction is our priority. We offer 5-day returns and comprehensive after-sales support.'
  }
];


export const About = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-16">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">About Adams Electronic</h1>
              <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90">
                Your trusted partner in electronics for over 5 years. We bring you the latest technology with unmatched service and support.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <div key={index} className="text-center">
                    <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="h-8 w-8 text-primary-600" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                    <div className="text-gray-600">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Our Story */}
        <div className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
                <div className="space-y-4 text-gray-600">
                  <p>
                    Founded in 2020, Adams Electronic started as a small electronics store in Kutus with a simple mission: 
                    to make cutting-edge technology accessible to everyone in Kenya. What began as a passion project 
                    has grown into one of the country's leading electronics retailers.
                  </p>
                  <p>
                    Over the years, we've built strong relationships with top global brands and developed a reputation 
                    for quality, reliability, and exceptional customer service. Our team of experts is dedicated to 
                    helping you find the perfect electronics for your needs, whether you're a tech enthusiast, 
                    professional, or just looking for everyday gadgets.
                  </p>
                  <p>
                    Today, we serve customers across Kenya with both online and physical stores, offering the latest 
                    smartphones, laptops, home appliances, and more, all backed by our commitment to quality and 
                    customer satisfaction.
                  </p>
                </div>
              </div>
              <div className="relative">
                <img
                  src="https://plus.unsplash.com/premium_photo-1679079456083-9f288e224e96?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
                  alt="ElectroHub store"
                  className="rounded-2xl shadow-lg"
                />
                <div className="absolute -bottom-6 -right-6 bg-primary-500 text-white p-6 rounded-2xl shadow-lg">
                  <div className="text-2xl font-bold">5+</div>
                  <div className="text-sm opacity-90">Years of Excellence</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Our Values */}
        <div className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                These core values guide everything we do and shape our commitment to you.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => {
                const IconComponent = value.icon;
                return (
                  <div key={index} className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300">
                    <div className="bg-primary-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                      <IconComponent className="h-6 w-6 text-primary-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">{value.title}</h3>
                    <p className="text-gray-600 text-sm">{value.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Experience the Difference?</h2>
            <p className="text-xl text-gray-600 mb-8">
              Join thousands of satisfied customers who trust Adams Electronic for their electronics needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/shop/products"
                className="bg-primary-500 text-white px-8 py-3 rounded-lg font-medium hover:bg-primary-600 transition-colors duration-200"
              >
                Shop Now
              </a>
              <a
                href="/contact"
                className="border-2 border-primary-500 text-primary-600 px-8 py-3 rounded-lg font-medium hover:bg-primary-500 hover:text-white transition-colors duration-200"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
