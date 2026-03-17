'use client';

import React, { useState, useEffect } from 'react';
import AdminRoute from '../../components/AdminRoute';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../lib/api';
import { Plus, Edit, Trash2, X, Image as ImageIcon } from 'lucide-react';

const CategoriesManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [showOnHome, setShowOnHome] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/categories');
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (isEditing && selectedId) {
        await api.put(`/categories/${selectedId}`, { name, image, showOnHome });
      } else {
        await api.post('/categories', { name, image, showOnHome });
      }
      handleCloseModal();
      fetchCategories();
    } catch (error) {
      console.error('Error saving category:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (cat: any) => {
    setName(cat.name);
    setImage(cat.image);
    setShowOnHome(cat.showOnHome);
    setSelectedId(cat._id);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setSelectedId(null);
    setName('');
    setImage('');
    setShowOnHome(false);
  };

  const deleteHandler = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this category? All products in this category will become unassigned.')) {
      try {
        await api.delete(`/categories/${id}`);
        fetchCategories();
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    }
  };

  return (
    <AdminRoute>
      <DashboardLayout>
        <div className="flex flex-col gap-10">
          <div className="flex justify-between items-center">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl text-white font-medium">Category Management</h1>
              <p className="text-text-muted text-sm tracking-widest uppercase font-light">Organise Showroom</p>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="btn-premium flex items-center gap-2 text-xs"
            >
              <Plus size={16} />
              NEW CATEGORY
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
               [1,2,3].map(i => <div key={i} className="h-60 glass animate-pulse"></div>)
            ) : categories.length === 0 ? (
              <div className="col-span-full py-20 text-center text-text-muted tracking-widest uppercase text-sm border border-dashed border-glass-border">No categories found</div>
            ) : (
              categories.map((cat: any) => (
                <div key={cat._id} className="relative group glass h-64 overflow-hidden">
                   <img src={cat.image} alt="" className="w-full h-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-110" />
                   <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-black/40">
                      <h3 className="text-xl text-white font-bold tracking-[0.2em] mb-4 uppercase text-center px-4">{cat.name}</h3>
                      <div className="flex gap-4">
                        <button onClick={() => handleEdit(cat)} className="w-10 h-10 glass flex items-center justify-center text-white hover:text-primary transition-colors">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => deleteHandler(cat._id)} className="w-10 h-10 glass flex items-center justify-center text-white hover:text-red-500 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="mt-4">
                        <span className={`text-[10px] tracking-widest uppercase font-bold px-3 py-1 glass ${cat.showOnHome ? 'text-primary' : 'text-text-muted'}`}>
                          {cat.showOnHome ? 'Visible on Home' : 'Hidden from Home'}
                        </span>
                      </div>
                   </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={handleCloseModal}></div>
            <div className="relative w-full max-w-lg glass p-10 flex flex-col gap-8 shadow-2xl border border-white/10">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl text-white font-medium uppercase tracking-widest">{isEditing ? 'Edit Category' : 'New Category'}</h2>
                <button onClick={handleCloseModal} className="text-text-muted hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] text-text-muted uppercase tracking-widest font-bold">Category Name</label>
                  <input
                    required
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-accent border border-glass-border p-4 text-white focus:outline-none focus:border-primary transition-all text-sm uppercase tracking-widest"
                    placeholder="e.g. LUXURY CHRONOGRAPHS"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] text-text-muted uppercase tracking-widest font-bold">Category Image</label>
                  <div className="relative group overflow-hidden glass aspect-video flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-primary/50 transition-colors">
                    {image ? (
                      <>
                        <img src={image} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-50 transition-transform duration-700 group-hover:scale-110" />
                        <div className="relative z-10 flex flex-col items-center gap-2">
                          <ImageIcon size={32} className="text-primary" />
                          <span className="text-[10px] text-white font-bold uppercase tracking-widest">Change Image</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <ImageIcon size={32} className="text-text-muted" />
                        <span className="text-[10px] text-text-muted font-bold uppercase tracking-widest">Upload Image</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        
                        setIsSubmitting(true);
                        const formData = new FormData();
                        formData.append('image', file);
                        
                        try {
                          const { data } = await api.post('/upload', formData, {
                            headers: { 'Content-Type': 'multipart/form-data' }
                          });
                          setImage(data);
                        } catch (error) {
                          console.error('Upload Error:', error);
                          alert('Failed to upload image. Please try again.');
                        } finally {
                          setIsSubmitting(false);
                        }
                      }}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4">
                   <div 
                    onClick={() => setShowOnHome(!showOnHome)}
                    className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors duration-300 ${showOnHome ? 'bg-primary' : 'bg-glass-border'}`}
                   >
                     <div className={`w-4 h-4 rounded-full bg-white transition-transform duration-300 ${showOnHome ? 'translate-x-6' : 'translate-x-0'}`}></div>
                   </div>
                   <span className="text-xs text-text-muted uppercase tracking-widest font-bold">Show on Homepage</span>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="btn-premium py-4 flex items-center justify-center gap-3 mt-4"
                >
                  {isSubmitting ? (isEditing ? 'SAVING...' : 'CREATING...') : (isEditing ? 'SAVE CHANGES' : 'CREATE CATEGORY')}
                  {!isSubmitting && (isEditing ? <Edit size={18} /> : <Plus size={18} />)}
                </button>
              </form>
            </div>
          </div>
        )}
      </DashboardLayout>
    </AdminRoute>
  );
};

export default CategoriesManagement;
