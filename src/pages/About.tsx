import React from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { AwardIcon, UsersIcon, GlobeIcon, ShieldIcon, TruckIcon, HeadphonesIcon, StarIcon, CheckIcon } from 'lucide-react';

const stats = [
  { icon: UsersIcon, value: '50,000+', label: 'Happy Customers' },
  { icon: GlobeIcon, value: '100+', label: 'Cities Served' },
  { icon: AwardIcon, value: '15+', label: 'Years Experience' },
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
    description: 'Free shipping on orders over KSh 10,000 with same-day delivery in Nairobi and next-day nationwide.'
  },
  {
    icon: HeadphonesIcon,
    title: 'Expert Support',
    description: 'Our technical experts are available 24/7 to help you choose the right products and provide support.'
  },
  {
    icon: StarIcon,
    title: 'Customer First',
    description: 'Your satisfaction is our priority. We offer 30-day returns and comprehensive after-sales support.'
  }
];

const team = [
  {
    name: 'John Mwangi',
    role: 'CEO & Founder',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    bio: 'Passionate about technology and customer satisfaction, John founded ElectroHub in 2008.'
  },
  {
    name: 'Sarah Wanjiku',
    role: 'Head of Operations',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    bio: 'Sarah ensures smooth operations and maintains our high standards of service delivery.'
  },
  {
    name: 'David Kimani',
    role: 'Technical Director',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    bio: 'David leads our technical team and ensures all products meet the highest quality standards.'
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
              <h1 className="text-4xl md:text-5xl font-bold mb-6">About ElectroHub</h1>
              <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90">
                Your trusted partner in electronics for over 15 years. We bring you the latest technology with unmatched service and support.
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
                    Founded in 2008, ElectroHub started as a small electronics store in Nairobi with a simple mission: 
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
                  src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
                  alt="ElectroHub store"
                  className="rounded-2xl shadow-lg"
                />
                <div className="absolute -bottom-6 -right-6 bg-primary-500 text-white p-6 rounded-2xl shadow-lg">
                  <div className="text-2xl font-bold">15+</div>
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

        {/* Our Team */}
        <div className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                The passionate people behind ElectroHub who make everything possible.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {team.map((member, index) => (
                <div key={index} className="text-center">
                  <div className="relative mb-6">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-32 h-32 rounded-full mx-auto object-cover"
                    />
                    <div className="absolute -bottom-2 -right-2 bg-primary-500 text-white w-8 h-8 rounded-full flex items-center justify-center">
                      <CheckIcon className="h-4 w-4" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>
                  <p className="text-primary-600 font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="bg-primary-500 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Why Choose ElectroHub?</h2>
              <p className="text-xl opacity-90 max-w-2xl mx-auto">
                We're not just another electronics store. Here's what makes us different.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShieldIcon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Authentic Products</h3>
                <p className="opacity-90">100% genuine products with manufacturer warranties</p>
              </div>
              <div className="text-center">
                <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TruckIcon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Fast & Free Delivery</h3>
                <p className="opacity-90">Free shipping on orders over KSh 10,000</p>
              </div>
              <div className="text-center">
                <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <HeadphonesIcon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Expert Support</h3>
                <p className="opacity-90">24/7 technical support and guidance</p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Experience the Difference?</h2>
            <p className="text-xl text-gray-600 mb-8">
              Join thousands of satisfied customers who trust ElectroHub for their electronics needs.
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
