'use client';

import React from 'react';
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
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative flex flex-col bg-accent/30 border border-glass-border hover:border-primary/30 transition-all duration-500 overflow-hidden"
    >
      {/* Product Image */}
      <div className="relative aspect-[4/5] overflow-hidden bg-[#0a0a0a]">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Hover Actions */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center gap-4">
          <button className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-colors duration-300 transform translate-y-4 group-hover:translate-y-0 shadow-lg">
            <ShoppingCart size={20} />
          </button>
          <Link
            href={`/catalog/${product._id}`}
            className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-colors duration-300 transform translate-y-4 group-hover:translate-y-0 delay-75 shadow-lg"
          >
            <Eye size={20} />
          </Link>
        </div>

        {/* Badges */}
        {product.isFeatured && (
          <span className="absolute top-4 left-4 bg-primary text-black text-[10px] font-bold px-3 py-1 tracking-widest uppercase rounded-sm">
            Featured
          </span>
        )}
      </div>

      {/* Product Info */}
      <div className="p-6 flex flex-col gap-2">
        <span className="text-[10px] tracking-[0.2em] text-primary uppercase font-bold">
          {product.brand}
        </span>
        <Link href={`/catalog/${product._id}`} className="hover:text-primary transition-colors">
          <h3 className="text-lg font-medium tracking-tight text-white truncate">
            {product.name}
          </h3>
        </Link>
        <p className="text-xl font-semibold text-white mt-2">
          Rs. {product.price.toLocaleString()}
        </p>
      </div>

      {/* Subtle border bottom that expands on hover */}
      <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-500 group-hover:w-full"></div>
    </motion.div>
  );
};

export default ProductCard;
