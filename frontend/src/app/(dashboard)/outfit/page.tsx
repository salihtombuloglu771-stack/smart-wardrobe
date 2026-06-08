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
import { Sparkles, Thermometer, Wind, Droplets, Shirt } from 'lucide-react';
import Image from 'next/image';

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
  });

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const { data } = await outfitsApi.generate(occasion);
      setResult(data);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Kombin oluşturulamadı');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Kombin Üret</h1>
        <p className="text-muted-foreground text-sm">AI sana özel kombin oluşturur</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {weather && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <img src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`} alt="hava" className="w-12 h-12" />
                <div>
                  <p className="font-semibold text-lg">{weather.temp}°C</p>
                  <p className="text-sm text-muted-foreground capitalize">{weather.description}</p>
                  <p className="text-xs text-muted-foreground">{weather.city}</p>
                </div>
                <div className="ml-auto text-xs text-muted-foreground space-y-1">
                  <div className="flex items-center gap-1"><Thermometer className="h-3 w-3" />Hissedilen: {weather.feels_like}°C</div>
                  <div className="flex items-center gap-1"><Wind className="h-3 w-3" />Rüzgar: {weather.wind_speed} km/h</div>
                  <div className="flex items-center gap-1"><Droplets className="h-3 w-3" />Nem: {weather.humidity}%</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent className="p-4 space-y-3">
            <div>
              <p className="text-sm font-medium mb-2">Etkinlik</p>
              <Select value={occasion} onValueChange={(v) => v && setOccasion(v)}>
                <SelectTrigger>
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
              <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">Tesettür modu aktif</Badge>
            )}
            <Button onClick={handleGenerate} className="w-full bg-rose-600 hover:bg-rose-700" disabled={generating}>
              <Sparkles className="h-4 w-4 mr-2" />
              {generating ? 'Kombin hazırlanıyor...' : 'Kombin Oluştur'}
            </Button>
          </CardContent>
        </Card>
      </div>

      {result && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Sparkles className="h-5 w-5 text-rose-500" />
                Günün Kombini — {occasion}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-4">
                {result.outfit.items.map(item => (
                  <div key={item.id} className="text-center">
                    <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-gray-100 mb-1">
                      <Image src={item.clothing.imageUrl} alt={item.clothing.name} fill className="object-cover" sizes="150px" />
                    </div>
                    <p className="text-xs font-medium truncate">{item.clothing.name}</p>
                    <p className="text-xs text-muted-foreground">{item.role}</p>
                  </div>
                ))}
              </div>

              <div className="bg-rose-50 rounded-lg p-3 mb-4">
                <p className="text-sm font-medium text-rose-800 mb-1">Neden bu kombin?</p>
                <p className="text-sm text-rose-700">{result.explanation}</p>
              </div>

              <div className="bg-blue-50 rounded-lg p-3 mb-4">
                <p className="text-sm font-medium text-blue-800 mb-1">Renk Analizi</p>
                <p className="text-sm text-blue-700">{result.colorAnalysis}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Renk Uyumu', value: result.outfit.harmonyScore },
                  { label: 'Konfor', value: result.outfit.comfortScore },
                  { label: 'Hava Uyumu', value: result.outfit.weatherScore },
                  { label: 'Toplam Puan', value: result.outfit.totalScore },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">{label}</span>
                      <span className="font-medium">{value}/100</span>
                    </div>
                    <Progress value={value || 0} className="h-1.5" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Button variant="outline" onClick={handleGenerate} disabled={generating} className="w-full">
            Farklı Kombin Dene
          </Button>
        </div>
      )}

      {!result && !generating && (
        <div className="text-center py-16">
          <Shirt className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
          <p className="text-muted-foreground">Etkinliği seç ve AI kombini oluştursun</p>
        </div>
      )}
    </div>
  );
}
