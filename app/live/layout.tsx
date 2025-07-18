'use client';

import '../globals.css';
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="relative flex min-h-screen flex-col">{children}</div>;
}
