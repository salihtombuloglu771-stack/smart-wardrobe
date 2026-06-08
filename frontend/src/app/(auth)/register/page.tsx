'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/auth.store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shirt } from 'lucide-react';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', city: '' });
  const { register, loading } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(form);
      router.replace('/wardrobe');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Kayıt başarısız');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-pink-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="p-3 bg-rose-100 rounded-full">
              <Shirt className="h-8 w-8 text-rose-600" />
            </div>
          </div>
          <CardTitle className="text-2xl">Hesap Oluştur</CardTitle>
          <CardDescription>Smart Wardrobe AI'ya katıl</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Ad Soyad</Label>
              <Input id="name" placeholder="Adın" value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-posta</Label>
              <Input id="email" type="email" placeholder="ornek@email.com" value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Şifre</Label>
              <Input id="password" type="password" placeholder="En az 6 karakter" value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required minLength={6} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">Şehir <span className="text-muted-foreground">(opsiyonel)</span></Label>
              <Input id="city" placeholder="İstanbul" value={form.city}
                onChange={e => setForm(f => ({ ...f, city: e.target.value }))} />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Kaydediliyor...' : 'Kayıt Ol'}
            </Button>
          </form>
          <p className="text-center text-sm text-muted-foreground mt-4">
            Hesabın var mı?{' '}
            <Link href="/login" className="text-rose-600 hover:underline font-medium">
              Giriş Yap
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
