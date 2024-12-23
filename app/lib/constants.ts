export const HIRAGANA = [
  // 基本的なひらがな（あ行～わ行）
  'あ', 'い', 'う', 'え', 'お',
  'か', 'き', 'く', 'け', 'こ',
  'さ', 'し', 'す', 'せ', 'そ',
  'た', 'ち', 'つ', 'て', 'と',
  'な', 'に', 'ぬ', 'ね', 'の',
  'は', 'ひ', 'ふ', 'へ', 'ほ',
  'ま', 'み', 'む', 'め', 'も',
  'や', 'ゆ', 'よ',
  'ら', 'り', 'る', 'れ', 'ろ',
  'わ', 'を', 'ん',
  // 拗音と濁音・半濁音（画像の表の順序）
  'みゃ', 'びゃ', 'にゃ', 'ちゃ', 'しゃ', 'きゃ', 'ぱ', 'ば', 'だ', 'ざ', 'が',
  'みゅ', 'びゅ', 'にゅ', 'ちゅ', 'しゅ', 'きゅ', 'ぴ', 'び', 'ぢ', 'じ', 'ぎ',
  'みょ', 'びょ', 'にょ', 'ちょ', 'しょ', 'きょ', 'ぷ', 'ぶ', 'づ', 'ず', 'ぐ',
  'りゃ', 'ぴゃ', 'ひゃ', 'じゃ', 'ぎゃ', 'ぺ', 'べ', 'で', 'ぜ', 'げ',
  'りゅ', 'ぴゅ', 'ひゅ', 'じゅ', 'ぎゅ', 'ぽ', 'ぼ', 'ど', 'ぞ', 'ご'
] as const;

// 型定義
type HiraganaKey = typeof HIRAGANA[number];

export const HIRAGANA_MAP: Record<HiraganaKey, string> = {
  // 基本的なひらがな
  'あ': 'a', 'い': 'i', 'う': 'u', 'え': 'e', 'お': 'o',
  'か': 'ka', 'き': 'ki', 'く': 'ku', 'け': 'ke', 'こ': 'ko',
  'さ': 'sa', 'し': 'shi', 'す': 'su', 'せ': 'se', 'そ': 'so',
  'た': 'ta', 'ち': 'chi', 'つ': 'tsu', 'て': 'te', 'と': 'to',
  'な': 'na', 'に': 'ni', 'ぬ': 'nu', 'ね': 'ne', 'の': 'no',
  'は': 'ha', 'ひ': 'hi', 'ふ': 'fu', 'へ': 'he', 'ほ': 'ho',
  'ま': 'ma', 'み': 'mi', 'む': 'mu', 'め': 'me', 'も': 'mo',
  'や': 'ya', 'ゆ': 'yu', 'よ': 'yo',
  'ら': 'ra', 'り': 'ri', 'る': 'ru', 'れ': 're', 'ろ': 'ro',
  'わ': 'wa', 'を': 'wo', 'ん': 'n',
  // 拗音と濁音・半濁音
  'みゃ': 'mya', 'びゃ': 'bya', 'にゃ': 'nya', 'ちゃ': 'cha', 'しゃ': 'sha', 'きゃ': 'kya', 'ぱ': 'pa', 'ば': 'ba', 'だ': 'da', 'ざ': 'za', 'が': 'ga',
  'みゅ': 'myu', 'びゅ': 'byu', 'にゅ': 'nyu', 'ちゅ': 'chu', 'しゅ': 'shu', 'きゅ': 'kyu', 'ぴ': 'pi', 'び': 'bi', 'ぢ': 'ji', 'じ': 'ji', 'ぎ': 'gi',
  'みょ': 'myo', 'びょ': 'byo', 'にょ': 'nyo', 'ちょ': 'cho', 'しょ': 'sho', 'きょ': 'kyo', 'ぷ': 'pu', 'ぶ': 'bu', 'づ': 'zu', 'ず': 'zu', 'ぐ': 'gu',
  'りゃ': 'rya', 'ぴゃ': 'pya', 'ひゃ': 'hya', 'じゃ': 'ja', 'ぎゃ': 'gya', 'ぺ': 'pe', 'べ': 'be', 'で': 'de', 'ぜ': 'ze', 'げ': 'ge',
  'りゅ': 'ryu', 'ぴゅ': 'pyu', 'ひゅ': 'hyu', 'じゅ': 'ju', 'ぎゅ': 'gyu', 'ぽ': 'po', 'ぼ': 'bo', 'ど': 'do', 'ぞ': 'zo', 'ご': 'go'
}; 