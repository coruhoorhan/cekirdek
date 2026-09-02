import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { AlertCircle, CheckCircle, Clock, Mail, User, Shield, UserPlus, Key } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { toast } from '@/hooks/use-toast';
import { createClient } from '@supabase/supabase-js';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { sendPasswordSetupEmail } from '@/lib/emailService';

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


const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const createNewUserClient = () => {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
};

const UserManagementPage: React.FC = () => {
  const [authUsers, setAuthUsers] = useState<AuthUser[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  // New user form state
  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: 'parent',
  });
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [createdUserTempPassword, setCreatedUserTempPassword] = useState<string | null>(null);
  const [creationMethod, setCreationMethod] = useState<'temp_password' | 'invite_email'>('temp_password');

  const generateTempPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let pass = '';
    for (let i = 0; i < 12; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return pass;
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreatingUser(true);
    setCreatedUserTempPassword(null);

    try {
      const tempPassword = generateTempPassword();
      const fullName = `${newUser.firstName} ${newUser.lastName}`.trim();

      const adminClient = createNewUserClient();

      const { data, error } = await adminClient.auth.signUp({
        email: newUser.email,
        password: tempPassword,
        options: {
          data: {
            full_name: fullName,
            role: newUser.role,
          },
        },
      });

      if (error) throw error;

      // Ensure profile exists or is created (some setups might have a trigger for this)
      if (data.user) {
        // Try inserting into profiles table if needed.
        // It might conflict if trigger already does it, so we catch errors silently.
        await supabase.from('profiles').upsert({
          id: data.user.id,
          name: fullName,
          role: newUser.role,
        }).select();
      }

      if (creationMethod === 'invite_email') {
        const { success, error: emailError } = await sendPasswordSetupEmail(newUser.email, fullName);
        if (success) {
          toast({
            title: "Kullanıcı başarıyla oluşturuldu",
            description: `Yeni kullanıcı (${newUser.email}) sisteme eklendi ve şifre belirleme e-postası gönderildi.`,
            variant: "default"
          });
        } else {
          // If email fails, fallback to showing the temp password
          setCreatedUserTempPassword(tempPassword);
          toast({
            title: "Kullanıcı oluşturuldu ancak e-posta gönderilemedi",
            description: `Kullanıcı eklendi ancak davet e-postası gönderilemedi: ${emailError}. Lütfen geçici şifreyi kullanıcıya iletin.`,
            variant: "destructive"
          });
        }
      } else {
        setCreatedUserTempPassword(tempPassword);
        toast({
          title: "Kullanıcı başarıyla oluşturuldu",
          description: `Yeni kullanıcı (${newUser.email}) sisteme eklendi.`,
          variant: "default"
        });
      }

      // Refresh data
      fetchData();

      // Reset form
      setNewUser({
        firstName: '',
        lastName: '',
        email: '',
        role: 'parent',
      });

    } catch (error: any) {
      console.error('Kullanıcı oluşturma hatası:', error);
      toast({
        title: "Kullanıcı oluşturulamadı",
        description: error.message || "Bilinmeyen bir hata oluştu",
        variant: "destructive"
      });
    } finally {
      setIsCreatingUser(false);
    }
  };

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
          <TabsTrigger value="add-user">
            <UserPlus className="mr-2 h-4 w-4" />
            Kullanıcı Ekle
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

        <TabsContent value="add-user">
          <Card>
            <CardHeader>
              <CardTitle>Yeni Kullanıcı Ekle</CardTitle>
              <CardDescription>
                Sisteme yeni bir öğretmen veya veli ekleyin. Otomatik olarak geçici bir şifre oluşturulacaktır.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateUser} className="space-y-4 max-w-md">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Ad</Label>
                    <Input
                      id="firstName"
                      value={newUser.firstName}
                      onChange={(e) => setNewUser({...newUser, firstName: e.target.value})}
                      required
                      disabled={isCreatingUser}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Soyad</Label>
                    <Input
                      id="lastName"
                      value={newUser.lastName}
                      onChange={(e) => setNewUser({...newUser, lastName: e.target.value})}
                      required
                      disabled={isCreatingUser}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">E-posta</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                    required
                    disabled={isCreatingUser}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Rol</Label>
                  <Select
                    value={newUser.role}
                    onValueChange={(val) => setNewUser({...newUser, role: val})}
                    disabled={isCreatingUser}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Rol seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="teacher">Öğretmen</SelectItem>
                      <SelectItem value="parent">Veli</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3 pt-2 pb-4">
                  <Label>Kullanıcı Bilgilendirme Yöntemi</Label>
                  <RadioGroup
                    value={creationMethod}
                    onValueChange={(val) => setCreationMethod(val as 'temp_password' | 'invite_email')}
                    disabled={isCreatingUser}
                    className="space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="temp_password" id="temp_password" />
                      <Label htmlFor="temp_password" className="font-normal cursor-pointer">
                        Geçici şifre oluştur (Ekranda gösterilir)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="invite_email" id="invite_email" />
                      <Label htmlFor="invite_email" className="font-normal cursor-pointer">
                        Davet e-postası gönder (Kullanıcı şifresini kendi belirler)
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <Button type="submit" disabled={isCreatingUser} className="w-full">
                  {isCreatingUser ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Oluşturuluyor...
                    </>
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Kullanıcı Oluştur
                    </>
                  )}
                </Button>
              </form>

              {createdUserTempPassword && (
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
                  <h4 className="font-medium text-green-900 mb-2 flex items-center">
                    <CheckCircle className="mr-2 h-5 w-5" />
                    Kullanıcı Başarıyla Oluşturuldu
                  </h4>
                  <div className="text-sm text-green-800 space-y-2">
                    <p>Kullanıcı giriş yapabilmesi için aşağıdaki geçici şifreyi kullanabilir:</p>
                    <div className="flex items-center space-x-2 bg-white p-2 rounded border border-green-100">
                      <Key className="h-4 w-4 text-green-600" />
                      <span className="font-mono font-medium text-lg">{createdUserTempPassword}</span>
                    </div>
                    <p className="text-xs text-green-700 mt-2">
                      Lütfen bu şifreyi güvenli bir şekilde kullanıcı ile paylaşın. İlk girişte şifre değiştirme istenebilir.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserManagementPage;
