'use client';

import React, { useState, useEffect } from 'react';
import AdminRoute from '../../components/AdminRoute';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../lib/api';
import { Users, Search, Copy, Trash2, Download } from 'lucide-react';
import DateFilters from '../../components/DateFilters';

interface SubscriberType {
  _id: string;
  email: string;
  createdAt: string;
}

const SubscribersPage = () => {
  const [subscribers, setSubscribers] = useState<SubscriberType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/subscribers');
      setSubscribers(data);
    } catch (error) {
      console.error('Error fetching subscribers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterByDate = (subs: SubscriberType[]) => {
    if (dateFilter === 'all') return subs;
    
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    return subs.filter((sub: SubscriberType) => {
      const subDate = new Date(sub.createdAt);
      
      switch (dateFilter) {
        case 'today':
          return subDate >= today;
        case 'yesterday':
          const yesterday = new Date(today);
          yesterday.setDate(yesterday.getDate() - 1);
          return subDate >= yesterday && subDate < today;
        case '7days':
          const sevenDaysAgo = new Date(today);
          sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
          return subDate >= sevenDaysAgo;
        case 'month':
          const lastMonth = new Date(today);
          lastMonth.setMonth(lastMonth.getMonth() - 1);
          return subDate >= lastMonth;
        case '90days':
          const ninetyDaysAgo = new Date(today);
          ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
          return subDate >= ninetyDaysAgo;
        default:
          return true;
      }
    });
  };

  const copyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
  };

  const deleteSubscriber = async (id: string) => {
    if (window.confirm('Remove this subscriber?')) {
      try {
        await api.delete(`/subscribers/${id}`);
        fetchSubscribers();
      } catch (error) {
        console.error('Delete error:', error);
      }
    }
  };

  const downloadCSV = () => {
    const filtered = filterByDate(subscribers).filter(s => 
      s.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const csvContent = 'data:text/csv;charset=utf-8,' + 
      'Name,Email,Date Joined\r\n' +
      filtered.map(sub => {
        const namePart = sub.email.split('@')[0];
        const name = namePart.charAt(0).toUpperCase() + namePart.slice(1).replace(/[._-]+/g, ' ');
        const dateStr = new Date(sub.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
        return `"${name}","${sub.email.replace(/"/g, '""')}","${dateStr}"`;
      }).join('\r\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `subscribers_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const processedSubscribers = filterByDate(subscribers).filter(s => 
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminRoute>
      <DashboardLayout>
        <div className="flex flex-col gap-10">
          <div className="flex justify-between items-center">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl text-white font-medium">Newsletter Subscribers</h1>
              <p className="text-text-muted text-sm tracking-widest uppercase font-light">
                Total: {processedSubscribers.length}
              </p>
            </div>
            <button 
              onClick={downloadCSV}
              className="btn-premium flex items-center gap-2 px-6"
              disabled={processedSubscribers.length === 0}
            >
              <Download size={18} />
              Export CSV ({processedSubscribers.length})
            </button>
          </div>

          <div className="flex gap-6 items-center">
            <DateFilters value={dateFilter} onChange={setDateFilter} />
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
            <input
              type="text"
              placeholder="Search subscribers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-accent border border-glass-border p-4 pl-12 text-white focus:outline-none focus:border-primary transition-all text-sm"
            />
          </div>

          {/* Subscribers Table */}
          <div className="glass overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-glass-border bg-white/5 uppercase text-[10px] tracking-widest text-text-muted">
                  <th className="p-6 font-bold">Email</th>
                  <th className="p-6 font-bold">Date Joined</th>
                  <th className="p-6 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-glass-border">
                {loading ? (
                  <tr><td colSpan={3} className="p-20 text-center text-primary tracking-widest uppercase animate-pulse">Loading subscribers...</td></tr>
                ) : processedSubscribers.length === 0 ? (
                  <tr><td colSpan={3} className="p-20 text-center text-text-muted tracking-widest uppercase">No subscribers match filters</td></tr>
                ) : (
                  processedSubscribers.map((subscriber) => (
                    <tr key={subscriber._id} className="hover:bg-white/5 transition-all">
                      <td className="p-6 text-sm text-white font-medium">{subscriber.email}</td>
                      <td className="p-6 text-[10px] text-text-muted tracking-widest uppercase">
                        {new Date(subscriber.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-6 text-right">
                        <div className="flex gap-2 justify-end">
                          <button 
                            onClick={() => copyEmail(subscriber.email)}
                            className="p-2 text-text-muted hover:text-primary"
                            title="Copy email"
                          >
                            <Copy size={16} />
                          </button>
                          <button 
                            onClick={() => deleteSubscriber(subscriber._id)}
                            className="p-2 text-text-muted hover:text-red-500"
                            title="Remove"
                          >
                            <Trash2 size={16} />
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
      </DashboardLayout>
    </AdminRoute>
  );
};

export default SubscribersPage;

