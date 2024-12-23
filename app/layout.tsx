import type { Metadata } from 'next';
import { GeistSans, GeistMono } from 'geist/font';
import { Noto_Sans_JP } from 'next/font/google';
import './globals.css';

const geistSans = GeistSans;

const geistMono = GeistMono;

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-noto-sans-jp',
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
      <body className={`${notoSansJP.variable} font-sans antialiased`}>{children}</body>
    </html>
  );
}
