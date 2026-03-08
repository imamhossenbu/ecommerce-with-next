"use client"

import React, { useContext } from 'react';
import { Minus, Plus, Trash2, ArrowLeft, ShoppingBag } from 'lucide-react';
import { CartContext } from '../../context/CartContext';
import Link from 'next/link';

export default function Cart() {
  const { cartItems, addToCart, removeFromCart } = useContext(CartContext);

  const subtotal = cartItems.reduce((acc, item) => acc + (item.salePrice * item.quantity), 0);
  const shipping = cartItems.length > 0 ? 5.99 : 0;
  const total = subtotal + shipping;

  const handleUpdateQuantity = (product, delta) => {

    if (product.quantity === 1 && delta === -1) return;
    
    addToCart(product, delta); 
  };

  return (
    <div className="pt-32 pb-20 bg-white min-h-screen">
      <div className="site-container">
        <h1 className="text-[32px] font-medium mb-12 tracking-tight text-gray-900">Shopping Cart</h1>

        {cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            
            <div className="lg:col-span-7 space-y-8">
              {cartItems.map((item,index) => (
                <div key={item._id || index} className="flex gap-6 pb-8 border-b border-gray-100 last:border-0 relative">
                  <div className="w-24 h-24 bg-[#F6F6F6] rounded-sm overflow-hidden shrink-0">
                    <img src={item.thumbnail} alt={item.name} className="w-full h-full object-cover" />
                  </div>

                  <div className="flex-1 flex justify-between">
                    <div className="space-y-2">
                      <h3 className="text-[18px] font-medium text-primary">{item.name}</h3>
                      <p className="text-[14px] text-gray-500">Unit Price: ${item.salePrice}</p>
                   
                      <div className="flex items-center border border-gray-200 w-fit rounded-sm mt-2 bg-white">
                        <button 
                          onClick={() => handleUpdateQuantity(item, -1)} 
                          className="p-1.5 hover:bg-gray-50 text-gray-500 disabled:opacity-30 transition-colors"
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={14} />
                        </button>
                        <span className="px-3 text-[14px] font-bold min-w-[34px] text-center text-primary">
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => handleUpdateQuantity(item, 1)} 
                          className="p-1.5 hover:bg-gray-50 text-gray-500 transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col justify-between items-end">
                      <span className="text-[18px] font-bold text-primary">${(item.salePrice * item.quantity).toFixed(2)}</span>
                      <button 
                        onClick={() => removeFromCart(item._id)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-1"
                        title="Remove Item"
                      >
                        <Trash2 size={18} strokeWidth={1.5} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <Link 
                href="/shop" 
                className="inline-flex items-center gap-2 border border-gray-900 px-6 py-3 rounded-sm text-[13px] font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all mt-4"
              >
                <ArrowLeft size={16} /> Continue Shopping
              </Link>
            </div>

            {/* Right Side: Order Summary */}
            <div className="lg:col-span-5">
              <div className="bg-[#FDF8F1] p-8 rounded-sm space-y-6 sticky top-32">
                <h2 className="text-[20px] font-bold text-primary">Order Summary</h2>
                
                <div className="space-y-4 text-[15px]">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium text-primary">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping Estimate</span>
                    <span className="font-medium text-primary">${shipping.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-4 flex justify-between">
                    <span className="font-bold text-[18px] text-primary">Order Total</span>
                    <span className="font-bold text-[18px] text-primary">${total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Promo Code" 
                    className="flex-1 bg-white border border-gray-200 px-4 py-3 rounded-sm outline-none text-[14px] focus:border-black transition-colors"
                  />
                  <button className="bg-black text-white px-6 py-3 rounded-sm font-bold text-[12px] uppercase tracking-wider hover:bg-neutral-800 transition-colors">
                    Apply
                  </button>
                </div>

                <Link href={'/checkout'}>
                <button className="w-full bg-black cursor-pointer text-white py-4 rounded-sm font-bold uppercase tracking-[0.2em] text-[14px] hover:bg-neutral-800 transition-all shadow-lg active:scale-[0.98]">
                  Proceed to Checkout
                </button>
                </Link>
                
                <p className="text-[11px] text-center text-gray-400 uppercase tracking-tighter">
                  Tax calculated at checkout
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-32 border border-dashed border-gray-200 rounded-lg">
            <ShoppingBag className="mx-auto mb-4 text-gray-300" size={48} />
            <p className="text-gray-500 mb-8 text-lg font-medium">Your shopping bag is currently empty.</p>
            <Link href="/shop" className="bg-black text-white px-10 py-4 rounded-sm font-bold uppercase tracking-widest text-[14px] hover:bg-neutral-800 transition-all">
              Start Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}