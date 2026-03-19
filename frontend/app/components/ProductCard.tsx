'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingCart, Eye } from 'lucide-react';

interface ProductCardProps {
  product: {
    _id: string;
    name: string;
    price: number;
    brand: string;
    images: string[];
    isFeatured?: boolean;
  };
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative flex flex-col bg-accent/30 border border-glass-border hover:border-primary/30 transition-all duration-500 overflow-hidden w-full touch-manipulation h-full"
    >
      {/* Product Image */}
      <div className="relative aspect-[3/4] xs:aspect-[4/5] sm:aspect-[4/5] md:aspect-[4/5] overflow-hidden bg-[#0a0a0a] flex-shrink-0">
        {!imageError ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-accent/50">
            <span className="text-text-muted text-[8px] xs:text-[10px] sm:text-xs text-center px-2">
              Image unavailable
            </span>
          </div>
        )}
        
        {/* Hover Actions - Optimized for 2-column layout */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center gap-1 xs:gap-1.5 sm:gap-2 md:gap-3">
          <button 
            className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 bg-white text-black rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-colors duration-300 transform translate-y-4 group-hover:translate-y-0 shadow-lg active:scale-95 touch-manipulation"
            aria-label="Add to cart"
          >
            <ShoppingCart size={10} className="xs:w-3 xs:h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
          </button>
          <Link
            href={`/catalog/${product._id}`}
            className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 bg-white text-black rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-colors duration-300 transform translate-y-4 group-hover:translate-y-0 delay-75 shadow-lg active:scale-95 touch-manipulation"
            aria-label="View product"
          >
            <Eye size={10} className="xs:w-3 xs:h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
          </Link>
        </div>

        {/* Badges */}
        {product.isFeatured && (
          <span className="absolute top-1 xs:top-1.5 sm:top-2 left-1 xs:left-1.5 sm:left-2 bg-primary text-black text-[6px] xs:text-[7px] sm:text-[8px] md:text-[9px] lg:text-[10px] font-bold px-1 xs:px-1.5 sm:px-2 md:px-2.5 py-0.5 tracking-widest uppercase rounded-sm z-10">
            Featured
          </span>
        )}

        {/* Discount or Sale Badge */}
        {product.price < 50000 && (
          <span className="absolute top-1 xs:top-1.5 sm:top-2 right-1 xs:right-1.5 sm:right-2 bg-red-500 text-white text-[6px] xs:text-[7px] sm:text-[8px] md:text-[9px] lg:text-[10px] font-bold px-1 xs:px-1.5 sm:px-2 md:px-2.5 py-0.5 tracking-widest uppercase rounded-sm z-10">
            Sale
          </span>
        )}
      </div>

      {/* Product Info - Compact for 2-column layout */}
      <div className="p-1.5 xs:p-2 sm:p-2.5 md:p-3 lg:p-4 flex flex-col gap-0.5 xs:gap-1 sm:gap-1 flex-grow">
        <span className="text-[7px] xs:text-[8px] sm:text-[9px] md:text-[10px] lg:text-[11px] tracking-[0.15em] xs:tracking-[0.18em] sm:tracking-[0.2em] text-primary uppercase font-bold truncate">
          {product.brand}
        </span>
        <Link 
          href={`/catalog/${product._id}`} 
          className="hover:text-primary transition-colors touch-manipulation"
        >
          <h3 className="text-[10px] xs:text-[11px] sm:text-xs md:text-sm lg:text-base font-medium tracking-tight text-white line-clamp-2 xs:line-clamp-2 sm:line-clamp-2 md:line-clamp-1">
            {product.name}
          </h3>
        </Link>
        <p className="text-[11px] xs:text-xs sm:text-sm md:text-base lg:text-lg font-semibold text-white mt-0.5 xs:mt-1">
          Rs. {product.price.toLocaleString()}
        </p>
      </div>

      {/* Subtle border bottom that expands on hover */}
      <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-500 group-hover:w-full"></div>
    </motion.div>
  );
};

export default ProductCard;