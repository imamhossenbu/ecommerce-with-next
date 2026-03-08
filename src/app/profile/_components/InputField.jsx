import React from 'react';

const InputField = ({ label, type = "text", value, onChange, disabled, full }) => (
  <div className={`flex flex-col gap-2 ${full ? 'md:col-span-2' : ''}`}>
    <label className="text-[11px] font-bold text-[#1A1A1A] uppercase tracking-wider">
      {label}
    </label>
    <input 
      type={type} 
      value={value || ''}
      disabled={disabled}
      onChange={(e) => onChange?.(e.target.value)}
      className="w-full border border-[#E5E5E5] px-4 py-2.5 rounded-md outline-none focus:border-black transition-colors text-[14px] disabled:bg-gray-50 disabled:text-gray-400" 
    />
  </div>
);

export default InputField;