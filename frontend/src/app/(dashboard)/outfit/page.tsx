'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { outfitsApi, weatherApi } from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';
import { Outfit, WeatherData, OCCASIONS } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sparkles, Thermometer, Wind, Droplets, Shirt, RefreshCw } from 'lucide-react';
import Image from 'next/image';

const WEATHER_EMOJI: Record<string, string> = {
  '01d': '☀️', '01n': '🌙', '02d': '⛅', '02n': '⛅',
  '03d': '☁️', '03n': '☁️', '04d': '☁️', '04n': '☁️',
  '09d': '🌧️', '09n': '🌧️', '10d': '🌦️', '10n': '🌦️',
  '11d': '⛈️', '11n': '⛈️', '13d': '❄️', '13n': '❄️',
  '50d': '🌫️', '50n': '🌫️',
};

export default function OutfitPage() {
  const { user } = useAuthStore();
  const [occasion, setOccasion] = useState('Günlük');
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<{ outfit: Outfit; explanation: string; colorAnalysis: string } | null>(null);

  const { data: weather } = useQuery<WeatherData>({
    queryKey: ['weather', user?.city],
    queryFn: async () => {
      const { data } = await weatherApi.get(user?.city || 'Istanbul');
      return data;
    },
    enabled: !!user,
    staleTime: 10 * 60 * 1000,
  });

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const { data } = await outfitsApi.generate(occasion);
      setResult(data);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg || 'Kombin oluşturulamadı');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <div className="mb-4">
        <h1 className="text-xl md:text-2xl font-bold">Kombin Üret</h1>
        <p className="text-muted-foreground text-xs md:text-sm">AI sana özel kombin oluşturur</p>
      </div>

      {/* Weather + Occasion selector */}
      <div className="space-y-3 mb-5">
        {weather && (
          <Card>
            <CardContent className="p-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{WEATHER_EMOJI[weather.icon] ?? '🌤️'}</span>
                <div className="flex-1">
                  <div className="flex items-baseline gap-1.5">
                    <p className="font-bold text-xl">{weather.temp}°C</p>
                    <p className="text-sm text-muted-foreground capitalize">{weather.description}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">{weather.city}</p>
                </div>
                <div className="text-right text-xs text-muted-foreground space-y-0.5">
                  <div className="flex items-center gap-1 justify-end">
                    <Thermometer className="h-3 w-3" />{weather.feels_like}°C
                  </div>
                  <div className="flex items-center gap-1 justify-end">
                    <Wind className="h-3 w-3" />{weather.wind_speed} km/h
                  </div>
                  <div className="flex items-center gap-1 justify-end">
                    <Droplets className="h-3 w-3" />{weather.humidity}%
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent className="p-3 space-y-3">
            <div>
              <p className="text-sm font-medium mb-2">Etkinlik</p>
              <Select value={occasion} onValueChange={v => v && setOccasion(v)}>
                <SelectTrigger className="h-11 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {OCCASIONS.map(o => (
                    <SelectItem key={o} value={o}>{o}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {user?.isModestMode && (
              <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 text-xs">
                ✓ Tesettür modu aktif
              </Badge>
            )}
            <Button
              onClick={handleGenerate}
              className="w-full h-12 rounded-xl bg-rose-600 hover:bg-rose-700 text-base font-semibold"
              disabled={generating}
            >
              {generating ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Kombin hazırlanıyor...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" /> Kombin Oluştur
                </span>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Empty state */}
      {!result && !generating && (
        <div className="text-center py-14">
          <div className="p-5 bg-rose-50 rounded-full w-fit mx-auto mb-3">
            <Shirt className="h-12 w-12 text-rose-300" />
          </div>
          <p className="text-muted-foreground text-sm">Etkinliği seç ve AI kombini oluştursun</p>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="space-y-3">
          <Card>
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="flex items-center gap-2 text-base">
                <Sparkles className="h-4 w-4 text-rose-500" />
                {occasion} Kombini
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              {/* Outfit items grid */}
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-4">
                {result.outfit.items.map(item => (
                  <div key={item.id} className="text-center">
                    <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-gray-100 mb-1">
                      <Image
                        src={item.clothing.imageUrl}
                        alt={item.clothing.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 33vw, 25vw"
                      />
                    </div>
                    <p className="text-xs font-medium truncate leading-tight">{item.clothing.name}</p>
                    {item.role && <p className="text-[10px] text-muted-foreground">{item.role}</p>}
                  </div>
                ))}
              </div>

              {/* Explanation */}
              <div className="bg-rose-50 rounded-xl p-3 mb-3">
                <p className="text-xs font-semibold text-rose-700 mb-1">Neden bu kombin?</p>
                <p className="text-sm text-rose-800 leading-relaxed">{result.explanation}</p>
              </div>

              {/* Color analysis */}
              <div className="bg-blue-50 rounded-xl p-3 mb-4">
                <p className="text-xs font-semibold text-blue-700 mb-1">Renk Analizi</p>
                <p className="text-sm text-blue-800 leading-relaxed">{result.colorAnalysis}</p>
              </div>

              {/* Scores */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Renk Uyumu', value: result.outfit.harmonyScore },
                  { label: 'Konfor', value: result.outfit.comfortScore },
                  { label: 'Hava Uyumu', value: result.outfit.weatherScore },
                  { label: 'Toplam', value: result.outfit.totalScore },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">{label}</span>
                      <span className="font-semibold">{value ?? 0}/100</span>
                    </div>
                    <Progress value={value ?? 0} className="h-2 rounded-full" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Button
            variant="outline"
            onClick={handleGenerate}
            disabled={generating}
            className="w-full h-11 rounded-xl"
          >
            <RefreshCw className="h-4 w-4 mr-2" /> Farklı Kombin Dene
          </Button>
        </div>
      )}
    </div>
  );
}
