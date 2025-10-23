import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Login } from './pages/auth/Login';
import { Register } from './pages/Register';
import { Shop } from './pages/Shop';
import { Categories } from './pages/Categories';
import { ProductDetail } from './pages/ProductDetail';
import { ProductPreview } from './pages/ProductPreview';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Profile } from './pages/Profile';
import { Orders } from './pages/Orders';
import { AdminPanel } from './pages/admin/AdminPanel';
import { Products as AdminProducts } from './pages/admin/Products';
import { Orders as AdminOrders } from './pages/admin/Orders';
import { Customers as AdminCustomers } from './pages/admin/Customers';

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/shop/products" element={<Shop />} />
        <Route path="/shop/categories" element={<Categories />} />
        <Route path="/shop/categories/:id" element={<Categories />} />
        <Route path="/shop/product/:id" element={<ProductDetail />} />
        <Route path="/shop/preview/:id" element={<ProductPreview />} />
        <Route path="/shop/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/admin/products" element={<AdminProducts />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/admin/customers" element={<AdminCustomers />} />
      </Routes>
    </BrowserRouter>
  );
}