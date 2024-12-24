'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/app/lib/supabase';
import { Button } from '@/app/components/ui/button';
import Link from 'next/link';
import { HIRAGANA_MAP } from '@/app/lib/constants';
import { Header } from '@/app/components/header';

type Recording = {
  hiragana: string;
  url: string;
  timestamp: number;
};

export default function SessionDetail() {
  const params = useParams();
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    async function loadRecordings() {
      try {
        if (!supabase) {
          throw new Error('Supabase client not initialized');
        }

        const { data: files, error } = await supabase.storage.from('recordings').list(`audio/${params.id}`);

        if (error) {
          console.error('録音の取得に失敗:', error);
          return;
        }

        // ファイル名からひらがなを抽出し、URLを取得
        const recordingsData = await Promise.all(
          files.map(async (file) => {
            const romajiMatch = file.name.split('_')[0];
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const hiragana = Object.entries(HIRAGANA_MAP).find(([_, romaji]) => romaji === romajiMatch)?.[0] || '';

            if (!supabase) {
              throw new Error('Supabase client not initialized');
            }

            const {
              data: { publicUrl },
            } = supabase.storage.from('recordings').getPublicUrl(`audio/${params.id}/${file.name}`);

            return {
              hiragana,
              url: publicUrl,
              timestamp: parseInt(file.name.split('_')[1]) || 0,
            };
          })
        );

        // タイムスタンプでソート
        setRecordings(recordingsData.sort((a, b) => a.timestamp - b.timestamp));
      } finally {
        setIsLoading(false);
      }
    }

    loadRecordings();
  }, [params.id]);

  const handlePlay = (url: string) => {
    if (currentAudio) {
      currentAudio.pause();
    }
    const audio = new Audio(url);
    audio.play();
    setCurrentAudio(audio);
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <div className='min-h-screen flex items-center justify-center'>読み込み中...</div>
      </>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-b from-blue-50 to-pink-50'>
      <Header />
      <main className='pt-20 p-4'>
        <div className='max-w-4xl mx-auto'>
          <div className='flex flex-col items-center mb-8'>
            <h1 className='text-3xl font-bold text-center mb-4 text-blue-600'>
              <span className='text-4xl mr-2'>🎵</span>
              とった おとの きろく
            </h1>
            <Button asChild className='text-xl py-4 px-8 rounded-full bg-pink-400 hover:bg-pink-500 text-white shadow-lg'>
              <Link href={`/record/${params.id}`}>
                <span className='text-2xl mr-2'>🎤</span>
                つづきを とろう！
              </Link>
            </Button>
          </div>

          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'>
            {recordings.map((recording) => (
              <div
                key={recording.url}
                className='relative aspect-square flex flex-col items-center justify-center bg-white rounded-3xl p-4 shadow-lg'>
                <div className='text-6xl mb-4 text-gray-300'>{recording.hiragana}</div>
                <Button
                  variant='outline'
                  onClick={() => handlePlay(recording.url)}
                  className='w-full text-lg py-2 px-4 rounded-full bg-black text-white hover:opacity-80 flex items-center justify-center gap-2'>
                  <span className='text-xl'>🔊</span>
                  きく
                </Button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
