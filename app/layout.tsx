import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Awesome Generative AI Apps Hub — 50 Turnkey AI SaaS Products',
  description: '50 complete, sellable generative AI SaaS products. Brand them, sell them, keep 100% of revenue. One-click deploy, Stripe billing, Google OAuth, and MuAPI models.',
  keywords: ['Generative AI', 'AI SaaS', 'Open Source AI', 'Next.js 14', 'Vercel Deploy', 'Stripe Billing'],
  authors: [{ name: 'Xennials & Community' }],
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="bg-ambient">
          <div className="ambient-orb-1" />
          <div className="ambient-orb-2" />
          <div className="ambient-orb-3" />
        </div>
        {children}
      </body>
    </html>
  );
}
