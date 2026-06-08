'use client';
import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { usersApi, clothingApi } from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';
import { STYLE_OPTIONS, COLOR_SEASONS, FACE_SHAPES, OCCASIONS } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { BarChart3, Sparkles, Shirt, Calendar, User } from 'lucide-react';

export default function ProfilePage() {
  const { user, setUser } = useAuthStore();
  const [saving, setSaving] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [shalOccasion, setShalOccasion] = useState('Günlük');
  const [shalAdvice, setShalAdvice] = useState('');
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    name: user?.name || '',
    city: user?.city || '',
    isModestMode: user?.isModestMode || false,
    colorSeason: user?.colorSeason || '',
    faceShape: user?.faceShape || '',
    stylePreferences: user?.stylePreferences || [],
  });

  const { data: stats } = useQuery({
    queryKey: ['clothing-stats'],
    queryFn: async () => { const { data } = await clothingApi.getStats(); return data; },
  });

  const { data: analysis, refetch: refetchAnalysis } = useQuery({
    queryKey: ['wardrobe-analysis'],
    queryFn: async () => { const { data } = await usersApi.analyzeWardrobe(); return data; },
    enabled: false,
  });

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data } = await usersApi.updateProfile(form);
      setUser({ ...user!, ...data });
      toast.success('Profil güncellendi');
    } catch {
      toast.error('Güncelleme başarısız');
    } finally {
      setSaving(false);
    }
  };

  const handleAnalyze = async () => {
    setAnalyzing(true);
    await refetchAnalysis();
    setAnalyzing(false);
  };

  const handleShalAdvice = async () => {
    try {
      const { data } = await usersApi.getShalAdvice(shalOccasion);
      setShalAdvice(data.advice);
    } catch {
      toast.error('Öneri alınamadı');
    }
  };

  const toggleStyle = (style: string) => {
    setForm(f => ({
      ...f,
      stylePreferences: f.stylePreferences.includes(style)
        ? f.stylePreferences.filter(s => s !== style)
        : [...f.stylePreferences, style],
    }));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Profil & Analiz</h1>
        <p className="text-muted-foreground text-sm">Tercihlerini ayarla, gardırobunu analiz et</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { icon: Shirt, label: 'Kıyafet', value: stats?.totalItems || 0 },
          { icon: Calendar, label: 'Kombin', value: user?._count?.outfits || 0 },
          { icon: BarChart3, label: 'Stil Çeşidi', value: Object.keys(stats?.styleCount || {}).length },
          { icon: User, label: 'Kategori', value: Object.keys(stats?.byCategory || {}).length },
        ].map(({ icon: Icon, label, value }) => (
          <Card key={label}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-rose-50 rounded-lg">
                <Icon className="h-4 w-4 text-rose-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{value}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><User className="h-4 w-4" />Profil Bilgileri</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Ad Soyad</Label>
              <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Şehir</Label>
              <Input value={form.city} placeholder="İstanbul" onChange={e => setForm(f => ({ ...f, city: e.target.value }))} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Tesettür Modu</Label>
                <p className="text-xs text-muted-foreground">Sadece tesettüre uygun kombinler</p>
              </div>
              <Switch checked={form.isModestMode} onCheckedChange={v => setForm(f => ({ ...f, isModestMode: v }))} />
            </div>
            <Separator />
            <div className="space-y-2">
              <Label>Renk Mevsimi</Label>
              <Select value={form.colorSeason} onValueChange={v => setForm(f => ({ ...f, colorSeason: v as string }))}>
                <SelectTrigger><SelectValue placeholder="Seç..." /></SelectTrigger>
                <SelectContent>
                  {COLOR_SEASONS.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Yüz Şekli</Label>
              <Select value={form.faceShape} onValueChange={v => setForm(f => ({ ...f, faceShape: v as string }))}>
                <SelectTrigger><SelectValue placeholder="Seç..." /></SelectTrigger>
                <SelectContent>
                  {FACE_SHAPES.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Stil Tercihlerim</Label>
              <div className="flex flex-wrap gap-2">
                {STYLE_OPTIONS.map(style => (
                  <Badge
                    key={style}
                    variant={form.stylePreferences.includes(style) ? 'default' : 'outline'}
                    className={`cursor-pointer ${form.stylePreferences.includes(style) ? 'bg-rose-600' : ''}`}
                    onClick={() => toggleStyle(style)}
                  >
                    {style}
                  </Badge>
                ))}
              </div>
            </div>
            <Button onClick={handleSave} className="w-full bg-rose-600 hover:bg-rose-700" disabled={saving}>
              {saving ? 'Kaydediliyor...' : 'Kaydet'}
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-rose-500" />Gardırop Analizi
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={handleAnalyze} variant="outline" className="w-full" disabled={analyzing}>
                {analyzing ? 'Analiz yapılıyor...' : 'Gardırobu Analiz Et'}
              </Button>
              {analysis && (
                <>
                  <div>
                    <p className="text-sm font-medium mb-2">Stil Dağılımı</p>
                    {Object.entries(analysis.styleBreakdown || {}).map(([style, pct]) => (
                      <div key={style} className="mb-2">
                        <div className="flex justify-between text-xs mb-1">
                          <span>{style}</span><span>{pct as number}%</span>
                        </div>
                        <Progress value={pct as number} className="h-1.5" />
                      </div>
                    ))}
                  </div>
                  {analysis.missingPieces?.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2">Eksik Parçalar</p>
                      <ul className="space-y-1">
                        {analysis.missingPieces.map((p: string) => (
                          <li key={p} className="text-sm text-muted-foreground flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />{p}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {analysis.suggestion && (
                    <p className="text-sm bg-rose-50 text-rose-800 p-3 rounded-lg">{analysis.suggestion}</p>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {form.isModestMode && (
            <Card>
              <CardHeader><CardTitle className="text-base">Şal Bağlama Önerileri</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <Select value={shalOccasion} onValueChange={v => v && setShalOccasion(v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {OCCASIONS.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Button onClick={handleShalAdvice} variant="outline" className="w-full">Öneri Al</Button>
                {shalAdvice && (
                  <div className="text-sm bg-emerald-50 text-emerald-800 p-3 rounded-lg whitespace-pre-line">{shalAdvice}</div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
