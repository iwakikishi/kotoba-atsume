import Link from 'next/link';
import { Button } from '@/app/components/ui/button';

export function Header() {
  return (
    <header className='fixed top-0 left-0 right-0 p-4 z-50'>
      <div className='max-w-7xl mx-auto flex justify-end'>
        <Button
          asChild
          variant='outline'
          className='text-lg py-4 px-6 rounded-full border-2 border-pink-400 bg-white/90 hover:bg-pink-50 shadow-md backdrop-blur-sm'>
          <Link href='/sessions'>
            <span className='text-2xl mr-2'>👂</span>
            <span className='text-pink-600'>きろくを みる</span>
          </Link>
        </Button>
      </div>
    </header>
  );
}
