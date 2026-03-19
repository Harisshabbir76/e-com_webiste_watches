'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Container from '../components/Container';
import api from '../lib/api';
import Link from 'next/link';
import { motion } from 'framer-motion';

const CollectionsPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get('/categories');
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <main className="bg-bg-main min-h-screen pt-32">
      <Navbar />
      <Container>
        <div className="flex flex-col gap-12 mb-20">
          <div className="flex flex-col items-center text-center">
            <span className="text-primary tracking-[0.4em] text-[10px] font-bold mb-4 uppercase">Discover Your Style</span>
            <h1 className="text-5xl md:text-7xl text-white mb-6 font-light">The Collections</h1>
            <div className="w-24 h-0.5 bg-primary"></div>
          </div>

          {loading ? (
            <div className="grid grid-cols-3 gap-6 sm:gap-8">
              {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="aspect-[4/5] glass animate-pulse"></div>)}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-6 sm:gap-8">
              {categories.map((cat: any, index) => (
                <motion.div
                  key={cat._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative flex flex-col bg-accent/30 border border-glass-border hover:border-primary/30 transition-all duration-500 overflow-hidden"
                >
                  <div className="relative flex-1 overflow-hidden bg-[#0a0a0a]">
                    <img src={cat.image} alt={cat.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  </div>
                  <div className="p-6 flex flex-col gap-2">
                    <span className="text-[10px] tracking-[0.2em] text-primary uppercase font-bold">
                      COLLECTION
                    </span>
                    <Link href={`/catalog?category=${cat._id}`} className="hover:text-primary transition-colors">
                      <h3 className="text-lg font-medium tracking-tight text-white truncate">
                        {cat.name}
                      </h3>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </Container>
      <Footer />
    </main>
  );
};

export default CollectionsPage;
