"use client"

import React, { useState, useEffect, useContext } from 'react';
import { Star, Minus, Plus, ZoomIn, Heart } from 'lucide-react';
import { getProductById, getProducts } from '../../../../lib/api'; 
import toast from 'react-hot-toast';
import ProductCard from '../../../../components/ui/ProductCard'
import ProductReviews from './productReview';
import ProductSkeleton from '../../../../components/skeletons/ProductSkeleton';
import { CartContext } from '../../../../context/CartContext';
import Link from 'next/link';


export default function ProductDetailsView({id}) {
  const [product, setProduct] = useState(null);
  const [activeImg, setActiveImg] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {

    if (!id) return;

    const fetchProduct = async () => {
      try {
        const res = await getProductById(id);
        if (res.success) {
          setProduct(res.data);
          setActiveImg(res.data.thumbnail); 
        }
      // eslint-disable-next-line no-unused-vars
      } catch (err) {
        toast.error("Product not found");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
  if (product?.categoryID) {
    const fetchRelated = async () => {
      try {
        const res = await getProducts({ 
          category: product.categoryID, 
          limit: 4 
        });
        if (res.success) {
          setRelatedProducts(res.data.filter(p => p._id !== id));
        }
      // eslint-disable-next-line no-unused-vars
      } catch (err) {
        console.error("Related products fetch failed");
      }
    };
    fetchRelated();
  }
}, [product, id]);


const handleAddToCart = (e) => {
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }
  
  if (product) {
    addToCart(product, quantity); 
  }
};




  if (loading) return (
<ProductSkeleton/>
  );

  if (!product) return <div className="min-h-screen flex items-center justify-center">No Product Found</div>;

  const allImages = [product.thumbnail, ...(product.images || [])];

  return (
    <section className="pb-20 bg-white">
      <div className="site-container grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* LEFT: Image Gallery */}
        <div className="lg:col-span-7 flex flex-col md:flex-row-reverse gap-4">
          <div className="relative flex-1 bg-[#F9F9F9] aspect-square overflow-hidden group border border-gray-100">
            <img src={activeImg} alt={product.name} className="w-full h-full object-cover transition-transform duration-500" />
            <button className="absolute bottom-4 right-4 p-2 bg-white rounded-full shadow-md text-gray-400 hover:text-black">
              <ZoomIn size={20} />
            </button>
          </div>

          {/* Thumbnails List */}
          <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-visible no-scrollbar">
            {allImages.map((img, idx) => (
              <div 
                key={idx}
                onMouseEnter={() => setActiveImg(img)}
                className={`w-20 h-20 md:w-24 md:h-24 border-2 cursor-pointer overflow-hidden transition-all bg-[#F9F9F9] ${activeImg === img ? 'border-black' : 'border-transparent'}`}
              >
                <img src={img} alt={`view-${idx}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: Product Info */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              {product.isBestseller && <span className="bg-black text-white text-[10px] px-2 py-0.5 uppercase font-bold tracking-widest">Bestseller</span>}
              {product.stock <= 5 && <span className="text-red-500 text-[11px] font-bold uppercase">Low Stock: {product.stock} left</span>}
            </div>
            <h1 className="text-[32px] md:text-[40px] font-medium text-gray-900 leading-tight">
              {product.name}
            </h1>
            <div className="flex items-center gap-3 mt-2">
              <div className="flex text-black">
                {[...Array(5)].map((_, i) => <Star key={i} size={14} className="fill-current" />)}
              </div>
              <span className="text-[14px] text-gray-500 underline cursor-pointer">157 Reviews</span>
            </div>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-[32px] font-bold text-black">${product.salePrice}</span>
            {product.regularPrice > product.salePrice && (
              <span className="text-[18px] text-gray-400 line-through">${product.regularPrice}</span>
            )}
            <span className="text-sm font-medium text-green-600 ml-auto">
              Save ${product.regularPrice - product.salePrice} right now
            </span>
          </div>

          {/* STRAIGHT UP: Backend Data */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <h4 className="font-bold text-[15px] uppercase tracking-wider">Details</h4>
            <p className="text-gray-600 leading-relaxed italic">
              {product.straight_up || product.description}
            </p>
          </div>

          {/* LOWDOWN: Backend Array */}
          {product.lowdown && product.lowdown.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-bold text-[14px] uppercase tracking-wider">The Lowdown:</h4>
              <ul className="list-disc pl-5 space-y-2 text-gray-600 text-[14px]">
                {product.lowdown.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-6 flex flex-wrap items-center gap-4">
            <div className="flex items-center border border-gray-300 rounded-md overflow-hidden bg-white">
              <button onClick={() => quantity > 1 && setQuantity(v => v - 1)} className="p-3 hover:bg-gray-100"><Minus size={18} /></button>
              <span className="px-6 font-bold w-12 text-center">{quantity}</span>
              <button onClick={() => setQuantity(v => v + 1)} className="p-3 hover:bg-gray-100"><Plus size={18} /></button>
            </div>

            <button type='button'
            onClick={handleAddToCart}
            className="flex-1 bg-black cursor-pointer text-white h-[52px] rounded-md font-bold uppercase tracking-wider hover:bg-neutral-800 transition-all flex items-center justify-center gap-2 group">
              Add to Cart <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>

            <button className="w-[52px] h-[52px] border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-50 transition-all">
              <Heart size={20} />
            </button>
          </div>
        </div>
      </div>
<div className="mt-20 site-container border-t border-gray-100 pt-16">
  <div className="flex justify-between items-end mb-10">
    <h2 className="text-[24px] md:text-[28px] font-medium text-gray-900">
      Hand picked for you
    </h2>
    <Link 
      href="/shop" 
      className="flex items-center gap-2 text-[14px] font-bold uppercase tracking-wider hover:text-accent transition-colors"
    >
      View all products <ArrowRight size={16} />
    </Link>
  </div>

  <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
    {relatedProducts.length > 0 ? (
      relatedProducts.map((relProduct) => (
        <ProductCard key={relProduct._id} product={relProduct} />
      ))
    ) : (
      [...Array(4)].map((_, i) => (
        <div key={i} className="animate-pulse space-y-4">
          <div className="bg-gray-100 aspect-square rounded-sm"></div>
          <div className="h-4 bg-gray-100 w-3/4"></div>
          <div className="h-4 bg-gray-100 w-1/2"></div>
        </div>
      ))
    )}
  </div>
</div>

<ProductReviews 
      productId={product._id} 
      avgRating={product.avgRating} 
      totalReviews={product.totalReviews} 
    />
    </section>
  );
}

const ArrowRight = ({ className }) => (
  <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
);