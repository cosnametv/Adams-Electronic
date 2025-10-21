import React from 'react';
export const Promotions = () => {
  return <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Deals</h2>
          <a href="/latest-deals" className="text-sm font-medium text-primary-600 hover:text-primary-700">See all</a>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <a href="/shop/products?category=Smartphones" className="group rounded-2xl border border-gray-200 bg-white p-6 flex items-center gap-6 hover:border-primary-200 transition-colors">
            <img src="https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=1200&auto=format&fit=crop" alt="Smartphone sale" className="w-36 h-28 object-cover rounded-lg" />
            <div>
              <div className="text-xs font-semibold text-primary-600">Limited time</div>
              <h3 className="text-xl font-bold text-gray-900 mt-1">Smartphone sale</h3>
              <p className="text-sm text-gray-600 mt-1">Up to 30% off popular models</p>
            </div>
          </a>
          <a href="/shop/products?category=Gaming" className="group rounded-2xl border border-gray-200 bg-white p-6 flex items-center gap-6 hover:border-primary-200 transition-colors">
            <img src="https://images.unsplash.com/photo-1606813907291-d86efa9b94db?q=80&w=1200&auto=format&fit=crop" alt="Gaming gear" className="w-36 h-28 object-cover rounded-lg" />
            <div>
              <div className="text-xs font-semibold text-primary-600">Flash sale</div>
              <h3 className="text-xl font-bold text-gray-900 mt-1">Gaming gear</h3>
              <p className="text-sm text-gray-600 mt-1">Buy 2 get 1 free on select</p>
            </div>
          </a>
        </div>
      </div>
    </section>;
};