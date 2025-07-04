import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabaseClient';
import { Loader2, Key, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const SetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [sessionChecked, setSessionChecked] = useState(false);

  useEffect(() => {
    const handleAuthChange = async () => {
      const hash = window.location.hash;
      if (hash.includes('access_token') && hash.includes('refresh_token')) {
        const params = new URLSearchParams(hash.substring(1));
        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');

        if (accessToken && refreshToken) {
          const { error: setSessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (setSessionError) {
            setError("Geçersiz veya süresi dolmuş şifre sıfırlama linki. Lütfen yeni bir link talep edin.");
          } else {
            window.history.replaceState(null, '', window.location.pathname);
          }
        }
      } else {
         const { data: { session } } = await supabase.auth.getSession();
         if (!session) {
            setError("Geçerli bir oturum bulunamadı. Lütfen e-postanızdaki linki tekrar kullanın veya yeni bir link talep edin.");
         }
      }
      setSessionChecked(true);
    };

    handleAuthChange();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setError(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (password.length < 8 || password !== confirmPassword) {
      setError("Lütfen şifre kurallarına uyun ve şifrelerin eşleştiğinden emin olun.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password
      });

      if (updateError) {
        setError(`Şifre güncellenirken hata oluştu: ${updateError.message}`);
      } else {
        setSuccess(true);
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    } catch (err) {
      setError(`Beklenmeyen bir hata oluştu: ${err instanceof Error ? err.message : 'Bilinmeyen hata'}`);
    } finally {
      setLoading(false);
    }
  };

  const isButtonDisabled = loading || success || password.length < 8 || password !== confirmPassword;

  if (!sessionChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-yellow-50 p-4">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Oturum kontrol ediliyor...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-yellow-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center flex items-center justify-center">
            <Key className="w-6 h-6 mr-2 text-primary" />
            Şifre Oluştur
          </CardTitle>
          <CardDescription className="text-center">
            Hesabınız için yeni bir şifre oluşturun.
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
            <Alert variant="default" className="mb-4 bg-green-50 border-green-200">
               <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800">Başarılı!</AlertTitle>
              <AlertDescription className="text-green-700">Şifreniz başarıyla oluşturuldu. Giriş sayfasına yönlendiriliyorsunuz...</AlertDescription>
            </Alert>
          )}

          {!success && !error && (
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Yeni Şifre</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
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
                    disabled={loading}
                  />
                </div>
                 {password && (
                    <div className="text-sm space-y-1 mt-2">
                        <div className={`flex items-center ${password.length >= 8 ? 'text-green-600' : 'text-red-600'}`}>
                            {password.length >= 8 ? <CheckCircle className="h-4 w-4 mr-2" /> : <XCircle className="h-4 w-4 mr-2" />}
                            En az 8 karakter
                        </div>
                        {confirmPassword && (
                             <div className={`flex items-center ${password === confirmPassword ? 'text-green-600' : 'text-red-600'}`}>
                                {password === confirmPassword ? <CheckCircle className="h-4 w-4 mr-2" /> : <XCircle className="h-4 w-4 mr-2" />}
                                Şifreler eşleşiyor
                            </div>
                        )}
                    </div>
                )}
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isButtonDisabled}
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
          )}
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