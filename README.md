# Smart Wardrobe AI

Akıllı gardırop ve kombin asistanı.

## Kurulum

### Gereksinimler
- Node.js 18+
- PostgreSQL
- OpenAI API key
- Cloudinary hesabı
- OpenWeather API key

### Backend

```bash
cd backend
cp .env.example .env  # .env içindeki değerleri doldur
npm install
npx prisma migrate dev
npm run start:dev
```

### Frontend

```bash
cd frontend
cp .env.local.example .env.local  # değerleri doldur
npm install
npm run dev
```

## API Anahtarları

`backend/.env` dosyasını düzenle:

| Değişken | Nereden |
|---|---|
| `DATABASE_URL` | PostgreSQL bağlantı string |
| `JWT_SECRET` | Rastgele güçlü bir string |
| `OPENAI_API_KEY` | platform.openai.com |
| `CLOUDINARY_*` | cloudinary.com/console |
| `OPENWEATHER_API_KEY` | openweathermap.org/api |

## Özellikler

- Kıyafet yükleme + AI analiz (GPT-4o Vision)
- Hava durumuna göre kombin önerisi
- Tesettür modu
- Renk mevsimi analizi
- Şal bağlama önerileri
- Kombin takvimi
- Gardırop analizi & eksik parça tespiti
