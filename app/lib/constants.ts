export const HIRAGANA_MAP = {
  // あ行
  あ: 'a',
  い: 'i',
  う: 'u',
  え: 'e',
  お: 'o',
  // ... 残りのマッピング
} as const;

export const HIRAGANA = Object.keys(HIRAGANA_MAP); 