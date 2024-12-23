'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';

export default function Register() {
  const router = useRouter();
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from('children')
        .insert([
          {
            age: parseInt(age),
            gender,
            created_at: new Date().toISOString(),
          },
        ])
        .select();

      if (error) throw error;

      if (data && data[0]) {
        router.push(`/record/${data[0].id}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('エラーが発生しました。もう一度お試しください。');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex flex-col items-center justify-center p-8'>
      <h1 className='text-3xl font-bold mb-8'>基本情報の登録</h1>
      <form onSubmit={handleSubmit} className='w-full max-w-md space-y-6'>
        <div>
          <label className='block text-sm font-medium mb-2'>
            年齢
            <select
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className='mt-1 block w-full rounded-md border border-gray-300 p-2 text-gray-900 bg-white'
              required>
              <option value=''>選択してください</option>
              {Array.from({ length: 5 }, (_, i) => i + 4).map((num) => (
                <option key={num} value={num}>
                  {num}歳
                </option>
              ))}
            </select>
          </label>
        </div>
        <div>
          <label className='block text-sm font-medium mb-2'>
            性別
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className='mt-1 block w-full rounded-md border border-gray-300 p-2 text-gray-900 bg-white'
              required>
              <option value=''>選択してください</option>
              <option value='male'>男性</option>
              <option value='female'>女性</option>
              <option value='other'>その他</option>
            </select>
          </label>
        </div>
        <Button type='submit' disabled={isLoading} className='w-full'>
          {isLoading ? '登録中...' : '次へ'}
        </Button>
      </form>
    </div>
  );
}
