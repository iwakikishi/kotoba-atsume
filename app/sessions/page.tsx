'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/app/lib/supabase';
import { Button } from '@/app/components/ui/button';
import Link from 'next/link';

export default function Sessions() {
  const [sessions, setSessions] = useState<Array<{ id: string; count: number }>>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadSessions() {
      try {
        const { data: folders, error } = await supabase.storage.from('recordings').list('audio');

        if (error) {
          console.error('セッション一覧の取得に失敗:', error);
          return;
        }

        // 各フォルダの録音数を取得
        const sessionsWithCount = await Promise.all(
          folders.map(async (folder) => {
            const { data: files } = await supabase.storage.from('recordings').list(`audio/${folder.name}`);

            return {
              id: folder.name,
              count: files?.length || 0,
            };
          })
        );

        setSessions(sessionsWithCount);
      } finally {
        setIsLoading(false);
      }
    }

    loadSessions();
  }, []);

  if (isLoading) {
    return <div className='min-h-screen flex items-center justify-center'>読み込み中...</div>;
  }

  return (
    <div className='min-h-screen p-8'>
      <h1 className='text-3xl font-bold mb-8'>録音セッション一覧</h1>
      {sessions.length === 0 ? (
        <div className='text-center'>
          <p className='mb-4'>録音セッションがありません</p>
          <Button asChild>
            <Link href='/register'>新規開始</Link>
          </Button>
        </div>
      ) : (
        <div className='space-y-4'>
          {sessions.map((session) => (
            <div key={session.id} className='border p-4 rounded-lg'>
              <div className='flex justify-between items-center'>
                <div>
                  <div>セッションID: {session.id}</div>
                  <div className='text-sm text-gray-600'>録音済み: {session.count}文字</div>
                </div>
                <Button asChild>
                  <Link href={`/record/${session.id}`}>続きから再開</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
