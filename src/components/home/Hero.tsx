import React, { useState, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, StarIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

const trendingProducts = [
  {
    id: 1,
    name: 'iPhone 13 Pro Max - 256GB',
    price: 129900,
    originalPrice: 149900,
    image: 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    rating: 4.8,
    reviews: 124,
    discount: 13
  },
  {
    id: 2,
    name: 'MacBook Pro 14" M1 Pro',
    price: 199900,
    originalPrice: 219900,
    image: 'https://images.unsplash.com/photo-1629131726692-1accd0c53ce0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    rating: 4.9,
    reviews: 89,
    discount: 9
  },
  {
    id: 3,
    name: 'Sony WH-1000XM4 Wireless Headphones',
    price: 34900,
    originalPrice: 49900,
    image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    rating: 4.7,
    reviews: 203,
    discount: 30
  },
  {
    id: 4,
    name: 'Samsung 55" QLED 4K Smart TV',
    price: 79900,
    originalPrice: 99900,
    image: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    rating: 4.6,
    reviews: 156,
    discount: 20
  },
  {
    id: 5,
    name: 'Amazon Echo Dot (4th Gen)',
    price: 4999,
    originalPrice: 9999,
    image: 'https://images.unsplash.com/photo-1543512214-318c7553f230?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    rating: 4.4,
    reviews: 312,
    discount: 50
  },
  {
    id: 6,
    name: 'Apple Watch Series 7',
    price: 39900,
    originalPrice: 49900,
    image: 'https://images.unsplash.com/photo-1617043786394-f977fa12eddf?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    rating: 4.7,
    reviews: 189,
    discount: 20
  }
];

export const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % Math.ceil(trendingProducts.length / 3));
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.ceil(trendingProducts.length / 3));
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + Math.ceil(trendingProducts.length / 3)) % Math.ceil(trendingProducts.length / 3));
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  const getVisibleProducts = () => {
    const startIndex = currentSlide * 3;
    return trendingProducts.slice(startIndex, startIndex + 3);
  };

  return (
    <section className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-xs font-semibold mb-4">
            <span>🔥 Trending Now</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Hot Deals This Week</h2>
          <p className="text-gray-600">Limited time offers on our most popular products</p>
      </div>

            <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow"
          >
            <ChevronLeftIcon className="h-6 w-6 text-gray-600" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow"
          >
            <ChevronRightIcon className="h-6 w-6 text-gray-600" />
          </button>

          {/* Products Slider */}
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {Array.from({ length: Math.ceil(trendingProducts.length / 3) }).map((_, slideIndex) => (
                <div key={slideIndex} className="w-full flex-shrink-0">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {trendingProducts.slice(slideIndex * 3, slideIndex * 3 + 3).map((product) => (
                      <Link
                        key={product.id}
                        to={`/shop/preview/${product.id}`}
                        className="group bg-white rounded-xl border border-gray-200 p-4 hover:border-primary-200 hover:shadow-lg transition-all duration-300"
                      >
                        <div className="relative mb-4">
                          <div className="aspect-square rounded-lg overflow-hidden bg-gray-50">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            -{product.discount}%
              </div>
            </div>
                        
                        <div className="space-y-2">
                          <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 line-clamp-2">
                            {product.name}
                          </h3>
                          
                          <div className="flex items-center gap-1">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <StarIcon
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < Math.floor(product.rating)
                                      ? 'text-yellow-400 fill-current'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-500">({product.reviews})</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-gray-900">
                              KSh {product.price.toLocaleString()}
                </span>
                            <span className="text-sm text-gray-500 line-through">
                              KSh {product.originalPrice.toLocaleString()}
                </span>
            </div>
          </div>
                      </Link>
                    ))}
                  </div>
              </div>
              ))}
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-6 gap-2">
            {Array.from({ length: Math.ceil(trendingProducts.length / 3) }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentSlide ? 'bg-primary-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="text-center mt-8">
          <Link
            to="/shop/products"
            className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
          >
            View All Trending Products
          </Link>
        </div>
      </div>
    </section>
  );
};