import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabaseClient'; // Supabase client'ı import ediyoruz
import { Loader2, UserPlus } from 'lucide-react';

const SignUpPage: React.FC = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setMessage(null);

    if (password !== confirmPassword) {
      setError("Şifreler eşleşmiyor.");
      return;
    }

    if (password.length < 6) {
      setError("Şifre en az 6 karakter olmalıdır.");
      return;
    }

    setLoading(true);

    // Supabase signUp işlemi
    // Rolü şimdilik 'parent' olarak varsayıyoruz veya kullanıcıya seçtirebiliriz.
    // user_metadata içinde 'role' ve 'full_name' göndereceğiz.
    // Supabase tarafında bir trigger'ın bu metadata'yı alıp 'profiles' tablosuna işlemesi idealdir.
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          full_name: fullName,
          // role: 'parent' // Rolü burada veya kullanıcıya seçtirerek belirleyebiliriz.
                           // Şimdilik varsayılan olarak Supabase tarafında (trigger ile) veya ilk girişte atanabilir.
        }
      }
    });

    setLoading(false);

    if (signUpError) {
      setError(signUpError.message);
    } else if (data.user && data.user.identities && data.user.identities.length === 0) {
      // Bu durum genellikle e-posta zaten kayıtlı olduğunda (ama doğrulanmamış) oluşur.
      // Supabase bazen bu durumda user nesnesini döndürür ama identities boş olur.
      setError("Bu e-posta adresi ile daha önce kayıt yapılmış ancak doğrulanmamış olabilir. Lütfen e-postanızı kontrol edin veya farklı bir e-posta deneyin.");
    } else if (data.user) {
      setMessage("Kayıt başarılı! Lütfen e-posta adresinize gönderilen doğrulama linkine tıklayın.");
      // Formu temizleyebilir veya kullanıcıyı bir sonraki adıma yönlendirebiliriz.
      setFullName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } else {
      // Beklenmedik bir durum, data.user null ama error da yok.
       setError("Kayıt sırasında beklenmedik bir sorun oluştu. Lütfen tekrar deneyin.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-100 via-yellow-50 to-orange-100 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-primary text-primary-foreground rounded-full p-3">
              <UserPlus size={32} />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-primary">Yeni Hesap Oluştur</CardTitle>
          <CardDescription>
            Okul yönetim sistemine kaydolun.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Ad Soyad</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Adınız Soyadınız"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
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
              <Label htmlFor="password">Şifre</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Şifre Tekrar</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            {message && <p className="text-sm text-green-600">{message}</p>}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserPlus className="mr-2 h-4 w-4" />}
              Kayıt Ol
            </Button>
            <p className="text-xs text-center text-gray-500">
              Zaten bir hesabınız var mı?{' '}
              <Link to="/login" className="font-medium text-primary hover:underline">
                Giriş Yapın
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default SignUpPage;
