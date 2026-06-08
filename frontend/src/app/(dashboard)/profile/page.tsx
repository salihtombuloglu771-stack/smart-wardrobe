'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
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
import { BarChart3, Sparkles, Shirt, Calendar, User, LogOut } from 'lucide-react';

export default function ProfilePage() {
  const { user, setUser, logout } = useAuthStore();
  const [saving, setSaving] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [shalOccasion, setShalOccasion] = useState('Günlük');
  const [shalAdvice, setShalAdvice] = useState('');

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
    <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-bold">Profil & Analiz</h1>
          <p className="text-muted-foreground text-xs md:text-sm">Tercihlerini ayarla</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-red-500 hover:text-red-600 hover:bg-red-50 md:hidden"
          onClick={logout}
        >
          <LogOut className="h-4 w-4 mr-1" /> Çıkış
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { icon: Shirt, label: 'Kıyafet', value: stats?.totalItems ?? 0 },
          { icon: Calendar, label: 'Kombin', value: user?._count?.outfits ?? 0 },
          { icon: BarChart3, label: 'Stil', value: Object.keys(stats?.styleCount || {}).length },
          { icon: User, label: 'Kategori', value: Object.keys(stats?.byCategory || {}).length },
        ].map(({ icon: Icon, label, value }) => (
          <Card key={label}>
            <CardContent className="p-2.5 flex flex-col items-center gap-1">
              <Icon className="h-4 w-4 text-rose-500" />
              <p className="text-lg font-bold leading-none">{value}</p>
              <p className="text-[10px] text-muted-foreground text-center">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Profile form */}
      <Card>
        <CardHeader className="pb-2 pt-4 px-4">
          <CardTitle className="text-base flex items-center gap-2">
            <User className="h-4 w-4" /> Profil Bilgileri
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Ad Soyad</Label>
              <Input
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="h-11 rounded-xl"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Şehir</Label>
              <Input
                value={form.city}
                placeholder="İstanbul"
                onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                className="h-11 rounded-xl"
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl">
            <div>
              <p className="text-sm font-medium text-emerald-800">Tesettür Modu</p>
              <p className="text-xs text-emerald-600">Sadece uygun kombinler</p>
            </div>
            <Switch
              checked={form.isModestMode}
              onCheckedChange={v => setForm(f => ({ ...f, isModestMode: v }))}
            />
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Renk Mevsimi</Label>
              <Select value={form.colorSeason} onValueChange={(v: string) => setForm(f => ({ ...f, colorSeason: v }))}>
                <SelectTrigger className="h-11 rounded-xl">
                  <SelectValue placeholder="Seç..." />
                </SelectTrigger>
                <SelectContent>
                  {COLOR_SEASONS.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Yüz Şekli</Label>
              <Select value={form.faceShape} onValueChange={(v: string) => setForm(f => ({ ...f, faceShape: v }))}>
                <SelectTrigger className="h-11 rounded-xl">
                  <SelectValue placeholder="Seç..." />
                </SelectTrigger>
                <SelectContent>
                  {FACE_SHAPES.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs">Stil Tercihlerim</Label>
            <div className="flex flex-wrap gap-1.5">
              {STYLE_OPTIONS.map(style => (
                <Badge
                  key={style}
                  variant={form.stylePreferences.includes(style) ? 'default' : 'outline'}
                  className={`cursor-pointer rounded-full text-xs ${
                    form.stylePreferences.includes(style) ? 'bg-rose-600 text-white' : ''
                  }`}
                  onClick={() => toggleStyle(style)}
                >
                  {style}
                </Badge>
              ))}
            </div>
          </div>

          <Button
            onClick={handleSave}
            className="w-full h-11 rounded-xl bg-rose-600 hover:bg-rose-700"
            disabled={saving}
          >
            {saving ? 'Kaydediliyor...' : 'Kaydet'}
          </Button>
        </CardContent>
      </Card>

      {/* Wardrobe analysis */}
      <Card>
        <CardHeader className="pb-2 pt-4 px-4">
          <CardTitle className="text-base flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-rose-500" /> Gardırop Analizi
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4 space-y-3">
          <Button
            onClick={handleAnalyze}
            variant="outline"
            className="w-full h-11 rounded-xl"
            disabled={analyzing}
          >
            {analyzing ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-rose-300 border-t-rose-600 rounded-full animate-spin" />
                Analiz yapılıyor...
              </span>
            ) : 'Gardırobu Analiz Et'}
          </Button>
          {analysis && (
            <>
              <div>
                <p className="text-sm font-medium mb-2">Stil Dağılımı</p>
                {Object.entries(analysis.styleBreakdown || {}).map(([style, pct]) => (
                  <div key={style} className="mb-2">
                    <div className="flex justify-between text-xs mb-0.5">
                      <span className="text-muted-foreground">{style}</span>
                      <span className="font-medium">{pct as number}%</span>
                    </div>
                    <Progress value={pct as number} className="h-2 rounded-full" />
                  </div>
                ))}
              </div>
              {(analysis.missingPieces?.length ?? 0) > 0 && (
                <div>
                  <p className="text-sm font-medium mb-1.5">Eksik Parçalar</p>
                  <div className="space-y-1">
                    {analysis.missingPieces.map((p: string) => (
                      <div key={p} className="text-sm text-muted-foreground flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />{p}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {analysis.suggestion && (
                <p className="text-sm bg-rose-50 text-rose-800 p-3 rounded-xl leading-relaxed">
                  {analysis.suggestion}
                </p>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Scarf advice */}
      {form.isModestMode && (
        <Card>
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-base">Şal Bağlama Önerileri</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 space-y-3">
            <Select value={shalOccasion} onValueChange={v => v && setShalOccasion(v)}>
              <SelectTrigger className="h-11 rounded-xl"><SelectValue /></SelectTrigger>
              <SelectContent>
                {OCCASIONS.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
              </SelectContent>
            </Select>
            <Button onClick={handleShalAdvice} variant="outline" className="w-full h-11 rounded-xl">
              Öneri Al
            </Button>
            {shalAdvice && (
              <div className="text-sm bg-emerald-50 text-emerald-800 p-3 rounded-xl whitespace-pre-line leading-relaxed">
                {shalAdvice}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
