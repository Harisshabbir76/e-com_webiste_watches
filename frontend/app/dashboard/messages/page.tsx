'use client';

import React, { useState, useEffect } from 'react';
import AdminRoute from '../../components/AdminRoute';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../lib/api';
import { 
  MessageCircle, Mail, User, Clock, Reply, Trash2, Search, 
  ExternalLink, X, Download, Filter, ChevronDown, Loader2, CheckCircle, AlertCircle 
} from 'lucide-react';
import DateFilters from '../../components/DateFilters';

interface MessageType {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isReplied: boolean;
  createdAt: string;
}

const MessagesPage = () => {
  const [messages, setMessages] = useState<MessageType[]>([]); 
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedMessage, setSelectedMessage] = useState<MessageType | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/messages');
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterByDate = (msgs: MessageType[]) => {
    if (dateFilter === 'all') return msgs;
    
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    return msgs.filter((msg: MessageType) => {
      const msgDate = new Date(msg.createdAt);
      
      switch (dateFilter) {
        case 'today':
          return msgDate >= today;
        case 'yesterday':
          const yesterday = new Date(today);
          yesterday.setDate(yesterday.getDate() - 1);
          return msgDate >= yesterday && msgDate < today;
        case '7days':
          const sevenDaysAgo = new Date(today);
          sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
          return msgDate >= sevenDaysAgo;
        case 'month':
          const lastMonth = new Date(today);
          lastMonth.setMonth(lastMonth.getMonth() - 1);
          return msgDate >= lastMonth;
        case '90days':
          const ninetyDaysAgo = new Date(today);
          ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
          return msgDate >= ninetyDaysAgo;
        default:
          return true;
      }
    });
  };

  const handleReply = async () => {
    if (!replyText.trim() || !selectedMessage) return;
    try {
      await api.post(`/messages/${selectedMessage._id}/reply`, { reply: replyText });
      fetchMessages();
      setSelectedMessage(null);
      setReplyText('');
    } catch (error) {
      console.error('Error sending reply:', error);
    }
  };

  const filteredMessages = filterByDate(messages).filter((msg: MessageType) => 
    msg.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.subject?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pendingCount = filteredMessages.filter(msg => !msg.isReplied).length;
  const repliedCount = filteredMessages.filter(msg => msg.isReplied).length;

  // Format date
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
                Messages & Inquiries
              </h1>
              <p className="text-text-muted text-[10px] xs:text-xs sm:text-sm tracking-widest uppercase font-light">
                Total: {filteredMessages.length} | Pending: <span className="text-primary">{pendingCount}</span> | Replied: <span className="text-green-500">{repliedCount}</span>
              </p>
            </div>
            
            {/* Stats Cards - Visible on larger screens */}
            <div className="hidden sm:flex items-center gap-2">
              <div className="glass px-3 py-2 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                <span className="text-xs text-white">{pendingCount} Pending</span>
              </div>
              <div className="glass px-3 py-2 flex items-center gap-2">
                <CheckCircle size={12} className="text-green-500" />
                <span className="text-xs text-white">{repliedCount} Replied</span>
              </div>
            </div>
          </div>

          {/* Filters Section */}
          <div className="flex flex-col xs:flex-row gap-2 xs:gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
              <input
                type="text"
                placeholder="Search by name, email or subject..."
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
                  <Clock size={14} />
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
                  <div key={i} className="glass animate-pulse h-[160px] xs:h-[180px] rounded-lg"></div>
                ))
              ) : filteredMessages.length === 0 ? (
                <div className="col-span-full text-center py-8 xs:py-10 text-text-muted tracking-widest uppercase text-xs xs:text-sm">
                  <MessageCircle size={32} className="mx-auto mb-3 opacity-50" />
                  No messages found
                </div>
              ) : (
                filteredMessages.map((message: MessageType) => (
                  <div 
                    key={message._id} 
                    className="glass p-2 xs:p-3 flex flex-col gap-2 hover:border-primary/30 transition-all cursor-pointer rounded-lg"
                    onClick={() => setSelectedMessage(message)}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 xs:w-7 xs:h-7 rounded-full bg-primary/10 flex items-center justify-center">
                          <User size={10} className="text-primary" />
                        </div>
                        <span className="text-[9px] xs:text-[10px] text-white font-medium truncate max-w-[80px]">
                          {message.name}
                        </span>
                      </div>
                      <span className={`text-[6px] xs:text-[7px] px-1.5 py-0.5 rounded-full uppercase font-bold ${
                        message.isReplied 
                          ? 'text-green-500 bg-green-500/10 border border-green-500/20' 
                          : 'text-primary bg-primary/10 border border-primary/20'
                      }`}>
                        {message.isReplied ? 'Replied' : 'Pending'}
                      </span>
                    </div>
                    
                    {/* Subject */}
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[8px] xs:text-[9px] text-text-muted uppercase">Subject</span>
                      <span className="text-[9px] xs:text-[10px] text-white line-clamp-2">
                        {message.subject}
                      </span>
                    </div>
                    
                    {/* Email & Date */}
                    <div className="flex flex-col gap-0.5 mt-auto pt-1">
                      <span className="text-[7px] xs:text-[8px] text-text-muted truncate">
                        {message.email}
                      </span>
                      <span className="text-[6px] xs:text-[7px] text-text-muted uppercase">
                        {formatDate(message.createdAt)}
                      </span>
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
                    <th className="p-3 xs:p-4 md:p-5 lg:p-6 font-bold">Customer</th>
                    <th className="p-3 xs:p-4 md:p-5 lg:p-6 font-bold">Subject</th>
                    <th className="p-3 xs:p-4 md:p-5 lg:p-6 font-bold">Date</th>
                    <th className="p-3 xs:p-4 md:p-5 lg:p-6 font-bold">Status</th>
                    <th className="p-3 xs:p-4 md:p-5 lg:p-6 font-bold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-glass-border">
                  {loading ? (
                    <tr><td colSpan={5} className="p-10 text-center text-primary tracking-widest uppercase">Loading...</td></tr>
                  ) : filteredMessages.length === 0 ? (
                    <tr><td colSpan={5} className="p-10 text-center text-text-muted tracking-widest uppercase">No messages found</td></tr>
                  ) : (
                    filteredMessages.map((message: MessageType) => (
                      <tr key={message._id} className="hover:bg-white/5 transition-all cursor-pointer" onClick={() => setSelectedMessage(message)}>
                        <td className="p-3 xs:p-4 md:p-5 lg:p-6">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 xs:w-9 xs:h-9 rounded-full bg-primary/10 flex items-center justify-center">
                              <User size={14} className="text-primary" />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-white text-xs sm:text-sm font-medium">{message.name}</span>
                              <span className="text-text-muted text-[9px] xs:text-[10px] uppercase tracking-widest">{message.email}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-3 xs:p-4 md:p-5 lg:p-6">
                          <span className="text-text-muted text-xs sm:text-sm line-clamp-1">{message.subject}</span>
                        </td>
                        <td className="p-3 xs:p-4 md:p-5 lg:p-6">
                          <span className="text-[9px] xs:text-[10px] text-text-muted tracking-widest uppercase">
                            {formatDate(message.createdAt)}
                          </span>
                        </td>
                        <td className="p-3 xs:p-4 md:p-5 lg:p-6">
                          <span className={`text-[8px] xs:text-[9px] font-bold px-2 py-1 uppercase tracking-widest rounded-sm ${
                            message.isReplied 
                              ? 'text-green-500 bg-green-500/10 border border-green-500/20' 
                              : 'text-primary bg-primary/10 border border-primary/20'
                          }`}>
                            {message.isReplied ? 'Replied' : 'Pending'}
                          </span>
                        </td>
                        <td className="p-3 xs:p-4 md:p-5 lg:p-6 text-right">
                          <button 
                            className="text-primary hover:opacity-70 transition-all text-[9px] xs:text-[10px] uppercase tracking-widest font-bold flex items-center gap-1 ml-auto"
                          >
                            View <ExternalLink size={12} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Reply Modal - Fully Responsive */}
          {selectedMessage && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 xs:p-3 sm:p-4 md:p-6 bg-black/50 backdrop-blur-sm overflow-y-auto">
              <div className="absolute inset-0" onClick={() => setSelectedMessage(null)}></div>
              <div className="relative w-full max-w-3xl my-4 xs:my-6 glass p-3 xs:p-4 sm:p-5 md:p-6 lg:p-8 rounded-2xl shadow-2xl border border-white/10 max-h-[95vh] overflow-y-auto">
                
                {/* Modal Header */}
                <div className="flex items-center justify-between mb-4 xs:mb-5 sm:mb-6 md:mb-8 sticky top-0 bg-accent/90 backdrop-blur-sm z-10 -mt-2 pt-2 pb-2">
                  <div className="flex flex-col gap-0.5 xs:gap-1">
                    <h2 className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl text-white font-medium uppercase tracking-widest">
                      Reply to Message
                    </h2>
                    <span className="text-primary text-[8px] xs:text-[9px] sm:text-[10px] font-bold tracking-[0.2em] uppercase">
                      {selectedMessage.email}
                    </span>
                  </div>
                  <button 
                    onClick={() => setSelectedMessage(null)} 
                    className="text-text-muted hover:text-white transition-colors p-1.5 xs:p-2 rounded-lg hover:bg-white/5"
                  >
                    <X size={16} className="xs:w-5 xs:h-5" />
                  </button>
                </div>

                {/* Message Details */}
                <div className="space-y-3 xs:space-y-4 mb-4 xs:mb-5 sm:mb-6 md:mb-8">
                  {/* Customer Info */}
                  <div className="flex flex-col xs:flex-row xs:items-center gap-2 xs:gap-4 p-3 xs:p-4 glass rounded-lg">
                    <div className="flex items-center gap-2">
                      <User size={12} className="text-primary" />
                      <span className="text-white text-xs xs:text-sm font-medium">{selectedMessage.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail size={12} className="text-text-muted" />
                      <span className="text-text-muted text-[10px] xs:text-xs">{selectedMessage.email}</span>
                    </div>
                  </div>

                  {/* Subject & Date */}
                  <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-2 p-3 xs:p-4 glass rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-primary text-[8px] xs:text-[9px] font-bold uppercase tracking-widest">Subject:</span>
                      <span className="text-white text-[10px] xs:text-xs">{selectedMessage.subject}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={10} className="text-text-muted" />
                      <span className="text-text-muted text-[8px] xs:text-[9px] uppercase">
                        {new Date(selectedMessage.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Message Content */}
                  <div className="p-3 xs:p-4 glass rounded-lg">
                    <p className="text-text-muted text-xs xs:text-sm leading-relaxed">
                      {selectedMessage.message}
                    </p>
                  </div>
                </div>

                {/* Reply Section */}
                <div className="flex flex-col gap-3">
                  <label className="text-[8px] xs:text-[9px] sm:text-[10px] text-text-muted uppercase tracking-widest font-bold">
                    Your Reply
                  </label>
                  <div className="flex flex-col xs:flex-row gap-2 xs:gap-3">
                    <textarea 
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Type your reply here..."
                      className="flex-1 bg-accent border border-glass-border p-2 xs:p-3 text-white focus:outline-none focus:border-primary transition-all text-xs xs:text-sm rounded-lg resize-none min-h-[100px] xs:min-h-[120px]"
                    />
                    <div className="flex xs:flex-col gap-2">
                      <button 
                        onClick={handleReply}
                        disabled={!replyText.trim()}
                        className="btn-premium px-3 xs:px-4 py-2 xs:py-3 flex items-center justify-center gap-2 text-xs whitespace-nowrap disabled:opacity-50 rounded-lg flex-1"
                      >
                        <Reply size={12} />
                        <span className="hidden xs:inline">Send</span>
                        <span className="xs:hidden">Send</span>
                      </button>
                      <button 
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this message?')) {
                            // Delete logic here
                          }
                        }}
                        className="px-3 xs:px-4 py-2 xs:py-3 flex items-center justify-center gap-2 text-xs bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500/20 transition-all rounded-lg flex-1"
                      >
                        <Trash2 size={12} />
                        <span className="hidden xs:inline">Delete</span>
                        <span className="xs:hidden">Del</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </DashboardLayout>
    </AdminRoute>
  );
};

export default MessagesPage;