import React from 'react';

export const Table = ({ headers, children }) => (
  <div className="overflow-x-auto custom-scrollbar">
    <table className="w-full border-collapse min-w-[1000px]">
      <thead>
        <tr className="text-left text-[11px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-50">
          {headers.map((header, index) => (
            <th key={index} className={`px-4 py-6 ${header.align === 'center' ? 'text-center' : ''}`}>
              {header.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-50">
        {children}
      </tbody>
    </table>
  </div>
);

export const StatusBadge = ({ status }) => {
  const styles = {
    // Payment Status Colors
    paid: 'bg-green-100 text-green-600',
    pending: 'bg-orange-100 text-orange-600',
    failed: 'bg-red-100 text-red-600',
    cancelled: 'bg-gray-100 text-gray-500',
    // Order/Delivery Status Colors
    delivered: 'bg-green-500 text-white',
    shipped: 'bg-blue-500 text-white',
    processing: 'bg-purple-500 text-white',
    canceled: 'bg-red-500 text-white',
  };

  const normalizedStatus = status?.toLowerCase();
  
  return (
    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${styles[normalizedStatus] || 'bg-gray-100'}`}>
      {status}
    </span>
  );
};