'use client'

import React, { useState } from "react";
import { Lock, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { resetPassword } from "../../../../lib/api"; 
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import logo from "../../../../../public/assets/logo.png";

export default function ResetPasswordPage() {
  const { token } = useParams(); 
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return toast.error("Passwords do not match!");
    }

    if (password.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    try {
      setLoading(true);
      const res = await resetPassword(token, password);

      if (res?.success) {
        toast.success(res.message);
        router.push("/signin");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-6">
      <div className="w-full max-w-sm">
        <Image src={logo} alt="Logo" className="w-32 mx-auto mb-8" />
        <h1 className="text-2xl font-black uppercase text-center mb-8">Reset Password</h1>
        
        <form onSubmit={handleReset} className="space-y-4">
          <div className="relative">
            <Lock className="absolute left-4 top-4 text-gray-400" size={18} />
            <input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border bg-gray-50 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-black"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-4 text-gray-400" size={18} />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border bg-gray-50 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-black"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}