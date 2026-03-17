'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Container from '../../components/Container';
import api from '../../lib/api';
import { CheckCircle, Package, Truck, MapPin, CreditCard, ShoppingBag, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const OrderConfirmationPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await api.get(`/orders/${id}`);
        setOrder(data);
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) return <div className="min-h-screen bg-bg-main pt-32 flex items-center justify-center text-primary tracking-widest uppercase">Verifying Acquisition...</div>;
  if (!order) return <div className="min-h-screen bg-bg-main pt-32 flex items-center justify-center text-white">Order not found.</div>;

  return (
    <main className="bg-bg-main min-h-screen pt-32 pb-24">
      <Navbar />
      
      <Container>
        <div className="max-w-4xl mx-auto flex flex-col gap-12">
          {/* Header Success */}
          <div className="flex flex-col items-center text-center gap-6">
            <motion.div 
              initial={{ scale: 0 }} 
              animate={{ scale: 1 }} 
              className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 border border-green-500/20"
            >
              <CheckCircle size={48} />
            </motion.div>
            <div className="flex flex-col gap-2">
              <h1 className="text-4xl md:text-5xl text-white font-light">Thank You for Your Order</h1>
              <p className="text-text-muted tracking-[0.3em] uppercase text-xs font-bold">Acquisition Confirmed | Order #{order._id.slice(-8).toUpperCase()}</p>
            </div>
            <p className="text-text-muted text-sm max-w-lg leading-relaxed font-light">
              Your request has been received and is being processed by our horological experts. 
              A confirmation email has been sent to your primary address.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column: Summary */}
            <div className="flex flex-col gap-8">
              <div className="glass p-8 flex flex-col gap-6">
                <h3 className="text-white text-xs font-bold uppercase tracking-widest border-b border-glass-border pb-4 flex items-center gap-2">
                  <Package size={14} className="text-primary" />
                  Order Summary
                </h3>
                <div className="flex flex-col gap-4">
                  {order.orderItems.map((item: any, idx: number) => (
                    <div key={idx} className="flex gap-4 items-center">
                      <div className="w-16 h-16 bg-black flex-shrink-0">
                        <img src={item.image} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 flex flex-col">
                        <span className="text-white text-xs font-medium">{item.name}</span>
                        {item.variant && Object.entries(item.variant).map(([k, v]: any) => (
                           <span key={k} className="text-[9px] text-text-muted uppercase">{k}: {v}</span>
                        ))}
                        <span className="text-[10px] text-text-muted uppercase">Qty: {item.qty}</span>
                      </div>
                      <span className="text-white text-xs font-bold">Rs. {(item.qty * item.price).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                 <div className="pt-6 border-t border-glass-border flex flex-col gap-3">
                   <div className="flex justify-between text-[10px] text-text-muted uppercase tracking-widest font-bold">
                     <span>Subtotal</span>
                     <span>Rs. {(order.itemsPrice || 0).toLocaleString()}</span>
                   </div>
                   <div className="flex justify-between text-[10px] text-text-muted uppercase tracking-widest font-bold">
                     <span>Shipping</span>
                     <span>{order.shippingPrice === 0 ? 'FREE' : `Rs. ${(order.shippingPrice || 0).toLocaleString()}`}</span>
                   </div>
                   <div className="flex justify-between items-center pt-2">
                     <span className="text-sm text-white font-bold uppercase tracking-widest">Total</span>
                     <span className="text-xl text-primary font-black">Rs. {(order.totalPrice || 0).toLocaleString()}</span>
                   </div>
                </div>
              </div>

              <div className="glass p-8 flex flex-col gap-6">
                <h3 className="text-white text-xs font-bold uppercase tracking-widest border-b border-glass-border pb-4 flex items-center gap-2">
                  <Truck size={14} className="text-primary" />
                  Expected Delivery
                </h3>
                <p className="text-text-muted text-sm font-light">
                  Standard Shipping (3-5 Business Days)
                </p>
              </div>
            </div>

            {/* Right Column: Customer Info */}
            <div className="flex flex-col gap-8">
              <div className="glass p-8 flex flex-col gap-6">
                <h3 className="text-white text-xs font-bold uppercase tracking-widest border-b border-glass-border pb-4 flex items-center gap-2">
                  <MapPin size={14} className="text-primary" />
                  Shipping Address
                </h3>
                <div className="flex flex-col gap-1 text-text-muted text-sm">
                  <span className="text-white font-medium">{order.shippingAddress.name}</span>
                  <span>{order.shippingAddress.address}</span>
                  <span>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</span>
                  <span>{order.shippingAddress.phone}</span>
                </div>
              </div>

              <div className="glass p-8 flex flex-col gap-6">
                <h3 className="text-white text-xs font-bold uppercase tracking-widest border-b border-glass-border pb-4 flex items-center gap-2">
                  <CreditCard size={14} className="text-primary" />
                  Payment Method
                </h3>
                <div className="flex flex-col gap-1">
                  <span className="text-white text-sm uppercase tracking-widest font-bold">{order.paymentMethod === 'Stripe' ? 'Online Payment' : 'Cash on Delivery'}</span>
                  <span className="text-[10px] text-text-muted uppercase tracking-tighter">
                    {order.paymentMethod === 'Stripe' ? 'Transaction processed via Secure Encryption' : 'Payment to be collected upon delivery'}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-4 mt-4">
                <Link href="/catalog" className="btn-premium py-4 flex items-center justify-center gap-3 text-xs w-full">
                  CONTINUE BROWSING
                  <ArrowRight size={16} />
                </Link>
                <Link href="/" className="text-center text-[10px] text-text-muted hover:text-white transition-colors uppercase tracking-[0.3em] font-bold">
                  Return to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Container>

      <Footer />
    </main>
  );
};

export default OrderConfirmationPage;
