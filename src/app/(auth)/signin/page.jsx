"use client"
import React, { useState, useContext } from 'react';
import { Mail, Lock, Eye, EyeOff, LogIn, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { loginUser } from '../../../lib/api'; 
import AuthContext from '../../../context/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Login() {
  const { login} = useContext(AuthContext);
  const router = useRouter();
  
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleSubmit = async (e) => {
  e.preventDefault();
  const loadingToast = toast.loading('Signing in...');
  
  try {
    const res = await loginUser(formData);
    
    if (res.success) {
      const userData = res.data;
      const userToken = res.data.token; 
      login(userData, userToken); 
      
      toast.success('Welcome back!', { id: loadingToast });
      router.push('/'); 
    }
  } catch (err) {
    toast.error(err.response?.data?.message || 'Invalid email or password', { id: loadingToast });
  }
};

  return (
    <section className="min-h-[70vh] bg-[#F5E6D3] flex flex-col items-center justify-center p-4">
      {/* Header Text */}
      <div className="text-center mb-8">
        <h1 className="text-[32px] md:text-[40px] font-medium text-neutral-800">Sign in to your account</h1>
        <p className="text-neutral-600 mt-2">
          Or <Link href="/signup" className="font-semibold cursor-pointer border-b border-black hover:text-accent transition-colors">create a new account</Link>
        </p>
      </div>

      {/* Login Card */}
      <div className="bg-white p-8 rounded-xl shadow-sm w-full max-w-[450px]">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Email Address */}
          <div>
            <label className="block text-[14px] font-medium text-gray-700 mb-2">Email address</label>
            <div className="relative">
              <input 
                type="email" 
                required
                placeholder="example@mail.com"
                className="w-full px-4 py-3 pl-11 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black transition-all"
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-[14px] font-medium text-gray-700">Password</label>
              <Link href={'/forget-password'} type="button" className="text-[13px] font-medium text-accent hover:underline">Forgot password?</Link>
            </div>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 pl-11 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black transition-all"
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" id="remember" className="w-4 h-4 rounded border-gray-300 accent-black" />
            <label htmlFor="remember" className="text-[14px] text-gray-600 select-none">Remember me for 30 days</label>
          </div>

          {/* Submit Button */}
          <button 
            type="submit"
            className="w-full bg-black text-white py-3.5 rounded-lg font-medium hover:bg-neutral-800 transition-all flex items-center justify-center gap-2 group"
          >
            <LogIn size={20} />
            Sign In
            <ArrowRight size={18} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
          </button>
        </form>
      </div>
      
      {/* Footer Info */}
      <p className="mt-8 text-[13px] text-gray-500 text-center max-w-[400px] leading-relaxed">
        By signing in, you agree to our <b className="text-gray-800">Terms of Service</b> and <b className="text-gray-800">Privacy Policy</b>.
      </p>
    </section>
  );
}