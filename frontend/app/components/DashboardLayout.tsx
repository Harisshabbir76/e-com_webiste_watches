'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { LayoutDashboard, Box, List, ShoppingBag, MessageCircle, Users, Settings, LogOut, ChevronRight, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { usePathname } from 'next/navigation';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { logout } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

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
  <div className="min-h-screen bg-bg-main flex">  {/* ADD flex here */}
    {/* Mobile Menu Overlay */}
    {isMobile && isSidebarOpen && (
      <div 
        className="fixed inset-0 z-40 bg-black/50 lg:hidden" 
        onClick={() => setIsSidebarOpen(false)}
      />
    )}

    {/* Sidebar */}
    <aside className={`fixed top-0 left-0 z-50 glass border-r border-glass-border flex flex-col pt-6 px-6 lg:px-8 transition-all duration-300 h-screen w-72 ${
      isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
    } lg:translate-x-0`}>
      
      <div className="flex items-center justify-between mb-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-widest text-white">iWRIST</span>
          <div className="w-1 h-1 rounded-full bg-primary mt-1"></div>
        </Link>
        <button 
          className="lg:hidden p-2 text-white hover:text-primary transition-colors"
          onClick={toggleSidebar}
        >
          <X size={24} />
        </button>
      </div>

      <nav className="flex-1">
        {menuItems.map((item) => (
          <Link 
            key={item.path} 
            href={item.path}
            className={`flex items-center gap-4 p-4 rounded-lg text-text-muted hover:bg-glass-bg hover:text-white transition-all group mb-3 last:mb-0 ${
              pathname === item.path ? 'bg-glass-bg text-white border-r-4 border-primary' : ''
            }`}
          >
            <span className={`transition-colors ${pathname === item.path ? 'text-primary' : 'group-hover:text-primary'}`}>
              {item.icon}
            </span>
            <span className="text-sm font-medium tracking-wide uppercase">{item.title}</span>
          </Link>
        ))}
      </nav>

      <button 
        onClick={logout}
        className="mt-auto flex items-center gap-4 p-4 text-text-muted hover:text-red-500 transition-all rounded-lg border-t border-glass-border"
      >
        <LogOut size={18} />
        <span className="text-sm font-medium tracking-wide uppercase">Logout</span>
      </button>
    </aside>

    {/* Main Content */}
    <main className="flex-1 lg:ml-72 p-6 lg:p-10 overflow-y-auto min-h-screen">
      <button 
        className="lg:hidden mb-6 p-3 glass rounded-lg flex items-center gap-2 w-fit"
        onClick={toggleSidebar}
      >
        <Menu size={20} />
        <span className="text-xs uppercase tracking-widest font-bold">Menu</span>
      </button>
      {children}
    </main>
  </div>
);
};

export default DashboardLayout;
