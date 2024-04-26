import type { Metadata } from 'next';
import { Inter as FontSans } from 'next/font/google';
import '../styles/globals.css';
import { cn } from '@/lib/utils';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Cek Ongkos Kirim',
  description:
    'Percobaan implementasi Open Source API RajaOngkir dengan Next.js untuk mengetahui ongkos kirim barang oleh Muhamad Aziz Prasetyo',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          fontSans.variable
        )}
      >
        {children}
      </body>
    </html>
  );
}
