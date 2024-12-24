'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/app/lib/supabase';
import { Button } from '@/app/components/ui/button';
import Link from 'next/link';
import { Header } from '@/app/components/header';

type Session = {
  id: string;
  recordingCount: number;
  date: string;
};

function isValidTimestamp(str: string): boolean {
  const num = parseInt(str);
  return !isNaN(num) && num > 0;
}

function formatDate(timestamp: string): string {
  const date = new Date(parseInt(timestamp));
  return date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

export default function Sessions() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadSessions() {
      try {
        if (!supabase) {
          throw new Error('Supabase client not initialized');
        }

        const { data: folders, error } = await supabase.storage.from('recordings').list('audio');

        if (error) {
          console.error('セッション一覧の取得に失敗:', error);
          return;
        }

        const sessionsData = await Promise.all(
          folders.map(async (folder) => {
            if (!supabase) {
              throw new Error('Supabase client not initialized');
            }

            const { data: files } = await supabase.storage.from('recordings').list(`audio/${folder.name}`);

            const displayDate = isValidTimestamp(folder.name) ? formatDate(folder.name) : 'Invalid Date';

            return {
              id: folder.name,
              recordingCount: files?.length || 0,
              date: displayDate,
            };
          })
        );

        setSessions(
          sessionsData.sort((a, b) => {
            if (a.date === 'Invalid Date' && b.date === 'Invalid Date') return 0;
            if (a.date === 'Invalid Date') return 1;
            if (b.date === 'Invalid Date') return -1;
            return parseInt(b.id) - parseInt(a.id);
          })
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadSessions();
  }, []);

  if (isLoading) {
    return (
      <div className='min-h-screen bg-gradient-to-b from-blue-50 to-pink-50'>
        <Header />
        <main className='pt-20 p-4'>
          <div className='flex items-center justify-center'>読み込み中...</div>
        </main>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-b from-blue-50 to-pink-50'>
      <Header />
      <main className='pt-20 p-4'>
        <div className='max-w-md mx-auto'>
          <h1 className='text-2xl font-bold text-center mb-8 text-blue-600'>
            <span className='text-3xl mr-2'>✏️</span>
            きろくの いちらん
          </h1>

          <div className='space-y-3'>
            {sessions.map((session) => (
              <Button key={session.id} asChild className='w-full h-auto py-3 px-4 rounded-2xl bg-white text-black hover:bg-gray-50 shadow-lg'>
                <Link href={`/sessions/${session.id}`} className='flex flex-col items-center'>
                  <div className='text-base font-bold mb-1'>{session.date}</div>
                  <div className='text-sm text-gray-500'>{session.recordingCount}もじ ろくおん ずみ</div>
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
