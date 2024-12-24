'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ReactMediaRecorder } from 'react-media-recorder';
import { supabase } from '@/lib/supabase';

// 50音の配列とそのローマ字表記のマッピング
const HIRAGANA_MAP = {
  // あ行
  あ: 'a',
  い: 'i',
  う: 'u',
  え: 'e',
  お: 'o',

  // か行
  か: 'ka',
  き: 'ki',
  く: 'ku',
  け: 'ke',
  こ: 'ko',

  // さ行
  さ: 'sa',
  し: 'shi',
  す: 'su',
  せ: 'se',
  そ: 'so',

  // た行
  た: 'ta',
  ち: 'chi',
  つ: 'tsu',
  て: 'te',
  と: 'to',

  // な行
  な: 'na',
  に: 'ni',
  ぬ: 'nu',
  ね: 'ne',
  の: 'no',

  // は行
  は: 'ha',
  ひ: 'hi',
  ふ: 'fu',
  へ: 'he',
  ほ: 'ho',

  // ま行
  ま: 'ma',
  み: 'mi',
  む: 'mu',
  め: 'me',
  も: 'mo',

  // や行
  や: 'ya',
  ゆ: 'yu',
  よ: 'yo',

  // ら行
  ら: 'ra',
  り: 'ri',
  る: 'ru',
  れ: 're',
  ろ: 'ro',

  // わ行
  わ: 'wa',
  を: 'wo',
  ん: 'n',

  // 濁音・半濁音（が行〜ぱ行）
  が: 'ga',
  ぎ: 'gi',
  ぐ: 'gu',
  げ: 'ge',
  ご: 'go',

  ざ: 'za',
  じ: 'ji',
  ず: 'zu',
  ぜ: 'ze',
  ぞ: 'zo',

  だ: 'da',
  ぢ: 'ji',
  づ: 'zu',
  で: 'de',
  ど: 'do',

  ば: 'ba',
  び: 'bi',
  ぶ: 'bu',
  べ: 'be',
  ぼ: 'bo',

  ぱ: 'pa',
  ぴ: 'pi',
  ぷ: 'pu',
  ぺ: 'pe',
  ぽ: 'po',

  // 拗音（きゃ行など）
  みゃ: 'mya',
  みゅ: 'myu',
  みょ: 'myo',
  びゃ: 'bya',
  びゅ: 'byu',
  びょ: 'byo',
  にゃ: 'nya',
  にゅ: 'nyu',
  にょ: 'nyo',
  ちゃ: 'cha',
  ちゅ: 'chu',
  ちょ: 'cho',
  じゃ: 'ja',
  じゅ: 'ju',
  じょ: 'jo',
  ぎゃ: 'gya',
  ぎゅ: 'gyu',
  ぎょ: 'gyo',
  りゃ: 'rya',
  りゅ: 'ryu',
  りょ: 'ryo',
  ひゃ: 'hya',
  ひゅ: 'hyu',
  ひょ: 'hyo',
} as const;

const HIRAGANA = Object.keys(HIRAGANA_MAP);

export default function Record() {
  const params = useParams();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [showAudio, setShowAudio] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [countdown, setCountdown] = useState<number | null>(null);
  const [hasRecorded, setHasRecorded] = useState(false);

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

  const startNewRecording = async (startRecording: () => void) => {
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

  if (currentIndex >= HIRAGANA.length) {
    return (
      <div className='min-h-screen flex flex-col items-center justify-center p-8'>
        <h1 className='text-3xl font-bold mb-8'>録音完了</h1>
        <p className='text-lg mb-8'>
          すべての音声の録音が完了しました。
          <br />
          ご協力ありがとうございました。
        </p>
      </div>
    );
  }

  return (
    <ReactMediaRecorder
      audio
      render={({ startRecording, stopRecording, mediaBlobUrl }) => (
        <div className='min-h-screen flex flex-col items-center justify-center p-8'>
          <h1 className='text-3xl font-bold mb-8'>「{HIRAGANA[currentIndex]}」の音を録音</h1>
          <div className='space-y-6 text-center'>
            <div className='text-6xl font-bold mb-8'>{HIRAGANA[currentIndex]}</div>
            {countdown !== null && <div className='text-8xl font-bold mb-8 text-blue-500'>{countdown === 0 ? 'スタート！' : countdown}</div>}
            <div className='space-x-4'>
              {!isRecording && countdown === null ? (
                <Button variant='outline' className='text-lg px-4 py-2' onClick={() => startNewRecording(() => startRecording())}>
                  {hasRecorded ? 'もう一度録音' : '録音開始'}
                </Button>
              ) : isRecording ? (
                <Button
                  className='text-lg px-4 py-2'
                  onClick={() => {
                    setIsRecording(false);
                    setShowAudio(true);
                    setCountdown(null);
                    setHasRecorded(true);
                    stopRecording();
                  }}>
                  録音停止
                </Button>
              ) : null}
              {showAudio && mediaBlobUrl && (
                <>
                  <audio src={mediaBlobUrl} controls className='my-4' />
                  <Button
                    variant='default'
                    className='text-lg px-4 py-2'
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

                        const result = await supabase.storage.from('recordings').upload(filePath, file, {
                          cacheControl: '3600',
                          upsert: true,
                        });

                        if (result.error) {
                          console.error('Upload error details:', {
                            error: result.error,
                            message: result.error.message,
                            statusCode: result.error.statusCode,
                            path: filePath,
                          });
                          throw new Error(`アップロードエラー: ${result.error.message || 'ストレージへの接続に失敗しました'}`);
                        }

                        console.log('Upload success:', result.data);

                        // アップロード成功後に古いファイルを削除
                        try {
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
                    {uploadStatus || '次へ'}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    />
  );
}
