import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Aura Wealth Portal — Aura Asset Management',
  description: 'Institutional wealth management, portfolio performance, and asset advisory.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased text-slate-900 bg-slate-50`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
