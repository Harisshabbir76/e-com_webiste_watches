'use client';

import React, { useState, useEffect } from 'react';
import AdminRoute from '../../components/AdminRoute';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../lib/api';
import { Plus, Edit, Trash2, Search, ExternalLink, X, Image as ImageIcon, Check, Loader2 } from 'lucide-react';
import Link from 'next/link';

const ProductsManagement = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    brand: '',
    model: '',
    category: '',
    countInStock: 0,
    description: '',
    movementType: '',
    strapMaterial: '',
    isFeatured: false,
    images: [''],
    variants: [] as { variantType: string; options: string[] }[]
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/products');
      setProducts(data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/categories');
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const deleteHandler = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this exquisite timepiece?')) {
      try {
        await api.delete(`/products/${id}`);
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const handleOpenCreate = () => {
    setIsEditing(false);
    setSelectedProductId('');
    setFormData({
      name: '',
      price: 0,
      brand: '',
      model: '',
      category: categories.length > 0 ? (categories[0] as any)._id : '',
      countInStock: 0,
      description: '',
      movementType: 'Quartz',
      strapMaterial: 'Leather',
      isFeatured: false,
      images: [''],
      variants: [
        { variantType: 'Size', options: [''] },
        { variantType: 'Colors', options: [''] }
      ]
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product: any) => {
    setIsEditing(true);
    setSelectedProductId(product._id);
    setFormData({
      name: product.name,
      price: product.price,
      brand: product.brand,
      model: product.model,
      category: product.category?._id || product.category || '',
      countInStock: product.countInStock,
      description: product.description,
      movementType: product.movementType || 'Quartz',
      strapMaterial: product.strapMaterial || 'Leather',
      isFeatured: product.isFeatured || false,
      images: product.images?.length ? product.images : [''],
      variants: product.variants || []
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const cleanedImages = formData.images.filter(img => img && img.trim() !== '');
      const cleanedVariants = formData.variants
        .filter(v => v.options.some(opt => opt && opt.trim() !== ''))
        .map(v => ({
          variantType: v.variantType.trim() || 'Custom',
          options: v.options.filter(opt => opt && opt.trim() !== '')
        }));
      
      const finalData = { 
        ...formData, 
        images: cleanedImages.length > 0 ? cleanedImages : ['/uploads/sample.jpg'],
        variants: cleanedVariants
      };
      
      if (isEditing) {
        await api.put(`/products/${selectedProductId}`, finalData);
      } else {
        await api.post('/products', finalData);
      }
      setIsModalOpen(false);
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error saving product. Please check all fields.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredProducts = products.filter((p: any) => 
    p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.model?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminRoute>
      <DashboardLayout>
        <div className="flex flex-col gap-4 xs:gap-5 sm:gap-6 md:gap-8 lg:gap-10 px-2 xs:px-3 sm:px-4 md:px-5 lg:px-6 pb-6 w-full max-w-[100vw] overflow-x-hidden">
          
          {/* Header - Stack on mobile, row on larger screens */}
          <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-3 xs:gap-4">
            <div className="flex flex-col gap-1 xs:gap-1.5 sm:gap-2">
              <h1 className="text-xl xs:text-2xl sm:text-3xl text-white font-medium tracking-tight">
                Product Management
              </h1>
              <p className="text-text-muted text-[10px] xs:text-xs sm:text-sm tracking-widest uppercase font-light">
                Inventory Control
              </p>
            </div>
            <button 
              onClick={handleOpenCreate} 
              className="btn-premium flex items-center justify-center gap-2 text-[10px] xs:text-xs px-3 xs:px-4 py-2 xs:py-3 w-full xs:w-auto"
            >
              <Plus size={14} className="xs:w-4 xs:h-4" />
              ADD NEW WATCH
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative w-full max-w-2xl">
            <Search className="absolute left-3 xs:left-4 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
            <input
              type="text"
              placeholder="Search inventory by name, brand, or model..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-accent border border-glass-border p-3 xs:p-4 pl-9 xs:pl-12 text-white focus:outline-none focus:border-primary transition-all text-xs xs:text-sm rounded-lg"
            />
          </div>

          {/* Products Grid - 2 columns on all mobile devices, 3 on tablet, 4 on desktop */}
          <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 xs:gap-3 sm:gap-4 md:gap-5 lg:gap-6">
            {loading ? (
              // Skeleton loading - 2 columns on mobile
              Array(6).fill(0).map((_, i) => (
                <div key={i} className="glass animate-pulse h-[200px] xs:h-[220px] sm:h-[250px] md:h-[280px] lg:h-[300px] rounded-lg"></div>
              ))
            ) : filteredProducts.length === 0 ? (
              <div className="col-span-full text-center py-8 xs:py-10 sm:py-12 md:py-16 lg:py-20 text-text-muted tracking-widest uppercase text-xs xs:text-sm">
                <Search size={32} className="mx-auto mb-3 opacity-50" />
                No products match your search
              </div>
            ) : (
              filteredProducts.map((product: any) => (
                <div key={product._id} className="glass group hover:shadow-xl transition-all overflow-hidden rounded-lg flex flex-col h-full">
                  {/* Product Image */}
                  <div className="relative aspect-square xs:aspect-[4/5] sm:aspect-[4/5] md:aspect-square overflow-hidden">
                    <img 
                      src={product.images?.[0] || '/placeholder.jpg'} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    />
                    
                    {/* Hover Actions - Optimized for touch */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-1.5 xs:p-2 sm:p-3">
                      <div className="flex gap-1 w-full">
                        <Link
                          href={`/catalog/${product._id}`}
                          target="_blank"
                          className="flex-1 p-1 xs:p-1.5 sm:p-2 glass text-text-muted hover:text-white transition-all text-center rounded"
                          title="View Live"
                        >
                          <ExternalLink size={10} className="mx-auto xs:w-3 xs:h-3" />
                        </Link>
                        <button 
                          onClick={() => handleOpenEdit(product)}
                          className="flex-1 p-1 xs:p-1.5 sm:p-2 glass text-text-muted hover:text-primary transition-all text-center rounded" 
                          title="Edit"
                        >
                          <Edit size={10} className="mx-auto xs:w-3 xs:h-3" />
                        </button>
                        <button 
                          onClick={() => deleteHandler(product._id)} 
                          className="flex-1 p-1 xs:p-1.5 sm:p-2 glass text-text-muted hover:text-red-500 transition-all text-center rounded" 
                          title="Delete"
                        >
                          <Trash2 size={10} className="mx-auto xs:w-3 xs:h-3" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-2 xs:p-2.5 sm:p-3 md:p-4 flex flex-col gap-1 flex-grow">
                    <span className="text-primary text-[8px] xs:text-[9px] sm:text-[10px] tracking-[0.2em] uppercase font-bold truncate">
                      {product.brand || 'BRAND'}
                    </span>
                    
                    <Link href={`/catalog/${product._id}`} className="block hover:text-primary transition-colors">
                      <h3 className="text-[10px] xs:text-xs sm:text-sm font-medium text-white line-clamp-2">
                        {product.name || 'Product Name'}
                      </h3>
                    </Link>
                    
                    <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-1 mt-auto pt-1">
                      <span className="text-[7px] xs:text-[8px] sm:text-[9px] text-text-muted uppercase tracking-widest font-medium truncate">
                        {product.category?.name || 'Uncategorized'}
                      </span>
                      <span className="text-[9px] xs:text-[10px] sm:text-xs font-bold text-white">
                        Rs. {product.price?.toLocaleString() || 0}
                      </span>
                    </div>
                    
                    <span className={`inline-block text-[6px] xs:text-[7px] sm:text-[8px] font-bold px-1 xs:px-1.5 py-0.5 uppercase tracking-widest rounded-sm w-fit mt-1 ${
                      product.countInStock > 5 ? 'text-green-500 bg-green-500/10' : 'text-red-500 bg-red-500/10'
                    }`}>
                      {product.countInStock || 0} Stock
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Create/Edit Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 xs:p-3 sm:p-4 md:p-6 bg-black/50 backdrop-blur-sm overflow-y-auto">
              <div className="relative w-full max-w-4xl lg:max-w-6xl my-4 xs:my-6 glass p-3 xs:p-4 sm:p-5 md:p-6 lg:p-8 rounded-2xl shadow-2xl border border-white/10 overflow-y-auto max-h-[95vh]">
                
                {/* Modal Header - Sticky */}
                <div className="flex items-center justify-between mb-4 xs:mb-5 sm:mb-6 md:mb-8 sticky top-0 bg-accent/90 backdrop-blur-sm z-10 -mt-2 pt-2 pb-2">
                  <div className="flex flex-col gap-0.5 xs:gap-1">
                    <h2 className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl text-white font-medium uppercase tracking-widest">
                      {isEditing ? 'Edit Timepiece' : 'Add New Timepiece'}
                    </h2>
                    <span className="text-primary text-[8px] xs:text-[9px] sm:text-[10px] font-bold tracking-[0.2em] uppercase">
                      {isEditing ? `REF: ${selectedProductId.slice(-8).toUpperCase()}` : 'NEW INVENTORY ENTRY'}
                    </span>
                  </div>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-text-muted hover:text-white transition-colors p-1.5 xs:p-2 rounded-lg hover:bg-white/5"
                  >
                    <X size={16} className="xs:w-5 xs:h-5" />
                  </button>
                </div>

                {/* Modal Form */}
                <form onSubmit={handleSubmit} className="flex flex-col lg:grid lg:grid-cols-2 gap-4 xs:gap-5 sm:gap-6 md:gap-8">

                  {/* Left Column */}
                  <div className="flex flex-col gap-3 xs:gap-4 sm:gap-5 md:gap-6">

                    {/* Watch Name */}
                    <div className="flex flex-col gap-1 xs:gap-1.5 sm:gap-2">
                      <label className="text-[8px] xs:text-[9px] sm:text-[10px] text-text-muted uppercase tracking-widest font-bold">
                        Watch Name
                      </label>
                      <input
                        required
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-accent border border-glass-border p-2 xs:p-2.5 sm:p-3 md:p-4 text-white focus:outline-none focus:border-primary transition-all text-xs xs:text-sm uppercase rounded-lg"
                        placeholder="ROLEX SUBMARINER DATE"
                      />
                    </div>

                    {/* Brand & Model */}
                    <div className="grid grid-cols-2 gap-2 xs:gap-3 sm:gap-4">
                      <div className="flex flex-col gap-1 xs:gap-1.5 sm:gap-2">
                        <label className="text-[8px] xs:text-[9px] sm:text-[10px] text-text-muted uppercase tracking-widest font-bold">
                          Brand
                        </label>
                        <input
                          required
                          type="text"
                          value={formData.brand}
                          onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                          className="w-full bg-accent border border-glass-border p-2 xs:p-2.5 sm:p-3 md:p-4 text-white focus:outline-none focus:border-primary transition-all text-xs xs:text-sm uppercase rounded-lg"
                          placeholder="ROLEX"
                        />
                      </div>
                      <div className="flex flex-col gap-1 xs:gap-1.5 sm:gap-2">
                        <label className="text-[8px] xs:text-[9px] sm:text-[10px] text-text-muted uppercase tracking-widest font-bold">
                          Model
                        </label>
                        <input
                          required
                          type="text"
                          value={formData.model}
                          onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                          className="w-full bg-accent border border-glass-border p-2 xs:p-2.5 sm:p-3 md:p-4 text-white focus:outline-none focus:border-primary transition-all text-xs xs:text-sm uppercase rounded-lg"
                          placeholder="126610LN"
                        />
                      </div>
                    </div>

                    {/* Price & Stock */}
                    <div className="grid grid-cols-2 gap-2 xs:gap-3 sm:gap-4">
                      <div className="flex flex-col gap-1 xs:gap-1.5 sm:gap-2">
                        <label className="text-[8px] xs:text-[9px] sm:text-[10px] text-text-muted uppercase tracking-widest font-bold">
                          Price (Rs.)
                        </label>
                        <input
                          required
                          type="number"
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                          className="w-full bg-accent border border-glass-border p-2 xs:p-2.5 sm:p-3 md:p-4 text-white focus:outline-none focus:border-primary transition-all text-xs xs:text-sm font-bold rounded-lg"
                        />
                      </div>
                      <div className="flex flex-col gap-1 xs:gap-1.5 sm:gap-2">
                        <label className="text-[8px] xs:text-[9px] sm:text-[10px] text-text-muted uppercase tracking-widest font-bold">
                          Stock Count
                        </label>
                        <input
                          required
                          type="number"
                          value={formData.countInStock}
                          onChange={(e) => setFormData({ ...formData, countInStock: Number(e.target.value) })}
                          className="w-full bg-accent border border-glass-border p-2 xs:p-2.5 sm:p-3 md:p-4 text-white focus:outline-none focus:border-primary transition-all text-xs xs:text-sm rounded-lg"
                        />
                      </div>
                    </div>

                    {/* Category */}
                    <div className="flex flex-col gap-1 xs:gap-1.5 sm:gap-2">
                      <label className="text-[8px] xs:text-[9px] sm:text-[10px] text-text-muted uppercase tracking-widest font-bold">
                        Category
                      </label>
                      <select
                        required
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full bg-accent border border-glass-border p-2 xs:p-2.5 sm:p-3 md:p-4 text-white focus:outline-none focus:border-primary transition-all text-xs xs:text-sm uppercase rounded-lg"
                      >
                        <option value="">Select Category</option>
                        {categories.map((cat: any) => (
                          <option key={cat._id} value={cat._id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>

                    {/* Description */}
                    <div className="flex flex-col gap-1 xs:gap-1.5 sm:gap-2">
                      <label className="text-[8px] xs:text-[9px] sm:text-[10px] text-text-muted uppercase tracking-widest font-bold">
                        Description
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full bg-accent border border-glass-border p-2 xs:p-2.5 sm:p-3 md:p-4 text-white focus:outline-none focus:border-primary transition-all text-xs xs:text-sm rounded-lg resize-none"
                        placeholder="Detailed specifications and craftsmanship details..."
                      />
                    </div>

                  </div>

                  {/* Right Column */}
                  <div className="flex flex-col gap-3 xs:gap-4 sm:gap-5 md:gap-6">

                    {/* Movement & Strap */}
                    <div className="grid grid-cols-2 gap-2 xs:gap-3 sm:gap-4">
                      <div className="flex flex-col gap-1 xs:gap-1.5 sm:gap-2">
                        <label className="text-[8px] xs:text-[9px] sm:text-[10px] text-text-muted uppercase tracking-widest font-bold">
                          Movement
                        </label>
                        <input
                          required
                          type="text"
                          value={formData.movementType}
                          onChange={(e) => setFormData({ ...formData, movementType: e.target.value })}
                          className="w-full bg-accent border border-glass-border p-2 xs:p-2.5 sm:p-3 md:p-4 text-white focus:outline-none focus:border-primary transition-all text-xs xs:text-sm uppercase rounded-lg"
                          placeholder="AUTOMATIC"
                        />
                      </div>
                      <div className="flex flex-col gap-1 xs:gap-1.5 sm:gap-2">
                        <label className="text-[8px] xs:text-[9px] sm:text-[10px] text-text-muted uppercase tracking-widest font-bold">
                          Strap
                        </label>
                        <input
                          required
                          type="text"
                          value={formData.strapMaterial}
                          onChange={(e) => setFormData({ ...formData, strapMaterial: e.target.value })}
                          className="w-full bg-accent border border-glass-border p-2 xs:p-2.5 sm:p-3 md:p-4 text-white focus:outline-none focus:border-primary transition-all text-xs xs:text-sm uppercase rounded-lg"
                          placeholder="OYSTERSTEEL"
                        />
                      </div>
                    </div>

                    {/* Images Section */}
                    <div className="flex flex-col gap-2 xs:gap-3">
                      <label className="text-[8px] xs:text-[9px] sm:text-[10px] text-text-muted uppercase tracking-widest font-bold">
                        Product Images
                      </label>
                      <div className="grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-[200px] overflow-y-auto pr-1 custom-scrollbar">
                        {formData.images.map((img, index) => (
                          <div
                            key={index}
                            className="relative group aspect-square glass cursor-pointer border border-glass-border hover:border-primary rounded-lg overflow-hidden"
                          >
                            {img ? (
                              <>
                                <img src={img} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                                <button
                                  type="button"
                                  className="absolute top-0.5 right-0.5 z-10 w-4 h-4 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const newImages = [...formData.images];
                                    newImages.splice(index, 1);
                                    if (newImages.length === 0) newImages.push('');
                                    setFormData({ ...formData, images: newImages });
                                  }}
                                >
                                  <X size={8} />
                                </button>
                              </>
                            ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center gap-1 text-text-muted">
                                <ImageIcon size={12} />
                                <span className="text-[6px] uppercase tracking-widest">Upload</span>
                              </div>
                            )}
                            <input
                              type="file"
                              accept="image/*"
                              className="absolute inset-0 opacity-0 cursor-pointer"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                const formDataImg = new FormData();
                                formDataImg.append('image', file);
                                try {
                                  const res = await api.post('/upload', formDataImg);
                                  const newImages = [...formData.images];
                                  newImages[index] = res.data;
                                  setFormData({ ...formData, images: newImages });
                                } catch (error) {
                                  alert('Upload failed');
                                }
                              }}
                            />
                          </div>
                        ))}
                        <button
                          type="button"
                          className="glass aspect-square border-2 border-dashed border-glass-border hover:border-primary text-text-muted hover:text-primary transition-all flex flex-col items-center justify-center gap-1 rounded-lg"
                          onClick={() => setFormData({ ...formData, images: [...formData.images, ''] })}
                        >
                          <Plus size={12} />
                          <span className="text-[6px] uppercase tracking-widest font-bold">Add</span>
                        </button>
                      </div>
                    </div>

                    {/* Featured Toggle */}
                    <div className="flex items-center gap-2 xs:gap-3 py-2 border-t border-glass-border">
                      <div
                        className={`relative w-9 h-5 rounded-full p-1 cursor-pointer transition-colors ${formData.isFeatured ? 'bg-primary' : 'bg-glass-border'}`}
                        onClick={() => setFormData({ ...formData, isFeatured: !formData.isFeatured })}
                      >
                        <div className={`absolute w-3.5 h-3.5 top-0.5 rounded-full bg-white transition-transform duration-300 ${formData.isFeatured ? 'translate-x-4' : ''}`}></div>
                      </div>
                      <span className="text-[8px] xs:text-[9px] sm:text-[10px] text-text-muted uppercase tracking-widest font-bold">
                        Feature on Homepage
                      </span>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-premium py-2 xs:py-2.5 sm:py-3 md:py-4 flex items-center justify-center gap-2 w-full text-xs xs:text-sm mt-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 size={14} className="animate-spin" />
                          PROCESSING...
                        </>
                      ) : (
                        <>
                          {isEditing ? 'UPDATE PRODUCT' : 'ADD PRODUCT'}
                          <Check size={14} />
                        </>
                      )}
                    </button>

                  </div>
                </form>
              </div>
            </div>
          )}

        </div>
      </DashboardLayout>
    </AdminRoute>
  );
};

export default ProductsManagement;