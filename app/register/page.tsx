'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/app/components/ui/button';
import { supabase } from '@/app/lib/supabase';

export default function Register() {
  const router = useRouter();
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!supabase) {
        throw new Error('Supabase client not initialized');
      }

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
    <div className='min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-blue-50 to-pink-50'>
      <h1 className='text-3xl font-bold mb-8 text-blue-600'>はじめまして！</h1>
      <form onSubmit={handleSubmit} className='w-full max-w-md space-y-6 bg-white/90 p-6 rounded-3xl shadow-lg border-4 border-blue-200'>
        <div>
          <label className='block text-xl font-medium mb-2 text-blue-600'>
            なんさい？
            <select
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className='h-14 mt-2 block w-full rounded-full border-2 border-pink-400 p-2 text-gray-900 bg-white text-xl'
              required>
              <option value=''>えらんでね</option>
              {Array.from({ length: 5 }, (_, i) => i + 4).map((num) => (
                <option key={num} value={num}>
                  {num}さい
                </option>
              ))}
            </select>
          </label>
        </div>
        <div>
          <label className='block text-xl font-medium mb-2 text-blue-600'>
            おとこのこ？おんなのこ？
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className='h-14 mt-2 block w-full rounded-full border-2 border-pink-400 p-2 text-gray-900 bg-white text-xl'
              required>
              <option value=''>えらんでね</option>
              <option value='male'>おとこのこ</option>
              <option value='female'>おんなのこ</option>
              <option value='other'>そのほか</option>
            </select>
          </label>
        </div>
        <Button
          type='submit'
          disabled={isLoading}
          className='w-full text-2xl py-6 rounded-full bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 shadow-lg transform hover:scale-105 transition-transform'>
          <span className='text-3xl mr-2'>✨</span>
          {isLoading ? 'ちょっとまってね...' : 'はじめる！'}
        </Button>
      </form>
    </div>
  );
}
