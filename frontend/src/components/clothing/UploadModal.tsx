'use client';
import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';
import { clothingApi } from '@/lib/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Upload, X, Sparkles, Camera } from 'lucide-react';
import Image from 'next/image';

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const STAGES = [
  { label: 'Fotoğraf yükleniyor...', pct: 25 },
  { label: 'AI kıyafeti tanıyor...', pct: 55 },
  { label: 'Detaylar çıkarılıyor...', pct: 80 },
  { label: 'Gardıroba ekleniyor...', pct: 95 },
];

export function UploadModal({ open, onClose, onSuccess }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [stageIdx, setStageIdx] = useState(0);
  const [progress, setProgress] = useState(0);

  const onDrop = useCallback((accepted: File[]) => {
    const f = accepted[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
  });

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setProgress(STAGES[0].pct);
    setStageIdx(0);

    const timers: ReturnType<typeof setTimeout>[] = [];
    STAGES.slice(1).forEach((s, i) => {
      timers.push(setTimeout(() => {
        setStageIdx(i + 1);
        setProgress(s.pct);
      }, (i + 1) * 1800));
    });

    try {
      await clothingApi.upload(file);
      timers.forEach(clearTimeout);
      setProgress(100);
      toast.success('Kıyafet eklendi! AI analizi tamamlandı.');
      onSuccess();
      handleClose();
    } catch (err: unknown) {
      timers.forEach(clearTimeout);
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg || 'Yükleme başarısız. Tekrar dene.');
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    if (uploading) return;
    setFile(null);
    setPreview(null);
    setProgress(0);
    setStageIdx(0);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="w-[calc(100%-2rem)] max-w-md rounded-2xl p-5">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <Sparkles className="h-4 w-4 text-rose-500" />
            Kıyafet Ekle
          </DialogTitle>
        </DialogHeader>

        {!preview ? (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors ${
              isDragActive ? 'border-rose-400 bg-rose-50' : 'border-gray-200 active:border-rose-300'
            }`}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center gap-3">
              <div className="p-4 bg-rose-50 rounded-2xl">
                <Camera className="h-8 w-8 text-rose-400" />
              </div>
              <div>
                <p className="font-semibold text-sm">Fotoğraf seç veya çek</p>
                <p className="text-xs text-muted-foreground mt-1">JPG, PNG, WEBP — max 10MB</p>
              </div>
              <Button type="button" variant="outline" size="sm" className="rounded-xl mt-1">
                <Upload className="h-3.5 w-3.5 mr-1.5" /> Galeriden Seç
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100">
              <Image src={preview} alt="Önizleme" fill className="object-contain" />
              {!uploading && (
                <button
                  onClick={() => { setFile(null); setPreview(null); }}
                  className="absolute top-3 right-3 p-1.5 bg-white/90 rounded-full shadow-md"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {uploading && (
              <div className="space-y-2">
                <Progress value={progress} className="h-2.5 rounded-full" />
                <p className="text-xs text-center text-muted-foreground font-medium">
                  {STAGES[stageIdx]?.label}
                </p>
              </div>
            )}

            <Button
              onClick={handleUpload}
              className="w-full h-12 rounded-xl bg-rose-600 hover:bg-rose-700 text-base font-semibold"
              disabled={uploading}
            >
              {uploading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  İşleniyor...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" /> AI ile Analiz Et
                </span>
              )}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
