import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';   // Shadcn/ui label
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { LogIn, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    setLoading(false);

    if (signInError) {
      setError(signInError.message);
    } else if (data.user) {
      // Giriş başarılı! AuthContext'in profile state'i onAuthStateChange ile güncellenecek.
      // Yönlendirmeyi AuthContext'teki profile bilgisi yüklendikten sonra yapmak daha doğru olur.
      // Şimdilik, AuthContext'in güncellenmesini bekleyip App.tsx'de bir ana yönlendirici ile yapılabilir
      // ya da burada profile'ı direkt çekmeyi deneyebiliriz (ama context zaten yapacak).
      // En temizi, bir sonraki renderda AuthContext'ten gelen profile'a göre yönlendirme yapmak.
      // Bu yüzden burada direkt navigate('/admin/dashboard') kalabilir,
      // ve App.tsx veya korumalı bir layout içinde rol kontrolü ve yönlendirme yapılabilir.
      // VEYA: AuthContext'e bir login fonksiyonu ekleyip, o fonksiyon içinde profil çekildikten sonra yönlendirme yapılabilir.
      // Şimdilik basit tutalım: Giriş başarılıysa, kullanıcıyı ana sayfaya yönlendirip,
      // Ana sayfada (veya App.tsx'de) rolüne göre ilgili dashboard'a yönlendirme yapılabilir.
      // Ya da AuthContext'in yüklenmesini bekleyip yönlendirme yapalım.
      // navigate('/'); // Kullanıcıyı ana sayfaya yönlendir, App.tsx rol bazlı yönlendirmeyi yapsın
      // VEYA burada AuthContext'i kullanıp profile'ı bekleyebiliriz.
      // Şimdilik sadece admin paneline yönlendirme yapalım, bu kısım AuthContext ile daha iyi yönetilecek.
      console.log('Giriş başarılı, yönlendirme yapılacak:', data.user);
      // AuthProvider zaten profili çekecek. Yönlendirmeyi Header veya App seviyesinde yapmak daha mantıklı.
      // Ancak hızlı bir çözüm için burada da yapılabilir.
      // Şimdilik admin'e yönlendiriyoruz, bu daha sonra AuthContext ile düzeltilecek.
      navigate('/admin/dashboard');
    } else {
      setError("Giriş sırasında beklenmedik bir sorun oluştu.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-100 via-yellow-50 to-orange-100 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-primary text-primary-foreground rounded-full p-3">
              <LogIn size={32} />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-primary">Giriş Yap</CardTitle>
          <CardDescription>
            Hesabınıza erişmek için giriş yapın.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-posta Adresi</Label>
              <Input
                id="email"
                type="email"
                placeholder="ornek@eposta.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password">Şifre</Label>
                <Link to="/sifremi-unuttum" className="text-xs text-primary hover:underline">
                  Şifremi Unuttum
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogIn className="mr-2 h-4 w-4" />}
              Giriş Yap
            </Button>
            <p className="text-xs text-center text-gray-500">
              Hesabınız yok mu?{' '}
              <Link to="/kayit-ol" className="font-medium text-primary hover:underline">
                Kayıt Olun
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default LoginPage;
