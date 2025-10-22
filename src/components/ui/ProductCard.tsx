import React from 'react';
import { Link } from 'react-router-dom';
import { StarIcon, HeartIcon, ShoppingCartIcon } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  images?: string[];
  category: string;
  brand?: string;
  isNew?: boolean;
  discount?: number;
  rating?: number;
  reviews?: number;
  description?: string;
  features?: string[];
  stock?: number;
  originalPrice?: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  price,
  image,
  category,
  brand,
  isNew,
  discount,
  rating,
  reviews,
  stock,
  originalPrice
}) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id,
      name,
      price,
      image,
      category
    });
  };

  const finalPrice = discount && discount > 0 ? price * (1 - discount / 100) : price;
  const displayOriginalPrice = originalPrice || price;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200 group">
      <Link to={`/shop/product/${id}`} className="block">
        {/* Product Image */}
        <div className="aspect-square bg-gray-100 relative overflow-hidden">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {isNew && (
              <span className="px-2 py-1 bg-green-500 text-white text-xs font-medium rounded-full">
                New
              </span>
            )}
            {discount && discount > 0 && (
              <span className="px-2 py-1 bg-red-500 text-white text-xs font-medium rounded-full">
                -{discount}%
              </span>
            )}
          </div>

          {/* Quick Actions */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors">
              <HeartIcon className="h-4 w-4 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          <div className="mb-2">
            <span className="text-xs text-gray-500 uppercase tracking-wide">{category}</span>
            {brand && (
              <span className="text-xs text-gray-400 ml-2">• {brand}</span>
            )}
          </div>
          
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
            {name}
          </h3>

          {/* Rating */}
          {rating && (
            <div className="flex items-center gap-1 mb-3">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    className={`h-3 w-3 ${
                      i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                    fill={i < Math.floor(rating) ? 'currentColor' : 'none'}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-500">
                {rating.toFixed(1)} ({reviews})
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg font-bold text-gray-900">
              KSh {finalPrice.toLocaleString()}
            </span>
            {discount && discount > 0 && (
              <span className="text-sm text-gray-500 line-through">
                KSh {displayOriginalPrice.toLocaleString()}
              </span>
            )}
          </div>

          {/* Stock Status */}
          <div className="text-xs mb-3">
            {stock && stock > 0 ? (
              <span className="text-green-600">✓ In stock</span>
            ) : (
              <span className="text-red-600">✗ Out of stock</span>
            )}
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={!stock || stock <= 0}
            className="w-full bg-primary-500 text-white py-2 px-4 rounded-lg hover:bg-primary-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-2 text-sm font-medium"
          >
            <ShoppingCartIcon className="h-4 w-4" />
            Add to Cart
          </button>
        </div>
      </Link>
    </div>
  );
};
