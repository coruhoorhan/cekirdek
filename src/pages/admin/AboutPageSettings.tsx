import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { PlusCircle, Edit, Trash2, Save, Users, Target, Eye, Award, Calendar, ListChecks } from "lucide-react";

// Örnek veri tipleri (About.tsx'e benzer)
interface StatItem {
  id: string;
  // icon: string; // İkon seçimi
  iconName: string;
  number: string;
  label: string;
}

interface PrincipleItem {
  id: string;
  // icon: string;
  iconName: string;
  title: string;
  description: string;
}

interface TimelineItem {
  id: string;
  year: string;
  title: string;
  description: string;
}

// Mock Data (Başlangıç için)
const initialStats: StatItem[] = [
  { id: '1', iconName: 'Users', number: '150+', label: 'Mutlu Çocuk' },
  { id: '2', iconName: 'Award', number: '15+', label: 'Yıllık Deneyim' },
];

const AboutPageSettings: React.FC = () => {
  const [stats, setStats] = useState<StatItem[]>(initialStats);
  const [mission, setMission] = useState<string>(
    "Çocuklarımızın mutlu, sağlıklı, özgüvenli ve yaratıcı bireyler olarak..." // About.tsx'den kısaltılmış örnek
  );
  const [vision, setVision] = useState<string>(
    "Türkiye'nin önde gelen anaokulu markası olarak..." // About.tsx'den kısaltılmış örnek
  );

  // TODO: Diğer bölümler için CRUD fonksiyonları ve formlar eklenecek

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Hakkımızda Sayfası İçerik Yönetimi</h1>

      <Tabs defaultValue="stats" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-5 mb-4">
          <TabsTrigger value="stats">İstatistikler</TabsTrigger>
          <TabsTrigger value="mission_vision">Misyon & Vizyon</TabsTrigger>
          <TabsTrigger value="principles">Eğitim İlkeleri</TabsTrigger>
          <TabsTrigger value="timeline">Tarihçe</TabsTrigger>
          <TabsTrigger value="why_us">Neden Biz?</TabsTrigger>
        </TabsList>

        {/* İstatistikler Yönetimi */}
        <TabsContent value="stats">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                İstatistikler
                <Button size="sm" onClick={() => alert("Yeni istatistik ekleme formu açılacak.")}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Yeni İstatistik Ekle
                </Button>
              </CardTitle>
              <CardDescription>"Hakkımızda" sayfasındaki istatistikleri yönetin.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {stats.map((stat) => (
                <Card key={stat.id} className="p-4 shadow-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{stat.label} ({stat.number})</h3>
                      <p className="text-sm text-muted-foreground">İkon: {stat.iconName}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => alert(`İstatistik ${stat.id} düzenlenecek.`)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => alert(`İstatistik ${stat.id} silinecek.`)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
              {stats.length === 0 && <p className="text-center text-gray-500">Henüz istatistik eklenmemiş.</p>}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Misyon & Vizyon Yönetimi */}
        <TabsContent value="mission_vision">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="mr-2 h-5 w-5 text-primary" /> Misyonumuz
                </CardTitle>
                <CardDescription>"Hakkımızda" sayfasındaki misyon metnini düzenleyin.</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={mission}
                  onChange={(e) => setMission(e.target.value)}
                  rows={8}
                  className="text-base"
                />
              </CardContent>
              <CardFooter>
                <Button onClick={() => alert("Misyon kaydedildi: " + mission)}>
                  <Save className="mr-2 h-4 w-4" /> Misyonu Kaydet
                </Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Eye className="mr-2 h-5 w-5 text-primary" /> Vizyonumuz
                </CardTitle>
                <CardDescription>"Hakkımızda" sayfasındaki vizyon metnini düzenleyin.</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={vision}
                  onChange={(e) => setVision(e.target.value)}
                  rows={8}
                  className="text-base"
                />
              </CardContent>
              <CardFooter>
                <Button onClick={() => alert("Vizyon kaydedildi: " + vision)}>
                  <Save className="mr-2 h-4 w-4" /> Vizyonu Kaydet
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        {/* Eğitim İlkeleri Yönetimi (Placeholder) */}
        <TabsContent value="principles">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Eğitim İlkelerimiz
                <Button size="sm" onClick={() => alert("Yeni ilke ekleme formu açılacak.")}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Yeni İlke Ekle
                </Button>
              </CardTitle>
              <CardDescription>"Hakkımızda" sayfasındaki eğitim ilkelerini yönetin.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-gray-500 py-8">
                <ListChecks className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                Eğitim ilkeleri listesi ve yönetim arayüzü burada olacak. (Örn: İkon, Başlık, Açıklama)
              </p>
              {/* TODO: İlkeler listesi, ekleme/düzenleme/silme formları */}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tarihçe Yönetimi (Placeholder) */}
        <TabsContent value="timeline">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Tarihçemiz
                <Button size="sm" onClick={() => alert("Yeni tarihçe öğesi ekleme formu açılacak.")}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Yeni Öğe Ekle
                </Button>
              </CardTitle>
              <CardDescription>"Hakkımızda" sayfasındaki tarihçe bölümünü yönetin.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-gray-500 py-8">
                <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                Tarihçe listesi ve yönetim arayüzü burada olacak. (Örn: Yıl, Başlık, Açıklama)
              </p>
              {/* TODO: Tarihçe listesi, ekleme/düzenleme/silme formları */}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Neden Biz? Yönetimi (Placeholder) */}
        <TabsContent value="why_us">
          <Card>
            <CardHeader>
              <CardTitle>Neden Bizi Seçmelisiniz?</CardTitle>
              <CardDescription>"Hakkımızda" sayfasındaki "Neden Biz?" bölümünü yönetin.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-gray-500 py-8">
                Bu bölümdeki maddelerin yönetim arayüzü burada olacak.
              </p>
              {/* TODO: Madde listesi, ekleme/düzenleme/silme formları */}
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
};

export default AboutPageSettings;
