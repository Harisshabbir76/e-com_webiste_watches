'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingCart, Search, User, Menu, X, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import api from '../lib/api';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const { userInfo } = useAuth();
  const { cartItems } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.trim()) {
        //@ts-ignore
        fetchResults();
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const fetchResults = async () => {
    setIsSearching(true);
    try {
      const { data } = await api.get(`/products?keyword=${searchQuery}`);
      setSearchResults(data.products.slice(0, 5));
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          isScrolled ? 'glass py-3' : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <button
            className="lg:hidden text-white"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu size={24} />
          </button>

          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold tracking-widest text-white">
              iWRIST
            </span>
            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1"></div>
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            <Link href="/catalog" className="text-sm font-medium tracking-wide hover:text-primary transition-colors text-white">
              CATALOG
            </Link>
            <Link href="/collections" className="text-sm font-medium tracking-wide hover:text-primary transition-colors text-white">
              COLLECTIONS
            </Link>
            <Link href="/contact" className="text-sm font-medium tracking-wide hover:text-primary transition-colors text-white">
              CONTACT US
            </Link>
            <Link href="/about" className="text-sm font-medium tracking-wide hover:text-primary transition-colors text-white">
              OUR STORY
            </Link>
          </div>

          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="text-white hover:text-primary transition-colors"
            >
              <Search size={22} />
            </button>
            <Link href="/cart" className="text-white hover:text-primary transition-colors relative">
              <ShoppingCart size={22} />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartItems.reduce((acc: number, item: any) => acc + item.qty, 0)}
                </span>
              )}
            </Link>
            <div className="text-white hover:text-primary transition-colors cursor-default">
              <User size={22} />
            </div>
          </div>
        </div>
      </nav>

      {/* Search Overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[100] transition-all duration-700 opacity-100 visible">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={() => setIsSearchOpen(false)}></div>
          
          <div className="relative max-w-4xl mx-auto pt-40 px-6">
            <button 
              onClick={() => setIsSearchOpen(false)}
              className="absolute top-10 right-6 text-text-muted hover:text-white transition-colors"
            >
              <X size={32} />
            </button>

            <div className="flex flex-col gap-12">
              <div className="flex flex-col gap-4">
                <span className="text-primary tracking-[0.4em] text-[10px] uppercase font-bold">Discover your next timepiece</span>
                <div className="relative group">
                  <input
                    autoFocus
                    type="text"
                    placeholder="SEARCH THE COLLECTION..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent border-b-2 border-glass-border pb-6 text-4xl md:text-6xl text-white font-light focus:outline-none focus:border-primary transition-all placeholder:text-white/10 uppercase"
                  />
                  <div className="absolute right-0 bottom-6">
                    {isSearching ? (
                      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Search size={40} className="text-white/20 group-focus-within:text-primary transition-colors" />
                    )}
                  </div>
                </div>
              </div>

              {/* Results Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {searchResults.length > 0 ? (
                  searchResults.map((product) => (
                    <Link 
                      key={product._id}
                      href={`/catalog/${product._id}`}
                      onClick={() => setIsSearchOpen(false)}
                      className="flex gap-6 group"
                    >
                      <div className="w-24 h-24 flex-shrink-0 glass overflow-hidden bg-black">
                        <img src={product.images[0]} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      <div className="flex flex-col justify-center gap-1">
                        <span className="text-[10px] tracking-widest text-primary uppercase font-bold">{product.brand}</span>
                        <h4 className="text-white text-lg font-medium group-hover:text-primary transition-colors">{product.name}</h4>
                        <span className="text-text-muted text-xs uppercase tracking-widest font-bold">Rs. {product.price.toLocaleString()}</span>
                      </div>
                    </Link>
                  ))
                ) : searchQuery && !isSearching ? (
                  <div className="col-span-full py-10 border-t border-glass-border">
                    <p className="text-text-muted text-center tracking-widest uppercase text-sm">No results match your search</p>
                  </div>
                ) : !searchQuery && (
                  <div className="col-span-full">
                    <span className="text-text-muted text-[10px] uppercase tracking-[0.3em] mb-6 block">Trending Searches</span>
                    <div className="flex flex-wrap gap-4">
                      {['Chrono', 'Automatic', 'Minimal', 'Gold Edition'].map((t) => (
                        <button 
                          key={t}
                          onClick={() => setSearchQuery(t)}
                          className="px-6 py-2 glass text-xs text-white hover:text-primary transition-colors uppercase tracking-widest"
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {searchQuery && searchResults.length > 0 && (
                <Link 
                  href={`/catalog?keyword=${searchQuery}`}
                  onClick={() => setIsSearchOpen(false)}
                  className="flex items-center gap-3 text-primary text-xs tracking-[0.3em] font-bold uppercase border-b border-primary self-start pb-2 hover:opacity-70 transition-all text-white"
                >
                  View all results
                  <ArrowRight size={16} />
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black z-[60] flex flex-col p-8 transition-all duration-500">
          <div className="flex justify-end">
            <button onClick={() => setIsMobileMenuOpen(false)} className="text-white">
              <X size={32} />
            </button>
          </div>
          <div className="flex flex-col gap-8 mt-12 items-center">
            <Link href="/catalog" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-medium tracking-widest text-white">
              CATALOG
            </Link>
            <Link href="/collections" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-medium tracking-widest text-white">
              COLLECTIONS
            </Link>
            <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-medium tracking-widest text-white">
              CONTACT US
            </Link>
            <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-medium tracking-widest text-white">
              OUR STORY
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
