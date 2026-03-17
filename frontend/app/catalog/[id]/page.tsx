'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Container from '../../components/Container';
import ProductCard from '../../components/ProductCard';
import api from '../../lib/api';
import { ShoppingCart, MessageCircle, Shield, Truck, RotateCcw, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCart } from '../../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

const ProductDetails = () => {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [settings, setSettings] = useState<any>(null);
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data);
        
        // Initialize selections as empty to force choice
        // (Previously it was auto-selecting first option)
        setSelections({});

        // Fetch settings for whatsapp number
        const setRes = await api.get('/cms/settings');
        setSettings(setRes.data);
        
        // Fetch recommended products from the same category
        if (data.category) {
          const recRes = await api.get(`/products?category=${data.category._id || data.category}&pageNumber=1`);
          setRecommended(recRes.data.products.filter((p: any) => p._id !== id).slice(0, 4));
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <div className="min-h-screen bg-bg-main pt-32 flex items-center justify-center text-primary tracking-widest uppercase">Initializing Showroom...</div>;
  if (!product) return <div className="min-h-screen bg-bg-main pt-32 flex items-center justify-center text-white">Product not found.</div>;

  const variantString = Object.entries(selections).length > 0 
    ? ' (' + Object.entries(selections).map(([k, v]) => `${k}: ${v}`).join(', ') + ')'
    : '';
  const whatsappMessage = encodeURIComponent(`Hi, I'm interested in the ${product.brand} ${product.name}${variantString} (Rs. ${product.price.toLocaleString()}). Can I get more details?`);
  const whatsappUrl = `https://wa.me/${settings?.whatsappNumber?.replace(/\+/g, '') || '923000000000'}?text=${whatsappMessage}`;

  const allVariantsSelected = product?.variants?.every((v: any) => selections[v.variantType]);

  const addToCartHandler = () => {
    if (!allVariantsSelected) {
      alert('Please select all options (e.g. Size, Color) before adding to cart.');
      return;
    }

    addToCart(product, qty, selections);
    alert('Product added to cart!');
  };

  const submitReviewHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment || !reviewName) {
      alert('Please provide your name and a comment.');
      return;
    }
    setIsSubmittingReview(true);
    try {
      await api.post(`/products/${id}/reviews`, { 
        name: reviewName, 
        rating: reviewRating, 
        comment: reviewComment 
      });
      alert('Review submitted successfully!');
      setReviewName('');
      setReviewComment('');
      setReviewRating(5);
      // Reload product to show new review
      const { data } = await api.get(`/products/${id}`);
      setProduct(data);
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review. Please try again.');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <main className="bg-bg-main min-h-screen pt-32">
      <Navbar />
      
      <Container>
        <div className="flex flex-col lg:flex-row gap-16 mb-24">
          {/* Image Gallery */}
          <div className="flex-1 flex flex-col gap-6">
            <div className="relative aspect-square glass overflow-hidden bg-[#0a0a0a]">
              <motion.img
                key={activeImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                src={product.images[activeImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              
              {product.images.length > 1 && (
                <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between">
                  <button 
                    onClick={() => setActiveImage(prev => prev === 0 ? product.images.length - 1 : prev - 1)}
                    className="w-10 h-10 rounded-full glass flex items-center justify-center text-white hover:bg-primary hover:text-black transition-all"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button 
                    onClick={() => setActiveImage(prev => prev === product.images.length - 1 ? 0 : prev + 1)}
                    className="w-10 h-10 rounded-full glass flex items-center justify-center text-white hover:bg-primary hover:text-black transition-all"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </div>
            
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {product.images.map((img: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`w-24 h-24 flex-shrink-0 border-2 transition-all ${activeImage === index ? 'border-primary' : 'border-glass-border'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex-1 flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <span className="text-primary tracking-[0.4em] text-xs font-bold uppercase">{product.brand}</span>
              <h1 className="text-4xl lg:text-5xl text-white leading-tight">{product.name}</h1>
              <span className="text-text-muted text-sm font-light uppercase tracking-widest">Model: {product.model}</span>
            </div>

            <div className="flex items-center gap-6">
              <span className="text-3xl font-semibold text-white">Rs. {product.price.toLocaleString()}</span>
              {product.countInStock > 0 ? (
                <span className="text-[10px] tracking-widest uppercase text-green-500 font-bold border border-green-500/30 px-3 py-1">In Stock</span>
              ) : (
                <span className="text-[10px] tracking-widest uppercase text-red-500 font-bold border border-red-500/30 px-3 py-1">Out of Stock</span>
              )}
            </div>

            <p className="text-text-muted leading-relaxed font-light">
              {product.description}
            </p>

            {/* Product Variants Selection */}
            {product.variants && product.variants.length > 0 && (
              <div className="flex flex-col gap-8 py-8 border-t border-glass-border">
                {product.variants.map((v: any, index: number) => (
                  <div key={index} className="flex flex-col gap-4">
                    <span className="text-[10px] text-text-muted uppercase tracking-[0.3em] font-bold">{v.variantType}</span>
                    <div className="flex flex-wrap gap-3">
                      {v.options.map((opt: string) => (
                        <button
                          key={opt}
                          onClick={() => setSelections({ ...selections, [v.variantType]: opt })}
                          className={`px-8 py-3 text-[10px] uppercase tracking-widest font-bold border transition-all ${
                            selections[v.variantType] === opt 
                              ? 'bg-primary border-primary text-black' 
                              : 'bg-transparent border-glass-border text-white hover:border-white'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="grid grid-cols-2 gap-y-6 gap-x-12 py-8 border-y border-glass-border">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-text-muted uppercase tracking-widest">Movement</span>
                <span className="text-sm text-white font-medium">{product.movementType}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-text-muted uppercase tracking-widest">Strap</span>
                <span className="text-sm text-white font-medium">{product.strapMaterial}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-text-muted uppercase tracking-widest">Case Diameter</span>
                <span className="text-sm text-white font-medium">{product.caseDiameter || 'N/A'}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-text-muted uppercase tracking-widest">Water Resistance</span>
                <span className="text-sm text-white font-medium">{product.waterResistance || 'N/A'}</span>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="flex border border-glass-border">
                  <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-4 py-3 text-white hover:bg-glass-bg">-</button>
                  <span className="px-6 py-3 text-white flex items-center justify-center font-bold min-w-[50px]">{qty}</span>
                  <button onClick={() => setQty(q => q + 1)} className="px-4 py-3 text-white hover:bg-glass-bg">+</button>
                </div>
                <button 
                  onClick={addToCartHandler}
                  className={`btn-premium flex-1 flex items-center justify-center gap-3 transition-opacity ${!allVariantsSelected ? 'opacity-50' : ''}`}
                >
                  <ShoppingCart size={18} />
                  {allVariantsSelected ? 'ADD TO CART' : 'SELECT OPTIONS'}
                </button>
              </div>
              
              <a 
                href={whatsappUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full py-4 border border-green-500 text-green-500 flex items-center justify-center gap-3 hover:bg-green-500 hover:text-white transition-all tracking-[0.2em] text-xs font-bold"
              >
                <MessageCircle size={18} />
                WHATSAPP INQUIRY
              </a>
            </div>

            <div className="flex flex-col gap-4 mt-4">
              <div className="flex items-center gap-4 text-xs text-text-muted tracking-widest uppercase">
                <Shield size={16} className="text-primary" />
                2 Year International Warranty
              </div>
              <div className="flex items-center gap-4 text-xs text-text-muted tracking-widest uppercase">
                <Truck size={16} className="text-primary" />
                Free Shipping on orders above Rs. 10,000
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="py-24 border-t border-glass-border">
          <div className="flex flex-col lg:flex-row gap-16">
            <div className="flex-1">
              <h2 className="text-3xl text-white mb-8">Client Feedback</h2>
              <div className="flex flex-col gap-8">
                {product.reviews && product.reviews.length > 0 ? (
                  product.reviews.map((rev: any, i: number) => (
                    <div key={i} className="glass p-8 flex flex-col gap-4">
                      <div className="flex justify-between items-start">
                        <div className="flex flex-col gap-1">
                          <span className="text-white font-medium tracking-wide">{rev.name}</span>
                          <span className="text-[10px] text-text-muted uppercase tracking-widest">
                            {new Date(rev.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex text-primary gap-0.5">
                          {[...Array(5)].map((_, idx) => (
                            <Star 
                              key={idx} 
                              size={12} 
                              fill={idx < rev.rating ? "currentColor" : "none"} 
                              className={idx < rev.rating ? "text-primary" : "text-text-muted"} 
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-text-muted font-light text-sm italic leading-relaxed">
                        "{rev.comment}"
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="py-10 border border-dashed border-glass-border text-center text-text-muted tracking-widest uppercase text-xs">
                    Be the first to review this masterpiece
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 glass p-10 h-fit">
              <h3 className="text-2xl text-white mb-8 tracking-widest uppercase font-light">Leave a Review</h3>
              <form onSubmit={submitReviewHandler} className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] text-text-muted uppercase tracking-widest font-bold">Your Name</label>
                  <input
                    required
                    type="text"
                    value={reviewName}
                    onChange={(e) => setReviewName(e.target.value)}
                    className="w-full bg-accent border border-glass-border p-4 text-white focus:outline-none focus:border-primary transition-all text-sm uppercase tracking-widest"
                    placeholder="ENTER YOUR FULL NAME"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] text-text-muted uppercase tracking-widest font-bold">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        className="text-primary hover:scale-125 transition-transform"
                      >
                        <Star size={24} fill={star <= reviewRating ? "currentColor" : "none"} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] text-text-muted uppercase tracking-widest font-bold">Your Comment</label>
                  <textarea
                    required
                    rows={4}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="w-full bg-accent border border-glass-border p-4 text-white focus:outline-none focus:border-primary transition-all text-sm font-light leading-relaxed"
                    placeholder="SHARE YOUR EXPERIENCE..."
                  />
                </div>

                <button 
                  disabled={isSubmittingReview}
                  type="submit" 
                  className="btn-premium py-4 flex items-center justify-center gap-3 mt-4"
                >
                  {isSubmittingReview ? 'SUBMITTING...' : 'SUBMIT REVIEW'}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Recommended Products */}
        {recommended.length > 0 && (
          <div className="py-24 border-t border-glass-border">
            <h2 className="text-3xl text-white mb-12">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {recommended.map((p: any) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        )}
      </Container>
      
      <Footer />
    </main>
  );
};

export default ProductDetails;
