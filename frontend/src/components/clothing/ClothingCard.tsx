'use client';
import Image from 'next/image';
import { Clothing, CATEGORY_LABELS } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreVertical, Trash2, Edit } from 'lucide-react';

interface Props {
  item: Clothing;
  onDelete: (id: string) => void;
}

export function ClothingCard({ item, onDelete }: Props) {
  return (
    <Card className="overflow-hidden group hover:shadow-md transition-shadow">
      <div className="relative aspect-[3/4] bg-gray-100">
        <Image src={item.imageUrl} alt={item.name} fill className="object-cover" sizes="(max-width: 768px) 50vw, 25vw" />
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="secondary" size="icon" className="h-8 w-8 shadow">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="text-red-600" onClick={() => onDelete(item.id)}>
                <Trash2 className="h-4 w-4 mr-2" /> Sil
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {item.isModest && (
          <Badge className="absolute bottom-2 left-2 bg-emerald-600 text-white text-xs">Tesettür</Badge>
        )}
      </div>
      <CardContent className="p-3">
        <p className="font-medium text-sm truncate">{item.name}</p>
        <p className="text-xs text-muted-foreground">{CATEGORY_LABELS[item.category]}</p>
        <div className="flex items-center gap-1 mt-2 flex-wrap">
          <div className="w-3 h-3 rounded-full border border-gray-200" style={{ backgroundColor: item.color.toLowerCase() === 'siyah' ? '#000' : item.color.toLowerCase() === 'beyaz' ? '#fff' : item.color.toLowerCase() === 'bej' ? '#f5f0e8' : item.color.toLowerCase() }} />
          <span className="text-xs text-muted-foreground">{item.color}</span>
          {item.timesWorn > 0 && (
            <span className="text-xs text-muted-foreground ml-auto">{item.timesWorn}x giyildi</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
