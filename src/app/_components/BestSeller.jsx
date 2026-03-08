"use client"

import React, { useEffect, useState } from 'react';
import ProductCard from '../../components/ui/ProductCard';
import ProductSkeleton from '../../components/skeletons/ProductSkeleton'; 
import { getBestsellingProducts } from '../../lib/api';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function Bestsellers() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await getBestsellingProducts();
        if (res.success) setProducts(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <section className="py-20 bg-white">
      <div className="site-container">
        <div className="flex justify-between items-end mb-10">
          <h2 className="text-[28px] font-medium text-primary leading-none">
            Bestsellers
          </h2>
          <Link 
            href="/shop" 
            className="flex items-center gap-2 text-secondary hover:text-accent transition-colors text-[14px] font-medium border-b border-transparent hover:border-accent pb-1"
          >
            View all products <ArrowRight size={18} strokeWidth={1.5} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {loading ? (
            <ProductSkeleton cards={4} /> 
          ) : (
            products.map((item) => <ProductCard key={item._id} product={item} />)
          )}
        </div>
      </div>
    </section>
  );
}