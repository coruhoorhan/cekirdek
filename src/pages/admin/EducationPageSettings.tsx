import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { BookOpenCheck } from 'lucide-react';

const EducationPageSettings: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Eğitim Sayfası Yönetimi</h1>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BookOpenCheck className="mr-2 h-6 w-6 text-primary" />
            Eğitim Programları ve İçerikleri
          </CardTitle>
          <CardDescription>
            Bu bölümden "Eğitimler" sayfasında yer alacak eğitim programlarını, yaş gruplarına göre içerikleri ve diğer detayları yönetebilirsiniz.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500 py-12">
            <BookOpenCheck className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <p className="text-xl font-semibold">Çok Yakında!</p>
            <p>Eğitim sayfası içerik yönetim modülü şu anda geliştirme aşamasındadır.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EducationPageSettings;
