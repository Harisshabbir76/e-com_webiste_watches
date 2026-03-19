'use client';

import React, { useEffect, useState } from 'react';
import Hero from './components/Hero';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Container from './components/Container';
import ProductCard from './components/ProductCard';
import api from './lib/api';
import { motion } from 'framer-motion';
import { Shield, Truck, CreditCard, RotateCcw, ChevronDown } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const [latestProducts, setLatestProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productRes = await api.get('/products?keyword=&pageNumber=1');
        const categoryRes = await api.get('/categories');
        
        setLatestProducts(productRes.data.products.slice(0, 6));

        const faqRes = await api.get('/cms/faqs');
        setFaqs(faqRes.data);

        setCategories(categoryRes.data.filter((c: any) => c.showOnHome));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const benefits = [
    { icon: <Shield size={20} className="xs:w-5 xs:h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8" />, title: 'Authentic Watches', desc: '100% genuine timepieces with official warranty.' },
    { icon: <Truck size={20} className="xs:w-5 xs:h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8" />, title: 'Fast Delivery', desc: 'Secure and rapid delivery across all major cities.' },
    { icon: <RotateCcw size={20} className="xs:w-5 xs:h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8" />, title: 'Easy Returns', desc: '14-day hassle-free return policy for your peace of mind.' },
    { icon: <CreditCard size={20} className="xs:w-5 xs:h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8" />, title: 'Secure Payments', desc: 'Multiple payment options including Stripe and COD.' },
  ];

  return (
    <main className="bg-bg-main min-h-screen overflow-x-hidden w-full max-w-[100vw]">
      <Navbar />
      <Hero />

      {/* Featured Collections - 2 per row on small devices */}
      <section className="py-8 xs:py-10 sm:py-12 md:py-16 lg:py-20 xl:py-24 bg-accent/10">
        <Container>
          <div className="flex flex-col items-center mb-6 xs:mb-8 sm:mb-10 md:mb-12 lg:mb-16 text-center px-2 xs:px-3 sm:px-4">
            <span className="text-primary tracking-[0.2em] xs:tracking-[0.25em] sm:tracking-[0.3em] md:tracking-[0.4em] text-[7px] xs:text-[8px] sm:text-[9px] md:text-[10px] font-bold mb-1 xs:mb-1.5 sm:mb-2 md:mb-3 lg:mb-4 uppercase whitespace-nowrap">
              Exquisite Curation
            </span>
            <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white mb-1 xs:mb-1.5 sm:mb-2 md:mb-3 lg:mb-4 px-1 xs:px-2">
              Elite Collections
            </h2>
            <div className="w-8 xs:w-10 sm:w-12 md:w-16 lg:w-20 h-0.5 bg-primary"></div>
          </div>

          {/* Grid: 2 columns on all devices up to medium, then 3 columns on lg and above */}
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2 xs:gap-3 sm:gap-4 md:gap-5 lg:gap-6 xl:gap-8 px-1 xs:px-2 sm:px-4">
            {categories.map((cat: any, index) => (
              <motion.div
                key={cat._id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="group relative flex flex-col bg-accent/30 border border-glass-border hover:border-primary/30 transition-all duration-500 overflow-hidden"
              >
                <div className="relative aspect-[3/4] xs:aspect-square sm:aspect-[3/4] md:aspect-[4/5] overflow-hidden bg-[#0a0a0a]">
                  <img 
                    src={cat.image} 
                    alt={cat.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                </div>
                <div className="p-2 xs:p-2.5 sm:p-3 md:p-4 lg:p-5 xl:p-6 flex flex-col gap-0.5 xs:gap-1 sm:gap-1.5 md:gap-2">
                  <span className="text-[7px] xs:text-[8px] sm:text-[9px] md:text-[10px] tracking-[0.15em] xs:tracking-[0.2em] text-primary uppercase font-bold">
                    COLLECTION
                  </span>
                  <Link href={`/catalog?category=${cat._id}`} className="hover:text-primary transition-colors">
                    <h3 className="text-xs xs:text-sm sm:text-base md:text-lg font-medium tracking-tight text-white truncate">
                      {cat.name}
                    </h3>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Latest Watches - 2 per row on small devices */}
      <section className="py-8 xs:py-10 sm:py-12 md:py-16 lg:py-20 xl:py-24 border-b border-glass-border">
        <Container>
          <div className="flex flex-col items-center mb-6 xs:mb-8 sm:mb-10 md:mb-12 lg:mb-16 text-center px-2 xs:px-3 sm:px-4">
            <span className="text-primary tracking-[0.2em] xs:tracking-[0.25em] sm:tracking-[0.3em] md:tracking-[0.4em] text-[7px] xs:text-[8px] sm:text-[9px] md:text-[10px] font-bold mb-1 xs:mb-1.5 sm:mb-2 md:mb-3 lg:mb-4 uppercase">
              New in Showroom
            </span>
            <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white mb-1 xs:mb-1.5 sm:mb-2 md:mb-3 lg:mb-4 px-1 xs:px-2">
              Latest Watches
            </h2>
            <div className="w-8 xs:w-10 sm:w-12 md:w-16 lg:w-20 h-0.5 bg-primary"></div>
          </div>

          {/* Grid: 2 columns on all devices up to medium, then 3 columns on lg and above */}
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2 xs:gap-3 sm:gap-4 md:gap-5 lg:gap-6 xl:gap-8 px-1 xs:px-2 sm:px-4">
            {latestProducts.length > 0 ? (
              latestProducts.map((product: any) => (
                <ProductCard key={product._id} product={product} />
              ))
            ) : (
              // Skeleton loading with 2 columns
              Array(6).fill(0).map((_, i) => (
                <div key={i} className="h-[250px] xs:h-[280px] sm:h-[320px] md:h-[350px] lg:h-[380px] xl:h-[400px] glass animate-pulse"></div>
              ))
            )}
          </div>
        </Container>
      </section>

      {/* Benefits Section - 2 per row on small devices */}
      <section className="py-8 xs:py-10 sm:py-12 md:py-16 lg:py-20 xl:py-24 bg-accent/20 border-y border-glass-border">
        <Container>
          {/* Grid: 2 columns on small devices, 4 columns on lg and above */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 xs:gap-5 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-12 px-2 xs:px-3 sm:px-4">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col items-center text-center gap-1 xs:gap-1.5 sm:gap-2 md:gap-3 lg:gap-4"
              >
                <div className="text-primary mb-0.5 xs:mb-1 sm:mb-1.5 md:mb-2">
                  {benefit.icon}
                </div>
                <h4 className="text-xs xs:text-sm sm:text-base md:text-lg font-medium text-white">
                  {benefit.title}
                </h4>
                <p className="text-[10px] xs:text-xs sm:text-sm text-text-muted font-light leading-relaxed max-w-[180px] xs:max-w-[200px] sm:max-w-[220px] md:max-w-[250px]">
                  {benefit.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* FAQ Section - Full width on all devices */}
      <section className="py-8 xs:py-10 sm:py-12 md:py-16 lg:py-20 xl:py-24 border-t border-glass-border bg-accent/5">
        <Container>
          <div className="flex flex-col items-center mb-6 xs:mb-8 sm:mb-10 md:mb-12 lg:mb-16 text-center px-2 xs:px-3 sm:px-4">
            <span className="text-primary tracking-[0.2em] xs:tracking-[0.25em] sm:tracking-[0.3em] md:tracking-[0.4em] text-[7px] xs:text-[8px] sm:text-[9px] md:text-[10px] font-bold mb-1 xs:mb-1.5 sm:mb-2 md:mb-3 lg:mb-4 uppercase">
              Customer Care
            </span>
            <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white mb-1 xs:mb-1.5 sm:mb-2 md:mb-3 lg:mb-4 px-1 xs:px-2">
              Registry Enquiries
            </h2>
            <div className="w-8 xs:w-10 sm:w-12 md:w-16 lg:w-20 h-0.5 bg-primary"></div>
          </div>

          <div className="max-w-3xl mx-auto flex flex-col gap-2 xs:gap-2.5 sm:gap-3 md:gap-4 px-2 xs:px-3 sm:px-4">
            {faqs.map((faq: any, index) => (
              <div 
                key={index}
                className="glass border border-glass-border overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-3 xs:p-3.5 sm:p-4 md:p-5 lg:p-6 text-left transition-colors hover:bg-white/5 min-h-[44px] xs:min-h-[48px] sm:min-h-[56px]"
                >
                  <span className="text-[11px] xs:text-xs sm:text-sm md:text-base text-white font-medium tracking-wide uppercase italic pr-2 xs:pr-3 sm:pr-4">
                    {faq.question}
                  </span>
                  <ChevronDown 
                    size={14} 
                    className={`xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-primary flex-shrink-0 transition-transform duration-500 ${openFaq === index ? 'rotate-180' : ''}`} 
                  />
                </button>
                <motion.div
                  initial={false}
                  animate={{ height: openFaq === index ? 'auto' : 0, opacity: openFaq === index ? 1 : 0 }}
                  transition={{ duration: 0.5, ease: [0.04, 0.62, 0.23, 0.98] }}
                >
                  <div className="px-3 xs:px-3.5 sm:px-4 md:px-5 lg:px-6 pb-3 xs:pb-3.5 sm:pb-4 md:pb-5 lg:pb-6 text-[11px] xs:text-xs sm:text-sm text-text-muted font-light leading-relaxed border-t border-glass-border/50 pt-2 xs:pt-2.5 sm:pt-3 md:pt-4">
                    {faq.answer}
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <Footer />
    </main>
  );
}