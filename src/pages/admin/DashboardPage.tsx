import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Home, Info, Settings, Newspaper, Image, Users, BarChart2, ExternalLink } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { sendPasswordSetupEmail } from '@/lib/emailService';
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, AlertCircle } from "lucide-react";

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

interface UserWithVerification {
  id: string;
  email: string;
  name?: string;
  role?: string;
  email_confirmed_at: string | null;
  created_at: string;
}

const DashboardPage: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<UserWithVerification[]>([]);
  const [activeTab, setActiveTab] = useState<'applications' | 'users'>('applications');
  const { toast } = useToast();

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .rpc('get_users_with_verification_status');
      
      if (error) {
        console.error("Kullanıcı listesi alınamadı:", error);
        return;
      }
      
      if (data) {
        setUsers(data as UserWithVerification[]);
      }
    } catch (err) {
      console.error("Kullanıcı listesi getirirken hata:", err);
    }
  };

  useEffect(() => {
    fetchApplications();
    fetchUsers();
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

    try {
      // E-posta adresini temizle (trim ve format kontrolü)
      const cleanEmail = app.email.trim().toLowerCase();

      // E-posta format kontrolü
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(cleanEmail)) {
        toast({
          title: "E-posta format hatası",
          description: `Geçersiz e-posta formatı: ${cleanEmail}`,
          variant: "destructive"
        });
        setError(`Geçersiz e-posta formatı: ${cleanEmail}`);
        setLoading(false);
        return;
      }

      // Önce applications tablosundaki e-posta adresini güncelle
      const { error: updateEmailError } = await supabase
        .from('applications')
        .update({ email: cleanEmail })
        .eq('id', app.id);

      if (updateEmailError) {
        console.error('E-posta güncelleme hatası:', updateEmailError);
      }

      const cleanOrigin = window.location.origin.replace(/\s+$/, '');

      // Güçlü geçici şifre oluştur
      const tempPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8).toUpperCase() + '123!';

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: cleanEmail,
        password: tempPassword,
        options: {
          data: {
            full_name: app.name,
            role: 'parent'
          },
          emailRedirectTo: `${cleanOrigin}/velisifre`
        }
      });

      if (authError) {
        toast({
          title: "Kullanıcı oluşturma hatası",
          description: authError.message,
          variant: "destructive"
        });
        setError('Kullanıcı oluşturulamadı: ' + authError.message);
        setLoading(false);
        return;
      }

      // Kullanıcı başarıyla oluşturulduysa, profile'daki name alanını güncelle
      if (authData.user) {
        const { error: profileUpdateError } = await supabase
          .from('profiles')
          .update({ name: app.name })
          .eq('id', authData.user.id);

        if (profileUpdateError) {
          console.error('Profile name güncelleme hatası:', profileUpdateError);
        }
      }

      const { error: updateError } = await supabase
        .from('applications')
        .update({ status: 'approved' })
        .eq('id', app.id);
        
      if (updateError) {
        toast({
          title: "Başvuru güncelleme hatası",
          description: updateError.message,
          variant: "destructive"
        });
        setError('Başvuru güncellenemedi: ' + updateError.message);
        setLoading(false);
        return;
      }

      console.log(`Şifre belirleme e-postası gönderiliyor: ${app.email}, yönlendirme: ${cleanOrigin}/velisifre`);
      const emailResult = await sendPasswordSetupEmail(app.email, app.name);
      if (!emailResult.success) {
        toast({
          title: "E-posta gönderme uyarısı",
          description: emailResult.error || "E-posta gönderilirken bir sorun oluştu",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Başarılı",
          description: `${app.name} başvurusu onaylandı ve şifre belirleme e-postası gönderildi.`,
          variant: "default"
        });
      }
      
      fetchApplications();
    } catch (err) {
      console.error("Onaylama işlemi sırasında hata:", err);
      const errorMessage = err instanceof Error ? err.message : "Bilinmeyen hata";
      toast({
        title: "İşlem hatası",
        description: errorMessage,
        variant: "destructive"
      });
      setError(`Onaylama işlemi sırasında hata oluştu: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (app: Application) => {
    setLoading(true);
    setError(null);
    try {
      const { error: rejectError } = await supabase
        .from('applications')
        .update({ status: 'rejected' })
        .eq('id', app.id);
        
      if (rejectError) {
        toast({
          title: "Başvuru reddetme hatası",
          description: rejectError.message,
          variant: "destructive"
        });
        setError('Başvuru reddedilemedi: ' + rejectError.message);
        return;
      }
      
      toast({
        title: "Başarılı",
        description: `${app.name} başvurusu reddedildi.`,
        variant: "default"
      });
      
      fetchApplications();
    } catch (err) {
      console.error("Reddetme işlemi sırasında hata:", err);
      const errorMessage = err instanceof Error ? err.message : "Bilinmeyen hata";
      toast({
        title: "İşlem hatası",
        description: errorMessage,
        variant: "destructive"
      });
      setError(`Reddetme işlemi sırasında hata oluştu: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('tr-TR');
  };

  const translateStatus = (status: string) => {
    return status === 'approved' ? 'Onaylandı' : 'Beklemede';
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Admin Paneli</h1>
        <div className="flex space-x-2 mb-4">
          <Button 
            variant={activeTab === 'applications' ? "default" : "outline"} 
            onClick={() => setActiveTab('applications')}
          >
            Başvurular
          </Button>
          <Button 
            variant={activeTab === 'users' ? "default" : "outline"} 
            onClick={() => setActiveTab('users')}
          >
            Kullanıcılar
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Hata</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {activeTab === 'applications' && (
        <Card>
          <CardHeader>
            <CardTitle>Veli Başvuruları</CardTitle>
            <CardDescription>Sisteme kayıt olmak isteyen velilerin başvuruları</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : applications.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Adı Soyadı</TableHead>
                      <TableHead>E-posta</TableHead>
                      <TableHead>Telefon</TableHead>
                      <TableHead>Başvuru Tarihi</TableHead>
                      <TableHead>Durum</TableHead>
                      <TableHead className="text-right">İşlemler</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {applications.map((app) => (
                      <TableRow key={app.id}>
                        <TableCell>{app.name}</TableCell>
                        <TableCell>{app.email}</TableCell>
                        <TableCell>{app.phone}</TableCell>
                        <TableCell>{formatDate(app.created_at)}</TableCell>
                        <TableCell>
                          <Badge variant={app.status === 'approved' ? "default" : "secondary"}>
                            {translateStatus(app.status)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {app.status === 'pending' && (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleApprove(app)}
                                disabled={loading}
                              >
                                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
                                Onayla
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleReject(app)}
                                disabled={loading}
                              >
                                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
                                Reddet
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center p-4">
                <p>Henüz başvuru bulunmuyor.</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === 'users' && (
        <Card>
          <CardHeader>
            <CardTitle>Kayıtlı Kullanıcılar</CardTitle>
            <CardDescription>Sistemdeki tüm kullanıcılar ve e-posta doğrulama durumları</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : users.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>E-posta</TableHead>
                      <TableHead>İsim</TableHead>
                      <TableHead>Rol</TableHead>
                      <TableHead>Kayıt Tarihi</TableHead>
                      <TableHead>E-posta Doğrulama</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.name || '-'}</TableCell>
                        <TableCell>{user.role || '-'}</TableCell>
                        <TableCell>{formatDate(user.created_at)}</TableCell>
                        <TableCell>
                          {user.email_confirmed_at ? (
                            <Badge variant="default" className="bg-green-500 hover:bg-green-600">Doğrulanmış</Badge>
                          ) : (
                            <Badge variant="destructive">Doğrulanmamış</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center p-4">
                <p>Henüz kullanıcı bulunmuyor.</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DashboardPage;
