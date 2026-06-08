'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/auth.store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Image from 'next/image';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', city: '' });
  const { register, loading } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await register(form);
      router.replace('/wardrobe');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg || 'Kayıt başarısız');
    }
  };

  return (
    <div
      className="min-h-[100dvh] flex flex-col items-center justify-center bg-gradient-to-br from-rose-50 via-white to-pink-50 px-5"
      style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 rounded-3xl overflow-hidden shadow-lg mb-4">
            <Image src="/icons/icon-192.png" alt="Logo" width={80} height={80} className="w-full h-full object-cover" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Hesap Oluştur</h1>
          <p className="text-sm text-gray-500 mt-1">Smart Wardrobe AI'ya katıl</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Ad Soyad</Label>
              <Input
                placeholder="Adın"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                autoComplete="name"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Şehir</Label>
              <Input
                placeholder="İstanbul"
                value={form.city}
                onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                autoComplete="address-level2"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">E-posta</Label>
            <Input
              type="email"
              placeholder="ornek@email.com"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              autoComplete="email"
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Şifre</Label>
            <Input
              type="password"
              placeholder="En az 6 karakter"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              autoComplete="new-password"
              required
              minLength={6}
            />
          </div>
          <Button
            type="submit"
            className="w-full h-12 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-base mt-2"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Kaydediliyor...
              </span>
            ) : 'Kayıt Ol'}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Hesabın var mı?{' '}
          <Link href="/login" className="text-rose-600 font-semibold">
            Giriş Yap
          </Link>
        </p>
      </div>
    </div>
  );
}
