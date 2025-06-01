"use client";
import React from 'react';
import HeroBanner from './home/noLogin/components/HeroBanner';
import FollowCollection from './home/noLogin/components/FollowCollection';
import FollowTrophy from './home/noLogin/components/FollowTrophy';
import NewFunctionality from './home/noLogin/components/NewFunctionality';

export default function Home() {
  return (
    <main>
      <HeroBanner />
      <FollowCollection />
      <FollowTrophy />
      <NewFunctionality />
    </main>
  );
}