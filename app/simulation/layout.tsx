'use client';

import '../globals.css'; 
import Header from '@/components/Header';
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    
      
        <main className="relative flex min-h-screen flex-col">
          <Header></Header>
          {children}
        </main>
  
  );
}
