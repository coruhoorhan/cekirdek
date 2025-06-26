import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Phone, Mail, MapPin } from 'lucide-react';

const ContactPageSettings: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">İletişim Sayfası Yönetimi</h1>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Phone className="mr-2 h-6 w-6 text-primary" />
            İletişim Bilgileri ve Form Mesajları
          </CardTitle>
          <CardDescription>
            Bu bölümden "İletişim" sayfasında yer alacak adres, telefon, e-posta gibi bilgileri ve (varsa) iletişim formundan gelen mesajları yönetebilirsiniz.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500 py-12">
            <Mail className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <p className="text-xl font-semibold">Çok Yakında!</p>
            <p>İletişim sayfası yönetim modülü şu anda geliştirme aşamasındadır.</p>
          </div>
          {/* Gelecekte eklenebilecek bölümler:
          <div className="mt-6">
            <h3 className="text-lg font-semibold">İletişim Bilgileri</h3>
            <p>Form alanları burada olacak (Adres, Telefon, E-posta, Harita vb.)</p>
          </div>
          <div className="mt-6">
            <h3 className="text-lg font-semibold">Gelen Mesajlar</h3>
            <p>İletişim formundan gelen mesajların listesi burada olacak.</p>
          </div>
          */}
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactPageSettings;
