'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/app/components/ui/button';
import { ReactMediaRecorder } from 'react-media-recorder';
import { supabase } from '@/app/lib/supabase';
import { HIRAGANA_MAP, HIRAGANA } from '@/app/lib/constants';
import { Header } from '@/app/components/header';

export default function Record() {
  const params = useParams();
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isRecording, setIsRecording] = useState(false);
  const [showAudio, setShowAudio] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [countdown, setCountdown] = useState<number | null>(null);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (countdown === null) return;

    if (countdown === 0) {
      setIsRecording(true);
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown]);

  useEffect(() => {
    async function loadExistingRecordings() {
      try {
        if (!supabase) {
          throw new Error('Supabase client not initialized');
        }

        const { data: files, error } = await supabase.storage.from('recordings').list(`audio/${params.id}`);

        if (error) {
          console.error('録音データの取得に失敗:', error);
          return;
        }

        // 録音済みのファイルからローマ字を抽出し、対応するひらがなを見つける
        const recorded = files?.reduce((acc: string[], file) => {
          const romajiMatch = file.name.split('_')[0];
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const hiragana = Object.entries(HIRAGANA_MAP).find(([_, romaji]) => romaji === romajiMatch)?.[0];
          if (hiragana) acc.push(hiragana);
          return acc;
        }, []);

        setCurrentIndex(recorded?.length || 0);
      } finally {
        setIsLoading(false);
      }
    }

    loadExistingRecordings();
  }, [params.id]);

  const startNewRecording = async (startRecording: () => void) => {
    if (!supabase) {
      console.error('Supabase client not initialized');
      return;
    }

    // If there's a previous recording for this character, delete it first
    if (hasRecorded) {
      try {
        const { error } = await supabase.storage.from('recordings').remove([`${params.id}/${HIRAGANA[currentIndex]}.wav`]);

        if (error) {
          console.error('Error deleting previous recording:', error);
        }
      } catch (error) {
        console.error('Error deleting previous recording:', error);
      }
    }

    setShowAudio(false);
    setCountdown(3);
    setTimeout(() => {
      startRecording();
    }, 3000);
  };

  if (isLoading || currentIndex === -1) {
    return (
      <>
        <Header />
        <div className='min-h-screen flex items-center justify-center'>読み込み中...</div>
      </>
    );
  }

  if (currentIndex >= HIRAGANA.length) {
    return (
      <>
        <Header />
        <div className='min-h-screen flex flex-col items-center justify-center p-8'>
          <h1 className='text-3xl font-bold mb-8'>録音完了</h1>
          <p className='text-lg mb-8'>
            すべての音声の録音が完了しました。
            <br />
            ご協力ありがとうございました。
          </p>
        </div>
      </>
    );
  }

  return (
    <ReactMediaRecorder
      audio
      render={({ startRecording, stopRecording, mediaBlobUrl }) => (
        <>
          <Header />
          <div className='min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-blue-50 to-pink-50'>
            <div className='bg-white/90 rounded-3xl p-8 shadow-lg border-4 border-blue-200 mb-6'>
              <div className='text-8xl sm:text-8xl font-darumadrop text-blue-600 animate-bounce'>{HIRAGANA[currentIndex]}</div>
            </div>

            {countdown !== null && (
              <div className='text-7xl sm:text-8xl font-bold mb-6 text-pink-500 bg-white/90 rounded-full px-8 py-4 animate-pulse shadow-lg'>
                {countdown === 0 ? 'GO!' : countdown}
              </div>
            )}

            <div className='space-y-6 text-center w-full max-w-sm'>
              {showAudio && mediaBlobUrl && (
                <div className='space-y-4 bg-white rounded-3xl p-6 shadow-lg border-4 border-yellow-200'>
                  <div className='text-2xl font-bold text-blue-600'>
                    <span className='text-3xl mr-2'>👂</span>
                    きいてみよう！
                  </div>
                  <audio src={mediaBlobUrl} controls className='w-full mb-4 h-12' />
                  <Button
                    variant='default'
                    className='w-full min-h-[100px] text-xl py-4 px-6 rounded-full bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 shadow-lg transform hover:scale-105 transition-transform'
                    onClick={async () => {
                      if (!mediaBlobUrl) return;

                      try {
                        setUploadStatus('アップロード中...');

                        // Fetch the blob from the mediaBlobUrl
                        const response = await fetch(mediaBlobUrl);
                        const blob = await response.blob();

                        // ファイルサイズチェック
                        const maxSize = 10 * 1024 * 1024; // 10MB
                        if (blob.size > maxSize) {
                          throw new Error('ファイルサイズが大きすぎます（上限10MB）');
                        }

                        // Generate a unique filename
                        const timestamp = new Date().getTime();
                        // ひらがなをローマ字に変換
                        const romajiChar = HIRAGANA_MAP[HIRAGANA[currentIndex] as keyof typeof HIRAGANA_MAP];
                        const fileName = `${romajiChar}_${timestamp}.wav`;
                        const filePath = `audio/${params.id}/${fileName}`;

                        // Create a File object
                        const file = new File([blob], fileName, {
                          type: 'audio/wav',
                        });

                        console.log('Uploading file:', {
                          path: filePath,
                          size: file.size,
                          type: file.type,
                          romaji: romajiChar,
                        });

                        if (!supabase) {
                          throw new Error('Supabase client not initialized');
                        }

                        const result = await supabase.storage.from('recordings').upload(filePath, file, {
                          cacheControl: '3600',
                          upsert: true,
                        });

                        if (result.error) {
                          console.error('Upload error details:', {
                            error: result.error,
                            message: result.error.message,
                            path: filePath,
                          });
                          throw new Error(`アップロードエラー: ${result.error.message || 'ストレージへの接続に失敗しました'}`);
                        }

                        console.log('Upload success:', result.data);

                        // アップロード成功後に古いファイルを削除
                        try {
                          if (!supabase) {
                            throw new Error('Supabase client not initialized');
                          }

                          const { data: existingFiles } = await supabase.storage.from('recordings').list(`audio/${params.id}`);

                          if (existingFiles) {
                            const oldFiles = existingFiles
                              .filter((f) => f.name.startsWith(romajiChar) && f.name !== fileName)
                              .map((f) => `audio/${params.id}/${f.name}`);

                            if (oldFiles.length > 0) {
                              const { error: removeError } = await supabase.storage.from('recordings').remove(oldFiles);

                              if (removeError) {
                                console.warn('古いファイルの削除に失敗:', removeError);
                              }
                            }
                          }
                        } catch (cleanupError) {
                          console.warn('クリーンアップ中にエラーが発生:', cleanupError);
                        }

                        // 成功時の処理
                        setCurrentIndex((prev) => prev + 1);
                        setShowAudio(false);
                        setHasRecorded(false);
                        setUploadStatus('');

                        // 自動的にカウントダウンを開始
                        setTimeout(() => {
                          startNewRecording(() => startRecording());
                        }, 500); // 0.5秒後にカウントダウン開始
                      } catch (error) {
                        console.error('Error details:', error);
                        let errorMessage = 'エラーが発生しました。もう一度お試しください。';

                        if (error instanceof Error) {
                          errorMessage = error.message;
                        } else if (typeof error === 'object' && error !== null) {
                          errorMessage = JSON.stringify(error);
                        }

                        setUploadStatus(errorMessage);
                      }
                    }}>
                    {uploadStatus || (
                      <div className='flex flex-col items-center justify-center w-full'>
                        <div className='flex items-center justify-center gap-2 mb-2'>
                          <span className='text-2xl'>✨</span>
                          {currentIndex + 1 < HIRAGANA.length ? (
                            <div className='flex flex-wrap items-center justify-center gap-1'>
                              つぎは
                              <span className='text-2xl font-bold'>「{HIRAGANA[currentIndex + 1]}」</span>
                              だよ！
                            </div>
                          ) : (
                            'おしまい！'
                          )}
                        </div>
                        {currentIndex + 1 < HIRAGANA.length && <div className='text-lg text-white/90'>じゅんび は いい？</div>}
                      </div>
                    )}
                  </Button>
                </div>
              )}
              <div className='px-4'>
                {!isRecording && countdown === null ? (
                  <Button
                    variant='default'
                    className='w-full text-2xl py-6 rounded-full bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 shadow-lg transform hover:scale-105 transition-transform'
                    onClick={() => startNewRecording(() => startRecording())}>
                    <span className='text-3xl mr-2'>🎤</span>
                    {hasRecorded ? 'もういちど とる？' : 'おとを とろう！'}
                  </Button>
                ) : isRecording ? (
                  <Button
                    className='w-full text-2xl py-6 rounded-full bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 shadow-lg animate-pulse'
                    onClick={() => {
                      setIsRecording(false);
                      setShowAudio(true);
                      setCountdown(null);
                      setHasRecorded(true);
                      stopRecording();
                    }}>
                    <span className='text-3xl mr-2'>⏹️</span>
                    おわり！
                  </Button>
                ) : null}
              </div>
            </div>
          </div>
        </>
      )}
    />
  );
}
