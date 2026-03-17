'use client';

import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Container from '../components/Container';
import api from '../lib/api';
import { useRouter } from 'next/navigation';
import { Shield } from 'lucide-react';

const STRIPE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!;

const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

interface CheckoutFormProps {
  stripePromise: Promise<any>;
}

const CardSection = ({}) => {
  const stripe = useStripe();
  const elements = useElements();

  const [errorMsg, setErrorMsg] = useState('');

  const handleCardChange = (elementType: string, isValid: boolean | null) => {
    if (errorMsg && isValid) setErrorMsg('');
  };

  return (
    <div className="space-y-4 pt-6">
      <div>
        <label className="text-[10px] text-text-muted uppercase tracking-widest mb-2 block">Card Number</label>
        <CardNumberElement
          className="bg-accent border border-glass-border p-4 text-white rounded-md text-sm h-12 focus:outline-none focus:border-primary transition-all"
          options={{
            style: {
              base: {
                color: '#ffffff',
                fontSize: '16px',
                '::placeholder': {
                  color: '#9ca3af',
                },
              },
            },
          }}
          onChange={(event) => handleCardChange('cardNumber', event.complete)}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-[10px] text-text-muted uppercase tracking-widest mb-2 block">Expiry Date</label>
          <CardExpiryElement
            className="bg-accent border border-glass-border p-4 text-white rounded-md text-sm h-12 focus:outline-none focus:border-primary transition-all"
            options={{
              style: {
                base: {
                  color: '#ffffff',
                  fontSize: '16px',
                  '::placeholder': {
                    color: '#9ca3af',
                  },
                },
              },
            }}
            onChange={(event) => handleCardChange('expiry', event.complete)}
          />
        </div>
        <div>
          <label className="text-[10px] text-text-muted uppercase tracking-widest mb-2 block">CVV</label>
          <CardCvcElement
            className="bg-accent border border-glass-border p-4 text-white rounded-md text-sm h-12 focus:outline-none focus:border-primary transition-all"
            options={{
              style: {
                base: {
                  color: '#ffffff',
                  fontSize: '16px',
                  '::placeholder': {
                    color: '#9ca3af',
                  },
                },
              },
            }}
            onChange={(event) => handleCardChange('cvc', event.complete)}
          />
        </div>
      </div>
      {errorMsg && (
        <div className="p-3 bg-red-500/20 border border-red-500/50 text-red-300 text-sm rounded-md">
          {errorMsg}
        </div>
      )}
    </div>
  );
};

