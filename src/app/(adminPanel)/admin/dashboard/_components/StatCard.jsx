import React from 'react';

const StatCard = ({ title, value, icon: Icon, color = "text-gray-600", bgColor = "bg-gray-50" }) => (
  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-start transition-all hover:shadow-md">
    <div>
      <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">{title}</p>
      <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight">{value}</h3>
    </div>
    <div className={`p-3 ${bgColor} rounded-xl`}>
      <Icon size={20} className={color} />
    </div>
  </div>
);

export default StatCard;