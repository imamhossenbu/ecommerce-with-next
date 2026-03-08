import React from 'react';
import { Clock, Truck, CheckCircle, Package } from 'lucide-react';

const OrderRow = ({ orderId, customer, amount, status }) => {
  // স্ট্যাটাস অনুযায়ী আইকন এবং স্টাইল কনফিগ
  const statusConfig = {
    Processing: {
      color: "bg-amber-50 text-amber-600",
      icon: <Clock size={18} className="text-amber-500" />,
    },
    Shipped: {
      color: "bg-blue-50 text-blue-600",
      icon: <Package size={18} className="text-blue-500" />,
    },
    Delivered: {
      color: "bg-emerald-50 text-emerald-600",
      icon: <CheckCircle size={18} className="text-emerald-500" />,
    },
    Cancelled: {
      color: "bg-red-50 text-red-600",
      icon: <Package size={18} className="text-red-500" />,
    }
  };

  const config = statusConfig[status] || statusConfig.Processing;

  return (
    <div className="flex items-center justify-between py-4 group hover:bg-gray-50/50 px-2 rounded-xl transition-all">
      <div className="flex items-center gap-4">
        <div className={`w-11 h-11 ${config.color.split(' ')[0]} rounded-full flex items-center justify-center transition-transform group-hover:scale-110`}>
           {config.icon}
        </div>
        <div>
          <p className="font-bold text-sm text-gray-900 tracking-tight">ORD-{orderId}</p>
          <p className="text-[11px] text-gray-400 font-medium">{customer}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-bold text-sm text-gray-900 mb-1">+${Number(amount).toLocaleString()}</p>
        <span className={`text-[9px] px-2.5 py-1 rounded-full font-black uppercase tracking-widest ${config.color} border border-current/10`}>
          {status}
        </span>
      </div>
    </div>
  );
};

export default OrderRow;