import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  return (
    <div className='min-h-screen flex flex-col items-center justify-center p-8'>
      <h1 className='text-4xl font-bold mb-8'>こどもの音声収集アプリ</h1>
      <div className='space-y-4 text-center'>
        <p className='text-lg mb-8'>
          このアプリは、子供たちの発音データを収集するためのサービスです。
          <br />
          「あ」から順番に単音を録音していきます。
        </p>
        <Button asChild className='w-48'>
          <Link href='/register'>はじめる</Link>
        </Button>
      </div>
    </div>
  );
}
