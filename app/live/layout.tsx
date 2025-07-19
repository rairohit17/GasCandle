'use client';
import { Suspense } from 'react';
import '../globals.css'; 
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    
      
        <main className="relative flex min-h-screen flex-col">
          {/* <Header></Header> */}
          <Suspense fallback={<div>Loading.....</div>}>{children}</Suspense>
          
        </main>
  
  );
}
