import React, { useState, useEffect } from 'react';
import { X, Save, Image as ImageIcon, Plus, Loader2, Trash2, ChevronDown, CheckCircle2 } from 'lucide-react';
import { addProduct, updateProduct, getCategories, addProductImage } from '../../../../../lib/api'; 
import toast from 'react-hot-toast';

const ProductModal = ({ isOpen, onClose, product, refresh }) => {
  const [formData, setFormData] = useState({
    name: '', regularPrice: '', salePrice: '', stock: '', description: '', 
    categoryID: '', straight_up: '', isFeatured: false, isBestseller: false, isNew: true
  });
  
  const [categories, setCategories] = useState([]);
  const [lowdown, setLowdown] = useState(['']); 
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);

  // ক্যাটাগরি লোড করা
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await getCategories();
        setCategories(res.data || res); 
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    };
    if (isOpen) fetchCats();
  }, [isOpen]);

  // এডিট মোড হ্যান্ডেল করা
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        regularPrice: product.regularPrice || '',
        salePrice: product.salePrice || '',
        stock: product.stock || '',
        description: product.description || '',
        categoryID: product.categoryID?._id || product.categoryID || '',
        straight_up: product.straight_up || '',
        isFeatured: product.isFeatured || false,
        isBestseller: product.isBestseller || false,
        isNew: product.isNew || true
      });
      setLowdown(product.lowdown || ['']);
      setThumbnailPreview(product.thumbnail);
      setGalleryPreviews(product.images || []);
    } else {
      resetForm();
    }
  }, [product, isOpen]);

  const resetForm = () => {
    setFormData({ name: '', regularPrice: '', salePrice: '', stock: '', description: '', categoryID: '', straight_up: '', isFeatured: false, isBestseller: false, isNew: true });
    setLowdown(['']);
    setThumbnailPreview(null);
    setGalleryPreviews([]);
  };

  const handleThumbnailChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingImg(true);
    try {
      const data = new FormData();
      data.append('image', file);
      const res = await addProductImage(data);
      setThumbnailPreview(res.url);
    } catch (err) {
      toast.error("Thumbnail upload failed!");
    } finally {
      setUploadingImg(false);
    }
  };

  const handleGalleryChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    setUploadingImg(true);
    try {
      const uploadPromises = files.map(async (file) => {
        const data = new FormData();
        data.append('image', file);
        const res = await addProductImage(data);
        return res.url;
      });
      const newUrls = await Promise.all(uploadPromises);
      setGalleryPreviews(prev => [...prev, ...newUrls]);
    } catch (err) {
      toast.error("Some images failed to upload!");
    } finally {
      setUploadingImg(false);
    }
  };

  const handleLowdownChange = (index, value) => {
    const updated = [...lowdown];
    updated[index] = value;
    setLowdown(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!thumbnailPreview) return toast.error("Please upload a thumbnail!");
    
    setLoading(true);
    try {
      const payload = {
        ...formData,
        thumbnail: thumbnailPreview,
        images: galleryPreviews,
        lowdown: lowdown.filter(item => item.trim() !== ""),
        regularPrice: Number(formData.regularPrice),
        salePrice: Number(formData.salePrice),
        stock: Number(formData.stock) || 0 // Stock handled as number
      };

      if (product) {
        await updateProduct(product._id, payload);
      } else {
        await addProduct(payload);
      }

      refresh();
      onClose();
      toast.success("Product saved successfully!");
    } catch (err) {
      console.error("Submit error:", err);
      toast.error(err.response?.data?.message || "Operation failed!");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-6xl max-h-[95vh] overflow-y-auto rounded-[3rem] shadow-2xl animate-in fade-in zoom-in duration-300">
        
        {/* Header */}
        <div className="sticky top-0 bg-white/90 backdrop-blur-md px-10 py-6 border-b border-gray-100 flex justify-between items-center z-20">
          <div>
            <h3 className="text-2xl font-black tracking-tight">{product ? 'Update Collection' : 'Add New Product'}</h3>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Store Management / {product ? 'Edit' : 'Create'}</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-gray-100 rounded-full transition-all"><X size={24} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Media */}
          <div className="lg:col-span-5 space-y-10">
            <div className="space-y-4">
              <label className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
                Hero Thumbnail {uploadingImg && <Loader2 size={12} className="animate-spin text-pink-500" />}
              </label>
              <div className="relative aspect-square rounded-[2.5rem] bg-gray-50 border-2 border-dashed border-gray-200 overflow-hidden group">
                {thumbnailPreview ? (
                  <div className="relative h-full">
                    <img src={thumbnailPreview} className="w-full h-full object-cover" alt="Preview" />
                    <div className="absolute top-4 right-4 bg-green-500 text-white p-1 rounded-full"><CheckCircle2 size={16} /></div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-gray-300">
                    <ImageIcon size={48} strokeWidth={1.2} />
                    <span className="text-[10px] font-black mt-3">Click to Auto-upload</span>
                  </div>
                )}
                <input type="file" accept="image/*" onChange={handleThumbnailChange} className="absolute inset-0 opacity-0 cursor-pointer" disabled={uploadingImg} />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Gallery Preview ({galleryPreviews.length})</label>
              <div className="grid grid-cols-4 gap-3">
                {galleryPreviews.map((url, i) => (
                  <div key={i} className="aspect-square rounded-2xl overflow-hidden border border-gray-100 shadow-sm relative group">
                    <img src={url} className="w-full h-full object-cover" alt="" />
                    <button type="button" onClick={() => setGalleryPreviews(prev => prev.filter((_, idx) => idx !== i))} className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 className="text-white" size={16} />
                    </button>
                  </div>
                ))}
                <label className={`aspect-square rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center cursor-pointer hover:bg-pink-50 transition-colors ${uploadingImg ? 'opacity-50 pointer-events-none' : ''}`}>
                  {uploadingImg ? <Loader2 className="animate-spin text-pink-500" size={20} /> : <Plus className="text-gray-400" size={20} />}
                  <input type="file" accept="image/*" multiple onChange={handleGalleryChange} className="hidden" />
                </label>
              </div>
            </div>

            <div className="p-7 bg-gray-50 rounded-[2.5rem] space-y-5 border border-gray-100">
               <label className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 block">Visibility & Tags</label>
               <div className="grid grid-cols-1 gap-4">
                  {['isNew', 'isBestseller', 'isFeatured'].map(tag => (
                    <label key={tag} className="flex items-center justify-between p-3 bg-white rounded-xl cursor-pointer hover:shadow-sm transition-shadow">
                      <span className="text-sm font-bold text-gray-700">{tag === 'isNew' ? 'New Arrival' : tag === 'isBestseller' ? 'Bestseller' : 'Featured'}</span>
                      <input type="checkbox" checked={formData[tag]} onChange={e => setFormData({...formData, [tag]: e.target.checked})} className="w-5 h-5 accent-black" />
                    </label>
                  ))}
               </div>
            </div>
          </div>

          {/* Right Column: Details */}
          <div className="lg:col-span-7 space-y-8">
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Product Title</label>
                <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl font-bold" required />
              </div>

              {/* Added Straight Up (Catchline) Field */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Straight Up (Short Catchline)</label>
                <input value={formData.straight_up} onChange={e => setFormData({...formData, straight_up: e.target.value})} className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl font-bold" placeholder="e.g. Pure Glow in a Bottle" />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Regular Price</label>
                  <input type="number" value={formData.regularPrice} onChange={e => setFormData({...formData, regularPrice: e.target.value})} className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl font-bold" required />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Sale Price</label>
                  <input type="number" value={formData.salePrice} onChange={e => setFormData({...formData, salePrice: e.target.value})} className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl font-bold text-pink-600" required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Collection / Category</label>
                  <div className="relative">
                    <select value={formData.categoryID} onChange={e => setFormData({...formData, categoryID: e.target.value})} className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl font-bold appearance-none cursor-pointer" required>
                      <option value="">Select a category</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                  </div>
                </div>

                {/* Added Stock Field */}
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Stock Availability</label>
                  <input type="number" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl font-bold" placeholder="0" />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-black uppercase text-gray-400">The Lowdown</label>
                  <button type="button" onClick={() => setLowdown([...lowdown, ''])} className="px-3 py-1 bg-pink-50 text-pink-600 rounded-lg font-black text-[10px] uppercase">+ Add Point</button>
                </div>
                {lowdown.map((item, index) => (
                  <div key={index} className="flex gap-3 group">
                    <input value={item} onChange={e => handleLowdownChange(index, e.target.value)} className="flex-1 px-6 py-3.5 bg-gray-50 border-none rounded-xl text-sm" />
                    {lowdown.length > 1 && (
                      <button type="button" onClick={() => setLowdown(lowdown.filter((_, i) => i !== index))} className="p-3 text-gray-300 hover:text-red-500"><Trash2 size={18} /></button>
                    )}
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-gray-400">Description</label>
                <textarea rows="4" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm" required />
              </div>
            </div>

            <div className="flex gap-5 pt-8">
              <button type="button" onClick={onClose} className="flex-1 py-5 text-[11px] font-black uppercase text-gray-400">Discard</button>
              <button disabled={loading || uploadingImg} type="submit" className="flex-[2.5] bg-black text-white py-5 rounded-[1.8rem] font-black uppercase text-[11px] flex items-center justify-center gap-3 disabled:opacity-50">
                {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                {product ? 'Apply Updates' : 'Publish to Store'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;