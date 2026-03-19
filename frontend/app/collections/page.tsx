'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Container from '../components/Container';
import api from '../lib/api';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Loader2, ChevronRight } from 'lucide-react';

const CollectionsPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState<{[key: string]: boolean}>({});

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get('/categories');
        setCategories(data || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleImageError = (categoryId: string) => {
    setImageErrors(prev => ({ ...prev, [categoryId]: true }));
  };

  return (
    <main className="bg-bg-main min-h-screen overflow-x-hidden">
      <Navbar />
      
      {/* Hero Section with adjusted padding for mobile */}
      <div className="pt-20 xs:pt-24 sm:pt-28 md:pt-32">
        <Container>
          <div className="flex flex-col gap-8 xs:gap-10 sm:gap-12 md:gap-16 lg:gap-20 mb-10 xs:mb-12 sm:mb-16 md:mb-20">
            
            {/* Header Section */}
            <div className="flex flex-col items-center text-center px-2 xs:px-3 sm:px-4">
              <span className="text-primary tracking-[0.2em] xs:tracking-[0.25em] sm:tracking-[0.3em] md:tracking-[0.4em] text-[8px] xs:text-[9px] sm:text-[10px] font-bold mb-2 xs:mb-3 sm:mb-4 uppercase">
                Discover Your Style
              </span>
              <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white mb-2 xs:mb-3 sm:mb-4 md:mb-5 lg:mb-6 font-light px-2">
                The Collections
              </h1>
              <div className="w-12 xs:w-16 sm:w-20 md:w-24 h-0.5 bg-primary"></div>
              
              {/* Breadcrumb for better navigation */}
              <div className="flex items-center gap-2 mt-4 xs:mt-5 sm:mt-6 text-[10px] xs:text-xs text-text-muted">
                <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                <ChevronRight size={10} />
                <span className="text-white">Collections</span>
              </div>
            </div>

            {/* Loading State */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-10 xs:py-12 sm:py-16 md:py-20">
                <Loader2 size={30} className="text-primary animate-spin mb-4" />
                <p className="text-text-muted text-xs xs:text-sm">Curating collections...</p>
              </div>
            ) : categories.length === 0 ? (
              <div className="text-center py-10 xs:py-12 sm:py-16 md:py-20">
                <p className="text-text-muted text-xs xs:text-sm uppercase tracking-widest">No collections found</p>
              </div>
            ) : (
              <>
                {/* Collections Grid - Responsive columns */}
                <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-2 xs:gap-3 sm:gap-4 md:gap-5 lg:gap-6 px-1 xs:px-2 sm:px-4">
                  {categories.map((cat: any, index) => (
                    <motion.div
                      key={cat._id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ delay: index * 0.1 }}
                      className="group relative flex flex-col bg-accent/30 border border-glass-border hover:border-primary/30 transition-all duration-500 overflow-hidden rounded-lg"
                    >
                      {/* Image Container */}
                      <div className="relative aspect-[3/4] xs:aspect-[4/5] sm:aspect-[4/5] md:aspect-[4/5] overflow-hidden bg-[#0a0a0a]">
                        {!imageErrors[cat._id] ? (
                          <img 
                            src={cat.image} 
                            alt={cat.name} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            loading="lazy"
                            onError={() => handleImageError(cat._id)}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-accent/50">
                            <span className="text-text-muted text-[8px] xs:text-[10px] sm:text-xs text-center px-2">
                              {cat.name}
                            </span>
                          </div>
                        )}
                        
                        {/* Overlay on hover - subtle gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      </div>

                      {/* Content */}
                      <div className="p-2 xs:p-2.5 sm:p-3 md:p-4 lg:p-5 xl:p-6 flex flex-col gap-1 xs:gap-1.5 sm:gap-2">
                        <span className="text-[7px] xs:text-[8px] sm:text-[9px] md:text-[10px] tracking-[0.15em] xs:tracking-[0.2em] text-primary uppercase font-bold">
                          COLLECTION
                        </span>
                        <Link 
                          href={`/catalog?category=${cat._id}`} 
                          className="hover:text-primary transition-colors group/link"
                        >
                          <h3 className="text-xs xs:text-sm sm:text-base md:text-lg font-medium tracking-tight text-white truncate flex items-center gap-1">
                            {cat.name}
                            <ChevronRight size={12} className="opacity-0 group-hover/link:opacity-100 transition-opacity" />
                          </h3>
                        </Link>
                        
                        {/* Optional: Show count if available */}
                        {cat.productCount && (
                          <span className="text-[6px] xs:text-[7px] sm:text-[8px] text-text-muted uppercase tracking-wider mt-1">
                            {cat.productCount} {cat.productCount === 1 ? 'Timepiece' : 'Timepieces'}
                          </span>
                        )}
                      </div>

                      {/* Bottom accent line */}
                      <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-500 group-hover:w-full"></div>
                    </motion.div>
                  ))}
                </div>

                {/* Collection Stats */}
                <div className="flex flex-wrap items-center justify-center gap-3 xs:gap-4 sm:gap-6 md:gap-8 mt-6 xs:mt-8 sm:mt-10 md:mt-12">
                  <div className="glass px-3 xs:px-4 py-1.5 xs:py-2 flex items-center gap-2">
                    <span className="text-primary text-[8px] xs:text-[9px] sm:text-[10px] font-bold uppercase">Total Collections</span>
                    <span className="text-white text-xs xs:text-sm font-bold">{categories.length}</span>
                  </div>
                  <div className="glass px-3 xs:px-4 py-1.5 xs:py-2 flex items-center gap-2">
                    <span className="text-primary text-[8px] xs:text-[9px] sm:text-[10px] font-bold uppercase">Curated For You</span>
                    <span className="text-white text-xs xs:text-sm font-bold">Luxury Edition</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </Container>
      </div>

      {/* Featured Collections Banner */}
      {!loading && categories.length > 0 && (
        <div className="mt-8 xs:mt-10 sm:mt-12 md:mt-16 lg:mt-20 mb-10 xs:mb-12 sm:mb-16 md:mb-20">
          <Container>
            <div className="glass p-3 xs:p-4 sm:p-5 md:p-6 lg:p-8 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 rounded-lg border border-primary/20">
              <div className="flex items-center gap-2 xs:gap-3">
                <div className="w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary text-xs xs:text-sm font-bold">{categories.length}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-white text-xs xs:text-sm sm:text-base font-medium">Explore Our Collections</span>
                  <span className="text-text-muted text-[8px] xs:text-[9px] sm:text-[10px] uppercase tracking-wider">
                    Find your perfect timepiece
                  </span>
                </div>
              </div>
              <Link 
                href="/catalog" 
                className="btn-premium text-[10px] xs:text-xs px-3 xs:px-4 py-2 w-full sm:w-auto text-center"
              >
                Browse All Watches
              </Link>
            </div>
          </Container>
        </div>
      )}

      <Footer />
    </main>
  );
};

export default CollectionsPage;