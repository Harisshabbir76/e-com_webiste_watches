'use client';

import React from 'react';
import Link from 'next/link';
import { LayoutDashboard, Box, List, ShoppingBag, MessageCircle, Users, Settings, LogOut, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { logout } = useAuth();

  const menuItems = [
    { title: 'Overview', icon: <LayoutDashboard size={18} />, path: '/dashboard' },
    { title: 'Products', icon: <Box size={18} />, path: '/dashboard/products' },
    { title: 'Categories', icon: <List size={18} />, path: '/dashboard/categories' },
    { title: 'Orders', icon: <ShoppingBag size={18} />, path: '/dashboard/orders' },
    { title: 'Messages', icon: <MessageCircle size={18} />, path: '/dashboard/messages' },
    { title: 'Subscribers', icon: <Users size={18} />, path: '/dashboard/subscribers' },
    { title: 'Settings', icon: <Settings size={18} />, path: '/dashboard/settings' },
  ];

  return (
    <div className="min-h-screen bg-bg-main flex">
      {/* Sidebar */}
      <aside className="w-72 border-r border-glass-border flex flex-col pt-10 px-8 sticky top-0 h-screen">
        <Link href="/" className="flex items-center gap-2 mb-16">
          <span className="text-xl font-bold tracking-widest text-white">iWRIST</span>
          <div className="w-1 h-1 rounded-full bg-primary mt-1"></div>
        </Link>

        <nav className="flex flex-col gap-2 flex-1">
          {menuItems.map((item) => (
            <Link 
              key={item.path} 
              href={item.path}
              className="flex items-center justify-between p-4 rounded-md text-text-muted hover:bg-glass-bg hover:text-white transition-all group"
            >
              <div className="flex items-center gap-4">
                <span className="group-hover:text-primary transition-colors">{item.icon}</span>
                <span className="text-sm font-medium tracking-wide">{item.title}</span>
              </div>
              <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          ))}
        </nav>

        <button 
          onClick={logout}
          className="mt-auto mb-10 flex items-center gap-4 p-4 text-text-muted hover:text-red-500 transition-all border-t border-glass-border pt-8"
        >
          <LogOut size={18} />
          <span className="text-sm font-medium tracking-wide uppercase">Logout</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-12 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
