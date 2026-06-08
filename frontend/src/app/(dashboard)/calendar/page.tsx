'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from 'date-fns';
import { tr } from 'date-fns/locale';
import { outfitsApi } from '@/lib/api';
import { Outfit } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, CalendarDays, X } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selected, setSelected] = useState<Outfit | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;

  const { data: outfits = [] } = useQuery<Outfit[]>({
    queryKey: ['calendar', year, month],
    queryFn: async () => {
      const { data } = await outfitsApi.getCalendar(year, month);
      return data;
    },
  });

  const days = eachDayOfInterval({ start: startOfMonth(currentDate), end: endOfMonth(currentDate) });
  const firstDayOffset = (startOfMonth(currentDate).getDay() + 6) % 7;
  const getOutfitForDay = (day: Date) => outfits.find(o => isSameDay(new Date(o.date), day));

  const prev = () => setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() - 1));
  const next = () => setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() + 1));

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto">
      <div className="mb-4">
        <h1 className="text-xl md:text-2xl font-bold">Kombin Takvimi</h1>
        <p className="text-muted-foreground text-xs md:text-sm">Geçmiş kombinlerini gör</p>
      </div>

      {/* Monthly stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <Card>
          <CardContent className="p-3 flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-rose-500 shrink-0" />
            <div>
              <p className="text-lg font-bold leading-none">{outfits.length}</p>
              <p className="text-xs text-muted-foreground">Kombin</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 flex items-center gap-2">
            <span className="text-rose-500 text-lg leading-none shrink-0">★</span>
            <div>
              <p className="text-lg font-bold leading-none">
                {outfits.length > 0
                  ? Math.round(outfits.reduce((s, o) => s + (o.totalScore || 0), 0) / outfits.length)
                  : '-'}
              </p>
              <p className="text-xs text-muted-foreground">Ort. Puan</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Calendar grid */}
      <Card className="mb-4">
        <CardHeader className="pb-2 pt-4 px-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base capitalize">
              {format(currentDate, 'MMMM yyyy', { locale: tr })}
            </CardTitle>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={prev}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={next}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-3 pb-3">
          <div className="grid grid-cols-7 mb-1">
            {['Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct', 'Pz'].map(d => (
              <div key={d} className="text-center text-[11px] font-medium text-muted-foreground py-1">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-0.5">
            {Array.from({ length: firstDayOffset }).map((_, i) => <div key={`e-${i}`} />)}
            {days.map(day => {
              const outfit = getOutfitForDay(day);
              const isSelected = selected && isSameDay(new Date(selected.date), day);
              return (
                <button
                  key={day.toISOString()}
                  onClick={() => outfit && setSelected(outfit)}
                  className={cn(
                    'aspect-square rounded-lg flex flex-col items-center justify-center text-xs transition-colors relative min-h-[40px]',
                    isToday(day) && 'ring-2 ring-rose-400',
                    isSelected && 'bg-rose-100',
                    outfit ? 'hover:bg-rose-50 active:bg-rose-100 cursor-pointer' : 'cursor-default',
                  )}
                >
                  <span className={cn('font-medium text-[13px]', isToday(day) && 'text-rose-600')}>
                    {format(day, 'd')}
                  </span>
                  {outfit && <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-0.5" />}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Selected outfit detail */}
      {selected && (
        <Card>
          <CardHeader className="pb-2 pt-4 px-4">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-sm capitalize">
                  {format(new Date(selected.date), 'd MMMM yyyy', { locale: tr })}
                </CardTitle>
                {selected.occasion && (
                  <Badge variant="outline" className="mt-1 text-xs">{selected.occasion}</Badge>
                )}
              </div>
              <button onClick={() => setSelected(null)} className="p-1 rounded-lg hover:bg-gray-100">
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="grid grid-cols-4 gap-2 mb-3">
              {selected.items.slice(0, 4).map(item => (
                <div key={item.id} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100">
                  <Image src={item.clothing.imageUrl} alt={item.clothing.name} fill className="object-cover" sizes="100px" />
                </div>
              ))}
            </div>
            {selected.totalScore != null && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Puan:</span>
                <Badge className="bg-rose-100 text-rose-700 text-xs">{selected.totalScore}/100</Badge>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
