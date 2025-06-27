import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Home, Info, Settings, Newspaper, Image, Users, BarChart2, ExternalLink } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';

const quickLinks = [
  { to: '/admin/home-settings', icon: <Home className="w-6 h-6 text-primary" />, title: 'Anasayfa Yönetimi', description: 'Hero, değerler, branşlar vb. yönetin.' },
  { to: '/admin/about-settings', icon: <Info className="w-6 h-6 text-primary" />, title: 'Hakkımızda Yönetimi', description: 'Misyon, vizyon, tarihçe vb. yönetin.' },
  { to: '/admin/news-settings', icon: <Newspaper className="w-6 h-6 text-primary" />, title: 'Haberler Yönetimi', description: 'Duyuruları ve haberleri yönetin.' },
  { to: '/admin/gallery-settings', icon: <Image className="w-6 h-6 text-primary" />, title: 'Galeri Yönetimi', description: 'Fotoğraf ve videoları yönetin.' },
  { to: '/admin/teachers-settings', icon: <Users className="w-6 h-6 text-primary" />, title: 'Öğretmenler Yönetimi', description: 'Öğretmen bilgilerini yönetin.' },
  { to: '/admin/education-settings', icon: <Settings className="w-6 h-6 text-primary" />, title: 'Eğitim İçerikleri', description: 'Eğitim programlarını yönetin.' },
];

interface Application {
  id: string;
  email: string;
  name: string;
  child_name: string;
  phone: string;
  status: string;
  created_at: string;
}

const DashboardPage: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: true });
    if (error) setError(error.message);
    else setApplications(data || []);
    setLoading(false);
  };

  const handleApprove = async (app: Application) => {
    setLoading(true);
    setError(null);
    // 1. profiles tablosuna ekle
    const { error: profileError } = await supabase.from('profiles').insert([
      {
        id: app.email, // veya uygun bir id üretimi, eğer email id değilse
        name: app.name,
        role: 'parent',
      },
    ]);
    if (profileError) {
      setError('Profil eklenemedi: ' + profileError.message);
      setLoading(false);
      return;
    }
    // 2. Başvurunun status'unu 'approved' yap
    await supabase.from('applications').update({ status: 'approved' }).eq('id', app.id);
    fetchApplications();
    setLoading(false);
  };

  const handleReject = async (app: Application) => {
    setLoading(true);
    setError(null);
    await supabase.from('applications').update({ status: 'rejected' }).eq('id', app.id);
    fetchApplications();
    setLoading(false);
  };

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

      <div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Bekleyen Başvurular</h2>
        {loading && <p>Yükleniyor...</p>}
        {error && <p className="text-red-600">{error}</p>}
        {applications.length === 0 && !loading ? (
          <p>Bekleyen başvuru yok.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border rounded-lg">
              <thead>
                <tr>
                  <th className="px-4 py-2 border">Ad Soyad</th>
                  <th className="px-4 py-2 border">E-posta</th>
                  <th className="px-4 py-2 border">Telefon</th>
                  <th className="px-4 py-2 border">Çocuk Adı</th>
                  <th className="px-4 py-2 border">Başvuru Tarihi</th>
                  <th className="px-4 py-2 border">İşlem</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.id}>
                    <td className="px-4 py-2 border">{app.name}</td>
                    <td className="px-4 py-2 border">{app.email}</td>
                    <td className="px-4 py-2 border">{app.phone}</td>
                    <td className="px-4 py-2 border">{app.child_name}</td>
                    <td className="px-4 py-2 border">{new Date(app.created_at).toLocaleString()}</td>
                    <td className="px-4 py-2 border space-x-2">
                      <Button size="sm" onClick={() => handleApprove(app)} disabled={loading}>Onayla</Button>
                      <Button size="sm" variant="destructive" onClick={() => handleReject(app)} disabled={loading}>Reddet</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
