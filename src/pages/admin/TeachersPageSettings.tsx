import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Users } from 'lucide-react';

const TeachersPageSettings: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Öğretmenler Yönetimi</h1>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="mr-2 h-6 w-6 text-primary" />
            Öğretmen Kadrosu
          </CardTitle>
          <CardDescription>
            Bu bölümden "Öğretmenlerimiz" sayfasında yer alacak öğretmen bilgilerini (fotoğraf, branş, açıklama vb.) yönetebilirsiniz.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500 py-12">
            <Users className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <p className="text-xl font-semibold">Çok Yakında!</p>
            <p>Öğretmenler yönetim modülü şu anda geliştirme aşamasındadır.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeachersPageSettings;
