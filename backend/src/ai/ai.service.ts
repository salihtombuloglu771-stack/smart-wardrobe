import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

interface ClothingAnalysis {
  name: string;
  category: string;
  color: string;
  secondaryColor?: string;
  pattern?: string;
  fabric?: string;
  season: string[];
  style: string[];
  fit?: string;
  isModest: boolean;
}

interface OutfitSuggestion {
  items: Array<{ clothingId: string; role: string }>;
  explanation: string;
  harmonyScore: number;
  comfortScore: number;
  weatherScore: number;
  totalScore: number;
  colorAnalysis: string;
}

@Injectable()
export class AiService {
  private openai: OpenAI;

  constructor(private config: ConfigService) {
    this.openai = new OpenAI({ apiKey: this.config.get('OPENAI_API_KEY') });
  }

  async analyzeClothing(imageUrl: string): Promise<ClothingAnalysis> {
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: { url: imageUrl, detail: 'high' },
            },
            {
              type: 'text',
              text: `Bu kıyafeti analiz et ve JSON formatında döndür. Türkçe yanıt ver.

{
  "name": "kıyafet adı (örn: Beyaz Oversize Gömlek)",
  "category": "UST | ALT | DIS_GIYIM | ELBISE | SAL | AYAKKABI | CANTA | AKSESUAR | IC_GIYIM | SPOR",
  "color": "ana renk Türkçe",
  "secondaryColor": "ikincil renk varsa",
  "pattern": "desen (düz, çizgili, ekose, çiçekli, baskılı vs.)",
  "fabric": "kumaş türü (pamuk, polyester, denim, vs.)",
  "season": ["ILKBAHAR", "YAZ", "SONBAHAR", "KIS", "TUM_MEVSIMLER"],
  "style": ["Casual", "Formal", "Vintage", "Sporty", "Old Money", "Minimalist", "Bohemian", "vs."],
  "fit": "Slim | Regular | Oversize | Loose",
  "isModest": true/false (tesettüre uygun mu - uzun, kapalı giysiler)
}

Sadece JSON döndür, başka bir şey ekleme.`,
            },
          ],
        },
      ],
      max_tokens: 500,
    });

    const content = response.choices[0].message.content || '{}';
    const cleaned = content.replace(/```json\n?|\n?```/g, '').trim();
    return JSON.parse(cleaned);
  }

  async generateOutfit(params: {
    wardrobe: Array<{ id: string; name: string; category: string; color: string; style: string[]; season: string[]; isModest: boolean }>;
    weather: { temp: number; feels_like: number; description: string; rain: boolean };
    occasion: string;
    isModestMode: boolean;
    userStyle: string[];
    recentOutfits?: string[];
  }): Promise<OutfitSuggestion> {
    const prompt = `Sen bir moda uzmanısın. Aşağıdaki bilgilere göre en uygun kombini oluştur.

HAVA DURUMU:
- Sıcaklık: ${params.weather.temp}°C (hissedilen: ${params.weather.feels_like}°C)
- Durum: ${params.weather.description}
- Yağmur: ${params.weather.rain ? 'Evet' : 'Hayır'}

ETKİNLİK: ${params.occasion}

KULLANICI STİLİ: ${params.userStyle.join(', ') || 'Belirtilmemiş'}

TESETTÜR MODU: ${params.isModestMode ? 'Evet - sadece tesettüre uygun parçalar kullan' : 'Hayır'}

GARDIROPTAKI PARÇALAR:
${JSON.stringify(params.wardrobe, null, 2)}

${params.recentOutfits?.length ? `SON KOMBINLER (bunları tekrar etme): ${params.recentOutfits.join(', ')}` : ''}

Şu formatta JSON döndür:
{
  "items": [
    {"clothingId": "id", "role": "Üst/Alt/Dış Giyim/Şal/Ayakkabı/Çanta"},
  ],
  "explanation": "Kombini neden seçtin? 2-3 cümle.",
  "harmonyScore": 0-100,
  "comfortScore": 0-100,
  "weatherScore": 0-100,
  "totalScore": 0-100,
  "colorAnalysis": "Renk uyumu açıklaması"
}

Sadece JSON döndür.`;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 800,
    });

    const content = response.choices[0].message.content || '{}';
    const cleaned = content.replace(/```json\n?|\n?```/g, '').trim();
    return JSON.parse(cleaned);
  }

  async analyzeWardrobeStyle(clothes: Array<{ style: string[]; color: string; category: string }>): Promise<{
    styleBreakdown: Record<string, number>;
    colorPalette: string[];
    missingPieces: string[];
    suggestion: string;
  }> {
    const prompt = `Aşağıdaki gardırobu analiz et ve JSON formatında döndür:

${JSON.stringify(clothes, null, 2)}

{
  "styleBreakdown": {"Casual": 40, "Vintage": 30, ...},
  "colorPalette": ["en çok kullanılan 5 renk"],
  "missingPieces": ["eksik parça önerileri - en az 5"],
  "suggestion": "Gardırop hakkında genel öneri"
}

Sadece JSON döndür.`;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 600,
    });

    const content = response.choices[0].message.content || '{}';
    const cleaned = content.replace(/```json\n?|\n?```/g, '').trim();
    return JSON.parse(cleaned);
  }

  async getShalTyingAdvice(faceShape: string, occasion: string): Promise<string> {
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: `${faceShape} yüz şekline sahip biri için ${occasion} etkinliğine uygun şal bağlama yöntemlerini öner. 3-4 farklı yöntem, kısa açıklamalarla Türkçe anlat.`,
        },
      ],
      max_tokens: 400,
    });
    return response.choices[0].message.content || '';
  }
}
