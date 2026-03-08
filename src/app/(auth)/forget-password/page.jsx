'use client'

import React, { useState } from 'react';
import { Mail, Loader2 } from 'lucide-react';
import logo from "../../../../public/assets/logo.png";
import { toast } from 'react-hot-toast';
import { forgetPassword } from '../../../lib/api';
import Image from 'next/image';

export default function ForgetPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await forgetPassword(email);
      if (res.success) {
        toast.success("Password reset link send to your email");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "User not found");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-white p-6">
      <div className="w-full max-w-sm text-center">
        <Image src={logo} alt="Logo" className="w-32 mx-auto mb-8" />
        <h1 className="text-2xl font-black uppercase tracking-tight mb-2">Reset password</h1>
        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-8">
          Enter your email to receive the reset link
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-4 top-4 text-gray-400" size={18} />
            <input 
              type="email" 
              placeholder="Enter your email" 
              required
              className="w-full border border-gray-100 bg-gray-50 rounded-2xl py-4 pl-12 pr-4 outline-none focus:bg-white focus:border-black transition-all font-medium text-sm"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button 
            disabled={loading}
            className="w-full bg-black text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-zinc-800 transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : "Send Link"}
          </button>
        </form>
      </div>
    </div>
  );
}