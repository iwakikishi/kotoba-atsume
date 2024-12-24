'use client';

import { Button } from '@/app/components/ui/button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Header() {
  const pathname = usePathname();

  // sessions と sessions/[id] ページではボタンを非表示
  const shouldShowButton = !pathname.startsWith('/sessions');

  return (
    <header className='fixed top-0 left-0 right-0 bg-white shadow-sm z-50'>
      <div className='max-w-4xl mx-auto px-4 h-16 flex items-center justify-between'>
        <Link href='/' className='text-xl font-bold text-blue-600'>
          ひらがな れんしゅう
        </Link>
        {shouldShowButton && (
          <Button asChild variant='outline' className='bg-white border-2 border-pink-400 hover:bg-pink-50'>
            <Link href='/sessions' className='text-pink-600 font-bold'>
              <span className='mr-2'>👂</span>
              きろく をみる
            </Link>
          </Button>
        )}
      </div>
    </header>
  );
}
