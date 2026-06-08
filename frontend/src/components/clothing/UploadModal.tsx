'use client';
import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';
import { clothingApi } from '@/lib/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Upload, X, Sparkles } from 'lucide-react';
import Image from 'next/image';

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function UploadModal({ open, onClose, onSuccess }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState('');

  const onDrop = useCallback((accepted: File[]) => {
    const f = accepted[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] }, maxFiles: 1,
  });

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setStage('Fotoğraf yükleniyor...');
    setProgress(30);

    try {
      setTimeout(() => { setStage('AI analiz yapıyor...'); setProgress(60); }, 1500);
      setTimeout(() => { setStage('Kıyafet kaydediliyor...'); setProgress(90); }, 3000);

      await clothingApi.upload(file);
      setProgress(100);
      toast.success('Kıyafet başarıyla eklendi!');
      onSuccess();
      handleClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Yükleme başarısız');
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setPreview(null);
    setProgress(0);
    setStage('');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-rose-500" />
            Kıyafet Ekle
          </DialogTitle>
        </DialogHeader>

        {!preview ? (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${isDragActive ? 'border-rose-400 bg-rose-50' : 'border-gray-200 hover:border-rose-300'}`}
          >
            <input {...getInputProps()} />
            <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
            <p className="font-medium text-sm">Fotoğraf yükle</p>
            <p className="text-xs text-muted-foreground mt-1">Sürükle bırak veya tıkla</p>
            <p className="text-xs text-muted-foreground">JPG, PNG, WEBP — max 10MB</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100">
              <Image src={preview} alt="Önizleme" fill className="object-contain" />
              {!uploading && (
                <button onClick={() => { setFile(null); setPreview(null); }}
                  className="absolute top-2 right-2 p-1 bg-white rounded-full shadow">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            {uploading && (
              <div className="space-y-2">
                <Progress value={progress} className="h-2" />
                <p className="text-xs text-center text-muted-foreground">{stage}</p>
              </div>
            )}
            <Button onClick={handleUpload} className="w-full" disabled={uploading}>
              {uploading ? 'İşleniyor...' : 'AI ile Analiz Et ve Ekle'}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
