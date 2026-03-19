'use client';

import React, { useState, useEffect } from 'react';
import AdminRoute from '../../components/AdminRoute';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../lib/api';
import { 
  ShoppingBag, Search, Eye, CheckCircle, Truck, XCircle, Clock, X, 
  MessageCircle, Phone, MapPin, User, Loader2, Filter, ChevronDown 
} from 'lucide-react';

const OrdersManagement = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/orders');
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending': return <Clock size={14} className="text-yellow-500" />;
      case 'processing': return <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />;
      case 'shipped': return <Truck size={14} className="text-purple-500" />;
      case 'delivered': return <CheckCircle size={14} className="text-green-500" />;
      case 'cancelled': return <XCircle size={14} className="text-red-500" />;
      default: return <Clock size={14} className="text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'processing': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      case 'shipped': return 'text-purple-500 bg-purple-500/10 border-purple-500/20';
      case 'delivered': return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'cancelled': return 'text-red-500 bg-red-500/10 border-red-500/20';
      default: return 'text-gray-500 bg-gray-500/10 border-gray-500/20';
    }
  };

  const openDetails = (order: any) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleWhatsApp = (order: any, specificMessage?: string) => {
    const phone = order.shippingAddress?.phone || '';
    if (!phone) {
      alert('No phone number available');
      return;
    }
    
    let cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '92' + cleanPhone.substring(1);
    }

    let message = '';

    if (specificMessage) {
      message = specificMessage;
    } else {
      const itemsList = order.orderItems?.map((item: any) => {
        const variantText = item.variant ? ` [${Object.entries(item.variant).map(([k, v]) => `${k}: ${v}`).join(', ')}]` : '';
        return `${item.name}${variantText} (${item.qty}x)`;
      }).join(', ') || '';
      
      message = `Hello ${order.shippingAddress?.name || 'Customer'},
\n\nThis is iWRIST regarding your Order #${order._id?.slice(-8).toUpperCase() || 'N/A'}.
\n\nItems: ${itemsList}
\nTotal: Rs. ${(order.totalPrice || 0).toLocaleString()}
\nDelivery: 3-5 Days
\n\nPlease confirm if this order is correct?`;
    }

    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string, orderData: any) => {
    if (!confirm(`Are you sure you want to change the status to ${newStatus}?`)) return;
    
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      
      setOrders(orders.map((o: any) => o._id === orderId ? { ...o, status: newStatus } : o));
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }

      const updateMessage = `Hello ${orderData.shippingAddress?.name || 'Customer'},
\n\nThis is an update from iWRIST regarding your Order #${orderId.slice(-8).toUpperCase()}.
\n\nYour order status has been updated to: *${newStatus}*.
\n\nThank you for choosing iWRIST!`;
      handleWhatsApp(orderData, updateMessage);
      
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status.');
    }
  };

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.shippingAddress?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.shippingAddress?.city?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status?.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  return (
    <AdminRoute>
      <DashboardLayout>
        <div className="flex flex-col gap-4 xs:gap-5 sm:gap-6 md:gap-8 lg:gap-10 px-2 xs:px-3 sm:px-4 md:px-5 lg:px-6 pb-6 w-full max-w-[100vw] overflow-x-hidden">
          
          {/* Header Section */}
          <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-3 xs:gap-4">
            <div className="flex flex-col gap-1 xs:gap-1.5 sm:gap-2">
              <h1 className="text-xl xs:text-2xl sm:text-3xl text-white font-medium tracking-tight">
                Order Management
              </h1>
              <p className="text-text-muted text-[10px] xs:text-xs sm:text-sm tracking-widest uppercase font-light">
                Transaction Flow
              </p>
            </div>
            
            {/* Stats Badge */}
            <div className="glass px-3 xs:px-4 py-2 xs:py-2.5 flex items-center gap-2 w-full xs:w-auto">
              <ShoppingBag size={14} className="text-primary" />
              <span className="text-xs xs:text-sm text-white font-medium">
                {filteredOrders.length} Orders
              </span>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="flex flex-col xs:flex-row gap-2 xs:gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
              <input
                type="text"
                placeholder="Search by Order ID, Customer, City..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-accent border border-glass-border p-2.5 xs:p-3 pl-9 xs:pl-10 text-white focus:outline-none focus:border-primary transition-all text-xs xs:text-sm rounded-lg"
              />
            </div>
            
            {/* Filter Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="w-full xs:w-auto bg-accent border border-glass-border p-2.5 xs:p-3 px-4 text-white flex items-center justify-between gap-2 hover:border-primary transition-all text-xs xs:text-sm rounded-lg min-w-[120px]"
              >
                <span className="flex items-center gap-2">
                  <Filter size={14} />
                  {statusFilter === 'all' ? 'All Orders' : statusFilter}
                </span>
                <ChevronDown size={14} className={`transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isFilterOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 z-20 glass border border-glass-border rounded-lg overflow-hidden">
                  {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
                    <button
                      key={status}
                      onClick={() => {
                        setStatusFilter(status);
                        setIsFilterOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-xs hover:bg-white/5 transition-colors capitalize
                        ${statusFilter === status ? 'text-primary bg-primary/10' : 'text-text-muted'}`}
                    >
                      {status === 'all' ? 'All Orders' : status}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Orders Grid - Cards for mobile, Table for larger screens */}
          <div className="block lg:hidden">
            {/* Mobile View - Card Grid (2 columns) */}
            <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 gap-2 xs:gap-3">
              {loading ? (
                Array(6).fill(0).map((_, i) => (
                  <div key={i} className="glass animate-pulse h-[180px] xs:h-[200px] rounded-lg"></div>
                ))
              ) : filteredOrders.length === 0 ? (
                <div className="col-span-full text-center py-8 xs:py-10 text-text-muted tracking-widest uppercase text-xs xs:text-sm">
                  <ShoppingBag size={32} className="mx-auto mb-3 opacity-50" />
                  No orders found
                </div>
              ) : (
                filteredOrders.map((order: any) => (
                  <div key={order._id} className="glass p-2 xs:p-3 flex flex-col gap-2 hover:border-primary/30 transition-all rounded-lg">
                    {/* Order Header */}
                    <div className="flex items-start justify-between">
                      <span className="text-[9px] xs:text-[10px] text-primary font-bold tracking-tighter">
                        #{order._id?.slice(-8).toUpperCase()}
                      </span>
                      <span className={`text-[7px] xs:text-[8px] px-1.5 py-0.5 rounded-full uppercase font-bold ${getStatusColor(order.status)}`}>
                        {order.status || 'Pending'}
                      </span>
                    </div>
                    
                    {/* Customer Info */}
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] xs:text-xs text-white font-medium truncate">
                        {order.shippingAddress?.name || order.user?.name || 'Guest'}
                      </span>
                      <span className="text-[8px] xs:text-[9px] text-text-muted truncate">
                        {order.shippingAddress?.city || 'N/A'}
                      </span>
                    </div>
                    
                    {/* Amount */}
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[9px] xs:text-[10px] text-text-muted">Total</span>
                      <span className="text-[10px] xs:text-xs font-bold text-white">
                        Rs. {order.totalPrice?.toLocaleString() || 0}
                      </span>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center gap-1 mt-1">
                      <button 
                        onClick={() => openDetails(order)}
                        className="flex-1 p-1.5 glass text-text-muted hover:text-primary transition-all text-center rounded flex items-center justify-center gap-1"
                      >
                        <Eye size={10} />
                        <span className="text-[7px] xs:text-[8px] uppercase">View</span>
                      </button>
                      <button 
                        onClick={() => handleWhatsApp(order)}
                        className="p-1.5 glass text-green-500 hover:bg-green-500/10 transition-all rounded"
                        title="WhatsApp"
                      >
                        <MessageCircle size={12} />
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
                    <th className="p-3 xs:p-4 md:p-5 lg:p-6 font-bold">Order ID</th>
                    <th className="p-3 xs:p-4 md:p-5 lg:p-6 font-bold">Customer</th>
                    <th className="p-3 xs:p-4 md:p-5 lg:p-6 font-bold">Total</th>
                    <th className="p-3 xs:p-4 md:p-5 lg:p-6 font-bold">Status</th>
                    <th className="p-3 xs:p-4 md:p-5 lg:p-6 font-bold">Payment</th>
                    <th className="p-3 xs:p-4 md:p-5 lg:p-6 font-bold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-glass-border">
                  {loading ? (
                    <tr><td colSpan={6} className="p-10 text-center text-primary tracking-widest uppercase">Loading...</td></tr>
                  ) : filteredOrders.length === 0 ? (
                    <tr><td colSpan={6} className="p-10 text-center text-text-muted tracking-widest uppercase">No orders found</td></tr>
                  ) : (
                    filteredOrders.map((order: any) => (
                      <tr key={order._id} className="hover:bg-white/5 transition-all">
                        <td className="p-3 xs:p-4 md:p-5 lg:p-6">
                          <span className="text-white text-xs sm:text-sm font-bold tracking-tighter">
                            #{order._id?.slice(-8).toUpperCase()}
                          </span>
                        </td>
                        <td className="p-3 xs:p-4 md:p-5 lg:p-6">
                          <div className="flex flex-col">
                            <span className="text-white text-xs sm:text-sm font-medium">
                              {order.shippingAddress?.name || order.user?.name || 'Guest'}
                            </span>
                            <span className="text-text-muted text-[9px] xs:text-[10px] uppercase">
                              {order.shippingAddress?.city || 'N/A'}
                            </span>
                          </div>
                        </td>
                        <td className="p-3 xs:p-4 md:p-5 lg:p-6 text-xs sm:text-sm text-white font-bold">
                          Rs. {order.totalPrice?.toLocaleString() || 0}
                        </td>
                        <td className="p-3 xs:p-4 md:p-5 lg:p-6">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(order.status)}
                            <span className={`text-[9px] xs:text-[10px] font-bold uppercase tracking-widest ${
                              order.status?.toLowerCase() === 'delivered' ? 'text-green-500' : 'text-text-muted'
                            }`}>
                              {order.status || 'Pending'}
                            </span>
                          </div>
                        </td>
                        <td className="p-3 xs:p-4 md:p-5 lg:p-6">
                          <span className={`text-[8px] xs:text-[9px] font-bold px-2 py-1 rounded-sm uppercase ${
                            order.isPaid 
                              ? 'text-green-500 bg-green-500/10 border border-green-500/20' 
                              : 'text-yellow-500 bg-yellow-500/10 border border-yellow-500/20'
                          }`}>
                            {order.isPaid ? 'Paid' : 'Unpaid'}
                          </span>
                        </td>
                        <td className="p-3 xs:p-4 md:p-5 lg:p-6">
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => openDetails(order)}
                              className="flex items-center gap-1 text-[8px] xs:text-[9px] tracking-[0.2em] font-bold text-primary hover:opacity-70 transition-all uppercase px-2 xs:px-3 py-1.5 glass rounded"
                            >
                              <Eye size={12} />
                              Details
                            </button>
                            <button 
                              onClick={() => handleWhatsApp(order)}
                              className="w-7 h-7 xs:w-8 xs:h-8 glass flex items-center justify-center text-green-500 hover:bg-green-500/10 transition-colors rounded"
                              title="Chat on WhatsApp"
                            >
                              <MessageCircle size={14} />
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
        </div>

        {/* Details Modal - Fully Responsive */}
        {isModalOpen && selectedOrder && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 xs:p-3 sm:p-4 md:p-6 bg-black/50 backdrop-blur-sm overflow-y-auto">
            <div className="absolute inset-0" onClick={() => setIsModalOpen(false)}></div>
            <div className="relative w-full max-w-4xl my-4 xs:my-6 glass p-3 xs:p-4 sm:p-5 md:p-6 lg:p-8 rounded-2xl shadow-2xl border border-white/10 max-h-[95vh] overflow-y-auto">
              
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-4 xs:mb-5 sm:mb-6 md:mb-8 sticky top-0 bg-accent/90 backdrop-blur-sm z-10 -mt-2 pt-2 pb-2">
                <div className="flex flex-col gap-0.5 xs:gap-1">
                  <h2 className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl text-white font-medium uppercase tracking-widest">
                    Order Details
                  </h2>
                  <span className="text-primary text-[8px] xs:text-[9px] sm:text-[10px] font-bold tracking-[0.2em] uppercase">
                    #{selectedOrder._id?.toUpperCase() || 'N/A'}
                  </span>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)} 
                  className="text-text-muted hover:text-white transition-colors p-1.5 xs:p-2 rounded-lg hover:bg-white/5"
                >
                  <X size={16} className="xs:w-5 xs:h-5" />
                </button>
              </div>

              {/* Modal Content - Stack on mobile, grid on larger */}
              <div className="flex flex-col lg:grid lg:grid-cols-2 gap-4 xs:gap-5 sm:gap-6 md:gap-8">
                
                {/* Left Column */}
                <div className="flex flex-col gap-4 xs:gap-5 sm:gap-6">
                  {/* Customer Info */}
                  <div className="flex flex-col gap-2 xs:gap-3">
                    <h4 className="flex items-center gap-2 text-white text-[10px] xs:text-xs font-bold uppercase tracking-widest pb-2 border-b border-glass-border">
                      <User size={12} className="text-primary" />
                      Customer Information
                    </h4>
                    <div className="flex flex-col gap-1">
                      <span className="text-white text-xs xs:text-sm font-bold uppercase">
                        {selectedOrder.shippingAddress?.name || selectedOrder.user?.name || 'Guest User'}
                      </span>
                      <span className="text-text-muted text-[10px] xs:text-xs">
                        {selectedOrder.user?.email || 'N/A'}
                      </span>
                      <span className="text-text-muted text-[10px] xs:text-xs flex items-center gap-1">
                        <Phone size={12} />
                        {selectedOrder.shippingAddress?.phone || 'N/A'}
                      </span>
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div className="flex flex-col gap-2 xs:gap-3">
                    <h4 className="flex items-center gap-2 text-white text-[10px] xs:text-xs font-bold uppercase tracking-widest pb-2 border-b border-glass-border">
                      <MapPin size={12} />
                      Shipping Address
                    </h4>
                    <div className="flex flex-col gap-1 text-text-muted text-[10px] xs:text-xs leading-relaxed">
                      <span>{selectedOrder.shippingAddress?.address}</span>
                      <span>{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.postalCode}</span>
                      <span>{selectedOrder.shippingAddress?.country}</span>
                    </div>
                  </div>

                  {/* Order Status */}
                  <div className="flex flex-col gap-2 xs:gap-3">
                    <h4 className="flex items-center gap-2 text-white text-[10px] xs:text-xs font-bold uppercase tracking-widest pb-2 border-b border-glass-border">
                      <CheckCircle size={12} className="text-primary" />
                      Order Status
                    </h4>
                    <div className="flex flex-col xs:flex-row gap-2 xs:gap-3">
                      <div className="flex-1 px-3 py-2 glass flex items-center gap-2 rounded-lg">
                        {getStatusIcon(selectedOrder.status)}
                        <select 
                          value={selectedOrder.status || 'Pending'}
                          onChange={(e) => handleStatusUpdate(selectedOrder._id, e.target.value, selectedOrder)}
                          className="bg-transparent text-[9px] xs:text-[10px] text-white font-bold uppercase tracking-widest focus:outline-none cursor-pointer w-full"
                        >
                          <option className="bg-bg-main" value="Pending">Pending</option>
                          <option className="bg-bg-main" value="Processing">Processing</option>
                          <option className="bg-bg-main" value="Shipped">Shipped</option>
                          <option className="bg-bg-main" value="Delivered">Delivered</option>
                          <option className="bg-bg-main" value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                      <div className="flex-1">
                        {selectedOrder.isPaid ? (
                          <div className="px-3 py-2 bg-green-500/10 border border-green-500/20 rounded-lg">
                            <span className="text-[9px] xs:text-[10px] text-green-500 font-bold uppercase block">
                              Payment Verified
                            </span>
                            {selectedOrder.paymentMethod && (
                              <span className="text-[8px] xs:text-[9px] text-blue-400 mt-1 block">
                                {selectedOrder.paymentMethod === 'Stripe' ? 'Online Payment' : 'Cash on Delivery'}
                              </span>
                            )}
                          </div>
                        ) : (
                          <div className="px-3 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                            <span className="text-[9px] xs:text-[10px] text-yellow-500 font-bold uppercase block">
                              Payment Pending
                            </span>
                            {selectedOrder.paymentMethod && (
                              <span className="text-[8px] xs:text-[9px] text-text-muted mt-1 block">
                                {selectedOrder.paymentMethod}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="flex flex-col gap-4 xs:gap-5 sm:gap-6">
                  {/* Order Items */}
                  <h4 className="flex items-center gap-2 text-white text-[10px] xs:text-xs font-bold uppercase tracking-widest pb-2 border-b border-glass-border">
                    <ShoppingBag size={12} className="text-primary" />
                    Order Items
                  </h4>
                  
                  <div className="flex flex-col gap-2 xs:gap-3 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                    {selectedOrder.orderItems?.map((item: any, idx: number) => (
                      <div key={idx} className="flex gap-2 xs:gap-3 p-2 xs:p-3 glass rounded-lg hover:border-primary/30 transition-all">
                        <div className="w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 bg-black flex-shrink-0 overflow-hidden rounded-lg">
                          <img 
                            src={item.image || '/placeholder.jpg'} 
                            alt={item.name} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <div className="flex flex-col justify-center gap-0.5 xs:gap-1 flex-1 min-w-0">
                          <span className="text-white text-[10px] xs:text-xs font-bold uppercase truncate">
                            {item.name}
                          </span>
                          {item.variant && Object.entries(item.variant).map(([key, val]: any) => (
                            <span key={key} className="text-[7px] xs:text-[8px] text-text-muted uppercase">
                              {key}: <span className="text-white">{val}</span>
                            </span>
                          ))}
                          <div className="flex flex-col xs:flex-row xs:items-center gap-1 xs:gap-2 mt-0.5">
                            <span className="text-text-muted text-[8px] xs:text-[9px] font-bold tracking-widest uppercase">
                              {item.qty} x Rs. {item.price?.toLocaleString()}
                            </span>
                            <span className="text-primary text-[8px] xs:text-[9px] font-bold tracking-widest uppercase">
                              = Rs. {(item.qty * item.price).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Summary */}
                  <div className="mt-2 p-3 xs:p-4 glass rounded-lg flex flex-col gap-2">
                    <div className="flex justify-between text-text-muted text-[8px] xs:text-[9px] uppercase font-bold tracking-widest">
                      <span>Subtotal</span>
                      <span>Rs. {(selectedOrder.itemsPrice || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-text-muted text-[8px] xs:text-[9px] uppercase font-bold tracking-widest">
                      <span>Shipping</span>
                      <span>Rs. {(selectedOrder.shippingPrice || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center mt-2 pt-2 border-t border-glass-border">
                      <span className="text-white text-[10px] xs:text-xs font-bold uppercase tracking-widest">
                        Total
                      </span>
                      <span className="text-primary text-sm xs:text-base font-black">
                        Rs. {(selectedOrder.totalPrice || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* WhatsApp Button */}
                  <button 
                    onClick={() => handleWhatsApp(selectedOrder)}
                    className="btn-premium py-2 xs:py-3 flex items-center justify-center gap-2 text-xs xs:text-sm rounded-lg"
                  >
                    <MessageCircle size={14} />
                    CONTACT VIA WHATSAPP
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </DashboardLayout>
    </AdminRoute>
  );
};

export default OrdersManagement;