import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { ArrowLeftIcon, StarIcon, ShoppingCartIcon, TruckIcon, ShieldIcon, RotateCcwIcon } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

// Minimal product list aligned with Shop.tsx ids
const products = [
  { id: 1, name: 'iPhone 13 Pro Max - 256GB', price: 129900, image: 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1315&q=80', category: 'Smartphones', rating: 4.8, reviews: 124, description: '6.7-inch Super Retina XDR, A15 Bionic, Pro camera system, 5G, Face ID.', features: ['6.7" Super Retina XDR', 'A15 Bionic', 'Triple-camera system', 'Face ID', '5G connectivity'] },
  { id: 2, name: 'MacBook Pro 14" M1 Pro', price: 199900, image: 'https://images.unsplash.com/photo-1629131726692-1accd0c53ce0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80', category: 'Laptops', rating: 4.9, reviews: 89, description: 'Stunning Liquid Retina XDR display, M1 Pro performance for pros.', features: ['14" Liquid Retina XDR', 'Apple M1 Pro', '16GB unified memory', '512GB SSD', 'All-day battery'] },
  { id: 3, name: 'Sony WH-1000XM4 Wireless Headphones', price: 34900, image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?ixlib=rb-4.0.3&auto=format&fit=crop&w=688&q=80', category: 'Audio', rating: 4.7, reviews: 203, description: 'Industry-leading noise canceling and premium sound.', features: ['ANC with Dual Noise Sensor', '30-hour battery', 'Quick charge', 'Touch controls'] },
  { id: 4, name: 'Samsung 55" QLED 4K Smart TV', price: 79900, image: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?ixlib=rb-4.0.3&auto=format&fit=crop&w=1474&q=80', category: 'TVs', rating: 4.6, reviews: 156, description: 'Quantum Dot QLED 4K with smart features.', features: ['55" 4K QLED', 'HDR10+', 'Smart TV apps', 'Multiple HDMI ports'] },
  { id: 5, name: 'Amazon Echo Dot (4th Gen)', price: 4999, image: 'https://images.unsplash.com/photo-1543512214-318c7553f230?ixlib=rb-4.0.3&auto=format&fit=crop&w=1374&q=80', category: 'Smart Home', rating: 4.4, reviews: 312, description: 'Compact smart speaker with Alexa.', features: ['Alexa voice control', 'Improved audio', 'Smart home hub'] },
  { id: 6, name: 'Apple Watch Series 7', price: 39900, image: 'https://images.unsplash.com/photo-1617043786394-f977fa12eddf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80', category: 'Wearables', rating: 4.7, reviews: 189, description: 'Larger Always-On Retina display with fast charging.', features: ['Always-On Retina', 'Fast charging', 'Water resistant', 'GPS'] },
];

export const ProductPreview: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const product = products.find(p => p.id === Number(id));

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Product preview not found</h1>
              <Link to="/shop/products" className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                <ArrowLeftIcon className="h-5 w-5 mr-2" /> Back to Shop
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart({ id: product.id, name: product.name, price: product.price, image: product.image, category: product.category });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link to="/shop/products" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6">
            <ArrowLeftIcon className="h-5 w-5 mr-1" /> Back to shop
          </Link>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white rounded-xl border border-gray-200 p-6">
            <div>
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-50">
                <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
                <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} className={`h-4 w-4 ${i < Math.floor(product.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                    ))}
                  </div>
                  <span>({product.reviews})</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-gray-900">KSh {product.price.toLocaleString()}</span>
              </div>

              <div className="flex items-center gap-4">
                <label className="text-sm text-gray-700">Quantity</label>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 hover:bg-gray-100">-</button>
                  <span className="px-4 py-2 text-sm min-w-[3rem] text-center">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="p-2 hover:bg-gray-100">+</button>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button onClick={handleAddToCart} className="inline-flex items-center justify-center px-5 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                  <ShoppingCartIcon className="h-5 w-5 mr-2" /> Add to cart
                </button>
              </div>
              {product.description && (
                <p className="text-sm text-gray-600 leading-relaxed pt-3">
                  {product.description}
                </p>
              )}
            </div>
          </div>

          {/* Full details inline */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-700">{product.description || 'High quality product with great performance and reliability.'}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Key Features</h3>
                <ul className="list-disc pl-5 text-gray-700 space-y-1">
                  {(product.features || ['Great build quality', 'Excellent value']).map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="space-y-3">
              <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center text-sm text-gray-700">
                <TruckIcon className="h-5 w-5 text-primary-600 mr-2" /> Free delivery over KSh 10,000
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center text-sm text-gray-700">
                <ShieldIcon className="h-5 w-5 text-primary-600 mr-2" /> 1-year warranty included
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center text-sm text-gray-700">
                <RotateCcwIcon className="h-5 w-5 text-primary-600 mr-2" /> 30-day returns policy
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};


