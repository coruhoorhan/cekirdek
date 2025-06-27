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
      // Giriş başarılı!
      // TODO: Rol bazlı yönlendirme burada yapılacak.
      // Şimdilik varsayılan olarak admin dashboard'a yönlendirelim.
      // Kullanıcının rolünü data.user.user_metadata.role veya profiles tablosundan çekmemiz gerekecek.
      console.log('Giriş başarılı:', data.user);
      // Örnek: navigate(data.user.user_metadata?.role === 'admin' ? '/admin/dashboard' : '/veli/dashboard');
      navigate('/admin/dashboard'); // Geçici yönlendirme
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
