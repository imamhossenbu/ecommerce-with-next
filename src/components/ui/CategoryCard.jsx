import Link from 'next/link';
import React from 'react';

export default function CategoryCard({ category }) {
  return (
    <Link 
      href={`/shop?category=${category._id}`}
      className="relative aspect-square group overflow-hidden block bg-[#E5E5E5]"
    >
      <img 
        src={category.image || "images/placeholder.png"} 
        alt={category.name} 
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />

      <div className="absolute inset-0 bg-black/25 group-hover:bg-black/40 transition-colors duration-300"></div>
      

      <div className="absolute inset-0 flex items-center justify-center">
        <h3 className="text-white text-[20px] md:text-[24px] font-medium tracking-wide">
          {category.name}
        </h3>
      </div>
    </Link>
  );
}