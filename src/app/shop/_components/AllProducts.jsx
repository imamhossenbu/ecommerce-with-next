"use client"

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';
import ProductCard from '../../../components/ui/ProductCard';
import { getProducts, getCategories } from '../../../lib/api';
import toast from 'react-hot-toast';

export default function AllProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // States for API Params
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('-createdAt'); 
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 8; 

  // Initial Fetch: Categories
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await getCategories();
        setCategories(res.data || []);
      } catch (err) {
        console.error("Failed to fetch categories");
      }
    };
    fetchCats();
  }, []);

  // Fetch Products whenever filters change
  useEffect(() => {
    const fetchShopData = async () => {
      setLoading(true);
      try {
        const params = {
          category: category || undefined,
          page: page,
          limit: limit,
          sort: sort 
        };
        
        const res = await getProducts(params);
        
        if (res.success) {
          setProducts(res.data);
          setTotalPages(res.totalPages);
        }
      } catch (err) {
        toast.error("Error loading products");
      } finally {
        setLoading(false);
      }
    };

    fetchShopData();
  }, [category, sort, page]);

  const handleCategoryChange = (catId) => {
    setCategory(catId);
    setPage(1);
  };

  return (
    <div className=" bg-white pt-4">
      {/* Category Bar */}
      <div className="bg-[#F5E6D3] py-4 border-b border-orange-100">
        <div className="site-container flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-6 md:gap-10">
            <button 
              onClick={() => handleCategoryChange('')}
              className={`text-[14px] font-bold uppercase tracking-widest transition-all ${!category ? 'border-b-2 border-black pb-1' : 'text-gray-500 hover:text-black'}`}
            >
              All Product
            </button>
            {categories.map((cat) => (
              <button 
                key={cat._id}
                onClick={() => handleCategoryChange(cat._id)}
                className={`text-[14px] font-bold uppercase tracking-widest transition-all ${category === cat._id ? 'border-b-2 border-black pb-1' : 'text-gray-500 hover:text-black'}`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Sorting Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-medium text-gray-400">Sort :</span>
            <select 
              value={sort}
              onChange={(e) => { setSort(e.target.value); setPage(1); }}
              className="bg-transparent text-[14px] font-bold outline-none cursor-pointer"
            >
              <option value="-createdAt">Newest First</option>
              <option value="price">Price: Low to High</option>
              <option value="-price">Price: High to Low</option>
              <option value="name">Name: A-Z</option>
              <option value="-name">Name: Z-A</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="site-container py-12">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10 animate-pulse">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="space-y-4">
                <div className="bg-gray-100 aspect-square rounded-sm"></div>
                <div className="h-4 bg-gray-100 w-3/4"></div>
                <div className="h-4 bg-gray-100 w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-20 flex justify-center items-center gap-2">
                <button 
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                  className="p-2 border border-gray-200 rounded hover:bg-black hover:text-white disabled:opacity-20 transition-all cursor-pointer"
                >
                  <ChevronLeft size={20} />
                </button>

                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setPage(i + 1)}
                    className={`w-10 h-10 rounded font-semibold transition-all ${
                      page === i + 1 
                      ? 'bg-black text-white shadow-lg' 
                      : 'bg-white border border-gray-200 text-gray-600 hover:border-black'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button 
                  disabled={page === totalPages}
                  onClick={() => setPage(p => p + 1)}
                  className="p-2 border border-gray-200 rounded hover:bg-black hover:text-white disabled:opacity-20 transition-all cursor-pointer"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
            
            {products.length === 0 && (
              <div className="text-center py-20 text-gray-400 font-medium">
                No products found in this category.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}