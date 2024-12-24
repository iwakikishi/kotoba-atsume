import { Button } from '@/app/components/ui/button';
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
          <br />
          途中で中断しても、後から続きから再開できます。
        </p>
        <div className='space-y-4'>
          <Button asChild className='w-48'>
            <Link href='/register'>新規開始</Link>
          </Button>
          <br />
          <Button asChild variant='outline' className='w-48'>
            <Link href='/sessions'>続きから再開</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
