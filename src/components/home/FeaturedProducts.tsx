import React from 'react';
import { ProductCard } from '../ui/ProductCard';
import { Link } from 'react-router-dom';
const products = [{
  id: 1,
  name: 'iPhone 13 Pro Max - 256GB',
  price: 129900,
  image: 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1315&q=80',
  images: [
    'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1315&q=80',
    'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1315&q=80',
    'https://images.unsplash.com/photo-1511707171631-5ed69779a1bb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1315&q=80'
  ],
  category: 'Smartphones',
  brand: 'Apple',
  isNew: true,
  rating: 4.8,
  reviews: 124,
  description: 'The iPhone 13 Pro Max features a 6.7-inch Super Retina XDR display with ProMotion technology, A15 Bionic chip, and advanced camera system.',
  features: [
    '6.7-inch Super Retina XDR display with ProMotion',
    'A15 Bionic chip with 6-core CPU and 5-core GPU',
    'Pro camera system with 12MP Ultra Wide, Wide, and Telephoto cameras',
    'Face ID for secure authentication',
    '5G connectivity',
    'Up to 28 hours video playback'
  ],
  stockCount: 25
}, {
  id: 2,
  name: 'MacBook Pro 14" M1 Pro',
  price: 199900,
  image: 'https://images.unsplash.com/photo-1629131726692-1accd0c53ce0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
  images: [
    'https://images.unsplash.com/photo-1629131726692-1accd0c53ce0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
  ],
  category: 'Laptops',
  brand: 'Apple',
  rating: 4.9,
  reviews: 89,
  description: 'The MacBook Pro 14" with M1 Pro chip delivers exceptional performance for professional workflows.',
  features: [
    '14-inch Liquid Retina XDR display',
    'M1 Pro chip with 8-core CPU and 14-core GPU',
    '16GB unified memory',
    '512GB SSD storage',
    'Up to 17 hours battery life',
    'Three Thunderbolt 4 ports'
  ],
  stockCount: 12
}, {
  id: 3,
  name: 'Sony WH-1000XM4 Wireless Headphones',
  price: 34900,
  image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=688&q=80',
  images: [
    'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=688&q=80',
    'https://images.unsplash.com/photo-1583394838336-acd977736f90?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=688&q=80'
  ],
  category: 'Audio',
  brand: 'Sony',
  discount: 15,
  rating: 4.7,
  reviews: 203,
  description: 'Industry-leading noise canceling with Dual Noise Sensor technology and exceptional sound quality.',
  features: [
    'Industry-leading noise canceling',
    'Dual Noise Sensor technology',
    '30-hour battery life',
    'Quick charge: 10 min for 5 hours',
    'Touch sensor controls',
    'Speak-to-Chat technology'
  ],
  stockCount: 30
}, {
  id: 4,
  name: 'Samsung 55" QLED 4K Smart TV',
  price: 79900,
  image: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1474&q=80',
  images: [
    'https://images.unsplash.com/photo-1593305841991-05c297ba4575?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1474&q=80',
    'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1474&q=80'
  ],
  category: 'TVs',
  brand: 'Samsung',
  isNew: true,
  rating: 4.6,
  reviews: 156,
  description: 'Experience stunning 4K QLED picture quality with Quantum Dot technology and smart features.',
  features: [
    '55-inch 4K QLED display',
    'Quantum Dot technology',
    'HDR10+ support',
    'Smart TV with Tizen OS',
    'Voice control with Bixby',
    'Multiple HDMI and USB ports'
  ],
  stockCount: 8
}, {
  id: 5,
  name: 'Amazon Echo Dot (4th Gen)',
  price: 4999,
  image: 'https://images.unsplash.com/photo-1543512214-318c7553f230?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80',
  images: [
    'https://images.unsplash.com/photo-1543512214-318c7553f230?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80'
  ],
  category: 'Smart Home',
  brand: 'Amazon',
  discount: 10,
  rating: 4.4,
  reviews: 312,
  description: 'Smart speaker with Alexa voice control and improved audio quality.',
  features: [
    'Alexa voice control',
    'Improved audio quality',
    'Smart home hub',
    'Music streaming',
    'Weather and news updates',
    'Compact design'
  ],
  stockCount: 45
}, {
  id: 6,
  name: 'DJI Mini 2 Drone',
  price: 44900,
  image: 'https://images.unsplash.com/photo-1579829366248-204fe8413f31?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
  images: [
    'https://images.unsplash.com/photo-1579829366248-204fe8413f31?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    'https://images.unsplash.com/photo-1473968512647-3e447244af8f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
  ],
  category: 'Drones',
  brand: 'DJI',
  rating: 4.5,
  reviews: 78,
  description: 'Compact drone with 4K video recording and intelligent flight features.',
  features: [
    '4K video recording',
    '12MP camera',
    '31-minute flight time',
    '10km transmission range',
    'Intelligent flight modes',
    'Compact and portable'
  ],
  stockCount: 15
}, {
  id: 7,
  name: 'Apple Watch Series 7',
  price: 39900,
  image: 'https://images.unsplash.com/photo-1617043786394-f977fa12eddf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
  images: [
    'https://images.unsplash.com/photo-1617043786394-f977fa12eddf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
  ],
  category: 'Wearables',
  brand: 'Apple',
  rating: 4.7,
  reviews: 189,
  description: 'The most advanced Apple Watch with larger display and faster charging.',
  features: [
    'Larger Always-On Retina display',
    'Faster charging',
    'Blood oxygen monitoring',
    'ECG app',
    'Water resistant to 50 meters',
    'GPS + Cellular'
  ],
  stockCount: 22
}, {
  id: 8,
  name: 'PlayStation 5 Console',
  price: 49900,
  image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
  images: [
    'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
  ],
  category: 'Gaming',
  brand: 'Sony',
  discount: 5,
  rating: 4.9,
  reviews: 267,
  description: 'Next-generation gaming console with ultra-high speed SSD and ray tracing.',
  features: [
    'Ultra-high speed SSD',
    'Ray tracing',
    '4K gaming',
    'DualSense wireless controller',
    '3D audio',
    'Backward compatibility'
  ],
  stockCount: 18
}];
export const FeaturedProducts = () => {
  return <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Featured products</h2>
          <Link to="/shop/products" className="text-sm font-medium text-primary-600 hover:text-primary-700">View all</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(product => <ProductCard key={product.id} {...product} />)}
        </div>
      </div>
    </section>;
};