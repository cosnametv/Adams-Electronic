import React, { useEffect, useState } from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { useAuth } from '../../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Loader2Icon, CheckCircleIcon } from 'lucide-react';
import { initializeApp, getApps } from 'firebase/app';
import { getDatabase, ref, push, set, serverTimestamp, onValue, remove, update } from 'firebase/database';

// Ensure Firebase app is initialized here as well (shared config)
const firebaseConfig = {
  apiKey: 'AIzaSyAdQEzEB9PaSa8S_Jns7GELHrYAPVgJHf0',
  authDomain: 'home-1e420.firebaseapp.com',
  databaseURL: 'https://home-1e420-default-rtdb.firebaseio.com',
  projectId: 'home-1e420',
  storageBucket: 'home-1e420.firebasestorage.app',
  messagingSenderId: '237502846110',
  appId: '1:237502846110:web:68729122ed80d0af7bd78f'
};
if (!getApps().length) {
  initializeApp(firebaseConfig);
}

export const Products: React.FC = () => {
  const { role, user, loading } = useAuth();
  const [saving, setSaving] = useState(false);
  const [successId, setSuccessId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    name: '', price: '', category: '', brand: '', description: '', image: '', stock: '', discount: ''
  });

  const [form, setForm] = useState({
    name: '',
    price: '',
    category: '',
    brand: '',
    description: '',
    image: '',
    stock: '',
    discount: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessId(null);

    if (!form.name || !form.price || !form.category) {
      setError('Please fill in name, price, and category.');
      return;
    }

    setSaving(true);
    try {
      const db = getDatabase();
      const productsRef = ref(db, 'products');
      const newRef = push(productsRef);
      await set(newRef, {
        name: form.name,
        price: Number(form.price),
        category: form.category,
        brand: form.brand || null,
        description: form.description || '',
        image: form.image || '',
        stock: form.stock ? Number(form.stock) : 0,
        discount: form.discount ? Number(form.discount) : 0,
        createdAt: serverTimestamp(),
        createdBy: user?.uid || null
      });
      setSuccessId(newRef.key);
      setForm({ name: '', price: '', category: '', brand: '', description: '', image: '', stock: '', discount: '' });
    } catch (err: any) {
      setError(err?.message || 'Failed to create product');
    } finally {
      setSaving(false);
    }
  };

  // Load products list
  useEffect(() => {
    const db = getDatabase();
    const productsRef = ref(db, 'products');
    const off = onValue(productsRef, (snap) => {
      const val = snap.val() || {};
      const list = Object.entries(val).map(([id, p]: any) => ({ id, ...p }));
      // sort newest first if createdAt exists
      list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      setProducts(list);
    });
    return () => off();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    try {
      const db = getDatabase();
      await remove(ref(db, `products/${id}`));
    } catch (err: any) {
      setError(err?.message || 'Failed to delete product');
    }
  };

  const startEdit = (p: any) => {
    setEditingId(p.id);
    setEditForm({
      name: p.name || '',
      price: String(p.price ?? ''),
      category: p.category || '',
      brand: p.brand || '',
      description: p.description || '',
      image: p.image || '',
      stock: String(p.stock ?? ''),
      discount: String(p.discount ?? '')
    });
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const saveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;
    try {
      const db = getDatabase();
      await update(ref(db, `products/${editingId}`), {
        name: editForm.name,
        price: Number(editForm.price),
        category: editForm.category,
        brand: editForm.brand || null,
        description: editForm.description || '',
        image: editForm.image || '',
        stock: editForm.stock ? Number(editForm.stock) : 0,
        discount: editForm.discount ? Number(editForm.discount) : 0,
        updatedAt: serverTimestamp(),
        updatedBy: user?.uid || null
      });
      setEditingId(null);
    } catch (err: any) {
      setError(err?.message || 'Failed to update product');
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-600">Loading...</div>;
  }
  if (role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Add Product</h1>
          <p className="text-gray-600 mb-6">Create a new product listing</p>

          {error && <div className="mb-4 p-3 rounded-md bg-red-50 text-red-700 border border-red-200 text-sm">{error}</div>}
          {successId && (
            <div className="mb-4 p-3 rounded-md bg-green-50 text-green-700 border border-green-200 text-sm flex items-center">
              <CheckCircleIcon className="h-4 w-4 mr-2" />
              Product created successfully (ID: {successId})
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input name="name" value={form.name} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (KSh)</label>
                <input type="number" name="price" value={form.price} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select name="category" value={form.category} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500" required>
                  <option value="">Select category</option>
                  <option>Smartphones</option>
                  <option>Laptops</option>
                  <option>Audio</option>
                  <option>TVs</option>
                  <option>Smart Home</option>
                  <option>Drones</option>
                  <option>Wearables</option>
                  <option>Gaming</option>
                  <option>Tablets</option>
                  <option>Cameras</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                <input name="brand" value={form.brand} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                <input type="number" name="stock" value={form.stock} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Discount (%)</label>
                <input type="number" name="discount" value={form.discount} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
              <input name="image" value={form.image} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="https://..." />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>

            <div className="pt-2">
              <button type="submit" disabled={saving} className="inline-flex items-center px-5 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-60">
                {saving ? <Loader2Icon className="h-5 w-5 animate-spin mr-2" /> : null}
                {saving ? 'Saving...' : 'Create Product'}
              </button>
            </div>
          </form>

          {/* Products List */}
          <div className="mt-10 bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Products</h2>
              <span className="text-sm text-gray-500">{products.length} total</span>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                    <th className="px-6 py-3"/>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map((p) => (
                    <tr key={p.id} className="align-top">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {p.image ? <img src={p.image} alt={p.name} className="h-10 w-10 rounded object-cover" /> : <div className="h-10 w-10 rounded bg-gray-100" />}
                          <div>
                            <div className="font-medium text-gray-900">{p.name}</div>
                            <div className="text-xs text-gray-500">{p.brand || '—'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">{p.category}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">KSh {Number(p.price || 0).toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{p.stock ?? 0}</td>
                      <td className="px-6 py-4 text-right min-w-[220px]">
                        {editingId === p.id ? (
                          <form onSubmit={saveEdit} className="space-y-2">
                            <div className="grid grid-cols-2 gap-2">
                              <input name="name" value={editForm.name} onChange={handleEditChange} className="px-2 py-1 border border-gray-300 rounded" placeholder="Name" />
                              <input name="price" type="number" value={editForm.price} onChange={handleEditChange} className="px-2 py-1 border border-gray-300 rounded" placeholder="Price" />
                              <input name="category" value={editForm.category} onChange={handleEditChange} className="px-2 py-1 border border-gray-300 rounded" placeholder="Category" />
                              <input name="stock" type="number" value={editForm.stock} onChange={handleEditChange} className="px-2 py-1 border border-gray-300 rounded" placeholder="Stock" />
                            </div>
                            <div className="flex gap-2 justify-end">
                              <button type="button" onClick={() => setEditingId(null)} className="px-3 py-1 border border-gray-300 rounded">Cancel</button>
                              <button type="submit" className="px-3 py-1 bg-primary-600 text-white rounded">Save</button>
                            </div>
                          </form>
                        ) : (
                          <div className="flex gap-2 justify-end">
                            <button onClick={() => startEdit(p)} className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">Edit</button>
                            <button onClick={() => handleDelete(p.id)} className="px-3 py-1 border border-red-300 text-red-700 rounded hover:bg-red-50">Delete</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};


