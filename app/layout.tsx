import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const viewport: Viewport = {
  themeColor: '#0B192C',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://aura-wealth.com'),
  title: {
    default: 'Aura Wealth Portal — Aura Asset Management Limited',
    template: '%s | Aura Asset Management',
  },
  description: 'Institutional private wealth management, portfolio performance, and collective investment schemes.',
  applicationName: 'Aura Wealth Portal',
  authors: [{ name: 'Aura Asset Management Limited' }],
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/logo-without text.png', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    shortcut: '/logo-without text.png',
    apple: [
      { url: '/logo-without text.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    title: 'Aura Wealth Portal — Aura Asset Management Limited',
    description: 'Institutional private wealth management, fund advisory, and collective investment schemes.',
    url: '/',
    siteName: 'Aura Asset Management Limited',
    images: [
      {
        url: '/logo-withtext.png',
        width: 1254,
        height: 1254,
        alt: 'Aura Asset Management Limited',
        type: 'image/png',
      },
    ],
    locale: 'en_GH',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aura Wealth Portal — Aura Asset Management Limited',
    description: 'Institutional private wealth management, fund advisory, and collective investment schemes.',
    images: ['/logo-withtext.png'],
  },
  other: {
    'image_src': '/logo-withtext.png',
  },
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
