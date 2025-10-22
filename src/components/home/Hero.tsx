import { useState, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, StarIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { productService, Product } from '../../services/dataService';

export const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = productService.getProducts((allProducts) => {
      // Get trending products (products with discounts or high ratings)
      const trending = allProducts
        .filter(product => product.discount || (product.rating && product.rating >= 4.5))
        .slice(0, 6);
      setTrendingProducts(trending);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

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


  if (loading) {
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
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading trending products...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (trendingProducts.length === 0) {
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
          
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="h-16 w-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products available</h3>
            <p className="text-gray-600 mb-6">The store is currently empty. Check back soon for our hot deals and trending products!</p>
            <div className="space-y-4">
              <p className="text-sm text-gray-500">Are you an admin? Add products through the admin panel.</p>
              <div className="flex gap-4 justify-center">
                <Link
                  to="/shop/products"
                  className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Browse All Products
                </Link>
                <a 
                  href="/admin/products" 
                  className="inline-flex items-center px-6 py-3 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Go to Admin Panel
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

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
                                    i < Math.floor(product.rating || 0)
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
                              KSh {(product.originalPrice || product.price).toLocaleString()}
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