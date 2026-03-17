'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Container from '../components/Container';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQty, clearCart, itemsPrice, shippingPrice, totalPrice } = useCart();

  return (
    <main className="bg-bg-main min-h-screen pt-32">
      <Navbar />
      
      <Container>
        <div className="flex flex-col gap-8 mb-24">
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl md:text-5xl text-white">Shopping Cart</h1>
            <p className="text-text-muted text-sm font-light uppercase tracking-[0.2em]">
              Review your selection before appraisal
            </p>
          </div>

          <div className="flex justify-between items-center mb-4">
            <Link href="/catalog" className="text-xs text-primary hover:text-white transition-colors flex items-center gap-2 uppercase tracking-widest font-bold">
              <ArrowRight size={14} className="rotate-180" />
              Continue Shopping
            </Link>
            {cartItems.length > 0 && (
              <button 
                onClick={() => {
                  if(confirm('Are you sure you want to clear your entire cart?')) {
                    clearCart();
                  }
                }}
                className="text-[10px] text-red-500 hover:text-white transition-colors uppercase tracking-widest font-bold border border-red-500/30 px-4 py-2 hover:bg-red-500"
              >
                Clear Cart
              </button>
            )}
          </div>

          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 border border-dashed border-glass-border gap-6">
              <div className="w-20 h-20 rounded-full glass flex items-center justify-center text-text-muted">
                <ShoppingBag size={32} />
              </div>
              <p className="text-text-muted tracking-widest uppercase text-sm">Your cart is empty</p>
              <Link href="/catalog" className="btn-premium text-xs">
                RETURN TO SHOWROOM
              </Link>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-12">
              {/* Items List */}
              <div className="flex-1 flex flex-col gap-6">
                {cartItems.map((item) => (
                  <motion.div
                    key={item._id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="glass p-6 flex flex-col sm:flex-row gap-6 items-center"
                  >
                    <div className="w-24 h-24 flex-shrink-0 bg-[#0a0a0a]">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    
                    <div className="flex-1 flex flex-col gap-1">
                      <span className="text-[10px] tracking-widest text-primary uppercase font-bold">{item.brand}</span>
                      <h3 className="text-lg text-white font-medium">{item.name}</h3>
                      <div className="flex flex-wrap gap-2 mt-1">
                        <span className="text-text-muted text-[10px] uppercase tracking-widest">{item.category}</span>
                        {item.variant && Object.entries(item.variant).map(([key, val]) => (
                          <span key={key} className="text-primary text-[10px] uppercase tracking-widest font-bold">
                            | {key}: {val}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex border border-glass-border">
                        <button 
                          onClick={() => updateQty(item._id, Math.max(1, item.qty - 1), item.variant)}
                          className="px-3 py-2 text-white hover:bg-glass-bg"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="px-4 py-2 text-white flex items-center justify-center font-bold text-sm min-w-[40px]">
                          {item.qty}
                        </span>
                        <button 
                          onClick={() => updateQty(item._id, item.qty + 1, item.variant)}
                          className="px-3 py-2 text-white hover:bg-glass-bg"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      
                      <button 
                        onClick={() => removeFromCart(item._id, item.variant)}
                        className="p-2 text-text-muted hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <div className="text-right sm:min-w-[120px]">
                      <span className="text-lg font-bold text-white">Rs. {(item.price * item.qty).toLocaleString()}</span>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Summary Summary */}
              <div className="lg:w-96">
                <div className="glass p-8 flex flex-col gap-8 sticky top-32">
                  <h4 className="text-xl text-white font-medium border-b border-glass-border pb-6">Order Summary</h4>
                  
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-text-muted uppercase tracking-widest">Subtotal</span>
                      <span className="text-white font-medium">Rs. {itemsPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-text-muted uppercase tracking-widest">Shipping</span>
                      <span className="text-white font-medium">{shippingPrice === 0 ? 'FREE' : `Rs. ${shippingPrice.toLocaleString()}`}</span>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-glass-border flex justify-between items-center">
                    <span className="text-sm text-white font-bold uppercase tracking-[0.2em]">Total</span>
                    <span className="text-2xl text-primary font-bold">Rs. {totalPrice.toLocaleString()}</span>
                  </div>

                  <Link href="/checkout" className="btn-premium w-full flex items-center justify-center gap-3 text-xs">
                    PROCEED TO CHECKOUT
                    <ArrowRight size={16} />
                  </Link>
                  
                  <p className="text-[10px] text-text-muted text-center uppercase tracking-widest leading-relaxed">
                    Prices are inclusive of all taxes. Free shipping on orders over Rs. 10,000.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </Container>
      
      <Footer />
    </main>
  );
};

export default CartPage;
