import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Image } from 'lucide-react';

const GalleryPageSettings: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Galeri Yönetimi</h1>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Image className="mr-2 h-6 w-6 text-primary" />
            Fotoğraf ve Video Galerisi
          </CardTitle>
          <CardDescription>
            Bu bölümden "Galeri" sayfasında yer alacak fotoğraf albümlerini ve videoları yönetebilirsiniz.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500 py-12">
            <Image className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <p className="text-xl font-semibold">Çok Yakında!</p>
            <p>Galeri yönetim modülü şu anda geliştirme aşamasındadır.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GalleryPageSettings;
