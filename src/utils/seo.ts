// SEO utility functions for Adams Electronic website

export interface SEOData {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'product' | 'article';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  price?: number;
  currency?: string;
  availability?: 'in stock' | 'out of stock' | 'preorder';
  brand?: string;
  category?: string;
}

export const updatePageSEO = (seoData: SEOData) => {
  // Update document title
  document.title = seoData.title;

  // Update or create meta tags
  const updateMetaTag = (name: string, content: string, property?: boolean) => {
    const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
    let meta = document.querySelector(selector) as HTMLMetaElement;
    
    if (!meta) {
      meta = document.createElement('meta');
      if (property) {
        meta.setAttribute('property', name);
      } else {
        meta.setAttribute('name', name);
      }
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', content);
  };

  // Basic meta tags
  updateMetaTag('description', seoData.description);
  if (seoData.keywords) {
    updateMetaTag('keywords', seoData.keywords);
  }
  if (seoData.author) {
    updateMetaTag('author', seoData.author);
  }

  // Open Graph tags
  updateMetaTag('og:title', seoData.title, true);
  updateMetaTag('og:description', seoData.description, true);
  updateMetaTag('og:type', seoData.type || 'website', true);
  updateMetaTag('og:url', seoData.url || window.location.href, true);
  if (seoData.image) {
    updateMetaTag('og:image', seoData.image, true);
  }

  // Twitter Card tags
  updateMetaTag('twitter:card', 'summary_large_image');
  updateMetaTag('twitter:title', seoData.title);
  updateMetaTag('twitter:description', seoData.description);
  if (seoData.image) {
    updateMetaTag('twitter:image', seoData.image);
  }

  // Product-specific meta tags
  if (seoData.type === 'product') {
    if (seoData.price) {
      updateMetaTag('product:price:amount', seoData.price.toString(), true);
      updateMetaTag('product:price:currency', seoData.currency || 'KES', true);
    }
    if (seoData.availability) {
      updateMetaTag('product:availability', seoData.availability, true);
    }
    if (seoData.brand) {
      updateMetaTag('product:brand', seoData.brand, true);
    }
    if (seoData.category) {
      updateMetaTag('product:category', seoData.category, true);
    }
  }

  // Article-specific meta tags
  if (seoData.type === 'article') {
    if (seoData.publishedTime) {
      updateMetaTag('article:published_time', seoData.publishedTime, true);
    }
    if (seoData.modifiedTime) {
      updateMetaTag('article:modified_time', seoData.modifiedTime, true);
    }
    if (seoData.author) {
      updateMetaTag('article:author', seoData.author, true);
    }
  }
};

// Predefined SEO data for each page
export const seoConfig = {
  home: {
    title: 'Adams Electronic - Kenya\'s Leading Electronics Store | Phones, Laptops & More',
    description: 'Shop the latest electronics in Kenya at Adams Electronic. Find smartphones, laptops, TVs, home appliances, and accessories with free delivery and warranty. Best prices guaranteed!',
    keywords: 'electronics Kenya, smartphones, laptops, TVs, home appliances, Adams Electronic, electronics store Kenya, free delivery, warranty',
    type: 'website' as const,
    author: 'Adams Electronic'
  },
  
  shop: {
    title: 'Electronics Store Kenya | Shop Latest Phones, Laptops & Gadgets | Adams Electronic',
    description: 'Browse our extensive collection of electronics in Kenya. Find the latest smartphones, laptops, TVs, and home appliances with competitive prices and fast delivery.',
    keywords: 'electronics store Kenya, smartphones Kenya, laptops Kenya, TVs Kenya, home appliances, electronics shop, Adams Electronic',
    type: 'website' as const
  },
  
  categories: {
    title: 'Electronics Categories | Phones, Laptops, TVs & More | Adams Electronic',
    description: 'Explore our electronics categories including smartphones, laptops, TVs, home appliances, and accessories. Find the perfect device for your needs.',
    keywords: 'electronics categories, smartphones, laptops, TVs, home appliances, accessories, electronics Kenya',
    type: 'website' as const
  },
  
  product: (productName: string, price: number, category: string, brand?: string) => ({
    title: `${productName} | ${brand || 'Electronics'} | Adams Electronic Kenya`,
    description: `Buy ${productName} at Adams Electronic Kenya. ${category} with warranty, free delivery, and best prices. Order now!`,
    keywords: `${productName}, ${category}, ${brand || 'electronics'}, Kenya, Adams Electronic, warranty, free delivery`,
    type: 'product' as const,
    price,
    currency: 'KES',
    availability: 'in stock' as const,
    brand,
    category
  }),
  
  about: {
    title: 'About Adams Electronic | Kenya\'s Trusted Electronics Store Since 2020',
    description: 'Learn about Adams Electronic, Kenya\'s leading electronics retailer. 5+ years of excellence, 5000+ happy customers, quality products with warranty.',
    keywords: 'about Adams Electronic, electronics store Kenya, trusted retailer, quality electronics, warranty, customer service',
    type: 'website' as const
  },
  
  contact: {
    title: 'Contact Adams Electronic | Get Support & Customer Service | Kenya',
    description: 'Contact Adams Electronic for support, sales inquiries, or technical assistance. Located in Kutus, Kenya. Call +254 700 056557 or visit our store.',
    keywords: 'contact Adams Electronic, customer service, support, electronics Kenya, Kutus, phone number, email',
    type: 'website' as const
  },
  
  login: {
    title: 'Login to Your Account | Adams Electronic Customer Portal',
    description: 'Sign in to your Adams Electronic account to track orders, manage your profile, and access exclusive deals.',
    keywords: 'login, account, customer portal, Adams Electronic, orders, profile',
    type: 'website' as const
  },
  
  register: {
    title: 'Create Account | Join Adams Electronic | Free Registration',
    description: 'Create your free Adams Electronic account to enjoy faster checkout, order tracking, and exclusive member benefits.',
    keywords: 'register, create account, sign up, Adams Electronic, free registration, member benefits',
    type: 'website' as const
  },
  
  cart: {
    title: 'Shopping Cart | Review Your Items | Adams Electronic',
    description: 'Review your selected electronics in your shopping cart. Secure checkout with free delivery on orders over KSh 10,000.',
    keywords: 'shopping cart, checkout, electronics, free delivery, secure payment',
    type: 'website' as const
  },
  
  checkout: {
    title: 'Secure Checkout | Complete Your Purchase | Adams Electronic',
    description: 'Complete your electronics purchase securely with Adams Electronic. Multiple payment options, free delivery, and warranty included.',
    keywords: 'checkout, secure payment, electronics purchase, free delivery, warranty',
    type: 'website' as const
  },
  
  profile: {
    title: 'My Account | Manage Profile & Orders | Adams Electronic',
    description: 'Manage your Adams Electronic account, view order history, update profile information, and track your electronics purchases.',
    keywords: 'my account, profile, order history, Adams Electronic, customer dashboard',
    type: 'website' as const
  },
  
  orders: {
    title: 'Order History | Track Your Electronics Purchases | Adams Electronic',
    description: 'View your complete order history with Adams Electronic. Track deliveries, download invoices, and manage your electronics purchases.',
    keywords: 'order history, track orders, electronics purchases, Adams Electronic, delivery tracking',
    type: 'website' as const
  },
  
  admin: {
    title: 'Admin Dashboard | Manage Adams Electronic Store',
    description: 'Admin dashboard for managing Adams Electronic store operations, products, orders, and customers.',
    keywords: 'admin dashboard, store management, Adams Electronic admin',
    type: 'website' as const
  }
};

// Structured data for rich snippets
export const generateStructuredData = (seoData: SEOData) => {
  const baseStructuredData = {
    "@context": "https://schema.org",
    "@type": seoData.type === 'product' ? 'Product' : 'WebSite',
    "name": seoData.title,
    "description": seoData.description,
    "url": seoData.url || window.location.href
  };

  if (seoData.type === 'product') {
    return {
      ...baseStructuredData,
      "@type": "Product",
      "name": seoData.title,
      "description": seoData.description,
      "brand": seoData.brand ? { "@type": "Brand", "name": seoData.brand } : undefined,
      "category": seoData.category,
      "offers": {
        "@type": "Offer",
        "price": seoData.price,
        "priceCurrency": seoData.currency || 'KES',
        "availability": seoData.availability === 'in stock' ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        "seller": {
          "@type": "Organization",
          "name": "Adams Electronic"
        }
      }
    };
  }

  return baseStructuredData;
};

// Add structured data to page
export const addStructuredData = (structuredData: any) => {
  // Remove existing structured data
  const existingScript = document.querySelector('script[type="application/ld+json"]');
  if (existingScript) {
    existingScript.remove();
  }

  // Add new structured data
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(structuredData);
  document.head.appendChild(script);
};
