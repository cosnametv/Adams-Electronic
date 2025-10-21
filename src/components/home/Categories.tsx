import React from 'react';
const categories = [{
  id: 'smartphones',
  name: 'Smartphones',
  image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1227&q=80',
  itemCount: 120,
  color: 'from-blue-500 to-indigo-600'
}, {
  id: 'laptops',
  name: 'Laptops & Computers',
  image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1468&q=80',
  itemCount: 85,
  color: 'from-purple-500 to-indigo-600'
}, {
  id: 'audio',
  name: 'Audio & Headphones',
  image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1465&q=80',
  itemCount: 64,
  color: 'from-pink-500 to-rose-600'
}, {
  id: 'smart-home',
  name: 'Smart Home',
  image: 'https://images.unsplash.com/photo-1558002038-bb4237d2f8e9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
  itemCount: 98,
  color: 'from-emerald-500 to-teal-600'
}];
export const Categories = () => {
  return <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Shop by category</h2>
          <a href="/shop/categories" className="text-sm font-medium text-primary-600 hover:text-primary-700">View all</a>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map(category => <a key={category.id} href={`/shop/categories/${category.id}`} className="group bg-white rounded-xl border border-gray-200 p-3 sm:p-4 flex flex-col items-center text-center hover:border-primary-200 hover:shadow-sm transition-colors">
              <div className="h-16 w-16 rounded-full overflow-hidden ring-1 ring-gray-200">
                <img src={category.image} alt={category.name} className="h-full w-full object-cover" />
              </div>
              <div className="mt-3">
                <div className="text-sm font-medium text-gray-900 group-hover:text-primary-700 line-clamp-1">{category.name}</div>
                <div className="text-xs text-gray-500">{category.itemCount} items</div>
              </div>
            </a>)}
        </div>
      </div>
    </section>;
};