const CheckoutPageContent = ({ stripePromise }: CheckoutFormProps) => {
  const { cartItems, itemsPrice, shippingPrice, totalPrice, clearCart } = useCart();
  const router = useRouter();
  const [shippingAddress, setShippingAddress] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'Online'>('COD');
  const [loading, setLoading] = useState(false);
  const [showStripeForm, setShowStripeForm] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const stripe = useStripe();
  const elements = useElements();

  const createOrder = async () => {
    try {
      const { data: order } = await api.post('/orders', {
        orderItems: cartItems.map(item => ({
          name: item.name,
          qty: item.qty,
          image: item.image,
          price: item.price,
          product: item._id,
          variant: item.variant
        })),
        shippingAddress,
        paymentMethod: 'Stripe',
        itemsPrice,
        shippingPrice,
        totalPrice,
      });
      return order._id;
    } catch (error) {
      throw error;
    }
  };

  const initializePayment = async (orderId: string) => {
    try {
      const { data } = await api.post('/stripe/create-payment-intent', { orderId });
      setClientSecret(data.client_secret);
      setShowStripeForm(true);
    } catch (error) {
      setErrorMsg('Failed to initialize payment');
    }
  };

const handlePaymentMethodChange = async (method: 'COD' | 'Online') => {
    setPaymentMethod(method);
    setShowStripeForm(false);
    setClientSecret('');
    setErrorMsg('');
    if (method === 'Online' && cartItems.length > 0 && Object.values(shippingAddress).every(Boolean)) {
      if (!STRIPE_PUBLISHABLE_KEY) {
        setErrorMsg('Stripe not configured. Check .env.local');
        return;
      }
      setLoading(true);
      try {
        const newOrderId = await createOrder();
        setOrderId(newOrderId);
        await initializePayment(newOrderId);
      } catch (error) {
        console.error(error);
        setErrorMsg('Failed to create order or payment intent. Check backend server/keys.');
      }
      setLoading(false);
    } else if (method === 'Online') {
      setErrorMsg('Please fill all shipping details and add items to cart.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setErrorMsg('');

    try {
      if (paymentMethod === 'COD') {
        await createOrder();
        alert('Order Placed Successfully via Cash on Delivery!');
        clearCart();
        router.push('/cart'); // or dashboard
        return;
      }

      if (!stripe || !elements || !clientSecret) {
        setErrorMsg('Payment form not ready');
        return;
      }

      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardNumberElement)!,
          billing_details: {
            name: shippingAddress.name,
            email: shippingAddress.email,
            phone: shippingAddress.phone,
          },
        }
      });

      if (error) {
        setErrorMsg(error.message || 'Payment failed');
      } else if (paymentIntent.status === 'succeeded') {
        // Update order as paid
        await api.put(`/orders/${orderId}/pay`, {
          id: paymentIntent.id
        });
        clearCart();
        router.push(`/order/${orderId}`);
      }
    } catch (error) {
      setErrorMsg('Checkout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-bg-main min-h-screen pt-32">
      <Navbar />
      
      <Container>
        <div className="flex flex-col gap-8 mb-24">
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl md:text-5xl text-white">Checkout</h1>
            <p className="text-text-muted text-sm font-light uppercase tracking-[0.2em]">
              Complete your acquisition
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-16">
            {/* Shipping Form */}
            <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-10">
              {/* Shipping section unchanged */}
              <section className="flex flex-col gap-6">
                <h3 className="text-xl text-white font-medium border-b border-glass-border pb-4 uppercase tracking-widest text-sm">Shipping Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* ... same inputs as before ... */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] text-text-muted uppercase tracking-widest">Full Name</label>
                    <input required type="text" value={shippingAddress.name} onChange={(e) => setShippingAddress({ ...shippingAddress, name: e.target.value })} className="bg-accent border border-glass-border p-4 text-white focus:outline-none focus:border-primary transition-all text-sm" placeholder="Enter your full name" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] text-text-muted uppercase tracking-widest">Email Address</label>
                    <input required type="email" value={shippingAddress.email} onChange={(e) => setShippingAddress({ ...shippingAddress, email: e.target.value })} className="bg-accent border border-glass-border p-4 text-white focus:outline-none focus:border-primary transition-all text-sm" placeholder="For order updates" />
                  </div>
                  <div className="md:col-span-2 flex flex-col gap-2">
                    <label className="text-[10px] text-text-muted uppercase tracking-widest">Phone Number</label>
                    <input required type="tel" value={shippingAddress.phone} onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })} className="bg-accent border border-glass-border p-4 text-white focus:outline-none focus:border-primary transition-all text-sm" placeholder="e.g. 0300 1234567" />
                  </div>
                  <div className="md:col-span-2 flex flex-col gap-2">
                    <label className="text-[10px] text-text-muted uppercase tracking-widest">Address</label>
                    <input required type="text" value={shippingAddress.address} onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })} className="bg-accent border border-glass-border p-4 text-white focus:outline-none focus:border-primary transition-all text-sm" placeholder="House #, Street, Area" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] text-text-muted uppercase tracking-widest">City</label>
                    <input required type="text" value={shippingAddress.city} onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })} className="bg-accent border border-glass-border p-4 text-white focus:outline-none focus:border-primary transition-all text-sm" placeholder="e.g. Lahore" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] text-text-muted uppercase tracking-widest">Postal Code</label>
                    <input required type="text" value={shippingAddress.postalCode} onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })} className="bg-accent border border-glass-border p-4 text-white focus:outline-none focus:border-primary transition-all text-sm" placeholder="e.g. 54000" />
                  </div>
                </div>
              </section>

              <section className="flex flex-col gap-6">
                <h3 className="text-xl text-white font-medium border-b border-glass-border pb-4 uppercase tracking-widest text-sm">Payment Method</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => handlePaymentMethodChange('COD')}
                    className={`p-6 border flex flex-col gap-2 text-left transition-all ${paymentMethod === 'COD' ? 'bg-primary/10 border-primary' : 'bg-accent border-glass-border opacity-60'}`}
                  >
                    <span className="text-white text-sm font-bold uppercase tracking-widest">Cash on Delivery</span>
                    <span className="text-[10px] text-text-muted uppercase tracking-tighter">Pay when your watch arrives</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePaymentMethodChange('Online')}
                    className={`p-6 border flex flex-col gap-2 text-left transition-all ${paymentMethod === 'Online' ? 'bg-primary/10 border-primary' : 'bg-accent border-glass-border opacity-60'}`}
                    disabled={loading}
                  >
                    <span className="text-white text-sm font-bold uppercase tracking-widest">Online Payment</span>
                    <span className="text-[10px] text-text-muted uppercase tracking-tighter">Secure Stripe Card</span>
                  </button>
                </div>
              </section>

