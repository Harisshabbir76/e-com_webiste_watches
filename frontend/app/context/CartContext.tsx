'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/api';

interface CartItem {
  _id: string;
  name: string;
  price: number;
  image: string;
  qty: number;
  brand: string;
  category: string;
  variant?: Record<string, string>;
}

interface Settings {
  shippingCost: number;
  freeShippingAbove: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: any, qty: number, variant?: Record<string, string>) => void;
  removeFromCart: (id: string, variant?: Record<string, string>) => void;
  updateQty: (id: string, qty: number, variant?: Record<string, string>) => void;
  clearCart: () => void;
  itemsPrice: number;
  shippingPrice: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [settings, setSettings] = useState({ shippingCost: 250, freeShippingAbove: 10000 });

  useEffect(() => {
    const savedCart = localStorage.getItem('cartItems');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    api.get('/cms/settings')
      .then(({ data }: { data: Settings }) => {
        setSettings({
          shippingCost: data.shippingCost || 250,
          freeShippingAbove: data.freeShippingAbove || 10000
        });
      })
      .catch((err: any) => {
        console.warn('Settings fetch failed, using defaults:', err);
      });
  }, []);

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product: any, qty: number, variant?: Record<string, string>) => {
    setCartItems((prev) => {
      const existItem = prev.find((x) => 
        x._id === product._id && 
        JSON.stringify(x.variant) === JSON.stringify(variant)
      );
      
      if (existItem) {
        return prev.map((x) => 
          x._id === product._id && JSON.stringify(x.variant) === JSON.stringify(variant) 
          ? { ...x, qty: x.qty + qty } 
          : x
        );
      } else {
        return [...prev, {
          _id: product._id,
          name: product.name,
          price: product.price,
          image: product.images[0],
          brand: product.brand,
          category: product.category?.name || product.category || 'Luxury Watch',
          qty,
          variant
        }];
      }
    });
  };

  const removeFromCart = (id: string, variant?: Record<string, string>) => {
    setCartItems((prev) => prev.filter((x) => 
      !(x._id === id && JSON.stringify(x.variant) === JSON.stringify(variant))
    ));
  };

  const updateQty = (id: string, qty: number, variant?: Record<string, string>) => {
    setCartItems((prev) => prev.map((x) => 
      x._id === id && JSON.stringify(x.variant) === JSON.stringify(variant) 
      ? { ...x, qty } 
      : x
    ));
  };

  const clearCart = () => setCartItems([]);

  const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shippingPrice = itemsPrice >= settings.freeShippingAbove || itemsPrice === 0 ? 0 : settings.shippingCost;
  const totalPrice = itemsPrice + shippingPrice;

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQty,
      clearCart,
      itemsPrice,
      shippingPrice,
      totalPrice
    }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
