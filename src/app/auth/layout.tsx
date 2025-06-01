"use client";
import React from 'react';
import AuthHeader from '@/components/auth/AuthHeader';
import Footer from '@/components/common/Footer';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="page-container">
      <AuthHeader />
      {children}
      <Footer />
    </div>
  );
} 