'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/app/lib/supabase';
import { Button } from '@/app/components/ui/button';
import Link from 'next/link';
import { Header } from '@/app/components/header';

export default function Sessions() {
  const [sessions, setSessions] = useState<string[]>([]);
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

        setSessions(folders.map((folder) => folder.name));
      } finally {
        setIsLoading(false);
      }
    }

    loadSessions();
  }, []);

  if (isLoading) {
    return (
      <>
        <Header />
        <div className='min-h-screen flex items-center justify-center'>読み込み中...</div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className='min-h-screen p-4 bg-gradient-to-b from-blue-50 to-pink-50'>
        <div className='max-w-md mx-auto'>
          <h1 className='text-3xl font-bold text-center mb-8 bg-white/90 text-blue-600 rounded-full px-6 py-3 shadow-lg'>
            <span className='text-4xl mr-2'>📝</span>
            きろくの いちらん
          </h1>

          <div className='space-y-4'>
            {sessions.map((sessionId) => (
              <Button
                key={sessionId}
                asChild
                className='w-full text-xl py-6 rounded-full bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 shadow-lg transform hover:scale-105 transition-transform'>
                <Link href={`/sessions/${sessionId}`}>
                  <span className='text-2xl mr-2'>🎵</span>
                  きろく {sessionId}
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
