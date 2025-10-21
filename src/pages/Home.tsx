import React, { useEffect } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Hero } from '../components/home/Hero';
import { Categories } from '../components/home/Categories';
import { FeaturedProducts } from '../components/home/FeaturedProducts';
import { Promotions } from '../components/home/Promotions';
export const Home = () => {
  // Add smooth scrolling effect
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);
  return <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-16">
        {' '}
        {/* Add padding top to account for fixed navbar */}
        <main>
          <Hero />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 py-12">
            <Categories />
            <FeaturedProducts />
            <Promotions />
          </div>
        </main>
      </div>
      <Footer />
    </div>;
};