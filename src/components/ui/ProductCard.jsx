import React, { useContext } from 'react';
import { ShoppingBag, Star } from 'lucide-react';
import { CartContext } from '../../context/CartContext';
import toast from 'react-hot-toast'; 
import { useRouter } from 'next/navigation';

export default function ProductCard({ product }) {
  const { _id, thumbnail, name, categoryID, salePrice, regularPrice } = product;
  const router = useRouter();
  const { addToCart } = useContext(CartContext);

  const handleAddToCart = (e) => {
    e.preventDefault(); 
    e.stopPropagation(); 
    

    addToCart(product, 1); 
    

    toast.success(`${name} added to cart!`, {
      style: { fontSize: '12px', fontWeight: 'bold' }
    });
  };

  return (
    <div
      onClick={() => router.push(`/shop/${_id}`)}
      className="product-card group cursor-pointer"
    >
      <div className="img-box relative overflow-hidden bg-[#F6F6F6] aspect-square">
        <img 
          src={thumbnail} 
          alt={name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Overlay Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/5 z-10">
          <button
            type="button"
            onClick={handleAddToCart} 
            className="bg-white text-dark px-6 py-2.5 rounded-sm flex items-center gap-2 text-[13px] font-semibold shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-black hover:text-white pointer-events-auto"
          >
            <ShoppingBag size={16} />
            Add to Cart
          </button>
        </div>
      </div>


      <div className="mt-4 space-y-1">
        <p className="text-[12px] text-muted uppercase tracking-wider">
          {categoryID?.name || "Serums"}
        </p>
        <h3 className="text-[16px] font-medium text-primary line-clamp-1">
          {name}
        </h3>
        
        <div className="flex items-center gap-2">
          <span className="text-[18px] font-bold text-primary">${salePrice}</span>
          {regularPrice > salePrice && (
            <span className="text-[14px] text-muted line-through">${regularPrice}</span>
          )}
        </div>

        <div className="flex items-center gap-1 mt-1">
          <Star size={12} className="fill-accent text-accent" />
          <span className="text-[11px] font-bold text-primary">4.9</span>
          <span className="text-[11px] text-muted">(86)</span>
        </div>
      </div>
    </div>
  );
}