'use client'; 

import React, { useState, useEffect, useContext, useRef } from 'react';
import { Search, User, ShoppingBag, ChevronDown, Menu, X, UserCircle, LogOut, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image'; 
import Link from 'next/link'; 
import { usePathname, useRouter } from 'next/navigation'; 
import img from "../../../public/assets/logo.png"; 
import AuthContext from '@/context/AuthContext';
import { CartContext } from '@/context/CartContext';
import { getProducts } from '@/lib/api';
import { handleLogout } from '@/lib/axiosInstance';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [openMobileDropdown, setOpenMobileDropdown] = useState(null);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [allProducts, setAllProducts] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const { user } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const router = useRouter(); 
  const searchRef = useRef(null);
  const pathname = usePathname();



  const totalCartItems = cartItems?.reduce((total, item) => total + item.quantity, 0) || 0;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getProducts();
        if (res.success) setAllProducts(res.data);
      } catch (err) {
        console.error("Search fetch error", err);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const timeoutId = setTimeout(() => {
        const filtered = allProducts.filter(product => 
          product.name.toLowerCase().includes(searchQuery.toLowerCase())
        ).slice(0, 5);
        setFilteredResults(filtered);
        setIsSearching(false);
      }, 400);
      return () => clearTimeout(timeoutId);
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFilteredResults([]);
      setIsSearching(false);
    }
  }, [searchQuery, allProducts]);

  const closeAll = () => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
    setSearchQuery("");
  };

  const handleProductClick = (productId) => {
    closeAll();
    router.push(`/product/${productId}`);
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Skincare', hasDropdown: true, items: ['Cleansers', 'Toners', 'Essences'], href: '/shop' },
    { name: 'Collections', hasDropdown: true, items: ['Hydration', 'Brightening'], href: '/collections' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

    if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 bg-white ${isScrolled ? 'shadow-md py-3' : 'py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 md:px-6 relative flex justify-between items-center" ref={searchRef}>
        
        {/* LOGO & MOBILE MENU TOGGLE */}
        <div className="flex items-center gap-4">
          <button className="lg:hidden p-1 text-black cursor-pointer" onClick={() => setIsMobileMenuOpen(true)}>
            <Menu size={24} />
          </button>
          <Link href="/" className="block w-[80px] md:w-[110px]">
            <Image src={img} alt="Seoul Mirage" priority className="w-full h-auto object-contain" />
          </Link>
        </div>

        {/* DESKTOP NAV LINKS */}
        <ul className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.name} className="relative group py-2">
              <Link href={link.href || "#"} className="text-black hover:text-pink-500 flex items-center gap-1 transition-colors font-bold uppercase text-[13px]">
                {link.name}
                {link.hasDropdown && <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />}
              </Link>

              {link.hasDropdown && (
                <div className="absolute top-full left-0 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                  <div className="bg-white border border-gray-100 shadow-xl p-5 min-w-[200px] flex flex-col gap-3 rounded-xl">
                    {link.items.map(item => (
                      <Link key={item} href={`/shop?category=${item.toLowerCase()}`} className="text-sm text-gray-600 hover:text-pink-500 transition-colors font-medium">
                        {item}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>

        {/* RIGHT ICONS */}
        <div className="flex items-center gap-4 md:gap-6 text-black">
          {/* Search Section (Desktop) */}
          <div className="relative flex items-center">
            <AnimatePresence>
              {isSearchOpen && (
                <motion.div initial={{ width: 0, opacity: 0 }} animate={{ width: 220, opacity: 1 }} exit={{ width: 0, opacity: 0 }} className="relative hidden lg:block mr-2">
                  <input 
                    type="text" 
                    placeholder="Search products..." 
                    className="w-full bg-gray-50 border border-gray-100 rounded-full px-5 py-2 text-sm outline-none focus:ring-2 focus:ring-pink-500/10 transition-all"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      if(e.target.value.trim().length > 0) setIsSearching(true);
                    }}
                    autoFocus
                  />
                  {isSearching && <Loader2 className="absolute right-4 top-2.5 animate-spin text-pink-500" size={14} />}
                </motion.div>
              )}
            </AnimatePresence>
            
            <button onClick={() => { setIsSearchOpen(!isSearchOpen); setSearchQuery(""); }} className="hover:text-pink-500 cursor-pointer transition-colors pt-1">
              {isSearchOpen ? <X size={20} /> : <Search size={20} strokeWidth={1.5} />}
            </button>
          </div>

          {/* Profile & Cart Icons */}
          <div className="relative py-2" onMouseEnter={() => typeof window !== 'undefined' && window.innerWidth > 1024 && setIsUserMenuOpen(true)} onMouseLeave={() => typeof window !== 'undefined' && window.innerWidth > 1024 && setIsUserMenuOpen(false)}>
            <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} className="hover:text-pink-500 pt-1 outline-none">
              {user?.profileImage ? (
                <img src={user.profileImage} alt="" className="w-7 h-7 rounded-full border border-pink-100 object-cover" />
              ) : <User size={20} strokeWidth={1.5} />}
            </button>
            <AnimatePresence>
              {isUserMenuOpen && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute right-0 mt-2 bg-white shadow-2xl border border-gray-100 min-w-[180px] py-2 z-[100] rounded-xl overflow-hidden">
                  {user ? (
                    <>
                      <div className="px-5 py-3 border-b border-gray-100 bg-gray-50/50"><p className="text-[10px] font-black text-gray-400 uppercase truncate">{user.name}</p></div>
                      <Link href={user.role === 'admin' ? '/admin/dashboard' : '/profile'} onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-3 px-5 py-3 text-[11px] font-black hover:bg-gray-50 uppercase tracking-tighter text-black">
                        <UserCircle size={16} /> {user.role === 'admin' ? 'Admin Panel' : 'My Account'}
                      </Link>
                      <button onClick={handleLogout} className="w-full flex items-center gap-3 px-5 py-3 text-[11px] font-black text-red-500 hover:bg-red-50 border-t border-gray-100 mt-1 uppercase"><LogOut size={16} /> Logout</button>
                    </>
                  ) : (
                    <div className="flex flex-col">
                      <Link href="/signin" onClick={() => setIsUserMenuOpen(false)} className="px-5 py-3 text-[11px] font-black hover:bg-gray-50 uppercase">Sign In</Link>
                      <Link href="/signup" onClick={() => setIsUserMenuOpen(false)} className="px-5 py-3 text-[11px] font-black hover:bg-gray-50 uppercase">Sign Up</Link>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link href="/cart" className="hover:text-pink-500 relative pt-1 group">
            <ShoppingBag size={20} strokeWidth={1.5} />
            {totalCartItems > 0 && (
              <span className="absolute -top-1 -right-2 bg-pink-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {totalCartItems}
              </span>
            )}
          </Link>
        </div>

        {/* MOBILE SEARCH BAR (Slide down) */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="lg:hidden absolute top-full left-0 w-full bg-white border-b border-gray-100 shadow-lg overflow-hidden">
              <div className="px-4 py-4">
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Search products..." 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 py-3 text-sm outline-none" 
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      if(e.target.value.trim().length > 0) setIsSearching(true);
                    }}
                    autoFocus 
                  />
                  {isSearching && <Loader2 className="absolute right-4 top-3.5 animate-spin text-pink-500" size={16} />}
                </div>
                {searchQuery && (
                  <div className="mt-3 max-h-64 overflow-y-auto space-y-2">
                    {filteredResults.map(p => (
                      <div key={p._id} onClick={() => handleProductClick(p._id)} className="flex items-center gap-4 p-2 active:bg-gray-100 rounded-lg">
                        <img src={p.images?.[0]} className="w-12 h-12 rounded-lg object-cover" alt="" />
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-gray-800">{p.name}</span>
                          <span className="text-[10px] text-pink-500 font-black">${p.salePrice}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* MOBILE MENU DRAWER (Slide from left) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsMobileMenuOpen(false)} className="fixed inset-0 bg-black/40 z-[60] backdrop-blur-sm lg:hidden" />
            
            {/* Drawer */}
            <motion.div initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="fixed top-0 left-0 w-[280px] h-full bg-white z-[70] p-6 shadow-2xl lg:hidden">
              <div className="flex justify-between items-center mb-8 border-b border-gray-50 pb-6">
                <Image src={img} alt="Logo" className="w-[100px]" />
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-gray-50 rounded-full"><X size={20} /></button>
              </div>
              <ul className="space-y-1">
                {navLinks.map((link) => (
                  <li key={link.name} className="border-b border-gray-50 last:border-0">
                    <div className="flex justify-between items-center py-4" onClick={() => link.hasDropdown && setOpenMobileDropdown(openMobileDropdown === link.name ? null : link.name)}>
                      <Link href={link.href || "#"} onClick={!link.hasDropdown ? closeAll : undefined} className="text-[13px] font-black uppercase tracking-tight text-black">
                        {link.name}
                      </Link>
                      {link.hasDropdown && <ChevronDown size={18} className={`transition-transform ${openMobileDropdown === link.name ? 'rotate-180' : ''}`} />}
                    </div>
                    {link.hasDropdown && openMobileDropdown === link.name && (
                      <motion.ul initial={{ height: 0 }} animate={{ height: 'auto' }} className="pl-4 pb-2 overflow-hidden bg-pink-50/30 rounded-lg">
                        {link.items.map(item => (
                          <li key={item}>
                            <Link href={`/shop?category=${item.toLowerCase()}`} onClick={closeAll} className="py-3 px-4 text-[11px] font-bold text-gray-600 block uppercase hover:text-pink-500">
                              {item}
                            </Link>
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </li>
                ))}
              </ul>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}