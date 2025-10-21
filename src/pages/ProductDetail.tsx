import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { useCart } from '../contexts/CartContext';
import { ArrowLeftIcon, StarIcon, HeartIcon, ShareIcon, TruckIcon, ShieldIcon, RotateCcwIcon } from 'lucide-react';

// Mock product data - in a real app, this would come from an API
const products = [
  {
    id: 1,
    name: 'iPhone 13 Pro Max - 256GB',
    price: 129900,
    originalPrice: 129900,
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
    description: 'The iPhone 13 Pro Max features a 6.7-inch Super Retina XDR display with ProMotion technology, A15 Bionic chip, and advanced camera system with ProRAW and ProRes video recording capabilities.',
    features: [
      '6.7-inch Super Retina XDR display with ProMotion',
      'A15 Bionic chip with 6-core CPU and 5-core GPU',
      'Pro camera system with 12MP Ultra Wide, Wide, and Telephoto cameras',
      'ProRAW and ProRes video recording',
      'Face ID for secure authentication',
      '5G connectivity',
      'Up to 28 hours video playback',
      'Ceramic Shield front cover'
    ],
    specifications: {
      'Display': '6.7-inch Super Retina XDR',
      'Chip': 'A15 Bionic',
      'Storage': '256GB',
      'Camera': '12MP Pro camera system',
      'Battery': 'Up to 28 hours video playback',
      'Connectivity': '5G, Wi-Fi 6, Bluetooth 5.0',
      'Water Resistance': 'IP68 rated',
      'Weight': '240g'
    },
    inStock: true,
    stockCount: 25
  }
];

export const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const product = products.find(p => p.id === parseInt(id || '0'));

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Product not found</h1>
              <p className="text-gray-600 mb-8">The product you're looking for doesn't exist.</p>
              <Link
                to="/shop/products"
                className="inline-flex items-center px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors duration-200"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Back to Shop
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
            <Link to="/" className="hover:text-primary-600">Home</Link>
            <span>/</span>
            <Link to="/shop/products" className="hover:text-primary-600">Shop</Link>
            <span>/</span>
            <span className="text-gray-900">{product.category}</span>
            <span>/</span>
            <span className="text-gray-900">{product.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="aspect-square overflow-hidden rounded-lg bg-white">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover object-center"
                />
              </div>
              
              {product.images.length > 1 && (
                <div className="grid grid-cols-3 gap-4">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-square overflow-hidden rounded-lg border-2 ${
                        selectedImage === index ? 'border-primary-500' : 'border-gray-200'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} view ${index + 1}`}
                        className="w-full h-full object-cover object-center"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-sm text-primary-600 font-medium">{product.brand}</span>
                  {product.isNew && (
                    <span className="bg-primary-100 text-primary-800 text-xs font-bold px-2 py-1 rounded-full">
                      NEW
                    </span>
                  )}
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
                
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(product.rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-sm text-gray-600">
                      {product.rating} ({product.reviews} reviews)
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-4 mb-6">
                  <span className="text-3xl font-bold text-primary-600">
                    KSh {product.price.toLocaleString()}
                  </span>
                  {product.originalPrice > product.price && (
                    <span className="text-xl text-gray-500 line-through">
                      KSh {product.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>

                <p className="text-gray-700 leading-relaxed">{product.description}</p>
              </div>

              {/* Quantity and Actions */}
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <label className="text-sm font-medium text-gray-700">Quantity:</label>
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 hover:bg-gray-100 transition-colors duration-200"
                    >
                      <span className="text-lg">-</span>
                    </button>
                    <span className="px-4 py-2 text-sm font-medium min-w-[3rem] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stockCount, quantity + 1))}
                      className="p-2 hover:bg-gray-100 transition-colors duration-200"
                    >
                      <span className="text-lg">+</span>
                    </button>
                  </div>
                  <span className="text-sm text-gray-600">
                    {product.stockCount} in stock
                  </span>
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 bg-primary-500 text-white py-3 px-6 rounded-lg hover:bg-primary-600 transition-colors duration-200 font-medium"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className={`p-3 rounded-lg border transition-colors duration-200 ${
                      isWishlisted
                        ? 'bg-red-50 border-red-200 text-red-600'
                        : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <HeartIcon className="h-6 w-6" />
                  </button>
                  <button className="p-3 bg-gray-50 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                    <ShareIcon className="h-6 w-6" />
                  </button>
                </div>
              </div>

              {/* Features */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Features</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-primary-500 mr-2">•</span>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Shipping Info */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <TruckIcon className="h-5 w-5 mr-2 text-green-500" />
                  Free shipping on orders over KSh 10,000
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <ShieldIcon className="h-5 w-5 mr-2 text-blue-500" />
                  1-year warranty included
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <RotateCcwIcon className="h-5 w-5 mr-2 text-purple-500" />
                  30-day return policy
                </div>
              </div>
            </div>
          </div>

          {/* Specifications */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Specifications</h2>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="px-6 py-4 border-b border-gray-200 last:border-b-0">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-900">{key}</span>
                      <span className="text-gray-600">{value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
