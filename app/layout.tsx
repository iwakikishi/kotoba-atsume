import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Noto_Sans_JP } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
});

export const metadata: Metadata = {
  title: 'こどもの音声収集アプリ',
  description: '子供の発する単音データを収集するサービス',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='ja'>
      <body className={`${geistSans.variable} ${geistMono.variable} ${notoSansJP.variable} antialiased`}>{children}</body>
    </html>
  );
}
