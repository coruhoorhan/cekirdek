import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Eye, EyeOff, CheckCircle, XCircle, Lock } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/hooks/use-toast';

const UpdatePasswordPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  // URL'den access_token ve refresh_token'ı al
  const accessToken = searchParams.get('access_token');
  const refreshToken = searchParams.get('refresh_token');

  useEffect(() => {
    // Eğer token'lar yoksa login sayfasına yönlendir
    if (!accessToken || !refreshToken) {
      toast({
        title: "Geçersiz Link",
        description: "Şifre sıfırlama linki geçersiz veya süresi dolmuş.",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }

    // Session'ı token'larla güncelle
    const setSession = async () => {
      try {
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken
        });

        if (error) {
          console.error('Session ayarlama hatası:', error);
          toast({
            title: "Oturum Hatası",
            description: "Şifre sıfırlama oturumu başlatılamadı.",
            variant: "destructive"
          });
          navigate('/login');
        }
      } catch (error) {
        console.error('Session ayarlama hatası:', error);
        navigate('/login');
      }
    };

    setSession();
  }, [accessToken, refreshToken, navigate, toast]);

  // Şifre güçlülük kontrolü
  const validatePassword = (password: string): string[] => {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('Şifre en az 8 karakter olmalıdır');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('En az bir büyük harf içermelidir');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('En az bir küçük harf içermelidir');
    }
    
    if (!/\d/.test(password)) {
      errors.push('En az bir rakam içermelidir');
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('En az bir özel karakter içermelidir (!@#$%^&* vb.)');
    }
    
    return errors;
  };

  // Şifre değişikliği sırasında validation
  const handlePasswordChange = (value: string) => {
    setPassword(value);
    setValidationErrors(validatePassword(value));
    setError(null);
  };

  // Form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Şifre validation
      const passwordErrors = validatePassword(password);
      if (passwordErrors.length > 0) {
        setValidationErrors(passwordErrors);
        setLoading(false);
        return;
      }

      // Şifre eşleşme kontrolü
      if (password !== confirmPassword) {
        setError('Şifreler eşleşmiyor');
        setLoading(false);
        return;
      }

      // Supabase ile şifre güncelleme
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        setError(error.message);
        toast({
          title: "Şifre Güncelleme Hatası",
          description: error.message,
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      // Başarılı güncelleme
      setSuccess(true);
      toast({
        title: "Şifre Başarıyla Güncellendi",
        description: "Yeni şifrenizle giriş yapabilirsiniz.",
      });

      // 3 saniye sonra login sayfasına yönlendir
      setTimeout(() => {
        navigate('/login');
      }, 3000);

    } catch (error) {
      console.error('Şifre güncelleme hatası:', error);
      setError('Şifre güncellenirken bir hata oluştu');
      toast({
        title: "Hata",
        description: "Şifre güncellenirken bir hata oluştu.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Başarılı güncelleme ekranı
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-green-600">
              Şifre Başarıyla Güncellendi
            </CardTitle>
            <CardDescription>
              Yeni şifrenizle giriş yapabilirsiniz. 3 saniye sonra giriş sayfasına yönlendirileceksiniz.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => navigate('/login')} 
              className="w-full"
            >
              Giriş Sayfasına Git
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
            <Lock className="h-6 w-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Yeni Şifre Belirle</CardTitle>
          <CardDescription>
            Hesabınız için güçlü bir şifre oluşturun
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Hata Mesajı */}
            {error && (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Yeni Şifre */}
            <div className="space-y-2">
              <Label htmlFor="password">Yeni Şifre</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  placeholder="Yeni şifrenizi girin"
                  required
                  className={validationErrors.length > 0 ? 'border-red-500' : ''}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              
              {/* Şifre Gereksinimleri */}
              {validationErrors.length > 0 && (
                <div className="text-sm space-y-1">
                  {validationErrors.map((error, index) => (
                    <div key={index} className="flex items-center text-red-600">
                      <XCircle className="h-3 w-3 mr-1" />
                      {error}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Şifre Tekrar */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Şifre Tekrar</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Şifrenizi tekrar girin"
                  required
                  className={password !== confirmPassword && confirmPassword ? 'border-red-500' : ''}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              
              {/* Şifre Eşleşme Kontrolü */}
              {confirmPassword && password !== confirmPassword && (
                <div className="flex items-center text-red-600 text-sm">
                  <XCircle className="h-3 w-3 mr-1" />
                  Şifreler eşleşmiyor
                </div>
              )}
              
              {confirmPassword && password === confirmPassword && password && (
                <div className="flex items-center text-green-600 text-sm">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Şifreler eşleşiyor
                </div>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={loading || validationErrors.length > 0 || password !== confirmPassword || !password}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Güncelleniyor...
                </>
              ) : (
                'Şifreyi Güncelle'
              )}
            </Button>

            {/* Geri Dönüş Linki */}
            <div className="text-center">
              <Button
                type="button"
                variant="link"
                onClick={() => navigate('/login')}
                className="text-sm"
              >
                Giriş sayfasına dön
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UpdatePasswordPage;
