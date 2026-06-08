'use client';
import Image from 'next/image';
import { Clothing, CATEGORY_LABELS } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Trash2 } from 'lucide-react';

const COLOR_MAP: Record<string, string> = {
  siyah: '#111111', beyaz: '#f9f9f9', bej: '#f0e8d5', krem: '#fffdd0',
  gri: '#9ca3af', 'açık gri': '#d1d5db', 'koyu gri': '#4b5563',
  lacivert: '#1e3a5f', mavi: '#3b82f6', 'açık mavi': '#93c5fd', 'koyu mavi': '#1e40af',
  kırmızı: '#ef4444', 'koyu kırmızı': '#991b1b', bordo: '#881337',
  pembe: '#f9a8d4', 'açık pembe': '#fce7f3', fuşya: '#e879f9',
  turuncu: '#f97316', sarı: '#facc15', hardal: '#ca8a04',
  yeşil: '#22c55e', 'açık yeşil': '#86efac', 'koyu yeşil': '#15803d',
  haki: '#a3956a', mint: '#6ee7b7', zeytin: '#65a30d',
  mor: '#a855f7', leylak: '#c084fc', 'mürdüm': '#7e22ce',
  kahverengi: '#92400e', 'açık kahverengi': '#d97706', taba: '#c19a6b',
  altın: '#fbbf24', gümüş: '#9ca3af', bronz: '#cd7f32',
};

function getColorHex(color: string): string {
  const key = color.toLowerCase().trim();
  return COLOR_MAP[key] ?? (key.startsWith('#') ? key : '#e5e7eb');
}

interface Props {
  item: Clothing;
  onDelete: (id: string) => void;
}

export function ClothingCard({ item, onDelete }: Props) {
  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-[3/4] bg-gray-100">
        <Image
          src={item.imageUrl}
          alt={item.name}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
        />
        <button
          onClick={() => onDelete(item.id)}
          className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow active:scale-90 transition-transform"
          aria-label="Sil"
        >
          <Trash2 className="h-4 w-4 text-red-500" />
        </button>
        {item.isModest && (
          <Badge className="absolute bottom-2 left-2 bg-emerald-600 text-white text-xs">Tesettür</Badge>
        )}
      </div>
      <CardContent className="p-2.5">
        <p className="font-medium text-sm truncate leading-tight">{item.name}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{CATEGORY_LABELS[item.category]}</p>
        <div className="flex items-center gap-1.5 mt-1.5">
          <div
            className="w-3.5 h-3.5 rounded-full border border-gray-200 shrink-0"
            style={{ backgroundColor: getColorHex(item.color) }}
          />
          <span className="text-xs text-muted-foreground truncate">{item.color}</span>
          {item.timesWorn > 0 && (
            <span className="text-xs text-muted-foreground ml-auto shrink-0">{item.timesWorn}x</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
