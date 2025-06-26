import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Newspaper } from 'lucide-react';

const NewsPageSettings: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Haberler ve Duyurular Yönetimi</h1>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Newspaper className="mr-2 h-6 w-6 text-primary" />
            Haberler, Etkinlikler ve Duyurular
          </CardTitle>
          <CardDescription>
            Bu bölümden "Duyurular" sayfasında (veya anasayfadaki ilgili bölümde) yer alacak haberleri, etkinlikleri ve duyuruları yönetebilirsiniz.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500 py-12">
            <Newspaper className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <p className="text-xl font-semibold">Çok Yakında!</p>
            <p>Haberler ve duyurular yönetim modülü şu anda geliştirme aşamasındadır.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewsPageSettings;
