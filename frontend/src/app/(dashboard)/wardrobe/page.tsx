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
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Gardırobum</h1>
          <p className="text-muted-foreground text-sm">{clothes.length} parça</p>
        </div>
        <Button onClick={() => setUploadOpen(true)} className="bg-rose-600 hover:bg-rose-700">
          <Plus className="h-4 w-4 mr-2" /> Kıyafet Ekle
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Kıyafet ara..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="flex gap-2 flex-wrap mb-6">
        {CATEGORIES.map(cat => (
          <Badge
            key={cat}
            variant={activeCategory === cat ? 'default' : 'outline'}
            className={`cursor-pointer ${activeCategory === cat ? 'bg-rose-600' : 'hover:bg-rose-50'}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat === 'Tümü' ? 'Tümü' : CATEGORY_LABELS[cat as ClothingCategory]}
          </Badge>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[3/4] rounded-xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <Shirt className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
          <p className="text-lg font-medium text-muted-foreground">Gardırop boş</p>
          <p className="text-sm text-muted-foreground mt-1">İlk kıyafetini ekle</p>
          <Button onClick={() => setUploadOpen(true)} className="mt-4 bg-rose-600 hover:bg-rose-700">
            <Plus className="h-4 w-4 mr-2" /> İlk Kıyafeti Ekle
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filtered.map(item => (
            <ClothingCard key={item.id} item={item} onDelete={handleDelete} />
          ))}
        </div>
      )}

      <UploadModal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onSuccess={() => queryClient.invalidateQueries({ queryKey: ['clothing'] })}
      />
    </div>
  );
}
