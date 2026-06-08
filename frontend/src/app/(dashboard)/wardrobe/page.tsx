'use client';
import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { clothingApi } from '@/lib/api';
import { Clothing, CATEGORY_LABELS, ClothingCategory } from '@/types';
import { ClothingCard } from '@/components/clothing/ClothingCard';
import { UploadModal } from '@/components/clothing/UploadModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Search, Shirt } from 'lucide-react';

const CATEGORIES = ['Tümü', ...Object.keys(CATEGORY_LABELS)] as const;

export default function WardrobePage() {
  const [uploadOpen, setUploadOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('Tümü');
  const queryClient = useQueryClient();

  const { data: clothes = [], isLoading } = useQuery<Clothing[]>({
    queryKey: ['clothing', activeCategory],
    queryFn: async () => {
      const params = activeCategory !== 'Tümü' ? { category: activeCategory } : {};
      const { data } = await clothingApi.getAll(params);
      return data;
    },
  });

  const filtered = clothes.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.color.toLowerCase().includes(search.toLowerCase()),
  );

  const handleDelete = async (id: string) => {
    try {
      await clothingApi.remove(id);
      toast.success('Kıyafet silindi');
      queryClient.invalidateQueries({ queryKey: ['clothing'] });
    } catch {
      toast.error('Silinemedi');
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold">Gardırobum</h1>
          <p className="text-muted-foreground text-xs md:text-sm">{clothes.length} parça</p>
        </div>
        <Button
          onClick={() => setUploadOpen(true)}
          className="bg-rose-600 hover:bg-rose-700 h-10 rounded-xl"
          size="sm"
        >
          <Plus className="h-4 w-4 mr-1" /> Ekle
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Kıyafet veya renk ara..."
          className="pl-9 h-11 rounded-xl"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Category filter — scrollable row */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-none -mx-4 px-4">
        {CATEGORIES.map(cat => (
          <Badge
            key={cat}
            variant={activeCategory === cat ? 'default' : 'outline'}
            className={`cursor-pointer shrink-0 rounded-full py-1 px-3 text-xs ${
              activeCategory === cat ? 'bg-rose-600 text-white' : 'hover:bg-rose-50'
            }`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat === 'Tümü' ? 'Tümü' : CATEGORY_LABELS[cat as ClothingCategory]}
          </Badge>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[3/4] rounded-2xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="p-5 bg-rose-50 rounded-full w-fit mx-auto mb-4">
            <Shirt className="h-12 w-12 text-rose-300" />
          </div>
          <p className="text-base font-semibold text-gray-700">Gardırop boş</p>
          <p className="text-sm text-muted-foreground mt-1 mb-5">İlk kıyafetini ekleyerek başla</p>
          <Button onClick={() => setUploadOpen(true)} className="bg-rose-600 hover:bg-rose-700 rounded-xl h-12 px-6">
            <Plus className="h-4 w-4 mr-2" /> İlk Kıyafeti Ekle
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {filtered.map(item => (
            <ClothingCard key={item.id} item={item} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {/* FAB for mobile */}
      <button
        onClick={() => setUploadOpen(true)}
        className="fixed bottom-20 right-4 md:hidden z-40 bg-rose-600 text-white p-4 rounded-full shadow-lg active:scale-95 transition-transform"
        aria-label="Kıyafet ekle"
      >
        <Plus className="h-6 w-6" />
      </button>

      <UploadModal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onSuccess={() => queryClient.invalidateQueries({ queryKey: ['clothing'] })}
      />
    </div>
  );
}
