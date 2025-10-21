import React, { useState, useCallback } from 'react';
import { ShoppingCartIcon } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { Link } from 'react-router-dom';
interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  isNew?: boolean;
  discount?: number;
  rating?: number;
  reviews?: number;
  description?: string;
  features?: string[];
  brand?: string;
  stockCount?: number;
  images?: string[];
}
export const ProductCard = ({
  id,
  name,
  price,
  image,
  category,
  isNew,
  discount,
  rating,
  reviews,
  description,
  features,
  brand,
  stockCount,
  images
}: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart } = useCart();
  const discountedPrice = discount ? price - price * discount / 100 : price;

  const handleAddToCart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    addToCart({
      id,
      name,
      price: discountedPrice,
      image,
      category,
      discount
    });
  }, [addToCart, id, name, discountedPrice, image, category, discount]);
  return <div className="group relative bg-white rounded-xl border border-gray-200 overflow-hidden transition-colors hover:border-primary-200" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <Link to={`/shop/preview/${id}`} className="block">
        <div className="relative h-48 overflow-hidden">
          <img src={image} alt={name} className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105" />
          <div className={`absolute top-3 left-3 z-20 flex gap-2`}> 
            {isNew && <div className="bg-primary-600 text-white text-[10px] font-bold px-2 py-1 rounded-full">New</div>}
            {discount && <div className="bg-accent-600 text-white text-[10px] font-bold px-2 py-1 rounded-full">{discount}% OFF</div>}
          </div>
        </div>
      </Link>
      <div className="p-4">
        <div className="text-[11px] font-medium text-gray-500 mb-1">{category}</div>
        <Link to={`/shop/preview/${id}`} className="block">
          <h3 className="text-gray-900 font-semibold text-sm mb-1 line-clamp-1 hover:text-primary-700">{name}</h3>
        </Link>
        <div className="flex items-center mb-3">
          <div className="text-base font-bold text-gray-900">KSh {discountedPrice.toLocaleString()}</div>
          {discount && <div className="ml-2 text-gray-400 text-xs line-through">KSh {price.toLocaleString()}</div>}
        </div>
        <button onClick={handleAddToCart} className="w-full py-2.5 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-lg flex items-center justify-center text-sm font-medium">
          <ShoppingCartIcon className="h-4 w-4 mr-2" /> Add to cart
        </button>
      </div>
    </div>;
};