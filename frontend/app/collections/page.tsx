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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-96 glass animate-pulse"></div>)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories.map((cat: any, index) => (
                <motion.div
                  key={cat._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative h-[500px] group overflow-hidden border border-glass-border cursor-pointer"
                >
                  <Link href={`/catalog?category=${cat._id}`}>
                    <img src={cat.image} alt={cat.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-70 group-hover:opacity-100" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent flex flex-col items-center justify-center p-8">
                      <h3 className="text-3xl text-white tracking-[0.2em] mb-6 font-medium text-center uppercase">{cat.name}</h3>
                      <div className="btn-premium px-10 py-3 text-[10px] group-hover:bg-primary-dark transition-all">
                        VIEW COLLECTION
                      </div>
                    </div>
                  </Link>
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
