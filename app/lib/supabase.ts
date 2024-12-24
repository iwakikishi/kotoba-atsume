import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

// 環境変数のチェックと初期化
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// クライアントサイドでのみSupabaseクライアントを作成
export const supabase = typeof window !== 'undefined' 
  ? createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
      },
    })
  : null;