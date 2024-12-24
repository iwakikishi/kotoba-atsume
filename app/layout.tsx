import type { Metadata } from 'next';
import { M_PLUS_Rounded_1c } from 'next/font/google';
import './globals.css';

// M PLUS Rounded 1cフォントの設定（メイリオに似た丸みのあるフォント）
const mplus = M_PLUS_Rounded_1c({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
  preload: false,
  variable: '--font-mplus',
});

export const metadata: Metadata = {
  title: 'こどもの おはなし きろく',
  description: 'こどもたちの おはなしを きろくする アプリです',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='ja' className={`${mplus.variable}`}>
      <body className='font-mplus'>{children}</body>
    </html>
  );
}
