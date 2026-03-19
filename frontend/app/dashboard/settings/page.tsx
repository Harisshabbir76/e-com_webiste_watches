'use client';

import React, { useState, useEffect } from 'react';
import AdminRoute from '../../components/AdminRoute';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../lib/api';
import { Save, Shield, Smartphone, Mail, Truck, DollarSign, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

const SettingsPage = () => {
  const [settings, setSettings] = useState({
    shippingCost: 250,
    freeShippingThreshold: 10000,
    storeEmail: 'contact@iwrist.pk',
    whatsappNumber: '+923001234567',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('shipping');

  useEffect(() => {
    fetchSettings();
  }, []);

  useEffect(() => {
    if (saveSuccess) {
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  }, [saveSuccess]);

  const fetchSettings = async () => {
    try {
      const { data } = await api.get('/cms/settings');
      if (data) {
        setSettings({
          shippingCost: data.shippingCost || 250,
          freeShippingThreshold: data.freeShippingAbove || 10000,
          storeEmail: data.storeEmail || 'contact@iwrist.pk',
          whatsappNumber: data.whatsappNumber || '+923001234567',
        });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        shippingCost: Number(settings.shippingCost),
        freeShippingAbove: Number(settings.freeShippingThreshold),
        storeEmail: settings.storeEmail,
        whatsappNumber: settings.whatsappNumber,
      };
      await api.put('/cms/settings', payload);
      setSaveSuccess(true);
    } catch (error) {
      console.error('Error updating settings:', error);
      alert('Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  // Mobile tabs
  const tabs = [
    { id: 'shipping', label: 'Shipping', icon: <Truck size={14} /> },
    { id: 'contact', label: 'Contact', icon: <Smartphone size={14} /> }
  ];

  if (loading) {
    return (
      <AdminRoute>
        <DashboardLayout>
          <div className="flex flex-col gap-4 xs:gap-5 sm:gap-6 md:gap-8 lg:gap-10 px-2 xs:px-3 sm:px-4 md:px-5 lg:px-6 pb-6 w-full max-w-[100vw] overflow-x-hidden min-h-[60vh] items-center justify-center">
            <Loader2 size={40} className="text-primary animate-spin" />
            <p className="text-text-muted text-xs xs:text-sm mt-4">Loading settings...</p>
          </div>
        </DashboardLayout>
      </AdminRoute>
    );
  }

  return (
    <AdminRoute>
      <DashboardLayout>
        <div className="flex flex-col gap-4 xs:gap-5 sm:gap-6 md:gap-8 lg:gap-10 px-2 xs:px-3 sm:px-4 md:px-5 lg:px-6 pb-6 w-full max-w-[100vw] overflow-x-hidden">
          
          {/* Header Section */}
          <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-3 xs:gap-4">
            <div className="flex flex-col gap-1 xs:gap-1.5 sm:gap-2">
              <h1 className="text-xl xs:text-2xl sm:text-3xl text-white font-medium tracking-tight">
                Platform Settings
              </h1>
              <p className="text-text-muted text-[10px] xs:text-xs sm:text-sm tracking-widest uppercase font-light">
                Global Configuration
              </p>
            </div>
            
            {/* Save Button */}
            <button 
              onClick={handleSubmit}
              disabled={saving}
              className="btn-premium flex items-center justify-center gap-2 text-[10px] xs:text-xs px-3 xs:px-4 py-2 xs:py-3 w-full xs:w-auto relative"
            >
              {saving ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  SAVING...
                </>
              ) : saveSuccess ? (
                <>
                  <CheckCircle size={14} className="text-green-500" />
                  SAVED!
                </>
              ) : (
                <>
                  <Save size={14} />
                  SAVE CHANGES
                </>
              )}
            </button>
          </div>

          {/* Mobile Tabs - Only visible on small screens */}
          <div className="flex lg:hidden gap-1 xs:gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 p-2 xs:p-3 text-[10px] xs:text-xs uppercase tracking-widest font-bold rounded-lg transition-all ${
                  activeTab === tab.id
                    ? 'bg-primary text-black'
                    : 'glass text-text-muted hover:text-white'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 xs:gap-4 sm:gap-5 md:gap-6 lg:gap-8">
            
            {/* Logistic Settings Card */}
            <div className={`glass p-3 xs:p-4 sm:p-5 md:p-6 lg:p-8 flex flex-col gap-4 xs:gap-5 sm:gap-6 md:gap-8 ${
              activeTab !== 'shipping' ? 'hidden lg:flex' : 'flex'
            }`}>
              {/* Card Header */}
              <div className="flex items-center gap-2 xs:gap-3">
                <div className="w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Truck size={16} className="xs:w-5 xs:h-5" />
                </div>
                <h3 className="text-sm xs:text-base sm:text-lg md:text-xl text-white font-medium uppercase tracking-widest">
                  Logistic & Shipping
                </h3>
              </div>
              
              {/* Form Fields */}
              <div className="flex flex-col gap-3 xs:gap-4 sm:gap-5 md:gap-6">
                {/* Shipping Cost */}
                <div className="flex flex-col gap-1 xs:gap-1.5 sm:gap-2">
                  <label className="text-[8px] xs:text-[9px] sm:text-[10px] text-text-muted uppercase tracking-widest font-bold">
                    Standard Shipping Cost (PKR)
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={14} />
                    <input
                      type="number"
                      value={settings.shippingCost}
                      onChange={(e) => setSettings({ ...settings, shippingCost: Number(e.target.value) })}
                      className="w-full bg-accent border border-glass-border p-2 xs:p-2.5 sm:p-3 md:p-4 pl-8 xs:pl-9 text-white focus:outline-none focus:border-primary transition-all text-xs xs:text-sm rounded-lg"
                      min="0"
                      step="50"
                    />
                  </div>
                  <p className="text-[7px] xs:text-[8px] text-text-muted mt-1">
                    Base shipping fee applied to all orders
                  </p>
                </div>

                {/* Free Shipping Threshold */}
                <div className="flex flex-col gap-1 xs:gap-1.5 sm:gap-2">
                  <label className="text-[8px] xs:text-[9px] sm:text-[10px] text-text-muted uppercase tracking-widest font-bold">
                    Free Shipping Threshold (PKR)
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={14} />
                    <input
                      type="number"
                      value={settings.freeShippingThreshold}
                      onChange={(e) => setSettings({ ...settings, freeShippingThreshold: Number(e.target.value) })}
                      className="w-full bg-accent border border-glass-border p-2 xs:p-2.5 sm:p-3 md:p-4 pl-8 xs:pl-9 text-white focus:outline-none focus:border-primary transition-all text-xs xs:text-sm rounded-lg"
                      min="0"
                      step="500"
                    />
                  </div>
                  <p className="text-[7px] xs:text-[8px] text-text-muted mt-1">
                    Orders above this amount get free shipping
                  </p>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="mt-2 p-2 xs:p-3 bg-accent/30 rounded-lg border border-glass-border">
                <div className="flex items-center justify-between text-[8px] xs:text-[9px] sm:text-[10px]">
                  <span className="text-text-muted">Current Shipping:</span>
                  <span className="text-white font-bold">Rs. {settings.shippingCost.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-[8px] xs:text-[9px] sm:text-[10px] mt-1">
                  <span className="text-text-muted">Free Shipping Above:</span>
                  <span className="text-white font-bold">Rs. {settings.freeShippingThreshold.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Contact Settings Card */}
            <div className={`glass p-3 xs:p-4 sm:p-5 md:p-6 lg:p-8 flex flex-col gap-4 xs:gap-5 sm:gap-6 md:gap-8 ${
              activeTab !== 'contact' ? 'hidden lg:flex' : 'flex'
            }`}>
              {/* Card Header */}
              <div className="flex items-center gap-2 xs:gap-3">
                <div className="w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Smartphone size={16} className="xs:w-5 xs:h-5" />
                </div>
                <h3 className="text-sm xs:text-base sm:text-lg md:text-xl text-white font-medium uppercase tracking-widest">
                  Communication
                </h3>
              </div>
              
              {/* Form Fields */}
              <div className="flex flex-col gap-3 xs:gap-4 sm:gap-5 md:gap-6">
                {/* Support Email */}
                <div className="flex flex-col gap-1 xs:gap-1.5 sm:gap-2">
                  <label className="text-[8px] xs:text-[9px] sm:text-[10px] text-text-muted uppercase tracking-widest font-bold">
                    Customer Support Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={14} />
                    <input
                      type="email"
                      value={settings.storeEmail}
                      onChange={(e) => setSettings({ ...settings, storeEmail: e.target.value })}
                      className="w-full bg-accent border border-glass-border p-2 xs:p-2.5 sm:p-3 md:p-4 pl-8 xs:pl-9 text-white focus:outline-none focus:border-primary transition-all text-xs xs:text-sm rounded-lg"
                      placeholder="email@example.com"
                    />
                  </div>
                  <p className="text-[7px] xs:text-[8px] text-text-muted mt-1">
                    Used for order notifications and customer support
                  </p>
                </div>

                {/* WhatsApp Number */}
                <div className="flex flex-col gap-1 xs:gap-1.5 sm:gap-2">
                  <label className="text-[8px] xs:text-[9px] sm:text-[10px] text-text-muted uppercase tracking-widest font-bold">
                    WhatsApp Hotline Number
                  </label>
                  <div className="relative">
                    <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={14} />
                    <input
                      type="text"
                      value={settings.whatsappNumber}
                      onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                      className="w-full bg-accent border border-glass-border p-2 xs:p-2.5 sm:p-3 md:p-4 pl-8 xs:pl-9 text-white focus:outline-none focus:border-primary transition-all text-xs xs:text-sm rounded-lg"
                      placeholder="+92XXXXXXXXXX"
                    />
                  </div>
                  <p className="text-[7px] xs:text-[8px] text-text-muted mt-1">
                    Displayed on storefront for customer inquiries
                  </p>
                </div>
              </div>

              {/* Contact Preview */}
              <div className="mt-2 p-2 xs:p-3 bg-accent/30 rounded-lg border border-glass-border">
                <div className="flex items-center gap-2 text-[8px] xs:text-[9px] sm:text-[10px]">
                  <Mail size={10} className="text-primary" />
                  <span className="text-text-muted">Email:</span>
                  <span className="text-white truncate">{settings.storeEmail}</span>
                </div>
                <div className="flex items-center gap-2 text-[8px] xs:text-[9px] sm:text-[10px] mt-1">
                  <Smartphone size={10} className="text-primary" />
                  <span className="text-text-muted">WhatsApp:</span>
                  <span className="text-white truncate">{settings.whatsappNumber}</span>
                </div>
              </div>
            </div>

            {/* Security Note - Full Width */}
            <div className="lg:col-span-2">
              <div className="glass p-3 xs:p-4 sm:p-5 md:p-6 border-l-2 xs:border-l-4 border-primary bg-primary/5 flex flex-col xs:flex-row items-start xs:items-center gap-3 xs:gap-4 sm:gap-5 md:gap-6 rounded-lg">
                <div className="w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                  <Shield size={16} className="xs:w-5 xs:h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="flex flex-col gap-0.5 xs:gap-1">
                  <span className="text-white text-[10px] xs:text-xs sm:text-sm font-bold uppercase tracking-widest">
                    Administrator Note
                  </span>
                  <p className="text-text-muted text-[8px] xs:text-[9px] sm:text-xs leading-relaxed">
                    Changes made to global settings reflect across the entire storefront immediately. 
                    Please verify all thresholds before saving.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Save Confirmation Toast */}
          {saveSuccess && (
            <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 glass bg-green-500/20 border border-green-500/50 px-3 xs:px-4 py-2 xs:py-3 rounded-lg flex items-center gap-2 animate-fade-in-up">
              <CheckCircle size={14} className="text-green-500" />
              <span className="text-[10px] xs:text-xs text-white">Settings saved successfully!</span>
            </div>
          )}
        </div>
      </DashboardLayout>
    </AdminRoute>
  );
};

export default SettingsPage;