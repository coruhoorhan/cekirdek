import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, CheckCircle, Clock, Mail, User, Shield } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { toast } from '@/hooks/use-toast';

interface AuthUser {
  id: string;
  email: string;
  email_confirmed_at: string | null;
  created_at: string;
  raw_user_meta_data: {
    full_name?: string;
    role?: string;
  };
}

interface Profile {
  id: string;
  name: string | null;
  role: string;
  created_at: string;
}

interface Application {
  id: string;
  email: string;
  name: string;
  status: string;
  created_at: string;
}

const UserManagementPage: React.FC = () => {
  const [authUsers, setAuthUsers] = useState<AuthUser[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Auth users
      const { data: authData, error: authError } = await supabase
        .from('auth.users')
        .select('id, email, email_confirmed_at, created_at, raw_user_meta_data')
        .order('created_at', { ascending: false });

      if (authError) {
        console.error('Auth users fetch error:', authError);
      } else {
        setAuthUsers(authData || []);
      }

      // Profiles
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, name, role, created_at')
        .order('created_at', { ascending: false });

      if (profileError) {
        console.error('Profiles fetch error:', profileError);
      } else {
        setProfiles(profileData || []);
      }

      // Applications
      const { data: appData, error: appError } = await supabase
        .from('applications')
        .select('id, email, name, status, created_at')
        .order('created_at', { ascending: false });

      if (appError) {
        console.error('Applications fetch error:', appError);
      } else {
        setApplications(appData || []);
      }

    } catch (error) {
      console.error('Data fetch error:', error);
      toast({
        title: "Veri yükleme hatası",
        description: "Veriler yüklenirken bir hata oluştu",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge variant="default" className="bg-green-500"><CheckCircle size={12} className="mr-1" />Onaylandı</Badge>;
      case 'pending':
        return <Badge variant="secondary"><Clock size={12} className="mr-1" />Beklemede</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><AlertCircle size={12} className="mr-1" />Reddedildi</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getEmailStatusBadge = (emailConfirmedAt: string | null) => {
    if (emailConfirmedAt) {
      return <Badge variant="default" className="bg-green-500"><CheckCircle size={12} className="mr-1" />Doğrulandı</Badge>;
    }
    return <Badge variant="destructive"><AlertCircle size={12} className="mr-1" />Doğrulanmadı</Badge>;
  };

  const sendPasswordResetEmail = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/velisifre`
      });

      if (error) {
        toast({
          title: "E-posta gönderme hatası",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Başarılı",
          description: `Şifre sıfırlama e-postası ${email} adresine gönderildi`,
          variant: "default"
        });
      }
    } catch (error) {
      console.error('Password reset email error:', error);
      toast({
        title: "Hata",
        description: "E-posta gönderilirken bir hata oluştu",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Veriler yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Kullanıcı Yönetimi</h1>
        <p className="text-muted-foreground">Sistem kullanıcılarını ve başvuruları yönetin</p>
      </div>

      <Tabs defaultValue="auth-users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="auth-users">
            <User className="mr-2 h-4 w-4" />
            Kayıtlı Kullanıcılar ({authUsers.length})
          </TabsTrigger>
          <TabsTrigger value="profiles">
            <Shield className="mr-2 h-4 w-4" />
            Profiller ({profiles.length})
          </TabsTrigger>
          <TabsTrigger value="applications">
            <Mail className="mr-2 h-4 w-4" />
            Başvurular ({applications.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="auth-users">
          <Card>
            <CardHeader>
              <CardTitle>Kayıtlı Kullanıcılar</CardTitle>
              <CardDescription>
                Sistemdeki tüm kullanıcılar ve e-posta doğrulama durumları
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>E-posta</TableHead>
                    <TableHead>Ad</TableHead>
                    <TableHead>Rol</TableHead>
                    <TableHead>E-posta Durumu</TableHead>
                    <TableHead>Kayıt Tarihi</TableHead>
                    <TableHead>İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {authUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.email}</TableCell>
                      <TableCell>{user.raw_user_meta_data?.full_name || 'Belirlenmemiş'}</TableCell>
                      <TableCell>{user.raw_user_meta_data?.role || 'Belirlenmemiş'}</TableCell>
                      <TableCell>{getEmailStatusBadge(user.email_confirmed_at)}</TableCell>
                      <TableCell>{formatDate(user.created_at)}</TableCell>
                      <TableCell>
                        {!user.email_confirmed_at && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => sendPasswordResetEmail(user.email)}
                          >
                            <Mail className="mr-1 h-3 w-3" />
                            E-posta Gönder
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profiles">
          <Card>
            <CardHeader>
              <CardTitle>Kullanıcı Profilleri</CardTitle>
              <CardDescription>
                Kullanıcı profil bilgileri ve rolleri
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Ad</TableHead>
                    <TableHead>Rol</TableHead>
                    <TableHead>Oluşturma Tarihi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {profiles.map((profile) => (
                    <TableRow key={profile.id}>
                      <TableCell className="font-mono text-xs">{profile.id}</TableCell>
                      <TableCell>{profile.name || 'Belirlenmemiş'}</TableCell>
                      <TableCell>
                        <Badge variant={profile.role === 'admin' ? 'default' : 'secondary'}>
                          {profile.role}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(profile.created_at)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="applications">
          <Card>
            <CardHeader>
              <CardTitle>Başvurular</CardTitle>
              <CardDescription>
                Tüm başvurular ve durumları
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ad</TableHead>
                    <TableHead>E-posta</TableHead>
                    <TableHead>Durum</TableHead>
                    <TableHead>Başvuru Tarihi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.map((app) => (
                    <TableRow key={app.id}>
                      <TableCell className="font-medium">{app.name}</TableCell>
                      <TableCell>{app.email}</TableCell>
                      <TableCell>{getStatusBadge(app.status)}</TableCell>
                      <TableCell>{formatDate(app.created_at)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserManagementPage;
