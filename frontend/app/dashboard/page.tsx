'use client';

import React, { useState, useEffect } from 'react';
import AdminRoute from '../components/AdminRoute';
import DashboardLayout from '../components/DashboardLayout';
import { ShoppingBag, Box, Users, DollarSign, Loader2, Clock, TrendingUp, Package } from 'lucide-react';
import api from '../lib/api';
import Link from 'next/link';

const DashboardOverview = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/orders/stats');
        setStats(data);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statsConfig = [
    { 
      title: 'Total Revenue', 
      value: stats ? `Rs. ${stats.revenue?.toLocaleString() || 0}` : 'Rs. 0', 
      icon: <DollarSign size={16} className="xs:w-4 xs:h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />, 
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    { 
      title: 'Total Orders', 
      value: stats ? stats.orders || '0' : '0', 
      icon: <ShoppingBag size={16} className="xs:w-4 xs:h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />, 
      color: 'text-green-500',
      bgColor: 'bg-green-500/10'
    },
    { 
      title: 'Total Products', 
      value: stats ? stats.products || '0' : '0', 
      icon: <Box size={16} className="xs:w-4 xs:h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />, 
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    { 
      title: 'Active Customers', 
      value: stats ? stats.customers || '0' : '0', 
      icon: <Users size={16} className="xs:w-4 xs:h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />, 
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10'
    },
  ];

  // Additional stats for better dashboard
  const quickStats = [
    { 
      label: 'Pending Orders', 
      value: stats?.pendingOrders || 0, 
      icon: <Clock size={14} className="xs:w-3.5 xs:h-3.5" />,
      color: 'text-yellow-500'
    },
    { 
      label: 'Completed', 
      value: stats?.completedOrders || 0, 
      icon: <TrendingUp size={14} className="xs:w-3.5 xs:h-3.5" />,
      color: 'text-green-500'
    },
    { 
      label: 'Low Stock', 
      value: stats?.lowStock || 0, 
      icon: <Package size={14} className="xs:w-3.5 xs:h-3.5" />,
      color: 'text-red-500'
    },
  ];

  return (
    <AdminRoute>
      <DashboardLayout>
        <div className="flex flex-col gap-4 xs:gap-5 sm:gap-6 md:gap-8 lg:gap-10 px-2 xs:px-3 sm:px-4 md:px-5 lg:px-6 pb-6 w-full max-w-[100vw] overflow-x-hidden">
          {/* Header Section */}
          <div className="flex flex-col gap-1 xs:gap-1.5 sm:gap-2">
            <h1 className="text-xl xs:text-2xl sm:text-3xl text-white font-medium tracking-tight">
              Dashboard Overview
            </h1>
            <p className="text-text-muted text-[10px] xs:text-xs sm:text-sm tracking-widest uppercase font-light">
              Welcome back, Administrator
            </p>
          </div>

          {loading ? (
            <div className="h-[50vh] xs:h-[60vh] flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="text-primary animate-spin" size={32} />
                <p className="text-text-muted text-xs xs:text-sm">Loading dashboard...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Stats Grid - 2 columns on mobile, 4 on desktop */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 xs:gap-3 sm:gap-4 md:gap-5 lg:gap-6">
                {statsConfig.map((stat, index) => (
                  <div 
                    key={index} 
                    className="glass p-3 xs:p-4 sm:p-5 md:p-6 lg:p-8 flex flex-col gap-2 xs:gap-3 sm:gap-4 hover:border-primary/30 transition-all duration-300"
                  >
                    <div className={`w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 lg:w-12 lg:h-12 rounded-full ${stat.bgColor} flex items-center justify-center ${stat.color}`}>
                      {stat.icon}
                    </div>
                    <div className="flex flex-col gap-0.5 xs:gap-1">
                      <span className="text-[9px] xs:text-[10px] sm:text-xs text-text-muted tracking-widest uppercase font-medium">
                        {stat.title}
                      </span>
                      <span className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl text-white font-bold truncate">
                        {stat.value}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Stats Row - 3 columns */}
              <div className="grid grid-cols-3 gap-2 xs:gap-3 sm:gap-4">
                {quickStats.map((stat, index) => (
                  <div 
                    key={index}
                    className="glass p-2 xs:p-2.5 sm:p-3 md:p-4 flex items-center justify-between hover:border-primary/30 transition-all duration-300"
                  >
                    <div className="flex items-center gap-1.5 xs:gap-2 sm:gap-3">
                      <div className={`w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 rounded-full bg-accent/30 flex items-center justify-center ${stat.color}`}>
                        {stat.icon}
                      </div>
                      <span className="text-[9px] xs:text-[10px] sm:text-xs text-text-muted uppercase tracking-wider">
                        {stat.label}
                      </span>
                    </div>
                    <span className="text-xs xs:text-sm sm:text-base font-bold text-white">
                      {stat.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Recent Activity */}
              <div className="glass p-3 xs:p-4 sm:p-5 md:p-6 lg:p-8">
                <div className="flex items-center justify-between mb-4 xs:mb-5 sm:mb-6 md:mb-8">
                  <h3 className="text-sm xs:text-base sm:text-lg md:text-xl text-white font-medium uppercase tracking-widest">
                    Recent Orders
                  </h3>
                  <Link 
                    href="/dashboard/orders" 
                    className="text-primary text-[9px] xs:text-[10px] sm:text-xs tracking-widest uppercase border-b border-primary pb-0.5 hover:text-primary/80 transition-colors"
                  >
                    View All
                  </Link>
                </div>

                {/* Orders List */}
                <div className="flex flex-col gap-2 xs:gap-2.5 sm:gap-3 md:gap-4">
                  {stats?.recentOrders?.length === 0 ? (
                    <div className="text-center py-8 xs:py-10 sm:py-12">
                      <ShoppingBag size={32} className="mx-auto text-text-muted mb-3 opacity-50" />
                      <p className="text-text-muted text-xs xs:text-sm uppercase tracking-widest">
                        No orders found
                      </p>
                    </div>
                  ) : (
                    stats?.recentOrders?.map((order: any) => (
                      <div 
                        key={order._id} 
                        className="flex flex-col xs:flex-row xs:items-center justify-between py-2 xs:py-2.5 sm:py-3 md:py-4 border-b border-glass-border last:border-0 gap-2 xs:gap-3"
                      >
                        {/* Left Section */}
                        <div className="flex flex-col gap-0.5 xs:gap-1 min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-white text-xs xs:text-sm sm:text-base font-medium truncate">
                              Order #{order._id?.slice(-8).toUpperCase()}
                            </span>
                            <span className={`text-[8px] xs:text-[9px] sm:text-[10px] px-1.5 xs:px-2 py-0.5 rounded-full uppercase font-bold ${
                              order.status === 'delivered' ? 'bg-green-500/20 text-green-500' :
                              order.status === 'shipped' ? 'bg-blue-500/20 text-blue-500' :
                              order.status === 'processing' ? 'bg-yellow-500/20 text-yellow-500' :
                              'bg-gray-500/20 text-gray-400'
                            }`}>
                              {order.status || 'Pending'}
                            </span>
                          </div>
                          <span className="text-text-muted text-[9px] xs:text-[10px] sm:text-xs uppercase font-medium truncate">
                            {order.user?.name || 'Guest Customer'} • {order.orderItems?.length || 0} items
                          </span>
                        </div>

                        {/* Right Section */}
                        <div className="flex flex-col xs:items-end gap-0.5 xs:gap-1">
                          <span className="text-white text-xs xs:text-sm sm:text-base font-bold">
                            Rs. {order.totalPrice?.toLocaleString() || 0}
                          </span>
                          <div className="flex items-center gap-1.5 xs:gap-2">
                            <span className={`text-[8px] xs:text-[9px] sm:text-[10px] uppercase font-bold ${
                              order.isPaid ? 'text-green-500' : 'text-yellow-500'
                            }`}>
                              {order.isPaid ? 'Paid' : 'Unpaid'}
                            </span>
                            {order.paymentMethod && (
                              <>
                                <span className="text-text-muted text-[6px] xs:text-[7px]">•</span>
                                <span className="text-text-muted text-[8px] xs:text-[9px] uppercase">
                                  {order.paymentMethod}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              
            </>
          )}
        </div>
      </DashboardLayout>
    </AdminRoute>
  );
};

export default DashboardOverview;