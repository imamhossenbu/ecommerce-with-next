"use client";

import React, { useState, useContext } from 'react';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import Sidebar from '../admin/dashboard/_components/Sidebar'; 
import AuthContext from '@/context/AuthContext';

const AdminLayout = ({ children }) => { 
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useContext(AuthContext);

  // পেজ টাইটেলগুলো ডাইনামিক করার জন্য
  const getPageTitle = () => {
    const titles = {
      '/admin/dashboard': 'Overview',
      '/admin/products': 'Products',
      '/admin/categories': 'Categories',
      '/admin/orders': 'Orders',
      '/admin/customers': 'Customers',
      '/admin/settings': 'Settings',
    };
    return titles[pathname] || 'Admin Panel';
  };

  return (
    <div className="flex min-h-screen bg-[#FDF2F8]/30">
      
      {/* সাইডবার - পাস করা হয়েছে প্রপস */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      {/* মেন কন্টেন্ট এরিয়া - ডেস্কটপে সাইডবারের জায়গা ছেড়ে দিবে (lg:ml-64) */}
      <main className="flex-1 lg:ml-64 p-4 md:p-8 transition-all duration-300">
        
        {/* টপ হেডার */}
        <header className="flex justify-between items-center mb-10">
           <div className="flex items-center gap-4">
              {/* মোবাইল মেনু বাটন */}
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <Menu size={20} />
              </button>
              
              <h2 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">
                {getPageTitle()}
              </h2>
           </div>

           {/* ইউজার প্রোফাইল ইন্ডিকেটর */}
           <div className="flex items-center gap-3 bg-white p-1.5 pr-4 rounded-full border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-default">
              <div className="w-8 h-8 rounded-full bg-[#B0264F] flex items-center justify-center text-[10px] font-black text-white overflow-hidden border border-pink-100">
                {user?.profileImage ? (
                  <img 
                    src={user.profileImage} 
                    alt="admin profile" 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <span className="uppercase">{user?.name?.slice(0, 2) || 'AD'}</span>
                )}
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="text-[11px] font-black uppercase tracking-wider text-gray-800 leading-none">
                   {user?.name || 'Admin'}
                </span>
                <span className="text-[9px] font-bold text-[#B0264F] uppercase tracking-tighter">
                  Administrator
                </span>
              </div>
           </div>
        </header>

        {/* পেজ কন্টেন্ট রেন্ডার এরিয়া */}
        <section className="animate-in fade-in slide-in-from-bottom-3 duration-700 ease-out">
          {children} 
        </section>
      </main>
    </div>
  );
};

export default AdminLayout;