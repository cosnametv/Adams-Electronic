import React from 'react';
import { XIcon, StarIcon, ShoppingCartIcon, HeartIcon } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  images?: string[];
  category: string;
  isNew?: boolean;
  discount?: number;
  rating?: number;
  reviews?: number;
  description?: string;
  features?: string[];
  brand?: string;
  stockCount?: number;
  inStock?: boolean;
}

interface ProductPreviewModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export const ProductPreviewModal: React.FC<ProductPreviewModalProps> = ({
  product,
  isOpen,
  onClose
}) => {
  const { addToCart } = useCart();

  if (!isOpen) return null;

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category
    });
    onClose();
  };

  const originalPrice = product.discount ? product.price / (1 - product.discount / 100) : product.price;
  const finalPrice = product.discount ? product.price : originalPrice;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />
        
        {/* Modal */}
        <div className="relative bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Product Preview</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Product Image */}
              <div className="space-y-4">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {product.images && product.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {product.images.slice(0, 4).map((image, index) => (
                      <div key={index} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={image}
                          alt={`${product.name} view ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
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
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h1>
                  {product.brand && (
                    <p className="text-gray-600 mb-4">by {product.brand}</p>
                  )}
                </div>

                {/* Rating */}
                {product.rating && (
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(product.rating || 0) ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                          fill={i < Math.floor(product.rating || 0) ? 'currentColor' : 'none'}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      {product.rating.toFixed(1)} ({product.reviews} reviews)
                    </span>
                  </div>
                )}

                {/* Price */}
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-bold text-gray-900">
                    KSh {finalPrice.toLocaleString()}
                  </span>
                  {product.discount && product.discount > 0 && (
                    <>
                      <span className="text-lg text-gray-500 line-through">
                        KSh {originalPrice.toLocaleString()}
                      </span>
                      <span className="px-2 py-1 bg-red-100 text-red-800 text-sm font-medium rounded">
                        {product.discount}% OFF
                      </span>
                    </>
                  )}
                </div>

                {/* Description */}
                {product.description && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">Description</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>
                  </div>
                )}

                {/* Features */}
                {product.features && product.features.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">Key Features</h3>
                    <ul className="space-y-1">
                      {product.features.slice(0, 5).map((feature, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                          <span className="text-primary-500 mt-1">•</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Stock Status */}
                <div className="text-sm">
                  {product.inStock !== false ? (
                    <span className="text-green-600">
                      ✓ In stock {product.stockCount && `(${product.stockCount} available)`}
                    </span>
                  ) : (
                    <span className="text-red-600">✗ Out of stock</span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 bg-primary-500 text-white py-3 px-6 rounded-lg hover:bg-primary-600 transition-colors duration-200 font-medium flex items-center justify-center gap-2"
                  >
                    <ShoppingCartIcon className="h-5 w-5" />
                    Add to Cart
                  </button>
                  <button className="p-3 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors duration-200">
                    <HeartIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
