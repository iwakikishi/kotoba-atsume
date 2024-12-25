import { Button } from '@/app/components/ui/button';
import Link from 'next/link';
import { Header } from '@/app/components/header';

export default function Home() {
  return (
    <>
      <Header />
      <div className='min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-blue-50 to-pink-50'>
        <h1 className='text-4xl font-bold mb-6 text-blue-600 text-center'>
          🎤
          <br />
          <br />
          おはなしを
          <br />
          きかせてね！
        </h1>

        <div className='space-y-4 text-center bg-white/90 p-6 rounded-3xl shadow-lg border-4 border-blue-200 max-w-md w-full'>
          <p className='text-xl mb-8 text-blue-600 leading-relaxed'>
            「あ」から じゅんばんに
            <br />
            おはなしを きかせてください
            <br />
            おやすみの ときは
            <br />
            あとから つづけられます
          </p>

          <div className='space-y-4'>
            <Button
              asChild
              className='w-full text-2xl py-6 rounded-full bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 shadow-lg transform hover:scale-105 transition-transform'>
              <Link href='/register'>
                <span className='text-3xl mr-2'>✨</span>
                はじめる！
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
