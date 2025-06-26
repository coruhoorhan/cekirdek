import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { PlusCircle, Edit, Trash2, Save, Image as ImageIcon, List } from "lucide-react";
// import { useForm, useFieldArray } from "react-hook-form"; // Gelecekte form yönetimi için
// import { zodResolver } from "@hookform/resolvers/zod"; // Gelecekte validasyon için
// import * as z from "zod"; // Gelecekte validasyon için

// Örnek veri tipleri (Home.tsx'e benzer)
interface HeroSlide {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  description: string;
}

interface ValueItem {
  id: string;
  // icon: string; // İkon seçimi daha karmaşık olabilir, şimdilik metin olarak tutalım
  iconName: string; // Lucide ikon ismi veya SVG kodu
  title: string;
  description: string;
}

interface SubjectItem {
  id: string;
  // icon: string;
  iconName: string;
  name: string;
  image: string;
}

interface AgeGroupItem {
  id: string;
  title: string;
  description: string;
  image: string;
  features: string[];
}

// Mock Data (Başlangıç için)
const initialHeroSlides: HeroSlide[] = [
  { id: '1', image: '/images/hero/hero1.jpg', title: 'Seçkin Eğitimle Büyüyoruz', subtitle: 'Çekirdek Anaokulu\'na Hoşgeldiniz', description: 'Çocuklarınız için sevgi dolu, güvenli ve eğlenceli bir öğrenme ortamı' },
  { id: '2', image: '/images/hero/hero2.png', title: 'Doğa ile İç İçe Eğitim', subtitle: 'Keşfederek Öğreniyoruz', description: 'Doğal çevrede oyun temelli öğrenme deneyimi' },
];

const HomePageSettings: React.FC = () => {
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(initialHeroSlides);
  // Diğer bölümler için de state'ler eklenecek (kuruluş amacı, değerler, branşlar vb.)
  const [kurulusAmaci, setKurulusAmaci] = useState<string>(
    "Gelecek, yaşamdan ne istediğimize bağlıdır. Çocuklarımızın mutlu, sağlıklı, \n" +
    "yaratıcı ve özgüven sahibi bireyler olarak yetişmeleri için en uygun ortamı \n" +
    "hazırlayarak, onları hayata hazırlamak temel amacımızdır."
  ); // Home.tsx'den örnek metin

  // TODO: Diğer bölümler için CRUD fonksiyonları ve formlar eklenecek

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Anasayfa İçerik Yönetimi</h1>

      <Tabs defaultValue="hero" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-5 mb-4">
          <TabsTrigger value="hero">Hero Slider</TabsTrigger>
          <TabsTrigger value="kurulus">Kuruluş Amacı</TabsTrigger>
          <TabsTrigger value="degerler">Değerlerimiz</TabsTrigger>
          <TabsTrigger value="branslar">Branş Dersleri</TabsTrigger>
          <TabsTrigger value="psikolojik">Psikolojik Danışmanlık</TabsTrigger>
          <TabsTrigger value="yasgruplari">Yaş Grupları</TabsTrigger>
          <TabsTrigger value="onkayit">Ön Kayıt CTA</TabsTrigger>
        </TabsList>

        {/* Hero Slider Yönetimi */}
        <TabsContent value="hero">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Hero Slider Öğeleri
                <Button size="sm" onClick={() => alert("Yeni slayt ekleme formu açılacak.")}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Yeni Slayt Ekle
                </Button>
              </CardTitle>
              <CardDescription>Anasayfadaki hero slider'da görünecek slaytları yönetin.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {heroSlides.map((slide) => (
                <Card key={slide.id} className="p-4 shadow-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{slide.title}</h3>
                      <p className="text-sm text-gray-500">{slide.subtitle}</p>
                      <p className="text-sm text-gray-600 mt-1">{slide.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">Resim: {slide.image}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => alert(`Slayt ${slide.id} düzenlenecek.`)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => alert(`Slayt ${slide.id} silinecek.`)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
              {heroSlides.length === 0 && <p className="text-center text-gray-500">Henüz slayt eklenmemiş.</p>}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Kuruluş Amacı Yönetimi */}
        <TabsContent value="kurulus">
          <Card>
            <CardHeader>
              <CardTitle>Kuruluş Amacı Metni</CardTitle>
              <CardDescription>Anasayfada "Kuruluş Amacımız" bölümünde görünecek metni düzenleyin.</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={kurulusAmaci}
                onChange={(e) => setKurulusAmaci(e.target.value)}
                rows={10}
                className="text-base"
              />
            </CardContent>
            <CardFooter>
              <Button onClick={() => alert("Kuruluş amacı kaydedildi: " + kurulusAmaci)}>
                <Save className="mr-2 h-4 w-4" /> Değişiklikleri Kaydet
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Değerlerimiz Yönetimi (Placeholder) */}
        <TabsContent value="degerler">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Değerlerimiz
                <Button size="sm" onClick={() => alert("Yeni değer ekleme formu açılacak.")}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Yeni Değer Ekle
                </Button>
              </CardTitle>
              <CardDescription>Anasayfadaki "Değerlerimiz" bölümünü yönetin.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-gray-500 py-8">
                <List className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                Değerler listesi ve yönetim arayüzü burada olacak. (Örn: İkon, Başlık, Açıklama)
              </p>
              {/* TODO: Değerler listesi, ekleme/düzenleme/silme formları */}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Branş Dersleri Yönetimi (Placeholder) */}
        <TabsContent value="branslar">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Branş Dersleri
                <Button size="sm" onClick={() => alert("Yeni branş dersi ekleme formu açılacak.")}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Yeni Ders Ekle
                </Button>
              </CardTitle>
              <CardDescription>Anasayfadaki "Branş Derslerimiz" bölümünü yönetin.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-gray-500 py-8">
                <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                Branş dersleri listesi ve yönetim arayüzü burada olacak. (Örn: İkon, İsim, Resim)
              </p>
              {/* TODO: Branş dersleri listesi, ekleme/düzenleme/silme formları */}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Diğer Tablar için Placeholder */}
        <TabsContent value="psikolojik">
          <Card>
            <CardHeader><CardTitle>Psikolojik Danışmanlık</CardTitle></CardHeader>
            <CardContent><p className="text-center text-gray-500 py-8">Bu bölümün içerik yönetimi burada olacak.</p></CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="yasgruplari">
          <Card>
            <CardHeader><CardTitle>Yaş Grupları</CardTitle></CardHeader>
            <CardContent><p className="text-center text-gray-500 py-8">Bu bölümün içerik yönetimi burada olacak.</p></CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="onkayit">
          <Card>
            <CardHeader><CardTitle>Ön Kayıt CTA</CardTitle></CardHeader>
            <CardContent><p className="text-center text-gray-500 py-8">Bu bölümün içerik yönetimi burada olacak.</p></CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
};

export default HomePageSettings;
