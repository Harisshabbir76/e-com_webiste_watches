import { Suspense } from 'react';
import { SearchParams } from 'next/navigation';

import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Container from '../components/Container';
import ProductCard from '../components/ProductCard';
import api from '../lib/api';
import { Filter, ChevronDown, LayoutGrid, List } from 'lucide-react';

type CatalogContentProps = {
  searchParams: SearchParams;
};

const CatalogContent = ({ searchParams }: CatalogContentProps) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [priceMin, setPriceMin] = useState(searchParams.get('priceMin') ? Number(searchParams.get('priceMin')) : 0);
  const [priceMax, setPriceMax] = useState(searchParams.get('priceMax') ? Number(searchParams.get('priceMax')) : 500000);
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');
  const [strapType, setStrapType] = useState(searchParams.get('strapMaterial') || '');

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, priceMin, priceMax, sortBy, strapType]);

  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/categories');
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let query = `/products?pageNumber=1`;
      if (selectedCategory) query += `&category=${selectedCategory}`;
      if (priceMin > 0) query += `&priceMin=${priceMin}`;
      if (priceMax < 500000) query += `&priceMax=${priceMax}`;
      if (sortBy) query += `&sort=${sortBy}`;
      if (strapType) query += `&strapMaterial=${strapType}`;
      const { data } = await api.get(query);
      setProducts(data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-bg-main min-h-screen pt-32">
      <Navbar />
      
      <Container>
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl md:text-5xl text-white">The Collection</h1>
            <p className="text-text-muted text-sm font-light uppercase tracking-[0.2em]">
              Showing {products.length} exquisite timepieces
            </p>
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative group flex-1 md:flex-initial">
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-accent text-white border border-glass-border px-6 py-3 text-xs tracking-widest appearance-none focus:outline-none focus:border-primary uppercase"
              >
                <option value="newest">Newest Arrivals</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="best-selling">Best Selling</option>
              </select>
              <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Filters */}
          <aside className="lg:w-64 flex flex-col gap-10">
            {/* Categories */}
            <div className="flex flex-col gap-6">
              <h4 className="text-sm font-bold tracking-[0.2em] text-white uppercase border-b border-glass-border pb-4">Categories</h4>
              <ul className="flex flex-col gap-3">
                <li>
                  <button 
                    onClick={() => setSelectedCategory('')}
                    className={`text-sm ${!selectedCategory ? 'text-primary' : 'text-text-muted'} hover:text-primary transition-colors`}
                  >
                    All Collections
                  </button>
                </li>
                {categories.map((cat: any) => (
                  <li key={cat._id}>
                    <button 
                      onClick={() => setSelectedCategory(cat._id)}
                      className={`text-sm ${selectedCategory === cat._id ? 'text-primary' : 'text-text-muted'} hover:text-primary transition-colors`}
                    >
                      {cat.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Price Filter */}
            <div className="flex flex-col gap-6">
              <h4 className="text-sm font-bold tracking-[0.2em] text-white uppercase border-b border-glass-border pb-4">Price Range</h4>
              <div className="flex flex-col gap-4">
                <div className="flex gap-2">
                  <input 
                    type="number" 
                    min="0" 
                    max="500000" 
                    step="1000"
                    value={priceMin}
                    onChange={(e) => setPriceMin(Number(e.target.value) || 0)}
                    className="flex-1 bg-accent border border-glass-border p-3 text-xs text-white focus:outline-none focus:border-primary rounded text-right"
                    placeholder="Min"
                  />
                  <span className="self-center text-text-muted text-sm px-2">-</span>
                  <input 
                    type="number" 
                    min="0" 
                    max="500000" 
                    step="1000"
                    value={priceMax}
                    onChange={(e) => setPriceMax(Number(e.target.value) || 500000)}
                    className="flex-1 bg-accent border border-glass-border p-3 text-xs text-white focus:outline-none focus:border-primary rounded text-left"
                    placeholder="Max"
                  />
                </div>
                <div className="flex justify-between text-[10px] text-text-muted tracking-widest uppercase">
                  <span>Rs. 0</span>
                  <span>Rs. 1,000,000</span>
                </div>
              </div>
            </div>

            {/* Strap Type */}
            <div className="flex flex-col gap-6">
              <h4 className="text-sm font-bold tracking-[0.2em] text-white uppercase border-b border-glass-border pb-4">Strap Material</h4>
              <div className="flex flex-wrap gap-2">
                {['Leather', 'Stainless Steel', 'Rubber', 'Nylon'].map((type) => (
                  <button 
                    key={type}
                    onClick={() => setStrapType(type)}
                    className={`px-4 py-2 text-[10px] tracking-widest uppercase border ${strapType === type ? 'border-primary bg-primary text-black' : 'border-glass-border text-text-muted'} hover:border-primary transition-all`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="aspect-[4/5] glass animate-pulse"></div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                {products.map((product: any) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <div className="h-[400px] flex flex-col items-center justify-center border border-dashed border-glass-border gap-4">
                <p className="text-text-muted tracking-widest uppercase text-sm">No watches found in this selection</p>
                <button 
                  onClick={() => { setSelectedCategory(''); setStrapType(''); }}
                  className="text-primary text-xs border-b border-primary pb-1"
                >
                  CLEAR ALL FILTERS
                </button>
              </div>
            )}
          </div>
        </div>
      </Container>
      
      <div className="mt-24">
        <Footer />
      </div>
    </main>
  );
};

const Catalog = ({ searchParams }: CatalogContentProps) => {
  return (
    <CatalogContent searchParams={searchParams} />
  );
};

export default Catalog;
