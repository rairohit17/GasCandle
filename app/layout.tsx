"use client";
import Header from './components/Header';

import './globals.css'  // Add this import


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (
    <html lang="en" className="light">
      <body  className=" bg-gray-950 bg-cover bg-center w-full  min-h-screen bg-background">
        <main className="relative flex min-h-screen flex-col">
        
    <Header></Header>
                {children}
            
          
        </main>
      </body>
    </html>
  );
}