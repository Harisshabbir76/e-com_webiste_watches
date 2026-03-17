'use client';

import React, { useState, useEffect } from 'react';
import AdminRoute from '../../components/AdminRoute';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../lib/api';
import { Save, Shield, Smartphone, Mail, Truck } from 'lucide-react';

const SettingsPage = () => {
  const [settings, setSettings] = useState({
    shippingCost: 250,
    freeShippingThreshold: 10000,
    storeEmail: 'contact@iwrist.pk',
    whatsappNumber: '+923001234567',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data } = await api.get('/cms/settings');
      if (data) {
        setSettings({
          shippingCost: data.shippingCost,
          freeShippingThreshold: data.freeShippingAbove,
          storeEmail: data.storeEmail,
          whatsappNumber: data.whatsappNumber,
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
        shippingCost: settings.shippingCost,
        freeShippingAbove: settings.freeShippingThreshold,
        storeEmail: settings.storeEmail,
        whatsappNumber: settings.whatsappNumber,
      };
      await api.put('/cms/settings', payload);
      alert('Settings updated successfully');
    } catch (error) {
      console.error('Error updating settings:', error);
      alert('Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminRoute>
      <DashboardLayout>
        <div className="flex flex-col gap-10">
          <div className="flex justify-between items-center">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl text-white font-medium">Platform Settings</h1>
              <p className="text-text-muted text-sm tracking-widest uppercase font-light">Global Configuration</p>
            </div>
            <button 
              onClick={handleSubmit}
              disabled={saving}
              className="btn-premium flex items-center gap-2 text-xs"
            >
              <Save size={16} />
              {saving ? 'SAVING...' : 'SAVE CHANGES'}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
             {/* Logistic Settings */}
             <div className="glass p-8 flex flex-col gap-8">
                <div className="flex items-center gap-3 text-primary">
                  <Truck size={20} />
                  <h3 className="text-xl text-white font-medium uppercase tracking-widest text-sm">Logistic & Shipping</h3>
                </div>
                
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] text-text-muted uppercase tracking-widest font-bold">Standard Shipping Cost (PKR)</label>
                    <input
                      type="number"
                      value={settings.shippingCost}
                      onChange={(e) => setSettings({ ...settings, shippingCost: Number(e.target.value) })}
                      className="bg-accent border border-glass-border p-4 text-white focus:outline-none focus:border-primary transition-all text-sm"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] text-text-muted uppercase tracking-widest font-bold">Free Shipping Threshold (PKR)</label>
                    <input
                      type="number"
                      value={settings.freeShippingThreshold}
                      onChange={(e) => setSettings({ ...settings, freeShippingThreshold: Number(e.target.value) })}
                      className="bg-accent border border-glass-border p-4 text-white focus:outline-none focus:border-primary transition-all text-sm"
                    />
                  </div>
                </div>
             </div>

             {/* Contact Settings */}
             <div className="glass p-8 flex flex-col gap-8">
                <div className="flex items-center gap-3 text-primary">
                  <Smartphone size={20} />
                  <h3 className="text-xl text-white font-medium uppercase tracking-widest text-sm">Communication</h3>
                </div>
                
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] text-text-muted uppercase tracking-widest font-bold">Customer Support Email</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                      <input
                        type="email"
                        value={settings.storeEmail}
                        onChange={(e) => setSettings({ ...settings, storeEmail: e.target.value })}
                        className="w-full bg-accent border border-glass-border p-4 pl-12 text-white focus:outline-none focus:border-primary transition-all text-sm"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] text-text-muted uppercase tracking-widest font-bold">WhatsApp Hotline Number</label>
                    <div className="relative">
                      <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                      <input
                        type="text"
                        value={settings.whatsappNumber}
                        onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                        className="w-full bg-accent border border-glass-border p-4 pl-12 text-white focus:outline-none focus:border-primary transition-all text-sm"
                      />
                    </div>
                  </div>
                </div>
             </div>

             {/* Security Box */}
             <div className="lg:col-span-2 glass p-6 border-l-4 border-primary bg-primary/5 flex items-center gap-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Shield size={24} />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-white text-sm font-bold uppercase tracking-widest">Administrator Note</span>
                  <p className="text-text-muted text-xs leading-relaxed">Changes made to global settings reflect across the entire storefront immediately. Please verify all thresholds before saving.</p>
                </div>
             </div>
          </div>
        </div>
      </DashboardLayout>
    </AdminRoute>
  );
};

export default SettingsPage;
