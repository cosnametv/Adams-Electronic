import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { XIcon, HeartIcon, ShoppingCartIcon, StarIcon, MinusIcon, PlusIcon } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';

interface ProductPreviewModalProps {
  product: {
    id: number;
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
  };
  isOpen: boolean;
  onClose: () => void;
}

export const ProductPreviewModal = React.memo(({ product, isOpen, onClose }: ProductPreviewModalProps) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { addToCart } = useCart();

  const images = product.images || [product.image];
  const discountedPrice = product.discount ? product.price - product.price * product.discount / 100 : product.price;

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  const handleAddToCart = useCallback(() => {
    addToCart({
      id: product.id,
      name: product.name,
      price: discountedPrice,
      image: product.image,
      category: product.category,
      discount: product.discount
    });
    onClose();
  }, [addToCart, product.id, product.name, discountedPrice, product.image, product.category, product.discount, onClose]);

  const handleQuantityChange = useCallback((newQuantity: number) => {
    const maxQuantity = product.stockCount || 10;
    setQuantity(Math.max(1, Math.min(maxQuantity, newQuantity)));
  }, [product.stockCount]);

  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 z-50 overflow-y-auto" style={{ cursor: 'default' }}>
      <div className="flex min-h-screen items-center justify-center p-4" style={{ cursor: 'default' }}>
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={handleBackdropClick}
          style={{ cursor: 'pointer' }}
        />
        
        {/* Modal */}
        <div 
          className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          style={{ cursor: 'default' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Quick Preview</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <XIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="flex flex-col lg:flex-row max-h-[calc(90vh-80px)]">
            {/* Images Section */}
            <div className="lg:w-1/2 p-6">
              <div className="aspect-square overflow-hidden rounded-lg bg-gray-100 mb-4">
                <img
                  src={images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover object-center"
                />
              </div>
              
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {images.map((image, index) => (
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

            {/* Product Info Section */}
            <div className="lg:w-1/2 p-6 overflow-y-auto">
              <div className="space-y-4">
                {/* Brand and Tags */}
                <div className="flex items-center space-x-2">
                  {product.brand && (
                    <span className="text-sm text-primary-600 font-medium">{product.brand}</span>
                  )}
                  {product.isNew && (
                    <span className="bg-primary-100 text-primary-800 text-xs font-bold px-2 py-1 rounded-full">
                      NEW
                    </span>
                  )}
                  {product.discount && (
                    <span className="bg-accent-100 text-accent-800 text-xs font-bold px-2 py-1 rounded-full">
                      {product.discount}% OFF
                    </span>
                  )}
                </div>

                {/* Product Name */}
                <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>

                {/* Rating */}
                {product.rating && (
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(product.rating!)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      {product.rating} ({product.reviews} reviews)
                    </span>
                  </div>
                )}

                {/* Price */}
                <div className="flex items-center space-x-4">
                  <span className="text-2xl font-bold text-primary-600">
                    KSh {discountedPrice.toLocaleString()}
                  </span>
                  {product.discount && (
                    <span className="text-lg text-gray-500 line-through">
                      KSh {product.price.toLocaleString()}
                    </span>
                  )}
                </div>

                {/* Description */}
                {product.description && (
                  <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>
                )}

                {/* Features */}
                {product.features && product.features.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">Key Features</h3>
                    <ul className="space-y-1">
                      {product.features.slice(0, 4).map((feature, index) => (
                        <li key={index} className="flex items-start text-sm text-gray-600">
                          <span className="text-primary-500 mr-2">•</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Stock Status */}
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Availability:</span>
                  <span className={`text-sm font-medium ${
                    product.inStock !== false ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {product.inStock !== false ? 'In Stock' : 'Out of Stock'}
                  </span>
                  {product.stockCount && (
                    <span className="text-sm text-gray-500">
                      ({product.stockCount} available)
                    </span>
                  )}
                </div>

                {/* Quantity and Actions */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm font-medium text-gray-700">Quantity:</span>
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() => handleQuantityChange(quantity - 1)}
                        className="p-2 hover:bg-gray-100 transition-colors duration-200"
                      >
                        <MinusIcon className="h-4 w-4" />
                      </button>
                      <span className="px-4 py-2 text-sm font-medium min-w-[3rem] text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(quantity + 1)}
                        className="p-2 hover:bg-gray-100 transition-colors duration-200"
                      >
                        <PlusIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={handleAddToCart}
                      disabled={product.inStock === false}
                      className="flex-1 bg-primary-500 text-white py-3 px-6 rounded-lg hover:bg-primary-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      <ShoppingCartIcon className="h-5 w-5 mr-2" />
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
                  </div>
                </div>
              </div>
            </div>
          </div>
         </div>
       </div>
     </div>
   );

  return createPortal(modalContent, document.body);
 });

ProductPreviewModal.displayName = 'ProductPreviewModal';