{paymentMethod === 'Online' && showStripeForm && clientSecret && (
                <div>
                  <CardSection />
                </div>
              )}
              {paymentMethod === 'Online' && !showStripeForm && (
                <div className="p-6 bg-primary/10 border border-primary/20 text-primary text-sm rounded-md text-center">
                  Fill shipping details first, then select Online Payment to see card form.
                </div>
              )}
              {!STRIPE_PUBLISHABLE_KEY && paymentMethod === 'Online' && (
                <div className="p-4 bg-yellow-500/20 border border-yellow-500/50 text-yellow-300 text-sm rounded-md">
                  Stripe key missing. Add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY to .env.local and restart.
                </div>
              )}

              {errorMsg && (
                <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-md text-red-300 text-sm">
                  {errorMsg}
                </div>
              )}

              <button 
                type="submit" 
                disabled={loading || (paymentMethod === 'Online' && !showStripeForm) || cartItems.length === 0}
                className="btn-premium py-5 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'PROCESSING...' : 'COMPLETE ORDER'}
              </button>
            </form>

            {/* Order Review - unchanged */}
            <div className="lg:w-96">
              <div className="glass p-8 flex flex-col gap-8 sticky top-32">
                <h4 className="text-xl text-white font-medium border-b border-glass-border pb-6 uppercase tracking-widest text-sm">Review Order</h4>
                
                <div className="flex flex-col gap-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                  {cartItems.map((item) => (
                    <div key={item._id} className="flex gap-4 items-center">
                      <div className="w-16 h-16 flex-shrink-0 bg-[#0a0a0a]">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 flex flex-col">
                        <span className="text-white text-xs font-medium truncate">{item.name}</span>
                        {item.variant && Object.entries(item.variant).map(([key, val]) => (
                          <span key={key} className="text-[9px] text-text-muted uppercase tracking-tighter">
                            {key}: {val}
                          </span>
                        ))}
                        <span className="text-text-muted text-[10px] uppercase">Qty: {item.qty}</span>
                        <span className="text-primary text-[10px] font-bold">Rs. {(item.price * item.qty).toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-4 pt-6 border-t border-glass-border">
                  <div className="flex justify-between text-xs">
                    <span className="text-text-muted uppercase tracking-widest">Subtotal</span>
                    <span className="text-white">Rs. {itemsPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-text-muted uppercase tracking-widest">Shipping</span>
                    <span className="text-white">{shippingPrice === 0 ? 'FREE' : `Rs. ${shippingPrice.toLocaleString()}`}</span>
                  </div>
                  <div className="flex justify-between items-center pt-4">
                    <span className="text-sm text-white font-bold uppercase tracking-[0.2em]">Total</span>
                    <span className="text-xl text-primary font-bold">Rs. {totalPrice.toLocaleString()}</span>
                  </div>
                </div>

                <div className="p-4 bg-primary/5 border border-primary/20 flex gap-4 items-center">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Shield size={20} />
                  </div>
                  <span className="text-[10px] text-text-muted uppercase tracking-widest font-medium">
                    Secure Stripe Encryption • All Cards Accepted
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
      
      <Footer />
    </main>
  );
};

const CheckoutPageContentInner = () => {
  const stripe = useStripe();

  if (!stripe) {
    return <div>Loading payment form...</div>;
  }
  return <CheckoutPageContent stripePromise={stripePromise} />;
};

const CheckoutPage = () => {
  return (
    <Elements stripe={stripePromise} options={{ clientSecret: undefined }}>
      <CheckoutPageContentInner />
    </Elements>
  );
};

export default CheckoutPage;

