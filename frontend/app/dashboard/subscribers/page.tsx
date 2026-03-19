'use client';

import React, { useState, useEffect } from 'react';
import AdminRoute from '../../components/AdminRoute';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../lib/api';
import { 
  Users, Search, Copy, Trash2, Download, Mail, Calendar, 
  Filter, ChevronDown, CheckCircle, XCircle, Loader2 
} from 'lucide-react';
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
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/subscribers');
      setSubscribers(data || []);
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
    setCopiedEmail(email);
    setTimeout(() => setCopiedEmail(null), 2000);
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
      s.email?.toLowerCase().includes(searchTerm.toLowerCase())
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
    s.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return `Today, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <AdminRoute>
      <DashboardLayout>
        <div className="flex flex-col gap-4 xs:gap-5 sm:gap-6 md:gap-8 lg:gap-10 px-2 xs:px-3 sm:px-4 md:px-5 lg:px-6 pb-6 w-full max-w-[100vw] overflow-x-hidden">
          
          {/* Header Section */}
          <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-3 xs:gap-4">
            <div className="flex flex-col gap-1 xs:gap-1.5 sm:gap-2">
              <h1 className="text-xl xs:text-2xl sm:text-3xl text-white font-medium tracking-tight">
                Newsletter Subscribers
              </h1>
              <p className="text-text-muted text-[10px] xs:text-xs sm:text-sm tracking-widest uppercase font-light">
                Total: {processedSubscribers.length} subscribers
              </p>
            </div>
            
            {/* Export Button */}
            <button 
              onClick={downloadCSV}
              disabled={processedSubscribers.length === 0}
              className="btn-premium flex items-center justify-center gap-2 text-[10px] xs:text-xs px-3 xs:px-4 py-2 xs:py-3 w-full xs:w-auto disabled:opacity-50"
            >
              <Download size={14} className="xs:w-4 xs:h-4" />
              Export CSV ({processedSubscribers.length})
            </button>
          </div>

          {/* Filters Section */}
          <div className="flex flex-col xs:flex-row gap-2 xs:gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
              <input
                type="text"
                placeholder="Search subscribers by email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-accent border border-glass-border p-2.5 xs:p-3 pl-9 xs:pl-10 text-white focus:outline-none focus:border-primary transition-all text-xs xs:text-sm rounded-lg"
              />
            </div>
            
            {/* Date Filter */}
            <div className="relative">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="w-full xs:w-auto bg-accent border border-glass-border p-2.5 xs:p-3 px-4 text-white flex items-center justify-between gap-2 hover:border-primary transition-all text-xs xs:text-sm rounded-lg min-w-[140px]"
              >
                <span className="flex items-center gap-2">
                  <Calendar size={14} />
                  {dateFilter === 'all' ? 'All Time' : 
                   dateFilter === 'today' ? 'Today' :
                   dateFilter === 'yesterday' ? 'Yesterday' :
                   dateFilter === '7days' ? 'Last 7 Days' :
                   dateFilter === 'month' ? 'Last 30 Days' : 'Last 90 Days'}
                </span>
                <ChevronDown size={14} className={`transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isFilterOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 z-20 glass border border-glass-border rounded-lg overflow-hidden">
                  {[
                    { value: 'all', label: 'All Time' },
                    { value: 'today', label: 'Today' },
                    { value: 'yesterday', label: 'Yesterday' },
                    { value: '7days', label: 'Last 7 Days' },
                    { value: 'month', label: 'Last 30 Days' },
                    { value: '90days', label: 'Last 90 Days' }
                  ].map((filter) => (
                    <button
                      key={filter.value}
                      onClick={() => {
                        setDateFilter(filter.value);
                        setIsFilterOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-xs hover:bg-white/5 transition-colors
                        ${dateFilter === filter.value ? 'text-primary bg-primary/10' : 'text-text-muted'}`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Mobile View - Cards Grid (2 columns) */}
          <div className="block lg:hidden">
            <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 gap-2 xs:gap-3">
              {loading ? (
                Array(6).fill(0).map((_, i) => (
                  <div key={i} className="glass animate-pulse h-[120px] xs:h-[130px] sm:h-[140px] rounded-lg"></div>
                ))
              ) : processedSubscribers.length === 0 ? (
                <div className="col-span-full text-center py-8 xs:py-10 text-text-muted tracking-widest uppercase text-xs xs:text-sm">
                  <Users size={32} className="mx-auto mb-3 opacity-50" />
                  No subscribers found
                </div>
              ) : (
                processedSubscribers.map((subscriber) => (
                  <div 
                    key={subscriber._id} 
                    className="glass p-2 xs:p-3 flex flex-col gap-2 hover:border-primary/30 transition-all rounded-lg"
                  >
                    {/* Email */}
                    <div className="flex items-start gap-2">
                      <div className="w-6 h-6 xs:w-7 xs:h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Mail size={10} className="text-primary" />
                      </div>
                      <span className="text-[9px] xs:text-[10px] text-white font-medium break-all line-clamp-2">
                        {subscriber.email}
                      </span>
                    </div>
                    
                    {/* Date */}
                    <div className="flex items-center gap-1 mt-1">
                      <Calendar size={8} className="text-text-muted" />
                      <span className="text-[7px] xs:text-[8px] text-text-muted uppercase">
                        {formatDate(subscriber.createdAt)}
                      </span>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center justify-end gap-1 mt-1 pt-1 border-t border-glass-border/50">
                      <button 
                        onClick={() => copyEmail(subscriber.email)}
                        className="p-1.5 text-text-muted hover:text-primary transition-all rounded relative"
                        title="Copy email"
                      >
                        {copiedEmail === subscriber.email ? (
                          <CheckCircle size={12} className="text-green-500" />
                        ) : (
                          <Copy size={12} />
                        )}
                      </button>
                      <button 
                        onClick={() => deleteSubscriber(subscriber._id)}
                        className="p-1.5 text-text-muted hover:text-red-500 transition-all rounded"
                        title="Remove"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Desktop View - Table */}
          <div className="hidden lg:block glass overflow-hidden rounded-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-glass-border bg-white/5 uppercase text-[9px] xs:text-[10px] tracking-widest text-text-muted">
                    <th className="p-3 xs:p-4 md:p-5 lg:p-6 font-bold">Email</th>
                    <th className="p-3 xs:p-4 md:p-5 lg:p-6 font-bold">Date Joined</th>
                    <th className="p-3 xs:p-4 md:p-5 lg:p-6 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-glass-border">
                  {loading ? (
                    <tr>
                      <td colSpan={3} className="p-10 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Loader2 size={20} className="text-primary animate-spin" />
                          <span className="text-primary text-xs uppercase tracking-widest">Loading subscribers...</span>
                        </div>
                      </td>
                    </tr>
                  ) : processedSubscribers.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="p-10 text-center text-text-muted tracking-widest uppercase text-xs">
                        <Users size={24} className="mx-auto mb-2 opacity-50" />
                        No subscribers match filters
                      </td>
                    </tr>
                  ) : (
                    processedSubscribers.map((subscriber) => (
                      <tr key={subscriber._id} className="hover:bg-white/5 transition-all">
                        <td className="p-3 xs:p-4 md:p-5 lg:p-6">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <Mail size={14} className="text-primary" />
                            </div>
                            <span className="text-white text-xs sm:text-sm font-medium break-all">
                              {subscriber.email}
                            </span>
                          </div>
                        </td>
                        <td className="p-3 xs:p-4 md:p-5 lg:p-6">
                          <span className="text-[9px] xs:text-[10px] text-text-muted tracking-widest uppercase">
                            {new Date(subscriber.createdAt).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="p-3 xs:p-4 md:p-5 lg:p-6 text-right">
                          <div className="flex gap-2 justify-end">
                            <button 
                              onClick={() => copyEmail(subscriber.email)}
                              className="p-2 text-text-muted hover:text-primary transition-all rounded relative group"
                              title="Copy email"
                            >
                              {copiedEmail === subscriber.email ? (
                                <CheckCircle size={16} className="text-green-500" />
                              ) : (
                                <Copy size={16} />
                              )}
                              {copiedEmail === subscriber.email && (
                                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-green-500 text-black text-[8px] px-2 py-1 rounded whitespace-nowrap">
                                  Copied!
                                </span>
                              )}
                            </button>
                            <button 
                              onClick={() => deleteSubscriber(subscriber._id)}
                              className="p-2 text-text-muted hover:text-red-500 transition-all rounded"
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

          {/* Summary Stats - Mobile Bottom Bar */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 glass border-t border-glass-border p-3 z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users size={16} className="text-primary" />
                <span className="text-xs text-white font-medium">{processedSubscribers.length} Subscribers</span>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={downloadCSV}
                  disabled={processedSubscribers.length === 0}
                  className="btn-premium text-[10px] px-3 py-1.5 flex items-center gap-1 disabled:opacity-50"
                >
                  <Download size={12} />
                  Export
                </button>
              </div>
            </div>
          </div>

          {/* Padding for mobile bottom bar */}
          <div className="lg:hidden h-16"></div>
        </div>
      </DashboardLayout>
    </AdminRoute>
  );
};

export default SubscribersPage;