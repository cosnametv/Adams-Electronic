import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { useCart } from '../contexts/CartContext';
import {
  ArrowLeftIcon,
  StarIcon,
  HeartIcon,
  ShareIcon,
  TruckIcon,
  ShieldIcon,
  RotateCcwIcon,
} from 'lucide-react';
import { productService, Product } from '../services/dataService';

export const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
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
        <div className="pt-16 flex items-center justify-center h-[60vh]">
          <div className="text-center">
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
        <div className="pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Product not found</h1>
            <p className="text-gray-600 mb-8">
              The product you’re looking for doesn’t exist or has been removed.
            </p>
            <Link
              to="/shop/products"
              className="inline-flex items-center px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors duration-200"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Back to Shop
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // ✅ Ensure we have a valid image array
  const images =
    (product.images && product.images.length > 0
      ? product.images
      : product.image
        ? [product.image]
        : ['/placeholder.png']) as string[];

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: images[0],
      category: product.category,
    });
  };

  const originalPrice = product.originalPrice || product.price;
  const discount = product.discount || 0;
  const finalPrice = discount > 0 ? originalPrice * (1 - discount / 100) : originalPrice;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
            <Link to="/" className="hover:text-primary-600">
              Home
            </Link>
            <span>/</span>
            <Link to="/shop/products" className="hover:text-primary-600">
              Shop
            </Link>
            <span>/</span>
            <span className="text-gray-900">{product.name}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="aspect-square bg-white rounded-xl overflow-hidden border border-gray-200">
                <img
                  src={images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 ${selectedImage === index
                          ? 'border-primary-500'
                          : 'border-gray-200 hover:border-primary-300'
                        }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} view ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  {product.isNew && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                      New
                    </span>
                  )}
                  <span className="text-sm text-gray-500">{product.category}</span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                {product.brand && (
                  <p className="text-lg text-gray-600 mb-4">by {product.brand}</p>
                )}
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon
                      key={i}
                      className={`h-5 w-5 ${i < Math.floor(product.rating || 0)
                          ? 'text-yellow-400'
                          : 'text-gray-300'
                        }`}
                      fill={
                        i < Math.floor(product.rating || 0) ? 'currentColor' : 'none'
                      }
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {product.rating?.toFixed(1)} ({product.reviews || 0} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold text-gray-900">
                  KSh {finalPrice.toLocaleString()}
                </span>
                {discount > 0 && (
                  <>
                    <span className="text-xl text-gray-500 line-through">
                      KSh {originalPrice.toLocaleString()}
                    </span>
                    <span className="px-2 py-1 bg-red-100 text-red-800 text-sm font-medium rounded">
                      {discount}% OFF
                    </span>
                  </>
                )}
              </div>

              {product.description && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                  <div className="text-gray-600 leading-relaxed space-y-3">
                    {product.description
                      .split(/\n+/)
                      .filter((para) => para.trim() !== "")
                      .map((para, index) => (
                        <p key={index}>{para}</p>
                      ))}
                  </div>
                </div>
              )}


              {/* Features */}
              {product.features && product.features.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Key Features
                  </h3>
                  <ul className="space-y-1">
                    {product.features.map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-gray-600"
                      >
                        <span className="text-primary-500 mt-1">•</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Quantity and Add to Cart */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <label className="text-sm font-medium text-gray-700">
                    Quantity:
                  </label>
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2 hover:bg-gray-50"
                    >
                      -
                    </button>
                    <span className="px-4 py-2 border-x border-gray-300">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-2 hover:bg-gray-50"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 bg-primary-500 text-white py-3 px-6 rounded-lg hover:bg-primary-600 transition-colors duration-200 font-medium"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className={`p-3 rounded-lg border transition-colors duration-200 ${isWishlisted
                        ? 'bg-red-50 border-red-200 text-red-600'
                        : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                      }`}
                  >
                    <HeartIcon
                      className="h-5 w-5"
                      fill={isWishlisted ? 'currentColor' : 'none'}
                    />
                  </button>
                  <button className="p-3 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors duration-200">
                    <ShareIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Shipping Info */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <TruckIcon className="h-5 w-5 text-primary-500" />
                  <span className="text-sm text-gray-600">
                    Free shipping on orders over KSh 10,000
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <ShieldIcon className="h-5 w-5 text-primary-500" />
                  <span className="text-sm text-gray-600">
                    All products come with manufacturer warranty.
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <RotateCcwIcon className="h-5 w-5 text-primary-500" />
                  <span className="text-sm text-gray-600">
                    5-day return policy
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

      <Footer />
    </div>
  );
};
