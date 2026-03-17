'use client';

import React, { useState, useEffect } from 'react';
import AdminRoute from '../components/AdminRoute';
import DashboardLayout from '../components/DashboardLayout';
import { ShoppingBag, Box, Users, DollarSign, Loader2 } from 'lucide-react';
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
    { title: 'Total Revenue', value: stats ? `Rs. ${stats.revenue.toLocaleString()}` : 'Rs. 0', icon: <DollarSign size={20} />, color: 'text-primary' },
    { title: 'Total Orders', value: stats ? stats.orders : '0', icon: <ShoppingBag size={20} />, color: 'text-green-500' },
    { title: 'Total Products', value: stats ? stats.products : '0', icon: <Box size={20} />, color: 'text-blue-500' },
    { title: 'Active Customers', value: stats ? stats.customers : '0', icon: <Users size={20} />, color: 'text-purple-500' },
  ];

  return (
    <AdminRoute>
      <DashboardLayout>
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl text-white font-medium">Dashboard Overview</h1>
            <p className="text-text-muted text-sm tracking-widest uppercase font-light">Welcome back, Administrator</p>
          </div>

          {loading ? (
            <div className="h-[40vh] flex items-center justify-center">
              <Loader2 className="text-primary animate-spin" size={40} />
            </div>
          ) : (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statsConfig.map((stat, index) => (
                  <div key={index} className="glass p-8 flex flex-col gap-4">
                    <div className={`w-12 h-12 rounded-full glass flex items-center justify-center ${stat.color}`}>
                      {stat.icon}
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-sm text-text-muted tracking-widest uppercase font-medium">{stat.title}</span>
                      <span className="text-2xl text-white font-bold">{stat.value}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Recent Activity */}
              <div className="glass p-8">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl text-white font-medium uppercase tracking-widest text-sm">Recent Orders</h3>
                  <Link href="/dashboard/orders" className="text-primary text-xs tracking-widest uppercase border-b border-primary pb-1">View All</Link>
                </div>
                <div className="flex flex-col gap-4">
                  {stats?.recentOrders.length === 0 ? (
                    <p className="text-text-muted text-sm uppercase tracking-widest text-center py-10">No orders found</p>
                  ) : (
                    stats?.recentOrders.map((order: any) => (
                      <div key={order._id} className="flex items-center justify-between py-4 border-b border-glass-border last:border-0">
                        <div className="flex flex-col gap-1">
                          <span className="text-white text-sm font-medium">Order #{order._id.slice(-8).toUpperCase()}</span>
                          <span className="text-text-muted text-[10px] uppercase font-bold">
                            {order.user?.name || 'Guest'} • {order.orderItems.length} items
                          </span>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span className="text-white text-sm font-bold">Rs. {order.totalPrice.toLocaleString()}</span>
                          <span className={`text-[10px] uppercase font-bold ${order.isPaid ? 'text-green-500' : 'text-yellow-500'}`}>
                            {order.isPaid ? 'Paid' : 'Unpaid'} • {order.status}
                          </span>
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
