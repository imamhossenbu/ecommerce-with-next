'use client'

import React, { useEffect, useContext, useRef } from 'react';
import { CheckCircle2, ChevronRight } from 'lucide-react';
import { CartContext } from '../../context/CartContext';
import { useRouter } from 'next/navigation';

export default function PaymentSuccess() {
  const { clearCart } = useContext(CartContext);
  const router = useRouter();
  const isCleared = useRef(false);

 useEffect(() => {
    if (!isCleared.current) {
      clearCart();
      isCleared.current = true;
    }
  }, [clearCart]);

  return (
  
    <div className="relative z-10 min-h-[80vh] bg-[#F5E6D3]/60 flex items-center justify-center p-6">
      <div className="text-center space-y-8 animate-in fade-in zoom-in duration-500">
        
        {/* Success Icon */}
        <div className="flex justify-center">
          <div className="bg-[#2D8A4E] p-6 rounded-full shadow-lg">
            <CheckCircle2 size={64} className="text-white" strokeWidth={2} />
          </div>
        </div>

        {/* Success Message */}
        <div className="space-y-3">
          <h1 className="text-[28px] md:text-[36px] font-medium text-gray-900">
            Your payment has been <span className="text-[#2D8A4E]">received !</span>
          </h1>
          <p className="text-gray-600 text-[14px] md:text-[16px] max-w-md mx-auto leading-relaxed">
            Please check your email for a payment confirmation & invoice.
          </p>
        </div>

       
        <div className="pt-4 relative z-50"> 
          <button 
            type="button"
            onClick={(e) => {
              e.preventDefault();
              
              router.push('/shop');
            }}
            className="cursor-pointer inline-flex items-center gap-2 bg-black text-white px-10 py-4 rounded-sm font-bold uppercase text-[12px] tracking-[0.2em] hover:bg-neutral-800 transition-all shadow-xl active:scale-95 group pointer-events-auto"
          >
            Continue Shopping 
            <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </div>
    </div>
  );
}