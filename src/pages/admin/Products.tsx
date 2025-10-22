import React, { useEffect, useState } from "react";
import { Navbar } from "../../components/layout/Navbar";
import { Footer } from "../../components/layout/Footer";
import { useAuth } from "../../contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Loader2Icon, CheckCircleIcon } from "lucide-react";
import { ref, push, set, serverTimestamp, onValue } from "firebase/database";
import { database } from "../../config/firebase";
import { 
  handleFileSelection, 
  uploadFileToAssets, 
  revokeFilePreview, 
  UploadedFile 
} from "../../utils/fileUpload";

export const Products: React.FC = () => {
  const { role, user, loading } = useAuth();
  const [saving, setSaving] = useState(false);
  const [successId, setSuccessId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<any[]>([]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessId(null);
    setUploadErrors([]);

    if (!form.name || !form.price || !form.category) {
      setError("Please fill in name, price, and category.");
      return;
    }

    if (uploadedImages.length === 0) {
      setError("Please upload at least one image for the product.");
      return;
    }

    setSaving(true);
    try {
      // Upload all images first
      const imagePaths: string[] = [];
      for (const uploadedImage of uploadedImages) {
        const uploadResult = await uploadFileToAssets(uploadedImage.file, uploadedImage.name);
        if (uploadResult.success && uploadResult.path) {
          imagePaths.push(uploadResult.path);
        } else {
          throw new Error(`Failed to upload image: ${uploadResult.error}`);
        }
      }

      // Create product in database
      const productsRef = ref(database, "products");
      const newRef = push(productsRef);
      await set(newRef, {
        name: form.name,
        price: Number(form.price),
        category: form.category,
        brand: form.brand || null,
        description: form.description || "",
        images: imagePaths,
        stock: form.stock ? Number(form.stock) : 0,
        discount: form.discount ? Number(form.discount) : 0,
        createdAt: serverTimestamp(),
        createdBy: user?.uid || null,
      });
      
      setSuccessId(newRef.key);
      
      // Clean up preview URLs
      uploadedImages.forEach(img => revokeFilePreview(img.preview));
      
      // Reset form
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
    } catch (err: any) {
      setError(err?.message || "Failed to create product");
    } finally {
      setSaving(false);
    }
  };

  // Load products
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

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  if (role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-16">
        <div className="max-w-3xl mx-auto px-4 py-10">
          <h1 className="text-3xl font-bold mb-6">Add Product</h1>

          {error && <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200">{error}</div>}
          {successId && (
            <div className="mb-4 p-3 bg-green-50 text-green-700 border border-green-200 flex items-center">
              <CheckCircleIcon className="h-4 w-4 mr-2" />
              Product created successfully (ID: {successId})
            </div>
          )}

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
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                required
              >
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

            <div>
              <label className="block text-sm font-medium mb-1">
                Product Images (Max 4)
              </label>
              <input 
                type="file" 
                accept="image/*" 
                multiple 
                onChange={handleImageUpload}
                className="w-full px-3 py-2 border rounded" 
              />
              <p className="text-xs text-gray-500 mt-1">
                Supported formats: JPEG, PNG, WebP. Max size: 5MB per image.
              </p>
              
              {uploadErrors.length > 0 && (
                <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                  {uploadErrors.map((error, index) => (
                    <div key={index}>{error}</div>
                  ))}
                </div>
              )}
              
              {uploadedImages.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Uploaded Images ({uploadedImages.length}/4):
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {uploadedImages.map((img, index) => (
                      <div key={index} className="relative group">
                        <img 
                          src={img.preview} 
                          alt={`Preview ${index + 1}`} 
                          className="w-full h-24 object-cover border rounded"
                        />
                        <div className="absolute top-1 right-1">
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                          >
                            ×
                          </button>
                        </div>
                        <div className="text-xs text-gray-500 mt-1 truncate">
                          {img.name}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows={4} className="w-full px-3 py-2 border rounded" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium mb-1">Stock Quantity</label>
                <input 
                  type="number" 
                  name="stock" 
                  value={form.stock} 
                  onChange={handleChange} 
                  placeholder="0"
                  className="w-full px-3 py-2 border rounded" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Discount (%)</label>
                <input 
                  type="number" 
                  name="discount" 
                  value={form.discount} 
                  onChange={handleChange} 
                  placeholder="0"
                  min="0"
                  max="100"
                  className="w-full px-3 py-2 border rounded" 
                />
              </div>
            </div>

            <div>
              <button type="submit" disabled={saving} className="px-5 py-2 bg-blue-600 text-white rounded">
                {saving ? <Loader2Icon className="h-5 w-5 animate-spin inline-block mr-2" /> : null}
                {saving ? "Saving..." : "Create Product"}
              </button>
            </div>
          </form>

          {/* Products list */}
          <div className="mt-10 bg-white border rounded-xl">
            <div className="px-6 py-4 border-b flex justify-between">
              <h2 className="text-lg font-semibold">Products</h2>
              <span className="text-sm text-gray-500">{products.length} total</span>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium">Item</th>
                    <th className="px-6 py-3 text-left text-xs font-medium">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {products.map((p) => (
                    <tr key={p.id}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {p.images && p.images.length > 0 ? (
                            <img
                              src={p.images[0]}
                              alt={p.name}
                              className="h-10 w-10 rounded object-cover"
                              onError={(e) => {
                                e.currentTarget.src = "https://via.placeholder.com/40x40?text=No+Image";
                              }}
                            />
                          ) : (
                            <div className="h-10 w-10 bg-gray-200 rounded flex items-center justify-center">
                              <span className="text-xs text-gray-400">No Image</span>
                            </div>
                          )}
                          <div>
                            <div className="font-medium">{p.name}</div>
                            <div className="text-xs text-gray-500">{p.brand || "—"}</div>
                            {p.images && p.images.length > 1 && (
                              <div className="text-xs text-blue-500">
                                +{p.images.length - 1} more
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">{p.category}</td>
                      <td className="px-6 py-4 text-sm">KSh {p.price}</td>
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
