import React from 'react';
import { ChevronDown } from 'lucide-react';

const SelectField = ({ label, options, value, onChange, full }) => (
  <div className={`flex flex-col gap-2 ${full ? 'md:col-span-2' : ''}`}>
    <label className="text-[11px] font-bold text-[#1A1A1A] uppercase tracking-wider">
      {label}
    </label>
    <div className="relative">
      <select 
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full border border-[#E5E5E5] px-4 py-2.5 rounded-md outline-none appearance-none focus:border-black text-[14px] bg-white cursor-pointer"
      >
        {options.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
    </div>
  </div>
);

export default SelectField;