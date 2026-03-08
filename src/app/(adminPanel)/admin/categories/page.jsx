"use client"

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, X, Upload, Loader2, Image as ImageIcon, MoreVertical, Search as SearchIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { 
  createCategory, 
  deleteCategory, 
  updateCategory,
  getCategories
} from '../../../../lib/api';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  
  // Form States
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await getCategories();
      if (res.success) setCategories(res.data);
    } catch (err) {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Name is required");

    const formData = new FormData();
    formData.append("name", name);
    if (image) formData.append("image", image);

    setSubmitting(true);
    try {
      const res = editId ? await updateCategory(editId, formData) : await createCategory(formData);
      if (res.success) {
        toast.success(editId ? "Updated!" : "Added!");
        closeModal();
        fetchCategories();
      }
    } catch (err) {
      toast.error("Operation failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    try {
      const res = await deleteCategory(id);
      if (res.success) {
        toast.success("Deleted");
        fetchCategories();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  const openModal = (cat = null) => {
    if (cat) {
      setEditId(cat._id);
      setName(cat.name);
      setPreview(cat.image);
    } else {
      setEditId(null);
      setName("");
      setPreview("");
      setImage(null);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditId(null);
    setName("");
    setImage(null);
    setPreview("");
  };

  return (
    <div className="p-4 md:p-8 bg-white min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tighter text-gray-900">Categories List</h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Manage store classification</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="bg-black text-white px-6 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center gap-2 hover:bg-zinc-800 transition-all shadow-xl shadow-black/5 active:scale-95"
        >
          <Plus size={16} strokeWidth={3} /> Add Category
        </button>
      </div>

      {/* Table Container */}
      <div className="bg-white border border-gray-100 rounded-[32px] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-50">
                <th className="p-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Preview</th>
                <th className="p-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Category Name</th>
                <th className="p-6 text-[10px] font-black uppercase text-gray-400 tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan="3" className="p-20 text-center">
                    <Loader2 className="animate-spin inline-block text-gray-300" size={32} />
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan="3" className="p-20 text-center text-xs font-bold text-gray-300 uppercase italic">No categories found</td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr key={cat._id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="p-5">
                      <div className="w-14 h-14 rounded-2xl overflow-hidden bg-gray-100 border border-gray-100">
                        <img src={cat.image} className="w-full h-full object-cover" alt={cat.name} />
                      </div>
                    </td>
                    <td className="p-5">
                      <span className="text-sm font-black text-gray-800 uppercase tracking-tight">{cat.name}</span>
                    </td>
                    <td className="p-5 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => openModal(cat)}
                          className="p-3 bg-gray-50 text-gray-600 rounded-xl hover:bg-black hover:text-white transition-all"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(cat._id)}
                          className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal - Same as previous code but matches table style */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-md" onClick={closeModal} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white w-full max-w-md rounded-[40px] p-10 relative z-10 border border-gray-100 shadow-2xl">
              <button onClick={closeModal} className="absolute top-8 right-8 text-gray-400 hover:text-black"><X size={20} /></button>
              <h2 className="text-xl font-black uppercase mb-8 text-gray-900">{editId ? 'Edit' : 'New'} Category</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex flex-col items-center">
                  <label className="relative cursor-pointer w-full group">
                    <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                    {preview ? (
                      <div className="w-full h-48 rounded-3xl overflow-hidden border-2 border-gray-100 relative">
                        <img src={preview} className="w-full h-full object-cover" alt="Preview" />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"><Upload className="text-white" /></div>
                      </div>
                    ) : (
                      <div className="w-full h-48 rounded-3xl border-2 border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center text-gray-400 hover:bg-gray-100 transition-all">
                        <ImageIcon size={32} strokeWidth={1.5} className="mb-2" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Choose Image</span>
                      </div>
                    )}
                  </label>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Category Label</label>
                  <input type="text" className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-black/5 transition-all" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Serums" />
                </div>
                <button disabled={submitting} className="w-full bg-black text-white py-5 rounded-2xl font-black uppercase text-[11px] tracking-widest hover:bg-zinc-800 disabled:opacity-50 transition-all flex items-center justify-center gap-3">
                  {submitting ? <Loader2 className="animate-spin" size={18} /> : (editId ? 'Update' : 'Save')}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}