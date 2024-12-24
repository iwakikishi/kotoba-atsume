import { createClient } from '@supabase/supabase-js';

// 環境変数のデフォルト値を設定
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// クライアントサイドでのみSupabaseクライアントを作成
let supabase: ReturnType<typeof createClient>;

if (typeof window !== 'undefined') {
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false
    }
  });
}

export { supabase };