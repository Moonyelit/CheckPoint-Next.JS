import React from 'react';
import '../styles/globals.css'; 
import Navbar from '@/components/common/Navbar';
import Button from '@/components/common/Button';

export default function Home() {
  return (
    <>
      <Navbar />
      <p>hello world</p>
      <Button label="S'inscrire" />
      
    </>
  );
}
