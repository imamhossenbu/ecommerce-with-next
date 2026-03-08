"use client"

import React, { useState } from 'react';
import { Lock, Mail, ShieldCheck, Eye, EyeOff, Loader2 } from 'lucide-react';
import { changePassword, updateAdminSettings } from '../../../../lib/api';
import toast from 'react-hot-toast';

const Settings = () => {
  const [loading, setLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false });
  
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email && !formData.newPassword) {
        return toast.error("Please provide information to update");
    }

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
        return toast.error("Passwords do not match");
    }

    try {
        setLoading(true);
        const res = await updateAdminSettings({
            email: formData.email,
            currentPassword: formData.currentPassword,
            newPassword: formData.newPassword
        });

        if (res.success) {
            toast.success("Settings updated!");
            setFormData({ ...formData, currentPassword: '', newPassword: '', confirmPassword: '' });
        }
    } catch (err) {
        toast.error(err.response?.data?.message || "Update failed");
    } finally {
        setLoading(false);
    }
};



  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 font-sans">
      <div className="flex items-center justify-between">
        {/* <h2 className="text-2xl font-black text-gray-800 tracking-tight">Settings</h2> */}
      </div>

      {/* General Settings Section */}
      <section className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-8 space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-50 text-blue-500 rounded-lg">
              <ShieldCheck size={20} />
            </div>
            <h3 className="text-lg font-black text-gray-800">General</h3>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <label className="md:w-48 text-sm font-bold text-gray-500">Support Email :</label>
              <div className="flex-1 relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <input 
                  type="text" 
                  readOnly 
                  value="support@glowly.com" 
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent rounded-2xl text-sm font-bold text-gray-400 cursor-not-allowed outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security Settings Section */}
      <section className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-pink-50 text-pink-500 rounded-lg">
              <Lock size={20} />
            </div>
            <h3 className="text-lg font-black text-gray-800">Security</h3>
          </div>

          <div className="space-y-6">
            {/* Current Password */}
            <PasswordField 
              label="Currently Password:" 
              name="currentPassword"
              value={formData.currentPassword}
              show={showPasswords.current}
              onChange={handleChange}
              toggle={() => togglePasswordVisibility('current')}
            />

            {/* New Password */}
            <PasswordField 
              label="New Password:" 
              name="newPassword"
              value={formData.newPassword}
              show={showPasswords.new}
              onChange={handleChange}
              toggle={() => togglePasswordVisibility('new')}
            />

            {/* Confirm Password */}
            <PasswordField 
              label="Confirm Password:" 
              name="confirmPassword"
              value={formData.confirmPassword}
              show={showPasswords.confirm}
              onChange={handleChange}
              toggle={() => togglePasswordVisibility('confirm')}
            />
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-gray-900 text-white px-10 py-4 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-gray-800 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : "Update Password"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

// Reusable Input Component
const PasswordField = ({ label, name, value, show, onChange, toggle }) => (
  <div className="flex flex-col md:flex-row md:items-center gap-4 group">
    <label className="md:w-48 text-sm font-bold text-gray-500 group-focus-within:text-gray-800 transition-colors">
      {label}
    </label>
    <div className="flex-1 relative">
      <input 
        type={show ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        required
        placeholder="••••••••••••••••"
        className="w-full px-6 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-pink-50 focus:border-pink-200 transition-all font-mono"
      />
      <button 
        type="button"
        onClick={toggle}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-600 transition-colors"
      >
        {show ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  </div>
);

export default Settings;