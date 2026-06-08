export type ClothingCategory =
  | 'UST' | 'ALT' | 'DIS_GIYIM' | 'ELBISE'
  | 'SAL' | 'AYAKKABI' | 'CANTA' | 'AKSESUAR'
  | 'IC_GIYIM' | 'SPOR';

export type Season = 'ILKBAHAR' | 'YAZ' | 'SONBAHAR' | 'KIS' | 'TUM_MEVSIMLER';

export interface Clothing {
  id: string;
  userId: string;
  name: string;
  category: ClothingCategory;
  color: string;
  secondaryColor?: string;
  pattern?: string;
  fabric?: string;
  season: Season[];
  style: string[];
  fit?: string;
  imageUrl: string;
  thumbnailUrl?: string;
  isModest: boolean;
  notes?: string;
  timesWorn: number;
  lastWornAt?: string;
  createdAt: string;
}

export interface OutfitItem {
  id: string;
  outfitId: string;
  clothingId: string;
  role?: string;
  clothing: Clothing;
}

export interface Outfit {
  id: string;
  userId: string;
  name?: string;
  date: string;
  occasion?: string;
  weatherData?: WeatherData;
  totalScore?: number;
  harmonyScore?: number;
  comfortScore?: number;
  weatherScore?: number;
  notes?: string;
  items: OutfitItem[];
  createdAt: string;
}

export interface WeatherData {
  temp: number;
  feels_like: number;
  humidity: number;
  wind_speed: number;
  description: string;
  rain: boolean;
  snow: boolean;
  city: string;
  icon: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  city?: string;
  avatarUrl?: string;
  isModestMode: boolean;
  colorSeason?: string;
  faceShape?: string;
  stylePreferences: string[];
  _count?: { clothes: number; outfits: number };
}

export const CATEGORY_LABELS: Record<ClothingCategory, string> = {
  UST: 'Üst',
  ALT: 'Alt',
  DIS_GIYIM: 'Dış Giyim',
  ELBISE: 'Elbise / Tunik',
  SAL: 'Şal / Eşarp',
  AYAKKABI: 'Ayakkabı',
  CANTA: 'Çanta',
  AKSESUAR: 'Aksesuar',
  IC_GIYIM: 'İç Giyim',
  SPOR: 'Spor',
};

export const SEASON_LABELS: Record<Season, string> = {
  ILKBAHAR: 'İlkbahar',
  YAZ: 'Yaz',
  SONBAHAR: 'Sonbahar',
  KIS: 'Kış',
  TUM_MEVSIMLER: 'Tüm Mevsimler',
};

export const OCCASIONS = [
  'Günlük', 'İş', 'İş Görüşmesi', 'Okul', 'Yüksek Lisans Dersi',
  'Arkadaş Buluşması', 'Akşam Yemeği', 'Düğün / Nişan', 'Spor',
  'Seyahat', 'Özel Gün', 'Alışveriş',
];

export const STYLE_OPTIONS = [
  'Casual', 'Formal', 'Business', 'Vintage', 'Old Money',
  'Minimalist', 'Bohemian', 'Sporty', 'Streetwear', 'Romantic',
  'Dark Academia', 'Cottagecore', 'Y2K',
];

export const COLOR_SEASONS = [
  { value: 'soft-spring', label: 'Soft Spring' },
  { value: 'warm-spring', label: 'Warm Spring' },
  { value: 'light-spring', label: 'Light Spring' },
  { value: 'soft-summer', label: 'Soft Summer' },
  { value: 'cool-summer', label: 'Cool Summer' },
  { value: 'light-summer', label: 'Light Summer' },
  { value: 'soft-autumn', label: 'Soft Autumn' },
  { value: 'warm-autumn', label: 'Warm Autumn' },
  { value: 'deep-autumn', label: 'Deep Autumn' },
  { value: 'soft-winter', label: 'Soft Winter' },
  { value: 'cool-winter', label: 'Cool Winter' },
  { value: 'deep-winter', label: 'Deep Winter' },
];

export const FACE_SHAPES = [
  { value: 'oval', label: 'Oval' },
  { value: 'round', label: 'Yuvarlak' },
  { value: 'square', label: 'Kare' },
  { value: 'heart', label: 'Kalp' },
  { value: 'oblong', label: 'Uzun / Dikdörtgen' },
  { value: 'diamond', label: 'Elmas' },
];
