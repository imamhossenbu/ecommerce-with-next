'use client'

import React, { useState } from "react";
import { Lock, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { resetPassword } from "../../../../lib/api";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import logo from "../../../../public/assets/logo.png";

export default function ResetPassword() {
  const { token } = useParams();
const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      toast.error("Please fill all fields");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const res = await resetPassword(token, password);

      if (res?.success) {
        toast.success("Password changed successfully");

        setPassword("");
        setConfirmPassword("");

        setTimeout(() => {
          router.push("/signin");
        }, 1500);
      }
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          "Reset link expired or invalid. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-white p-6">
      <div className="w-full max-w-sm">
         <Image src={logo} alt="Logo" className="w-32 mx-auto mb-8" />
        <h1 className="text-2xl font-black uppercase text-center mb-8">
          Reset Password
        </h1>

        <form onSubmit={handleReset} className="space-y-4">
          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-4 top-4 text-gray-400" size={18} />
            <input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-gray-100 bg-gray-50 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-black transition-all"
            />
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <Lock className="absolute left-4 top-4 text-gray-400" size={18} />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full border border-gray-100 bg-gray-50 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-black transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Updating...
              </>
            ) : (
              "Update Password"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
