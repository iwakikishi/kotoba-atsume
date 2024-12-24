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
    <>
      <Header />
      <div className='min-h-screen p-4 bg-gradient-to-b from-blue-50 to-pink-50'>
        <div className='max-w-md mx-auto'>
          <div className='flex flex-col items-center mb-8'>
            <h1 className='text-3xl font-bold text-center mb-4 bg-white/90 text-blue-600 rounded-full px-6 py-3 shadow-lg'>
              <span className='text-4xl mr-2'>🎵</span>
              とった おとの きろく
            </h1>
            <Button
              asChild
              className='text-xl py-4 px-8 rounded-full bg-gradient-to-r from-pink-400 to-pink-500 hover:from-pink-500 hover:to-pink-600 shadow-lg'>
              <Link href={`/record/${params.id}`}>
                <span className='text-2xl mr-2'>🎤</span>
                つづきを とろう！
              </Link>
            </Button>
          </div>

          <div className='grid grid-cols-2 gap-3'>
            {recordings.map((recording) => (
              <div
                key={recording.url}
                className='border-4 border-blue-200 rounded-2xl p-4 bg-white shadow-lg transform hover:scale-105 transition-transform'>
                <div className='text-5xl font-bold mb-3 text-center text-blue-600'>{recording.hiragana}</div>
                <Button
                  variant='outline'
                  onClick={() => handlePlay(recording.url)}
                  className='w-full text-xl py-4 rounded-full border-2 border-pink-400 hover:bg-pink-50'>
                  <span className='text-2xl mr-2'>🔊</span>
                  きく
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
