'use client';

import React, { useState, useEffect } from 'react';
import AdminRoute from '../../components/AdminRoute';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../lib/api';
import { Plus, Edit, Trash2, Search, ExternalLink, X, Image as ImageIcon, Check } from 'lucide-react';
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
      setProducts(data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/categories');
      setCategories(data);
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
        images: product.images || [''],
        variants: product.variants || []
      });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('FormData before clean:', JSON.stringify(formData.variants, null, 2));
    setIsSubmitting(true);
    try {
      // Filter out empty images and variants
      const cleanedImages = formData.images.filter(img => img.trim() !== '');
      const cleanedVariants = formData.variants
        .filter(v => v.options.some(opt => opt.trim() !== ''))
        .map(v => ({
          variantType: v.variantType.trim() || 'Custom',
          options: v.options.filter(opt => opt.trim() !== '')
        }));
      console.log('cleanedVariants:', JSON.stringify(cleanedVariants, null, 2));
        
      const finalData = { 
        ...formData, 
        images: cleanedImages.length > 0 ? cleanedImages : ['/uploads/sample.jpg'],
        variants: cleanedVariants
      };
      console.log('finalData variants:', JSON.stringify(finalData.variants, null, 2));
      
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

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData({ ...formData, images: newImages });
  };

  const addImageField = () => {
    setFormData({ ...formData, images: [...formData.images, ''] });
  };

  const filteredProducts = products.filter((p: any) => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.model.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminRoute>
      <DashboardLayout>
        <div className="flex flex-col gap-10">
          <div className="flex justify-between items-center">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl text-white font-medium">Product Management</h1>
              <p className="text-text-muted text-sm tracking-widest uppercase font-light">Inventory Control</p>
            </div>
            <button onClick={handleOpenCreate} className="btn-premium flex items-center gap-2 text-xs">
              <Plus size={16} />
              ADD NEW WATCH
            </button>
          </div>

          {/* Search & Stats */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
              <input
                type="text"
                placeholder="Search inventory by name, brand, or model..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-accent border border-glass-border p-4 pl-12 text-white focus:outline-none focus:border-primary transition-all text-sm"
              />
            </div>
          </div>

          {/* Product Table */}
          <div className="glass overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-glass-border bg-white/5 uppercase text-[10px] tracking-widest text-text-muted">
                  <th className="p-6 font-bold">Watch</th>
                  <th className="p-6 font-bold">Category</th>
                  <th className="p-6 font-bold">Price</th>
                  <th className="p-6 font-bold">Stock</th>
                  <th className="p-6 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-glass-border">
                {loading ? (
                  <tr><td colSpan={5} className="p-20 text-center text-primary tracking-widest uppercase animate-pulse">Synchronizing Inventory...</td></tr>
                ) : filteredProducts.length === 0 ? (
                  <tr><td colSpan={5} className="p-20 text-center text-text-muted tracking-widest uppercase">No timepieces found matching your criteria</td></tr>
                ) : (
                  filteredProducts.map((product: any) => (
                    <tr key={product._id} className="hover:bg-white/5 transition-all group">
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <img src={product.images[0]} alt="" className="w-12 h-12 object-cover bg-black border border-glass-border" />
                          <div className="flex flex-col">
                            <span className="text-white text-sm font-medium">{product.name}</span>
                            <span className="text-text-muted text-[10px] uppercase font-bold tracking-widest">{product.brand}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-6 text-sm text-text-muted uppercase tracking-widest text-[10px] font-bold">
                        {product.category?.name || 'Uncategorized'}
                      </td>
                      <td className="p-6 text-sm text-white font-bold tracking-tighter">Rs. {product.price.toLocaleString()}</td>
                      <td className="p-6">
                        <span className={`text-[10px] font-bold px-3 py-1 uppercase tracking-widest glass ${product.countInStock > 5 ? 'text-green-500' : 'text-red-500'}`}>
                          {product.countInStock} IN STOCK
                        </span>
                      </td>
                      <td className="p-6 text-right">
                        <div className="flex justify-end gap-3 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                          <Link href={`/catalog/${product._id}`} target="_blank" className="p-2 text-text-muted hover:text-white transition-colors" title="View in Shop">
                            <ExternalLink size={18} />
                          </Link>
                          <button 
                            onClick={() => handleOpenEdit(product)}
                            className="p-2 text-text-muted hover:text-primary transition-colors" 
                            title="Edit Details"
                          >
                            <Edit size={18} />
                          </button>
                          <button onClick={() => deleteHandler(product._id)} className="p-2 text-text-muted hover:text-red-500 transition-colors" title="Remove Inventory">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create/Edit Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
            <div className="relative w-full max-w-4xl glass p-10 flex flex-col gap-8 shadow-2xl border border-white/10 max-h-[90vh] overflow-y-auto custom-scrollbar">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <h2 className="text-2xl text-white font-medium uppercase tracking-widest">{isEditing ? 'Edit Timepiece' : 'Add New Timepiece'}</h2>
                  <span className="text-primary text-[10px] font-bold tracking-[0.3em] uppercase">{isEditing ? `REF: ${selectedProductId.slice(-8).toUpperCase()}` : 'NEW INVENTORY ENTRY'}</span>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="text-text-muted hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="flex flex-col gap-6">
                   <div className="flex flex-col gap-2">
                     <label className="text-[10px] text-text-muted uppercase tracking-widest font-bold">Watch Name</label>
                     <input
                       required
                       type="text"
                       value={formData.name}
                       onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                       className="w-full bg-accent border border-glass-border p-4 text-white focus:outline-none focus:border-primary transition-all text-sm uppercase"
                       placeholder="ROLEX SUBMARINER DATE"
                     />
                   </div>

                   <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] text-text-muted uppercase tracking-widest font-bold">Brand</label>
                        <input
                          required
                          type="text"
                          value={formData.brand}
                          onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                          className="w-full bg-accent border border-glass-border p-4 text-white focus:outline-none focus:border-primary transition-all text-sm uppercase"
                          placeholder="ROLEX"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] text-text-muted uppercase tracking-widest font-bold">Model</label>
                        <input
                          required
                          type="text"
                          value={formData.model}
                          onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                          className="w-full bg-accent border border-glass-border p-4 text-white focus:outline-none focus:border-primary transition-all text-sm uppercase"
                          placeholder="126610LN"
                        />
                      </div>
                   </div>

                   <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] text-text-muted uppercase tracking-widest font-bold">Price (Rs.)</label>
                        <input
                          required
                          type="number"
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                          className="w-full bg-accent border border-glass-border p-4 text-white focus:outline-none focus:border-primary transition-all text-sm font-bold"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] text-text-muted uppercase tracking-widest font-bold">Stock Count</label>
                        <input
                          required
                          type="number"
                          value={formData.countInStock}
                          onChange={(e) => setFormData({ ...formData, countInStock: Number(e.target.value) })}
                          className="w-full bg-accent border border-glass-border p-4 text-white focus:outline-none focus:border-primary transition-all text-sm"
                        />
                      </div>
                   </div>

                   <div className="flex flex-col gap-2">
                     <label className="text-[10px] text-text-muted uppercase tracking-widest font-bold">Category</label>
                     <select
                       required
                       value={formData.category}
                       onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                       className="w-full bg-accent border border-glass-border p-4 text-white focus:outline-none focus:border-primary transition-all text-sm uppercase"
                     >
                       <option value="">Select Category</option>
                       {categories.map((cat: any) => (
                         <option key={cat._id} value={cat._id}>{cat.name}</option>
                       ))}
                     </select>
                   </div>

                   <div className="flex flex-col gap-2">
                     <label className="text-[10px] text-text-muted uppercase tracking-widest font-bold">Description</label>
                     <textarea
                       required
                       rows={4}
                       value={formData.description}
                       onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                       className="w-full bg-accent border border-glass-border p-4 text-white focus:outline-none focus:border-primary transition-all text-sm resize-none"
                       placeholder="Detailed specifications and craftsmanship details..."
                     />
                   </div>
                </div>

                {/* Right Column */}
                <div className="flex flex-col gap-6">
                   <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] text-text-muted uppercase tracking-widest font-bold">Movement</label>
                        <input
                          required
                          type="text"
                          value={formData.movementType}
                          onChange={(e) => setFormData({ ...formData, movementType: e.target.value })}
                          className="w-full bg-accent border border-glass-border p-4 text-white focus:outline-none focus:border-primary transition-all text-sm uppercase"
                          placeholder="AUTOMATIC"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] text-text-muted uppercase tracking-widest font-bold">Strap</label>
                        <input
                          required
                          type="text"
                          value={formData.strapMaterial}
                          onChange={(e) => setFormData({ ...formData, strapMaterial: e.target.value })}
                          className="w-full bg-accent border border-glass-border p-4 text-white focus:outline-none focus:border-primary transition-all text-sm uppercase"
                          placeholder="OYSTERSTEEL"
                        />
                      </div>
                   </div>



                   <div className="flex flex-col gap-4">
                     <label className="text-[10px] text-text-muted uppercase tracking-widest font-bold">Product Showcase (Images)</label>
                     <div className="grid grid-cols-2 gap-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                        {formData.images.map((img, index) => (
                           <div key={index} className="relative group glass aspect-square flex flex-col items-center justify-center gap-2 cursor-pointer border border-glass-border hover:border-primary/50 transition-all">
                              {img ? (
                                <>
                                  <img src={img} alt="" className="absolute inset-0 w-full h-full object-cover opacity-50 transition-transform duration-500 group-hover:scale-110" />
                                  <div className="relative z-10 flex flex-col items-center gap-1">
                                    <ImageIcon size={20} className="text-primary" />
                                    <span className="text-[8px] text-white font-bold uppercase tracking-widest">Change</span>
                                  </div>
                                  <button 
                                    type="button" 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const newImages = formData.images.filter((_, i) => i !== index);
                                      setFormData({ ...formData, images: newImages.length > 0 ? newImages : [''] });
                                    }}
                                    className="absolute top-2 right-2 z-20 w-6 h-6 glass bg-red-500/20 text-red-500 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <X size={12} />
                                  </button>
                                </>
                              ) : (
                                <>
                                  <ImageIcon size={24} className="text-text-muted" />
                                  <span className="text-[8px] text-text-muted font-bold uppercase tracking-widest text-center px-2">Click to Upload</span>
                                </>
                              )}
                              <input
                                type="file"
                                accept="image/*"
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (!file) return;
                                  
                                  const tempImages = [...formData.images];
                                  // Find a better way to show loading per image if needed, but for now just disable submit
                                  setIsSubmitting(true);
                                  
                                  const uploadData = new FormData();
                                  uploadData.append('image', file);
                                  
                                  try {
                                    const { data } = await api.post('/upload', uploadData, {
                                      headers: { 'Content-Type': 'multipart/form-data' }
                                    });
                                    tempImages[index] = data;
                                    setFormData({ ...formData, images: tempImages });
                                  } catch (error) {
                                    console.error('Upload Error:', error);
                                    alert('Failed to upload image.');
                                  } finally {
                                    setIsSubmitting(false);
                                  }
                                }}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                              />
                           </div>
                        ))}
                        <button 
                           type="button"
                           onClick={addImageField}
                           className="glass aspect-square flex flex-col items-center justify-center gap-2 border border-dashed border-glass-border hover:border-primary/50 transition-all text-text-muted hover:text-primary"
                         >
                           <Plus size={20} />
                           <span className="text-[8px] font-bold uppercase tracking-widest">Add Image</span>
                         </button>
                      </div>
                   </div>

                   <div className="flex flex-col gap-4">
                     <div className="flex justify-between items-center">
                       <label className="text-[10px] text-text-muted uppercase tracking-widest font-bold">Product Variants <span className="text-red-400">*</span> (type e.g. Size/Color)</label>
                       <button 
                         type="button"
                         onClick={() => setFormData({ ...formData, variants: [...formData.variants, { variantType: '', options: [''] }] })}
                         className="text-primary text-[10px] font-bold uppercase tracking-widest hover:underline"
                       >
                         + Add Variant
                       </button>
                     </div>
                   <div className="flex flex-col gap-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                     {formData.variants.map((variant, vIndex) => (
                       <div key={vIndex} className="glass p-4 border border-glass-border flex flex-col gap-4">
                         <div className="flex justify-between items-center">
                           <input
                             type="text"
                             placeholder="VARIANT TYPE (E.G. BAND)"
                             value={variant.variantType}
                             onChange={(e) => {
                               const newVariants = [...formData.variants];
                               newVariants[vIndex].variantType = e.target.value;
                               setFormData({ ...formData, variants: newVariants });
                             }}
                             className="bg-transparent border-b border-glass-border p-1 text-white text-[10px] font-bold uppercase focus:outline-none focus:border-primary tracking-widest"
                           />
                           <button 
                             type="button" 
                             onClick={() => setFormData({ ...formData, variants: formData.variants.filter((_, i) => i !== vIndex) })}
                             className="text-red-500 hover:text-red-400"
                           >
                             <Trash2 size={14} />
                           </button>
                         </div>
                         
                         <div className="flex flex-wrap gap-2">
                           {variant.options.map((opt, oIndex) => (
                             <div key={oIndex} className="relative group">
                               <input
                                 type="text"
                                 value={opt}
                                 onChange={(e) => {
                                   const newVariants = [...formData.variants];
                                   newVariants[vIndex].options[oIndex] = e.target.value;
                                   setFormData({ ...formData, variants: newVariants });
                                 }}
                                 className="glass px-4 py-2 text-[10px] text-white border border-glass-border focus:border-primary uppercase min-w-[80px]"
                                 placeholder="OPTION"
                               />
                               {variant.options.length > 1 && (
                                 <button 
                                   type="button"
                                   onClick={() => {
                                     const newVariants = [...formData.variants];
                                     newVariants[vIndex].options = newVariants[vIndex].options.filter((_, i) => i !== oIndex);
                                     setFormData({ ...formData, variants: newVariants });
                                   }}
                                   className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                 >
                                   <X size={8} />
                                 </button>
                               )}
                             </div>
                           ))}
                           <button 
                             type="button"
                             onClick={() => {
                               const newVariants = [...formData.variants];
                               newVariants[vIndex].options.push('');
                               setFormData({ ...formData, variants: newVariants });
                             }}
                             className="px-4 py-2 glass border border-dashed border-glass-border text-primary text-[10px] uppercase font-bold hover:bg-white/5"
                           >
                             +
                           </button>
                         </div>
                       </div>
                     ))}
                   </div>
                 </div>

                   <div className="flex items-center gap-4 py-4">
                      <div 
                        onClick={() => setFormData({ ...formData, isFeatured: !formData.isFeatured })}
                        className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors duration-300 ${formData.isFeatured ? 'bg-primary' : 'bg-glass-border'}`}
                      >
                        <div className={`w-4 h-4 rounded-full bg-white transition-transform duration-300 ${formData.isFeatured ? 'translate-x-6' : 'translate-x-0'}`}></div>
                      </div>
                      <span className="text-xs text-text-muted uppercase tracking-widest font-bold">Feature in Showcase</span>
                   </div>

                   <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="btn-premium py-4 flex items-center justify-center gap-3 mt-auto"
                   >
                     {isSubmitting ? 'PROCESSING...' : (isEditing ? 'COMMIT CHANGES' : 'ADD TO COLLECTION')}
                     {!isSubmitting && <Check size={18} />}
                   </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </DashboardLayout>
    </AdminRoute>
  );
};

export default ProductsManagement;
