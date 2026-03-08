import React from 'react';
import { XCircle, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function PaymentCancel() {
  return (
    <div className="min-h-[70vh] bg-[#F5E6D3]/60 flex items-center justify-center p-6">
      <div className="text-center space-y-8 animate-in fade-in zoom-in duration-500">
        
        {/* Cancel/Error Icon */}
        <div className="flex justify-center">
          <div className="bg-[#B23B3B] p-6 rounded-full shadow-lg">
            <XCircle size={64} className="text-white" strokeWidth={2} />
          </div>
        </div>

        {/* Error Message */}
        <div className="space-y-3">
          <h1 className="text-[28px] md:text-[36px] font-medium text-gray-900">
            Oops! Your Payment Wasn't <span className="text-[#B23B3B]">Completed !</span>
          </h1>
          <p className="text-gray-600 text-[14px] md:text-[16px] max-w-md mx-auto leading-relaxed">
            It looks like your transaction was canceled—please double-check your details and try again.
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-4">
          <Link 
            href="/cart" 
            className="inline-flex items-center gap-2 bg-black text-white px-8 py-4 rounded-sm font-bold uppercase text-[12px] tracking-[0.2em] hover:bg-neutral-800 transition-all shadow-xl active:scale-95 group"
          >
            Continue Shopping 
            <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

      </div>
    </div>
  );
}