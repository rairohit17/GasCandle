'use client';
import Header from '../components/Header';

import './globals.css'; // Add this import

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light ">
      <body className="bg-background bg-cover bg-center w-full min-h-screen">
        <main className="relative flex min-h-screen flex-col">
          <div>
            <Header></Header>
          </div>
          {children}
        </main>
      </body>
    </html>
  );
}
