'use client';

import React, { useState, useEffect } from 'react';
import AdminRoute from '../../components/AdminRoute';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../lib/api';
import { MessageCircle, Mail, User, Clock, Reply, Trash2, Search, ExternalLink, X, Download } from 'lucide-react';
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

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/messages');
      setMessages(data);
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
    msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );



  const pendingCount = filteredMessages.filter(msg => !msg.isReplied).length;

  return (
    <AdminRoute>
      <DashboardLayout>
        <div className="flex flex-col gap-10">
          <div className="flex justify-between items-center">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl text-white font-medium">Messages & Inquiries</h1>
              <p className="text-text-muted text-sm tracking-widest uppercase font-light">
                Total: {filteredMessages.length} | Pending: <span className="text-primary">{pendingCount}</span>
              </p>
            </div>
          </div>

          <div className="flex gap-6 items-center">
            <DateFilters value={dateFilter} onChange={setDateFilter} />
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
            <input
              type="text"
              placeholder="Search by name, email or subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-accent border border-glass-border p-4 pl-12 text-white focus:outline-none focus:border-primary transition-all text-sm"
            />
          </div>

          {/* Messages Table */}
          <div className="glass overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-glass-border bg-white/5 uppercase text-[10px] tracking-widest text-text-muted">
                  <th className="p-6 font-bold">Customer</th>
                  <th className="p-6 font-bold">Subject</th>
                  <th className="p-6 font-bold">Date</th>
                  <th className="p-6 font-bold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-glass-border">
                {loading ? (
                  <tr><td colSpan={4} className="p-20 text-center text-primary tracking-widest uppercase animate-pulse">Loading messages...</td></tr>
                ) : filteredMessages.length === 0 ? (
                  <tr><td colSpan={4} className="p-20 text-center text-text-muted tracking-widest uppercase">No messages match filters</td></tr>
                ) : (
                  filteredMessages.map((message: MessageType) => (
                    <tr key={message._id} className="hover:bg-white/5 transition-all cursor-pointer group" onClick={() => setSelectedMessage(message)}>
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <User size={16} className="text-primary" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-white text-sm font-medium">{message.name}</span>
                            <span className="text-text-muted text-[10px] uppercase tracking-widest">{message.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-6 text-sm text-text-muted">
                        {message.subject}
                      </td>
                      <td className="p-6 text-[10px] text-text-muted tracking-widest uppercase">
                        {new Date(message.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-6 text-right">
                        <span className={`text-[10px] font-bold px-3 py-1 uppercase tracking-widest glass ${
                          message.isReplied ? 'text-green-500' : 'text-primary'
                        }`}>
                          {message.isReplied ? 'Replied' : 'Pending'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Reply Modal */}
          {selectedMessage && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
              <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedMessage(null)}></div>
              <div className="relative w-full max-w-2xl glass p-8 max-h-[80vh] overflow-y-auto">
                <div className="flex justify-between items-start mb-8">
                  <h3 className="text-2xl text-white uppercase tracking-widest">Reply to {selectedMessage.name}</h3>
                  <button onClick={() => setSelectedMessage(null)} className="text-text-muted hover:text-white">
                    <X size={24} />
                  </button>
                </div>
                <div className="space-y-4 mb-8 p-6 glass mb-6">
                  <div className="flex gap-4 text-sm">
                    <span className="text-primary font-bold uppercase tracking-widest text-[10px]">Subject:</span>
                    <span>{selectedMessage.subject}</span>
                  </div>
                  <div className="flex gap-4 text-sm">
                    <span className="text-primary font-bold uppercase tracking-widest text-[10px]">From:</span>
                    <span>{selectedMessage.email}</span>
                  </div>
                  <div className="text-text-muted leading-relaxed">{selectedMessage.message}</div>
                </div>
                <div className="flex gap-4">
                  <textarea 
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your reply..."
                    className="flex-1 bg-accent border border-glass-border p-4 text-white focus:outline-none focus:border-primary resize-vertical min-h-[120px] text-sm"
                  />
                  <button 
                    onClick={handleReply}
                    disabled={!replyText.trim()}
                    className="btn-premium px-8 flex items-center gap-2 whitespace-nowrap disabled:opacity-50"
                  >
                    <Reply size={16} />
                    Send Reply
                  </button>
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

