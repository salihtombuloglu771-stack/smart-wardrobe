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
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';
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

  const getOutfitForDay = (day: Date) =>
    outfits.find(o => isSameDay(new Date(o.date), day));

  const prev = () => setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() - 1));
  const next = () => setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() + 1));

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Kombin Takvimi</h1>
        <p className="text-muted-foreground text-sm">Geçmiş kombinlerini gör</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base capitalize">
                  {format(currentDate, 'MMMM yyyy', { locale: tr })}
                </CardTitle>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={prev}><ChevronLeft className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={next}><ChevronRight className="h-4 w-4" /></Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 mb-2">
                {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map(d => (
                  <div key={d} className="text-center text-xs font-medium text-muted-foreground py-2">{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: firstDayOffset }).map((_, i) => (
                  <div key={`empty-${i}`} />
                ))}
                {days.map(day => {
                  const outfit = getOutfitForDay(day);
                  const isSelected = selected && isSameDay(new Date(selected.date), day);
                  return (
                    <button
                      key={day.toISOString()}
                      onClick={() => outfit && setSelected(outfit)}
                      className={cn(
                        'aspect-square rounded-lg flex flex-col items-center justify-center text-xs transition-colors relative',
                        isToday(day) && 'ring-2 ring-rose-400',
                        isSelected && 'bg-rose-100',
                        outfit ? 'hover:bg-rose-50 cursor-pointer' : 'cursor-default',
                      )}
                    >
                      <span className={cn('font-medium', isToday(day) && 'text-rose-600')}>
                        {format(day, 'd')}
                      </span>
                      {outfit && (
                        <div className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-0.5" />
                      )}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          {selected ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm capitalize">
                  {format(new Date(selected.date), 'd MMMM yyyy', { locale: tr })}
                </CardTitle>
                {selected.occasion && <Badge variant="outline" className="w-fit">{selected.occasion}</Badge>}
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {selected.items.slice(0, 4).map(item => (
                    <div key={item.id} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                      <Image src={item.clothing.imageUrl} alt={item.clothing.name} fill className="object-cover" sizes="100px" />
                    </div>
                  ))}
                </div>
                {selected.totalScore && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Puan:</span>
                    <Badge className="bg-rose-100 text-rose-700">{selected.totalScore}/100</Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <CalendarDays className="h-10 w-10 mx-auto text-muted-foreground/30 mb-3" />
                <p className="text-sm text-muted-foreground">Takvimden bir gün seç</p>
              </CardContent>
            </Card>
          )}

          <Card className="mt-4">
            <CardHeader><CardTitle className="text-sm">Bu Ay</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Toplam kombin</span>
                <span className="font-medium">{outfits.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Ort. puan</span>
                <span className="font-medium">
                  {outfits.length > 0
                    ? Math.round(outfits.reduce((s, o) => s + (o.totalScore || 0), 0) / outfits.length)
                    : '-'}/100
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
