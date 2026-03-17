'use client';

import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Container from '../components/Container';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import api from '../lib/api';
import { Lock, Mail, ArrowRight } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data } = await api.post('/users/login', { email, password });
      login(data);
      if (data.isAdmin) {
        router.push('/dashboard');
      } else {
        router.push('/');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-bg-main min-h-screen flex flex-col justify-center">
      <Navbar />
      
      <Container>
        <div className="max-w-md mx-auto py-24 flex flex-col gap-10">
          <div className="flex flex-col items-center text-center gap-4">
            <span className="text-primary tracking-[0.4em] text-[10px] font-bold uppercase">Restricted Access</span>
            <h1 className="text-4xl text-white font-medium">Administrator Login</h1>
            <div className="w-12 h-0.5 bg-primary"></div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-500 text-xs text-center uppercase tracking-widest font-bold">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label className="text-[10px] text-text-muted uppercase tracking-widest font-bold">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-accent border border-glass-border p-4 pl-12 text-white focus:outline-none focus:border-primary transition-all text-sm"
                  placeholder="admin@iwrist.pk"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] text-text-muted uppercase tracking-widest font-bold">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-accent border border-glass-border p-4 pl-12 text-white focus:outline-none focus:border-primary transition-all text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="btn-premium py-4 flex items-center justify-center gap-3 mt-4"
            >
              {loading ? 'AUTHENTICATING...' : 'SECURE LOGIN'}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <p className="text-[10px] text-text-muted text-center uppercase tracking-[0.2em] leading-relaxed">
            Unauthorized access attempt is prohibited and will be logged.
          </p>
        </div>
      </Container>
      
      <Footer />
    </main>
  );
};

export default LoginPage;
