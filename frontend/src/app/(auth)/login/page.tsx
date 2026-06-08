'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/auth.store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import { Download, X } from 'lucide-react';

const APK_URL = 'https://github.com/salihtombuloglu771-stack/smart-wardrobe/releases/download/v1.0.0/smart-wardrobe.apk';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showBanner, setShowBanner] = useState(false);
  const { login, loading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const ua = navigator.userAgent;
    const isAndroid = /android/i.test(ua);
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    if (isAndroid && !isStandalone) setShowBanner(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await login(email, password);
      router.replace('/wardrobe');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg || 'Giriş başarısız');
    }
  };

  return (
    <div
      className="min-h-[100dvh] flex flex-col items-center justify-center bg-gradient-to-br from-rose-50 via-white to-pink-50 px-5"
      style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {/* Android install banner */}
      {showBanner && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-gray-900 text-white px-4 py-3 flex items-center gap-3"
          style={{ paddingTop: 'max(12px, env(safe-area-inset-top))' }}>
          <div className="w-9 h-9 rounded-xl overflow-hidden shrink-0">
            <Image src="/icons/icon-192.png" alt="Logo" width={36} height={36} className="w-full h-full" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold leading-tight">Uygulamayı yükle</p>
            <p className="text-xs text-gray-300 leading-tight">Daha hızlı erişim için</p>
          </div>
          <a
            href={APK_URL}
            className="shrink-0 bg-rose-600 active:bg-rose-700 text-white text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5"
          >
            <Download className="h-3.5 w-3.5" /> İndir
          </a>
          <button onClick={() => setShowBanner(false)} className="shrink-0 p-1 text-gray-400">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="w-full max-w-sm" style={{ paddingTop: showBanner ? '64px' : '0' }}>
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 rounded-3xl overflow-hidden shadow-lg mb-4">
            <Image src="/icons/icon-192.png" alt="Logo" width={80} height={80} className="w-full h-full object-cover" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Smart Wardrobe</h1>
          <p className="text-sm text-gray-500 mt-1">AI destekli gardırop asistanın</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">E-posta</Label>
            <Input
              type="email"
              placeholder="ornek@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Şifre</Label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
              required
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
                Giriş yapılıyor...
              </span>
            ) : 'Giriş Yap'}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Hesabın yok mu?{' '}
          <Link href="/register" className="text-rose-600 font-semibold">
            Kayıt Ol
          </Link>
        </p>

        {/* Android download link (always visible on Android) */}
        <div className="mt-8 pt-6 border-t border-gray-100">
          <a
            href={APK_URL}
            className="flex items-center justify-center gap-2 w-full h-11 rounded-2xl border-2 border-gray-200 text-gray-600 text-sm font-medium active:bg-gray-50 transition-colors"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-[#3DDC84]">
              <path d="M17.523 15.341a.66.66 0 0 1-.66.66H7.137a.66.66 0 0 1-.66-.66V8.66c0-.365.295-.66.66-.66h9.726c.365 0 .66.295.66.66v6.681zm-5.523 3.3a.66.66 0 1 1 0-1.32.66.66 0 0 1 0 1.32zM8.456 2.988l1.152 1.993a.132.132 0 0 1-.048.18.132.132 0 0 1-.18-.047L8.22 3.108a7.784 7.784 0 0 0-3.592 6.552H19.37a7.784 7.784 0 0 0-3.592-6.552L14.62 5.114a.132.132 0 0 1-.18.047.132.132 0 0 1-.048-.18l1.152-1.993A7.85 7.85 0 0 0 12 2.34a7.85 7.85 0 0 0-3.544.648z"/>
            </svg>
            Android Uygulamasını İndir (.apk)
          </a>
          <p className="text-center text-xs text-gray-400 mt-2">
            Yüklerken "Yine de yükle" seç
          </p>
        </div>
      </div>
    </div>
  );
}
