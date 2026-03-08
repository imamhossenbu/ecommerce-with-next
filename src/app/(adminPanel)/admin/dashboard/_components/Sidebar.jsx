"use client" 

import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  Users, 
  Settings, 
  LogOut,
  X 
} from 'lucide-react';
import logo from "../../../../../../public/assets/logo.png";
import { handleLogout } from '../../../../../lib/axiosInstance'; 
import Link from 'next/link';
import { usePathname } from 'next/navigation'; 

const Sidebar = ({ isOpen, setIsOpen }) => {
  const pathname = usePathname(); 

  const menuItems = [
    { name: 'Overview', icon: LayoutDashboard, path: '/admin/dashboard' },
    { name: 'Products', icon: Package, path: '/admin/products' },
    { name: 'Categories', icon: Package, path: '/admin/categories' },
    { name: 'Orders', icon: ShoppingBag, path: '/admin/orders' },
    { name: 'Customers', icon: Users, path: '/admin/customers' },
    { name: 'Settings', icon: Settings, path: '/admin/settings' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`fixed top-0 left-0 h-full w-64 bg-[#ffeef3] border-r border-pink-100/50 flex flex-col z-50 transition-transform duration-300 lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        
        {/* Logo Section */}
        <div className="p-8 flex items-center justify-between">
          <Link href="/" onClick={() => setIsOpen(false)}>
            <img src={logo.src || logo} alt="Seoul Mirage" className="w-32" />
          </Link>
          <button onClick={() => setIsOpen(false)} className="lg:hidden p-1 text-gray-500 hover:bg-white/50 rounded-md">
            <X size={20} />
          </button>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 px-4 space-y-1">
          {menuItems.map((item, index) => {
            const isActive = pathname === item.path;
            
            return (
              <Link
                key={item.name || index}
                href={item.path} 
                onClick={() => setIsOpen(false)} 
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  isActive 
                  ? 'bg-black text-white shadow-lg shadow-black/10' 
                  : 'text-gray-600 hover:bg-white/60'
                }`}
              >
                <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Logout Section */}
        <div className="p-4 border-t border-pink-100/50">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;