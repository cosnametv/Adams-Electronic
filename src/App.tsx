import { AppRouter } from './AppRouter';
import { CartProvider } from './contexts/CartContext';
import { ProductPreviewProvider } from './contexts/ProductPreviewContext';
import { AuthProvider } from './contexts/AuthContext';

export function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <ProductPreviewProvider>
          <AppRouter />
        </ProductPreviewProvider>
      </CartProvider>
    </AuthProvider>
  );
}