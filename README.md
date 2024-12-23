# こどもの音声収集アプリ

子供の発する単音データを収集するためのウェブアプリケーションです。

## 機能

- 子供の基本情報（年齢・性別）の登録
- 50音順での音声録音
- 録音した音声の再生確認
- Supabaseを使用したデータとファイルの保存

## 技術スタック

- [Next.js](https://nextjs.org) - Reactフレームワーク
- [Tailwind CSS](https://tailwindcss.com) - スタイリング
- [Supabase](https://supabase.com) - バックエンド（データベース・ストレージ）
- [shadcn/ui](https://ui.shadcn.com) - UIコンポーネント

## セットアップ

1. リポジトリのクローン:
```bash
git clone [your-repo-url]
cd kotoba-atsume
```

2. 依存関係のインストール:
```bash
npm install
```

3. 環境変数の設定:
`.env.local`ファイルを作成し、以下の変数を設定:
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

4. Supabaseの設定:
以下のSQLを実行してテーブルを作成:
```sql
-- childrenテーブル
create table children (
  id uuid default uuid_generate_v4() primary key,
  age integer not null,
  gender text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- recordingsテーブル
create table recordings (
  id uuid default uuid_generate_v4() primary key,
  child_id uuid references children(id) not null,
  hiragana text not null,
  file_path text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

5. 開発サーバーの起動:
```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000)でアプリケーションにアクセスできます。

## 使い方

1. トップページの「はじめる」ボタンをクリック
2. 子供の年齢（4-8歳）と性別を入力
3. 「あ」から順番に音声を録音
4. 録音した音声を確認して「次へ」をクリック
5. すべての音声の録音が完了するまで繰り返し

## ライセンス

[MIT License](LICENSE)
