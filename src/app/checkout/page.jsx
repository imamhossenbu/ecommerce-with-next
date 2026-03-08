"use client"

import React, { useContext, useState } from 'react';
import { CartContext } from '../../context/CartContext';
import { ChevronRight, Loader2 } from 'lucide-react';
import { createCheckoutSession } from '../../lib/api'; 
import toast from 'react-hot-toast';

export default function Checkout() {
  const { cartItems } = useContext(CartContext);
  const [loading, setLoading] = useState(false);
  const [selectedShipping, setSelectedShipping] = useState(5.99);
  

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Bangladesh'
  });

  const subtotal = cartItems.reduce((acc, item) => acc + (item.salePrice * item.quantity), 0);
  const total = subtotal + selectedShipping;

  const shippingMethods = [
    { id: 'standard', name: 'Standard Shipping (5-7 business days)', price: 5.99 },
    { id: 'express', name: 'Express Shipping (2-3 business days)', price: 12.99 },
    { id: 'overnight', name: 'Overnight Shipping (1 business day)', price: 24.99 },
  ];

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    
    // সিম্পল ভ্যালিডেশন
    if (!formData.email || !formData.phone || !formData.address) {
      return toast.error("Please fill in all required fields");
    }

    if (cartItems.length === 0) {
      return toast.error("Your cart is empty");
    }

    setLoading(true);

    try {

      const formattedItems = cartItems.map(item => ({
      productID: item._id, 
        name: item.name,
        quantity: item.quantity,
        price: item.salePrice, 
        image: item.thumbnail
    }));




     const paymentData = {
      customerInfo: formData,
      items: formattedItems, 
      totalAmount: total,
      shippingFee: selectedShipping
    };
      const res = await createCheckoutSession(paymentData);
      
      if (res.success && res.url) {
        window.location.replace(res.url);
      } else {
        toast.error(res.message || "Failed to initiate payment");
      }
    } catch (error) {
      console.error("Checkout Error:", error);
      toast.error(error.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-32 pb-20 bg-[#F5E6D3]/40 min-h-screen">
      <div className="site-container">
        <h1 className="text-[36px] font-medium mb-12">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Shipping Information */}
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white p-6 md:p-10 rounded-sm shadow-sm">
              <h2 className="text-[20px] font-bold mb-8">Shipping Information</h2>
              
              <form onSubmit={handlePayment} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider">First name *</label>
                  <input required name="firstName" value={formData.firstName} onChange={handleInputChange} type="text" className="w-full border border-gray-200 p-3 rounded-sm outline-none focus:border-black transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider">Last name *</label>
                  <input required name="lastName" value={formData.lastName} onChange={handleInputChange} type="text" className="w-full border border-gray-200 p-3 rounded-sm outline-none focus:border-black transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider">Email *</label>
                  <input required name="email" value={formData.email} onChange={handleInputChange} type="email" className="w-full border border-gray-200 p-3 rounded-sm outline-none focus:border-black transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider">Phone *</label>
                  <input required name="phone" value={formData.phone} onChange={handleInputChange} type="tel" className="w-full border border-gray-200 p-3 rounded-sm outline-none focus:border-black transition-all" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider">Street Address *</label>
                  <input required name="address" value={formData.address} onChange={handleInputChange} type="text" placeholder="House number and street name" className="w-full border border-gray-200 p-3 rounded-sm outline-none focus:border-black transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider">Town / City *</label>
                  <input required name="city" value={formData.city} onChange={handleInputChange} type="text" className="w-full border border-gray-200 p-3 rounded-sm outline-none focus:border-black transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider">Postcode / ZIP *</label>
                  <input required name="zipCode" value={formData.zipCode} onChange={handleInputChange} type="text" className="w-full border border-gray-200 p-3 rounded-sm outline-none focus:border-black transition-all" />
                </div>

                {/* Shipping Method Section */}
                <div className="md:col-span-2 mt-6">
                  <h2 className="text-[18px] font-bold mb-4">Shipping Method</h2>
                  <div className="space-y-3">
                    {shippingMethods.map((method) => (
                      <label key={method.id} className={`flex justify-between items-center p-4 border rounded-sm cursor-pointer transition-all ${selectedShipping === method.price ? 'border-black bg-gray-50' : 'border-gray-100'}`}>
                        <div className="flex items-center gap-3">
                          <input type="radio" name="shipping" checked={selectedShipping === method.price} onChange={() => setSelectedShipping(method.price)} className="w-4 h-4 accent-black" />
                          <span className="text-[14px] font-medium">{method.name}</span>
                        </div>
                        <span className="font-bold text-[14px]">${method.price}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-2 mt-8 flex justify-end">
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="bg-black text-white px-12 py-4 rounded-sm font-bold flex items-center gap-2 hover:bg-neutral-800 transition-all uppercase text-[12px] tracking-[0.2em] disabled:bg-gray-400"
                  >
                    {loading ? <Loader2 className="animate-spin" size={18} /> : <>Continue to Payment <ChevronRight size={18} /></>}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* RIGHT: Order Summary */}
          <div className="lg:col-span-4 sticky top-32">
            <div className="bg-white p-8 rounded-sm shadow-sm space-y-6">
              <h2 className="text-[18px] font-bold border-b pb-4">Order Summary</h2>
              
              <div className="max-h-[400px] overflow-y-auto pr-2 space-y-6 no-scrollbar">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex gap-4 items-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-sm border border-gray-100 overflow-hidden shrink-0">
                      <img src={item.thumbnail} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-[13px] font-bold text-primary leading-tight">{item.name}</h4>
                      <p className="text-[12px] text-gray-500 mt-1">Qty: {item.quantity} × ${item.salePrice}</p>
                    </div>
                    <span className="font-bold text-[14px]">${(item.salePrice * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-6 space-y-3">
                <div className="flex justify-between text-[14px]">
                  <span className="text-gray-500 font-medium">Subtotal</span>
                  <span className="font-bold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[14px]">
                  <span className="text-gray-500 font-medium">Shipping</span>
                  <span className="font-bold">${selectedShipping.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
                  <span className="font-bold text-[16px]">Total</span>
                  <span className="font-bold text-[24px] text-primary">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}