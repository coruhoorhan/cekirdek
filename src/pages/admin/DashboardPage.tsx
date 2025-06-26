import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Home, Info, Settings, Newspaper, Image, Users, BarChart2, ExternalLink } from 'lucide-react';

const quickLinks = [
  { to: '/admin/home-settings', icon: <Home className="w-6 h-6 text-primary" />, title: 'Anasayfa Yönetimi', description: 'Hero, değerler, branşlar vb. yönetin.' },
  { to: '/admin/about-settings', icon: <Info className="w-6 h-6 text-primary" />, title: 'Hakkımızda Yönetimi', description: 'Misyon, vizyon, tarihçe vb. yönetin.' },
  { to: '/admin/news-settings', icon: <Newspaper className="w-6 h-6 text-primary" />, title: 'Haberler Yönetimi', description: 'Duyuruları ve haberleri yönetin.' },
  { to: '/admin/gallery-settings', icon: <Image className="w-6 h-6 text-primary" />, title: 'Galeri Yönetimi', description: 'Fotoğraf ve videoları yönetin.' },
  { to: '/admin/teachers-settings', icon: <Users className="w-6 h-6 text-primary" />, title: 'Öğretmenler Yönetimi', description: 'Öğretmen bilgilerini yönetin.' },
  { to: '/admin/education-settings', icon: <Settings className="w-6 h-6 text-primary" />, title: 'Eğitim İçerikleri', description: 'Eğitim programlarını yönetin.' },
];

const DashboardPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-primary to-green-700 p-6 rounded-lg shadow-md text-white">
        <h1 className="text-3xl font-bold">Admin Paneline Hoş Geldiniz!</h1>
        <p className="mt-2 text-lg text-green-100">
          Bu panel üzerinden web sitenizin içeriklerini kolayca yönetebilirsiniz.
        </p>
      </div>

      <div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Hızlı Erişim</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickLinks.map((link) => (
            <Link to={link.to} key={link.to} className="group">
              <Card className="hover:shadow-xl hover:border-primary/50 transition-all duration-300 h-full flex flex-col">
                <CardHeader className="flex flex-row items-center space-x-4 pb-3">
                  <div className="bg-primary/10 p-3 rounded-full">
                    {link.icon}
                  </div>
                  <CardTitle className="text-xl text-gray-800 group-hover:text-primary transition-colors">{link.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <CardDescription className="text-sm text-gray-600">{link.description}</CardDescription>
                </CardContent>
                <div className="p-4 pt-0 text-right">
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors" />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Genel İstatistikler</h2>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart2 className="w-6 h-6 mr-2 text-primary" />
              Site İstatistikleri
            </CardTitle>
            <CardDescription>
              Bu bölümde sitenizle ilgili genel istatistikler gösterilecektir (örneğin, haber sayısı, galeri öğesi vb.).
              Bu özellik gelecekte eklenecektir.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Yakında...</p>
            {/* Örnek İstatistikler (ileride dinamik olacak)
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500">Toplam Haber</h3>
                <p className="text-2xl font-semibold text-gray-800">12</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500">Toplam Galeri Öğesi</h3>
                <p className="text-2xl font-semibold text-gray-800">45</p>
              </div>
            </div>
            */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
