import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ProductPreviewModal } from '../components/ui/ProductPreviewModal';

interface Product {
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
}

interface ProductPreviewContextType {
  showPreview: (product: Product) => void;
  hidePreview: () => void;
}

const ProductPreviewContext = createContext<ProductPreviewContextType | undefined>(undefined);

export const ProductPreviewProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [previewProduct, setPreviewProduct] = useState<Product | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const showPreview = (product: Product) => {
    setPreviewProduct(product);
    setIsOpen(true);
  };

  const hidePreview = () => {
    setIsOpen(false);
    setPreviewProduct(null);
  };

  return (
    <ProductPreviewContext.Provider value={{ showPreview, hidePreview }}>
      {children}
      {previewProduct && (
        <ProductPreviewModal
          product={previewProduct}
          isOpen={isOpen}
          onClose={hidePreview}
        />
      )}
    </ProductPreviewContext.Provider>
  );
};

export const useProductPreview = () => {
  const context = useContext(ProductPreviewContext);
  if (context === undefined) {
    throw new Error('useProductPreview must be used within a ProductPreviewProvider');
  }
  return context;
};
