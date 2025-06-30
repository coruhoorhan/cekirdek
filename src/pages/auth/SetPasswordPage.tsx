import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabaseClient';
import { Loader2, Key, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const SetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [userData, setUserData] = useState<{name: string} | null>(null);

  useEffect(() => {
    // Token ve email zorunlu parametrelerdir
    if (!token || !email) {
      setError('Geçersiz şifre sıfırlama bağlantısı. Lütfen e-postanıza gelen bağlantıyı kullanın.');
      return;
    }

    // Kullanıcı bilgilerini getir
    const fetchUserData = async () => {
      try {
        const { data, error } = await supabase
          .from('applications')
          .select('name')
          .eq('email', email)
          .eq('status', 'approved')
          .single();

        if (error) {
          console.error('Kullanıcı bilgileri alınırken hata:', error);
          return;
        }

        if (data) {
          setUserData({ name: data.name });
        }
      } catch (err) {
        console.error('Beklenmeyen hata:', err);
      }
    };

    fetchUserData();
  }, [token, email]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(false);
    
    // Şifre kontrolü
    if (password !== confirmPassword) {
      setError('Şifreler eşleşmiyor. Lütfen kontrol edin.');
      return;
    }

    if (password.length < 6) {
      setError('Şifre en az 6 karakter uzunluğunda olmalıdır.');
      return;
    }

    setLoading(true);

    try {
      // Şifreyi güncelle
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        setError(`Şifre güncellenirken hata oluştu: ${error.message}`);
        setLoading(false);
        return;
      }

      // Başarılı
      setSuccess(true);
      setPassword('');
      setConfirmPassword('');
      
      // 3 saniye sonra login sayfasına yönlendir
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(`Beklenmeyen bir hata oluştu: ${err instanceof Error ? err.message : 'Bilinmeyen hata'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-yellow-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center flex items-center justify-center">
            <Key className="w-6 h-6 mr-2 text-primary" />
            Şifre Oluştur
          </CardTitle>
          <CardDescription className="text-center">
            {userData ? (
              <span>Merhaba <strong>{userData.name}</strong>, lütfen hesabınız için şifre oluşturun.</span>
            ) : (
              <span>Hesabınız için yeni bir şifre oluşturun.</span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Hata</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-4">
              <AlertTitle>Başarılı!</AlertTitle>
              <AlertDescription>Şifreniz başarıyla oluşturuldu. Giriş sayfasına yönlendiriliyorsunuz...</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Şifre</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading || success}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Şifre Tekrar</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={loading || success}
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={loading || success}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Şifre Oluşturuluyor...
                  </>
                ) : (
                  "Şifreyi Oluştur"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Şifrenizi oluşturduktan sonra giriş yapabileceksiniz.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SetPasswordPage; 