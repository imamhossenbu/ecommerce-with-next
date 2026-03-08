"use client"


import React from 'react';
import { Instagram, Facebook, Globe } from 'lucide-react';
import logoImg from "../../../public/assets/logo.png"; 
import Link from 'next/link';
import Image from 'next/image'; 
import { usePathname } from 'next/navigation';

export default function Footer() {

  const pathname = usePathname();

   if (pathname.startsWith('/admin')) {
    return null; 
  }

  return (
    <footer className="bg-white pt-16 pb-8 border-t border-border">
      <div className="site-container">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Column 1: About & Socials */}
          <div className="lg:col-span-2">
            <Link href="/" className="block mb-6">
          
              <div className="w-[110px]">
                <Image 
                  src={logoImg} 
                  alt="Seoul Mirage" 
                  className="object-contain"
                  // width and height are automatically handled for local imports
                />
              </div>
            </Link>
            <p className="text-secondary text-body max-w-sm mb-8">
              Seoul Mirage is your gateway to authentic Korean skincare. 
              We bring the best of Seoul's beauty secrets to your doorstep.
            </p>
            <div className="flex gap-5">
              <a href="#" className="text-accent hover:-translate-y-1 transition-transform duration-300">
                <Globe size={20} />
              </a>
              <a href="#" className="text-accent hover:-translate-y-1 transition-transform duration-300">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-accent hover:-translate-y-1 transition-transform duration-300">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Column 2: Shop Links */}
          <div>
            <h3 className="text-h3 text-primary mb-6 font-medium">Shop</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/shop" className="text-secondary hover:text-accent hover:pl-2 transition-all duration-300 text-body">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/shop?filter=bestsellers" className="text-secondary hover:text-accent hover:pl-2 transition-all duration-300 text-body">
                  Bestsellers
                </Link>
              </li>
              <li>
                <Link href="/shop?filter=new-arrivals" className="text-secondary hover:text-accent hover:pl-2 transition-all duration-300 text-body">
                  New Arrivals
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: About Links */}
          <div>
            <h3 className="text-h3 text-primary mb-6 font-medium">About</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/about" className="text-secondary hover:text-accent hover:pl-2 transition-all duration-300 text-body">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-secondary hover:text-accent hover:pl-2 transition-all duration-300 text-body">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-secondary hover:text-accent hover:pl-2 transition-all duration-300 text-body">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-secondary hover:text-accent hover:pl-2 transition-all duration-300 text-body">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="pt-8 border-t border-border">
          <p className="text-secondary text-[13px]">
            © {new Date().getFullYear()} Seoul Mirage. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}