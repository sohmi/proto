import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI Panchayat',
  description: 'Your digital village assistant',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
