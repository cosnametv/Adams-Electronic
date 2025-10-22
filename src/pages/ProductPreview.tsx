import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import {
  ArrowLeftIcon,
  StarIcon,
  ShoppingCartIcon,
  TruckIcon,
  ShieldIcon,
  RotateCcwIcon
} from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { productService, Product } from '../services/dataService';

export const ProductPreview = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      productService.getProduct(id).then((productData) => {
        setProduct(productData);
        setLoading(false);
      });
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-16 flex items-center justify-center">
          <div className="text-center py-24">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading product...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-16 text-center py-24">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Product not found</h1>
          <p className="text-gray-600 mb-8">
            The product you’re looking for doesn’t exist.
          </p>
          <Link
            to="/shop/products"
            className="inline-flex items-center px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors duration-200"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Shop
          </Link>
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

  const originalPrice = product.originalPrice || product.price;
  const discount = product.discount || 0;
  const finalPrice =
    discount > 0 ? originalPrice * (1 - discount / 100) : originalPrice;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <Link
            to="/shop/products"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Shop
          </Link>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Product Image */}
              <div className="aspect-square bg-gray-100">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Product Info */}
              <div className="p-8 space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    {product.isNew && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                        New
                      </span>
                    )}
                    <span className="text-sm text-gray-500">{product.category}</span>
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {product.name}
                  </h1>
                  {product.brand && (
                    <p className="text-gray-600 mb-4">by {product.brand}</p>
                  )}
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(product.rating || 0)
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                        }`}
                        fill={
                          i < Math.floor(product.rating || 0)
                            ? 'currentColor'
                            : 'none'
                        }
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {product.rating?.toFixed(1)} ({product.reviews} reviews)
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-bold text-gray-900">
                    KSh {finalPrice.toLocaleString()}
                  </span>
                  {discount > 0 && (
                    <>
                      <span className="text-lg text-gray-500 line-through">
                        KSh {originalPrice.toLocaleString()}
                      </span>
                      <span className="px-2 py-1 bg-red-100 text-red-800 text-sm font-medium rounded">
                        {discount}% OFF
                      </span>
                    </>
                  )}
                </div>

                {/* Description */}
                {product.description && (
                  <p className="text-gray-600 leading-relaxed">
                    {product.description}
                  </p>
                )}

                {/* Features */}
                {product.features && product.features.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">
                      Key Features
                    </h3>
                    <ul className="space-y-1">
                      {product.features.slice(0, 3).map((feature, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-2 text-sm text-gray-600"
                        >
                          <span className="text-primary-500 mt-1">•</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Actions */}
                <div className="space-y-4">
                  <button
                    onClick={handleAddToCart}
                    className="w-full bg-primary-500 text-white py-3 px-6 rounded-lg hover:bg-primary-600 transition-colors duration-200 font-medium flex items-center justify-center gap-2"
                  >
                    <ShoppingCartIcon className="h-5 w-5" />
                    Add to Cart
                  </button>

                  {/* ✅ Corrected link to product detail route */}
                  <Link
                    to={`/shop/product/${product.id}`}
                    className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium text-center block"
                  >
                    View Details
                  </Link>
                </div>

                {/* Shipping Info */}
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <TruckIcon className="h-4 w-4 text-primary-500" />
                    <span className="text-xs text-gray-600">
                      Free shipping on orders over KSh 10,000
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldIcon className="h-4 w-4 text-primary-500" />
                    <span className="text-xs text-gray-600">
                      2-year warranty included
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <RotateCcwIcon className="h-4 w-4 text-primary-500" />
                    <span className="text-xs text-gray-600">
                      30-day return policy
                    </span>
                  </div>
                </div>

                {/* Stock Status */}
                <div className="text-sm">
                  {product.stock && product.stock > 0 ? (
                    <span className="text-green-600">
                      ✓ In stock ({product.stock} available)
                    </span>
                  ) : (
                    <span className="text-red-600">✗ Out of stock</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
