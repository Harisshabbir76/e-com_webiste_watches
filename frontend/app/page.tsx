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
        
        // First 6 for latest (assuming API returns sorted by latest)
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
    { icon: <Shield size={32} />, title: 'Authentic Watches', desc: '100% genuine timepieces with official warranty.' },
    { icon: <Truck size={32} />, title: 'Fast Delivery', desc: 'Secure and rapid delivery across all major cities.' },
    { icon: <RotateCcw size={32} />, title: 'Easy Returns', desc: '14-day hassle-free return policy for your peace of mind.' },
    { icon: <CreditCard size={32} />, title: 'Secure Payments', desc: 'Multiple payment options including Stripe and COD.' },
  ];

  return (
    <main className="bg-bg-main min-h-screen">
      <Navbar />
      <Hero />

      {/* Featured Collections */}
      <section className="py-24 bg-accent/10">
        <Container>
          <div className="flex flex-col items-center mb-16 text-center">
            <span className="text-primary tracking-[0.4em] text-[10px] font-bold mb-4 uppercase">Exquisite Curation</span>
            <h2 className="text-4xl md:text-5xl text-white mb-4">Elite Collections</h2>
            <div className="w-20 h-0.5 bg-primary"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((cat: any, index) => (
              <motion.div
                key={cat._id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="relative h-[400px] group overflow-hidden border border-glass-border cursor-pointer"
              >
                <Link href={`/catalog?category=${cat._id}`}>
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-all duration-500 flex flex-col items-center justify-center">
                    <h3 className="text-2xl text-white tracking-widest mb-4 uppercase">{cat.name}</h3>
                    <span className="text-[10px] text-white border-b border-primary/50 pb-1 tracking-[0.4em] group-hover:text-primary group-hover:border-primary transition-all uppercase font-bold">
                      EXPLORE COLLECTION
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Latest Watches */}
      <section className="py-24 border-b border-glass-border">
        <Container>
          <div className="flex flex-col items-center mb-16 text-center">
            <span className="text-primary tracking-[0.4em] text-[10px] font-bold mb-4 uppercase">New in Showroom</span>
            <h2 className="text-4xl md:text-5xl text-white mb-4 uppercase">Latest Watches</h2>
            <div className="w-20 h-0.5 bg-primary"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {latestProducts.length > 0 ? (
              latestProducts.map((product: any) => (
                <ProductCard key={product._id} product={product} />
              ))
            ) : (
                [1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-[450px] glass animate-pulse"></div>
                ))
            )}
          </div>
        </Container>
      </section>



      {/* Benefits Section */}
      <section className="py-24 bg-accent/20 border-y border-glass-border">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col items-center text-center gap-4"
              >
                <div className="text-primary mb-2">
                  {benefit.icon}
                </div>
                <h4 className="text-lg font-medium text-white">{benefit.title}</h4>
                <p className="text-sm text-text-muted font-light leading-relaxed">
                  {benefit.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* FAQ Section */}
      <section className="py-24 border-t border-glass-border bg-accent/5">
        <Container>
          <div className="flex flex-col items-center mb-16 text-center">
            <span className="text-primary tracking-[0.4em] text-[10px] font-bold mb-4 uppercase">Customer Care</span>
            <h2 className="text-4xl md:text-5xl text-white mb-4 uppercase">Registry Enquiries</h2>
            <div className="w-20 h-0.5 bg-primary"></div>
          </div>

          <div className="max-w-3xl mx-auto flex flex-col gap-4">
            {faqs.map((faq: any, index) => (
              <div 
                key={index}
                className="glass border border-glass-border overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left transition-colors hover:bg-white/5"
                >
                  <span className="text-sm md:text-base text-white font-medium tracking-wide uppercase italic">
                    {faq.question}
                  </span>
                  <ChevronDown 
                    size={20} 
                    className={`text-primary transition-transform duration-500 ${openFaq === index ? 'rotate-180' : ''}`} 
                  />
                </button>
                <motion.div
                  initial={false}
                  animate={{ height: openFaq === index ? 'auto' : 0, opacity: openFaq === index ? 1 : 0 }}
                  transition={{ duration: 0.5, ease: [0.04, 0.62, 0.23, 0.98] }}
                >
                  <div className="px-6 pb-6 text-sm text-text-muted font-light leading-relaxed border-t border-glass-border/50 pt-4">
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
