'use client';

import React, { useState, useEffect } from 'react';
import AdminRoute from '../../components/AdminRoute';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../lib/api';
import { ShoppingBag, Search, Eye, CheckCircle, Truck, XCircle, Clock, X, MessageCircle, Phone, MapPin, User } from 'lucide-react';

const OrdersManagement = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/orders');
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending': return <Clock size={16} className="text-yellow-500" />;
      case 'Processing': return <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />;
      case 'Shipped': return <Truck size={16} className="text-purple-500" />;
      case 'Delivered': return <CheckCircle size={16} className="text-green-500" />;
      case 'Cancelled': return <XCircle size={16} className="text-red-500" />;
      default: return null;
    }
  };

  const openDetails = (order: any) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleWhatsApp = (order: any, specificMessage?: string) => {
    const phone = order.shippingAddress.phone || '';
    let cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '92' + cleanPhone.substring(1);
    }

    let message = '';

    if (specificMessage) {
      message = specificMessage;
    } else {
      const itemsList = order.orderItems.map((item: any) => {
        const variantText = item.variant ? ` [${Object.entries(item.variant).map(([k, v]) => `${k}: ${v}`).join(', ')}]` : '';
        return `${item.name}${variantText} (${item.qty}x)`;
      }).join(', ');
      message = `Hello ${order.shippingAddress.name || 'Customer'},
\n\nThis is iWRIST regarding your Order #${order._id.slice(-8).toUpperCase()}.
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

      const updateMessage = `Hello ${orderData.shippingAddress.name || 'Customer'},
\n\nThis is an update from iWRIST regarding your Order #${orderId.slice(-8).toUpperCase()}.
\n\nYour order status has been updated to: *${newStatus}*.
\n\nThank you for choosing iWRIST!`;
      handleWhatsApp(orderData, updateMessage);
      
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status.');
    }
  };

  return (
    <AdminRoute>
      <DashboardLayout>
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl text-white font-medium">Order Management</h1>
            <p className="text-text-muted text-sm tracking-widest uppercase font-light">Transaction Flow</p>
          </div>

          <div className="glass overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-glass-border bg-white/5 uppercase text-[10px] tracking-widest text-text-muted">
                  <th className="p-6 font-bold">Order ID</th>
                  <th className="p-6 font-bold">Customer</th>
                  <th className="p-6 font-bold">Total</th>
                  <th className="p-6 font-bold">Status</th>
                  <th className="p-6 font-bold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-glass-border">
                {loading ? (
                  <tr><td colSpan={5} className="p-20 text-center text-primary tracking-widest uppercase">Fetching Orders...</td></tr>
                ) : orders.length === 0 ? (
                  <tr><td colSpan={5} className="p-20 text-center text-text-muted tracking-widest uppercase">No orders received yet</td></tr>
                ) : (
                  orders.map((order: any) => (
                    <tr key={order._id} className="hover:bg-white/5 transition-all">
                      <td className="p-6">
                        <span className="text-white text-sm font-bold tracking-tighter">#{order._id.slice(-8).toUpperCase()}</span>
                      </td>
                      <td className="p-6">
                        <div className="flex flex-col">
                          <span className="text-white text-sm font-medium">{order.shippingAddress.name || order.user?.name || 'Guest'}</span>
                          <span className="text-text-muted text-[10px] uppercase">{order.shippingAddress.city}</span>
                        </div>
                      </td>
                      <td className="p-6 text-sm text-white font-bold">Rs. {order.totalPrice.toLocaleString()}</td>
                      <td className="p-6">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(order.status)}
                          <span className={`text-[10px] font-bold uppercase tracking-widest ${order.status === 'Delivered' ? 'text-green-500' : 'text-text-muted'}`}>
                            {order.status}
                          </span>
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => openDetails(order)}
                            className="flex items-center gap-2 text-[10px] tracking-[0.2em] font-bold text-primary hover:opacity-70 transition-all uppercase px-4 py-2 glass"
                          >
                            <Eye size={14} />
                            Details
                          </button>
                          <button 
                            onClick={() => handleWhatsApp(order)}
                            className="w-10 h-10 glass flex items-center justify-center text-green-500 hover:bg-green-500/10 transition-colors"
                            title="Chat on WhatsApp"
                          >
                            <MessageCircle size={18} />
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

        {/* Details Modal */}
        {isModalOpen && selectedOrder && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
            <div className="relative w-full max-w-4xl glass p-10 flex flex-col gap-10 shadow-2xl border border-white/10 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <h2 className="text-2xl text-white font-medium uppercase tracking-widest">Order Details</h2>
                  <span className="text-primary text-[10px] font-bold tracking-[0.3em] uppercase">#{selectedOrder._id.toUpperCase()}</span>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="text-text-muted hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Left: Customer & Shipping */}
                <div className="flex flex-col gap-8">
                   <div className="flex flex-col gap-4">
                      <h4 className="flex items-center gap-2 text-white text-xs font-bold uppercase tracking-widest pb-2 border-b border-glass-border">
                        <User size={14} className="text-primary" />
                        Customer Information
                      </h4>
                      <div className="flex flex-col gap-1">
                        <span className="text-white text-sm font-bold uppercase">{selectedOrder.shippingAddress.name || selectedOrder.user?.name || 'Guest User'}</span>
                        <span className="text-text-muted text-xs">{selectedOrder.user?.email || 'N/A'}</span>
                        <span className="text-text-muted text-xs flex items-center gap-1">
                          <Phone size={14} />
                          {selectedOrder.shippingAddress.phone || 'N/A'}
                        </span>
                      </div>
                   </div>

                   <div className="flex flex-col gap-4">
                      <h4 className="flex items-center gap-2 text-white text-xs font-bold uppercase tracking-widest pb-2 border-b border-glass-border">
                        <MapPin size={14} />
                        Shipping Address
                      </h4>
                      <div className="flex flex-col gap-1 text-text-muted text-xs leading-relaxed">
                        <span>{selectedOrder.shippingAddress.address}</span>
                        <span>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.postalCode}</span>
                        <span>{selectedOrder.shippingAddress.country}</span>
                      </div>
                   </div>

                   <div className="flex flex-col gap-4">
                      <h4 className="flex items-center gap-2 text-white text-xs font-bold uppercase tracking-widest pb-2 border-b border-glass-border">
                        <CheckCircle size={14} className="text-primary" />
                        Order Status
                      </h4>
                      <div className="flex items-center gap-4">
                        <div className="px-4 py-2 glass flex items-center gap-2">
                          {getStatusIcon(selectedOrder.status)}
                          <select 
                            value={selectedOrder.status}
                            onChange={(e) => handleStatusUpdate(selectedOrder._id, e.target.value, selectedOrder)}
                            className="bg-transparent text-[10px] text-white font-bold uppercase tracking-widest focus:outline-none cursor-pointer"
                          >
                            <option className="bg-bg-main" value="Pending">Pending</option>
                            <option className="bg-bg-main" value="Processing">Processing</option>
                            <option className="bg-bg-main" value="Shipped">Shipped</option>
                            <option className="bg-bg-main" value="Delivered">Delivered</option>
                            <option className="bg-bg-main" value="Cancelled">Cancelled</option>
                          </select>
                        </div>
{selectedOrder.isPaid ? (
                          <div className="flex flex-col gap-1">
                            <span className="text-[10px] text-green-500 font-bold uppercase bg-green-500/10 px-3 py-2 rounded-sm border border-green-500/20">Payment Verified</span>
                            {selectedOrder.paymentMethod === 'Stripe' && (
                              <span className="text-xs text-blue-400 font-mono tracking-tight bg-blue-500/5 px-2 py-1 rounded border border-blue-500/20">Online Payment (Stripe)</span>
                            )}
                          </div>
                        ) : (
                          <span className="text-[10px] text-yellow-500 font-bold uppercase bg-yellow-500/10 px-3 py-2 rounded-sm border border-yellow-500/20">
                            {selectedOrder.paymentMethod === 'Stripe' ? 'Online Payment Pending' : 'Cash on Delivery'}
                          </span>
                        )}
                      </div>
                   </div>
                </div>

                {/* Right: Items & Summary */}
                <div className="flex flex-col gap-8">
                   <h4 className="flex items-center gap-2 text-white text-xs font-bold uppercase tracking-widest pb-2 border-b border-glass-border">
                     <ShoppingBag size={14} className="text-primary" />
                     Order Items
                   </h4>
                   <div className="flex flex-col gap-4 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
                     {selectedOrder.orderItems.map((item: any, idx: number) => (
                       <div key={idx} className="flex gap-4 p-3 glass relative group">
                         <div className="w-16 h-16 bg-black flex-shrink-0 overflow-hidden">
                           <img src={item.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                         </div>
                         <div className="flex flex-col justify-center gap-1 flex-1">
                           <span className="text-white text-xs font-bold uppercase truncate max-w-[200px]">{item.name}</span>
                           {item.variant && Object.entries(item.variant).map(([key, val]: any) => (
                             <span key={key} className="text-[9px] text-text-muted uppercase">
                               {key}: <span className="text-white">{val}</span>
                             </span>
                           ))}
                           <div className="flex items-center gap-3">
                              <span className="text-text-muted text-[10px] font-bold tracking-widest uppercase">{item.qty} x Rs. {item.price.toLocaleString()}</span>
                              <span className="text-primary text-[10px] font-bold tracking-widest uppercase italic">TOTAL: Rs. {(item.qty * item.price).toLocaleString()}</span>
                           </div>
                         </div>
                       </div>
                     ))}
                   </div>

                   <div className="mt-4 p-6 glass border-t-2 border-primary/20 flex flex-col gap-3">
                      <div className="flex justify-between text-text-muted text-[10px] uppercase font-bold tracking-widest">
                        <span>Subtotal</span>
                        <span>Rs. {(selectedOrder.itemsPrice || 0).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-text-muted text-[10px] uppercase font-bold tracking-widest">
                        <span>Shipping</span>
                        <span>Rs. {(selectedOrder.shippingPrice || 0).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center mt-2 pt-3 border-t border-glass-border">
                        <span className="text-white text-sm font-bold uppercase tracking-widest">Total Revenue</span>
                        <span className="text-primary text-xl font-black">Rs. {(selectedOrder.totalPrice || 0).toLocaleString()}</span>
                      </div>
                   </div>

                   <button 
                    onClick={() => handleWhatsApp(selectedOrder)}
                    className="btn-premium py-4 flex items-center justify-center gap-3"
                   >
                     <MessageCircle size={18} />
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
