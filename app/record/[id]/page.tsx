'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ReactMediaRecorder } from 'react-media-recorder';
import { supabase } from '@/lib/supabase';

// 50音の配列とそのローマ字表記のマッピング
const HIRAGANA_MAP = {
  あ: 'a',
  い: 'i',
  う: 'u',
  え: 'e',
  お: 'o',
  か: 'ka',
  き: 'ki',
  く: 'ku',
  け: 'ke',
  こ: 'ko',
  さ: 'sa',
  し: 'shi',
  す: 'su',
  せ: 'se',
  そ: 'so',
  た: 'ta',
  ち: 'chi',
  つ: 'tsu',
  て: 'te',
  と: 'to',
  な: 'na',
  に: 'ni',
  ぬ: 'nu',
  ね: 'ne',
  の: 'no',
  は: 'ha',
  ひ: 'hi',
  ふ: 'fu',
  へ: 'he',
  ほ: 'ho',
  ま: 'ma',
  み: 'mi',
  む: 'mu',
  め: 'me',
  も: 'mo',
  や: 'ya',
  ゆ: 'yu',
  よ: 'yo',
  ら: 'ra',
  り: 'ri',
  る: 'ru',
  れ: 're',
  ろ: 'ro',
  わ: 'wa',
  を: 'wo',
  ん: 'n',
} as const;

const HIRAGANA = Object.keys(HIRAGANA_MAP);

export default function Record() {
  const params = useParams();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');

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
      render={({ status, startRecording, stopRecording, mediaBlobUrl }) => (
        <div className='min-h-screen flex flex-col items-center justify-center p-8'>
          <h1 className='text-3xl font-bold mb-8'>「{HIRAGANA[currentIndex]}」の音を録音</h1>
          <div className='space-y-6 text-center'>
            <div className='text-6xl font-bold mb-8'>{HIRAGANA[currentIndex]}</div>
            <div className='space-x-4'>
              {!isRecording ? (
                <Button
                  onClick={() => {
                    setIsRecording(true);
                    startRecording();
                  }}
                  disabled={status === 'recording'}>
                  録音開始
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    setIsRecording(false);
                    stopRecording();
                  }}
                  variant='destructive'
                  disabled={status !== 'recording'}>
                  録音停止
                </Button>
              )}
              {mediaBlobUrl && (
                <>
                  <audio src={mediaBlobUrl} controls className='my-4' />
                  <Button
                    onClick={async () => {
                      if (!mediaBlobUrl) return;

                      setUploadStatus('アップロード中...');

                      try {
                        const response = await fetch(mediaBlobUrl);
                        const blob = await response.blob();

                        const currentHiragana = HIRAGANA[currentIndex];
                        const romajiHiragana = HIRAGANA_MAP[currentHiragana as keyof typeof HIRAGANA_MAP];
                        const fileName = `${params.id}/${romajiHiragana}_${Date.now()}.wav`;

                        const { error: uploadError } = await supabase.storage.from('recordings').upload(fileName, blob);

                        if (uploadError) throw uploadError;

                        const { error: dbError } = await supabase.from('recordings').insert([
                          {
                            child_id: params.id,
                            hiragana: currentHiragana,
                            file_path: fileName,
                          },
                        ]);

                        if (dbError) throw dbError;

                        setCurrentIndex((prev) => prev + 1);
                        setUploadStatus('');
                      } catch (error) {
                        console.error('Error:', error);
                        setUploadStatus('エラーが発生しました');
                      }
                    }}
                    disabled={!mediaBlobUrl || uploadStatus === 'アップロード中...'}>
                    次へ
                  </Button>
                </>
              )}
            </div>
            {uploadStatus && <p className='text-sm text-gray-600'>{uploadStatus}</p>}
            <p className='text-sm text-gray-600'>
              進捗: {currentIndex + 1} / {HIRAGANA.length}
            </p>
          </div>
        </div>
      )}
    />
  );
}
