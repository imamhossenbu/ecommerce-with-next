"use client"
import React, { useState, useEffect } from 'react';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { getOrderById } from '../../../lib/api';
import { useRouter, useParams } from 'next/navigation'; 

const OrderDetailsPage = () => {
  const params = useParams(); 
  const orderId = params.id; 
  const router = useRouter(); 
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('summary');

  const getEstimatedDate = (dateString) => {
    if (!dateString) return "TBD";
    const date = new Date(dateString);
    date.setDate(date.getDate() + 3); 
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  useEffect(() => {
    if (orderId) {
      getOrderById(orderId)
        .then(res => {
          if (res.success) setOrder(res.data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [orderId]);

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;
  if (!order) return <div className="text-center py-20 font-bold">Order not found!</div>;

  return (
    <div className="min-h-screen bg-[#FDF0E1] pt-24 pb-20">
      <div className="max-w-[900px] mx-auto px-4">
        <button 
          onClick={() => router.back()} // Better UX for back button
          className="flex items-center gap-2 text-[14px] font-medium mb-8 hover:underline"
        >
          <ChevronLeft size={16} /> Back to Account
        </button>

        <div className="bg-white rounded-sm shadow-sm p-8 md:p-12">
          <div className="flex justify-between items-start mb-10">
            <div>
              <h1 className="text-[28px] font-bold mb-1 uppercase">Order {order.transactionId?.slice(-8)}</h1>
              <p className="text-gray-500">Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
            </div>
            <span className="bg-[#E7F3ED] text-[#2D8A5B] px-4 py-1 rounded-full text-[12px] font-bold uppercase tracking-wider">
              {order.orderStatus || 'Shipped'}
            </span>
          </div>

          <div className="flex gap-4 mb-10 border-b pb-4">
            <button 
              onClick={() => setActiveTab('summary')}
              className={`px-6 py-2 rounded-full text-[12px] font-bold transition-all ${activeTab === 'summary' ? 'bg-black text-white' : 'border border-gray-200'}`}
            >
              Summary
            </button>
            <button 
              onClick={() => setActiveTab('shipping')}
              className={`px-6 py-2 rounded-full text-[12px] font-bold transition-all ${activeTab === 'shipping' ? 'bg-black text-white' : 'border border-gray-200'}`}
            >
              Shipping
            </button>
          </div>

          {activeTab === 'summary' ? (
            <div className="space-y-10">
              <div>
                <h3 className="text-[16px] font-bold mb-6">Order Items</h3>
                <div className="space-y-6">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center border-b pb-6 last:border-0">
                      <div className="flex gap-6 items-center">
                        <img src={item.image || item.thumbnail || "/placeholder.png"} className="w-20 h-20 object-cover bg-gray-50" alt={item.name} />
                        <div>
                          <h4 className="font-bold text-[15px]">{item.name}</h4>
                          <p className="text-gray-400 text-[13px]">Quantity: {item.quantity}</p>
                        </div>
                      </div>
                      <span className="font-bold text-[18px]">${item.price}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t space-y-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-bold text-black">${(order.totalAmount - (order.shippingFee || 0)).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="font-bold text-black">${(order.shippingFee || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-6 border-t">
                  <span className="text-[20px] font-bold">Total</span>
                  <span className="text-[24px] font-bold">${order.totalAmount?.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-12 animate-in fade-in">
               <div className="space-y-4">
                  <h3 className="text-[16px] font-bold border-b pb-2">Shipping Address</h3>
                  <div className="text-gray-600 space-y-1 text-[15px]">
                    <p className="font-bold text-black">{order.customerInfo?.name || "Customer"}</p>
                    <p>{order.customerInfo?.email || order.email}</p>
                    <p>{order.customerInfo?.phone || order.phone}</p>
                    <p>{order.customerInfo?.address || order.address}</p>
                    <p>{order.customerInfo?.city}, {order.customerInfo?.state} {order.customerInfo?.zipCode}</p>
                    <p>{order.customerInfo?.country}</p>
                  </div>
               </div>

               <div className="space-y-4">
                  <h3 className="text-[16px] font-bold border-b pb-2">Shipping Method</h3>
                  <p className="text-gray-600">Standard Shipping (5-7 business days)</p>
               </div>

               <div className="space-y-4">
                  <h3 className="text-[16px] font-bold border-b pb-2">Tracking Information</h3>
                  <div className="flex justify-between items-center text-[14px]">
                    <span className="text-gray-500">Tracking Number:</span>
                    <span className="font-mono font-bold">{order.transactionId?.toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between items-center text-[14px]">
                    <span className="text-gray-500">Estimated Delivery:</span>
                    <span className="font-bold">{getEstimatedDate(order.createdAt)}</span>
                  </div>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;