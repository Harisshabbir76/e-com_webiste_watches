'use client';

import React from 'react';
import { useAuth } from '../context/AuthContext';
import { notFound } from 'next/navigation';

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { userInfo, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-main flex items-center justify-center text-primary tracking-widest uppercase bg-black">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="text-[10px] font-bold">Verifying Credentials...</span>
        </div>
      </div>
    );
  }

  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
  if (!userInfo || userInfo.email !== adminEmail) {
    notFound();
  }

  return <>{children}</>;
};

export default AdminRoute;

