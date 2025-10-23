import React, { useEffect, useState } from "react";
import { Navbar } from "../../components/layout/Navbar";
import { Footer } from "../../components/layout/Footer";
import { useAuth } from "../../contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { CheckCircleIcon } from "lucide-react";
import { ref, push, set, serverTimestamp, onValue, remove, update } from "firebase/database";
import { database } from "../../config/firebase";
import {
  handleFileSelection,
  uploadFileToAssets,
  revokeFilePreview,
  UploadedFile,
} from "../../utils/fileUpload";

export const Products: React.FC = () => {
  const { role, user, loading } = useAuth();
  const [saving, setSaving] = useState(false);
  const [successId, setSuccessId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    brand: "",
    description: "",
    stock: "",
    discount: "",
  });

  const [uploadedImages, setUploadedImages] = useState<UploadedFile[]>([]);
  const [uploadErrors, setUploadErrors] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // ✅ Filter logic (kept above returns)
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.brand?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "" || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    const { files: uploadedFiles, errors } = handleFileSelection(files, form.name, 4);
    setUploadedImages(uploadedFiles);
    setUploadErrors(errors);
  };

  const removeImage = (index: number) => {
    const newImages = uploadedImages.filter((_, i) => i !== index);
    revokeFilePreview(uploadedImages[index].preview);
    setUploadedImages(newImages);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setForm({
      name: "",
      price: "",
      category: "",
      brand: "",
      description: "",
      stock: "",
      discount: "",
    });
    setUploadedImages([]);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessId(null);
    setUploadErrors([]);

    if (!form.name || !form.price || !form.category) {
      setError("Please fill in name, price, and category.");
      return;
    }

    setSaving(true);
    try {
      const imagePaths: string[] = [];
      for (const uploadedImage of uploadedImages) {
        if (uploadedImage.file) {
          const uploadResult = await uploadFileToAssets(uploadedImage.file, uploadedImage.name);
          if (uploadResult.success && uploadResult.path) {
            imagePaths.push(uploadResult.path);
          }
        }
      }

      if (editingId) {
        const productRef = ref(database, `products/${editingId}`);
        await update(productRef, {
          ...form,
          price: Number(form.price),
          stock: Number(form.stock) || 0,
          discount: Number(form.discount) || 0,
          images: imagePaths.length > 0 ? imagePaths : undefined,
          updatedAt: serverTimestamp(),
        });
        setSuccessId(editingId);
      } else {
        const productsRef = ref(database, "products");
        const newRef = push(productsRef);
        await set(newRef, {
          ...form,
          price: Number(form.price),
          stock: Number(form.stock) || 0,
          discount: Number(form.discount) || 0,
          images: imagePaths,
          createdAt: serverTimestamp(),
          createdBy: user?.uid || null,
        });
        setSuccessId(newRef.key);
      }

      uploadedImages.forEach((img) => revokeFilePreview(img.preview));
      resetForm();
    } catch (err: any) {
      setError(err?.message || "Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (product: any) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      price: product.price,
      category: product.category,
      brand: product.brand || "",
      description: product.description || "",
      stock: product.stock?.toString() || "",
      discount: product.discount?.toString() || "",
    });
    setUploadedImages(
      (product.images || []).map((url: string, i: number) => ({
        name: `Existing Image ${i + 1}`,
        preview: url,
        file: null as any,
      }))
    );
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await remove(ref(database, `products/${id}`));
    } catch {
      alert("Failed to delete product");
    }
  };

  useEffect(() => {
    const productsRef = ref(database, "products");
    const off = onValue(productsRef, (snap) => {
      const val = snap.val() || {};
      const list = Object.entries(val).map(([id, p]: any) => ({ id, ...p }));
      list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      setProducts(list);
    });
    return () => off();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (role !== "admin") return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Form Section */}
      <div className="pt-16 max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-6">
          {editingId ? "Edit Product" : "Add Product"}
        </h1>

        {error && <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200">{error}</div>}
        {successId && (
          <div className="mb-4 p-3 bg-green-50 text-green-700 border border-green-200 flex items-center">
            <CheckCircleIcon className="h-4 w-4 mr-2" />
            Product saved successfully
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input name="name" value={form.name} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Price (KSh)</label>
              <input type="number" name="price" value={form.price} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select name="category" value={form.category} onChange={handleChange} className="w-full px-3 py-2 border rounded" required>
                <option value="">Select Category</option>
                <option>Phones</option>
                <option>TVs</option>
                <option>Sound Systems</option>
                <option>House Appliances</option>
                <option>Network Accessories</option>
                <option>Laptops</option>
                <option>Electronics</option>
                <option>Accessories</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Brand</label>
              <input name="brand" value={form.brand} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
            </div>
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium mb-1">Product Images (Max 4)</label>
            <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="w-full px-3 py-2 border rounded" />
            {uploadedImages.length > 0 && (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                {uploadedImages.map((img, index) => (
                  <div key={index} className="relative">
                    <img src={img.preview} alt={`Preview ${index + 1}`} className="w-full h-24 object-cover border rounded" />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={3} className="w-full px-3 py-2 border rounded" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium mb-1">Stock</label>
              <input type="number" name="stock" value={form.stock} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Discount (%)</label>
              <input type="number" name="discount" value={form.discount} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
            </div>
          </div>

          <div className="flex gap-3">
            <button type="submit" disabled={saving} className="px-5 py-2 bg-blue-600 text-white rounded">
              {saving ? "Saving..." : editingId ? "Update Product" : "Create Product"}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm} className="px-5 py-2 bg-gray-300 rounded">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* ✅ Product List */}
      <div className="mt-10 w-full px-4 pb-10">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-3">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-1/3 px-3 py-2 border rounded"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full md:w-1/4 px-3 py-2 border rounded"
          >
            <option value="">All Categories</option>
            <option>Phones</option>
            <option>TVs</option>
            <option>Sound Systems</option>
            <option>House Appliances</option>
            <option>Network Accessories</option>
            <option>Laptops</option>
            <option>Electronics</option>
            <option>Accessories</option>
          </select>
        </div>

        <div className="bg-white border rounded-xl overflow-x-auto w-full">
          <table className="w-full divide-y">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium">Item</th>
                <th className="px-6 py-3 text-left text-xs font-medium">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium">Price</th>
                <th className="px-6 py-3 text-right text-xs font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredProducts.map((p) => (
                <tr key={p.id}>
                  <td className="px-6 py-4 flex items-center gap-3">
                    {p.images?.length ? (
                      <img
                        src={p.images[0]}
                        alt={p.name}
                        className="h-10 w-10 rounded object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 bg-gray-200 rounded" />
                    )}
                    <div>
                      <div className="font-medium">{p.name}</div>
                      <div className="text-xs text-gray-500">{p.brand || "—"}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">{p.category}</td>
                  <td className="px-6 py-4 text-sm">KSh {p.price}</td>
                  <td className="px-6 py-4 text-right text-sm">
                    <button onClick={() => handleEdit(p)} className="text-blue-600 hover:underline mr-3">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:underline">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Footer />
    </div>
  );
};
