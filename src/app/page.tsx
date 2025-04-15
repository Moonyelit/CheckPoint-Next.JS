"use client";
import React from 'react';
import '../styles/globals.css'; 
import Navbar from '@/components/common/Navbar';
import HeroBanner from '@/app/home/noLogin/HeroBanner';
import FollowCollection from '@/app/home/noLogin/FollowCollection';

export default function Home() {
  return (
    <>
      <Navbar />
      <HeroBanner />
      <FollowCollection />

    </>
  );
}
