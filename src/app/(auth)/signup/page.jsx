"use client"

import React, { useState, useContext } from 'react';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { registerUser } from '../../../lib/api';
import AuthContext from '../../../context/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Register() {
  const { register } = useContext(AuthContext); 
  const router = useRouter();
  
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '',
    confirmPassword: '' 
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

   
    if (formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match!");
    }

    const loadingToast = toast.loading('Creating your account...');
    
    try {
    
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password
      };

      const res = await registerUser(payload); 
      
      if (res.success) {
        
        register(res.data, res.data.token || null); 
        
        toast.success('Registration successful!', { id: loadingToast });
        router.push('/'); 
      }
    } catch (err) {
   
      toast.error(err.response?.data?.message || 'Something went wrong', { id: loadingToast });
    }
  };

  return (
    <section className="min-h-[70vh] bg-[#F5E6D3] flex flex-col items-center justify-center p-4">
      {/* Header Section */}
      <div className="text-center mb-8">
        <h1 className="text-[32px] md:text-[40px] font-medium text-neutral-800">Create your account</h1>
        <p className="text-neutral-600 mt-2">
          Or <Link href="/signin" className="font-semibold cursor-pointer border-b border-black hover:text-accent transition-colors">sign in to your existing account</Link>
        </p>
      </div>

      {/* Registration Card */}
      <div className="bg-white p-8 rounded-xl shadow-sm w-full max-w-[480px]">
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Full Name Field */}
          <div>
            <label className="block text-[14px] font-medium text-gray-700 mb-2">Full name</label>
            <input 
              type="text" 
              required
              placeholder="Enter your name"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black transition-all"
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          {/* Email Address Field */}
          <div>
            <label className="block text-[14px] font-medium text-gray-700 mb-2">Email address</label>
            <input 
              type="email" 
              required
              placeholder="example@mail.com"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black transition-all"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-[14px] font-medium text-gray-700 mb-2">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black transition-all"
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Confirm Password Field */}
          <div>
            <label className="block text-[14px] font-medium text-gray-700 mb-2">Confirm password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black transition-all"
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              />
            </div>
          </div>

          {/* Privacy Policy Checkbox */}
          <div className="flex items-start gap-2 py-2">
            <input type="checkbox" required id="agree" className="mt-1 w-4 h-4 rounded border-gray-300 accent-black" />
            <label htmlFor="agree" className="text-[13px] text-gray-600 leading-snug select-none">
              I agree to the <span className="font-bold text-black cursor-pointer underline">Terms of Service</span> and <span className="font-bold text-black cursor-pointer underline">Privacy Policy</span>
            </label>
          </div>

          {/* Submit Button */}
          <button 
            type="submit"
            className="w-full bg-black text-white py-3.5 rounded-lg font-medium hover:bg-neutral-800 transition-all flex items-center justify-center gap-2 group active:scale-95"
          >
            Create Account
          </button>
        </form>
      </div>

      {/* Login Redirect */}
      <p className="mt-8 text-[15px] text-neutral-800">
        Already have an account? <Link href="/signin" className="font-bold hover:underline">Sign in</Link>
      </p>
    </section>
  );
}