# Adams Electronic Website Sitemap

## Overview
This document provides a comprehensive overview of all pages and routes available on the Adams Electronic website.

## Site Structure

### 🏠 **Home & Main Pages**
- **Home** (`/`) - Main landing page
- **About** (`/about`) - Company information
- **Contact** (`/contact`) - Contact information and form

### 🛒 **E-commerce & Shopping**
- **Shop Products** (`/shop/products`) - Product catalog
- **Categories** (`/shop/categories`) - Product categories overview
- **Category Details** (`/shop/categories/:id`) - Specific category products
- **Product Detail** (`/shop/product/:id`) - Individual product pages
- **Product Preview** (`/shop/preview/:id`) - Quick product preview modal
- **Shopping Cart** (`/shop/cart`) - User's shopping cart
- **Checkout** (`/checkout`) - Purchase completion process

### 👤 **User Authentication**
- **Login** (`/auth/login` or `/login`) - User login page
- **Register** (`/auth/register` or `/register`) - User registration
- **Forgot Password** (`/forgot-password`) - Password recovery

### 👥 **User Account**
- **Profile** (`/profile`) - User profile management
- **Orders** (`/orders`) - User order history

### 🔧 **Admin Panel**
- **Admin Dashboard** (`/admin`) - Admin main dashboard
- **Admin Products** (`/admin/products`) - Product management
- **Admin Orders** (`/admin/orders`) - Order management
- **Admin Customers** (`/admin/customers`) - Customer management

## Route Categories

### **Public Routes** (No authentication required)
- Home, About, Contact
- Shop pages (products, categories, cart)
- Authentication pages (login, register, forgot password)

### **Protected Routes** (Authentication required)
- Profile, Orders
- Checkout process

### **Admin Routes** (Admin authentication required)
- All `/admin/*` routes

### **Dynamic Routes**
- `/shop/categories/:id` - Category-specific product listings
- `/shop/product/:id` - Individual product pages
- `/shop/preview/:id` - Product preview modals

## SEO Considerations

### **High Priority Pages** (Priority 0.8-1.0)
- Home page
- Shop products
- Categories
- Checkout

### **Medium Priority Pages** (Priority 0.6-0.7)
- About, Contact
- User account pages
- Authentication pages

### **Lower Priority Pages** (Priority 0.4-0.5)
- Admin pages
- Forgot password

## Technical Notes

- **Framework**: React with React Router
- **Build Tool**: Vite
- **Deployment**: Vercel (based on vercel.json configuration)
- **Sitemap Location**: `/public/sitemap.xml`
- **Last Updated**: January 15, 2024

## Dynamic Content

The following routes contain dynamic content that should be updated regularly:
- Product pages (`/shop/product/:id`)
- Category pages (`/shop/categories/:id`)
- User-specific content (profile, orders)

## Search Engine Optimization

The XML sitemap is located at `/public/sitemap.xml` and includes:
- All static routes with appropriate priorities
- Last modification dates
- Change frequencies
- Proper XML formatting for search engine consumption

## Maintenance

To keep the sitemap current:
1. Update `lastmod` dates when content changes
2. Add new routes to both XML sitemap and this documentation
3. Adjust priorities based on page importance
4. Consider adding product-specific URLs for better SEO
