import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { LogIn, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { loginSchema, type LoginFormData } from '@/lib/validations';
import { loginRateLimiter, logSecurityEvent } from '@/lib/security';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [rateLimitError, setRateLimitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    // Rate limiting kontrolü
    const clientId = `login_${data.email}`;
    if (!loginRateLimiter.isAllowed(clientId)) {
      const remainingTime = Math.ceil(loginRateLimiter.getRemainingTime(clientId) / 1000 / 60);
      setRateLimitError(`Çok fazla başarısız giriş denemesi. ${remainingTime} dakika sonra tekrar deneyin.`);

      logSecurityEvent('login_rate_limit_exceeded', {
        email: data.email,
        remainingTime,
      });
      return;
    }

    setLoading(true);
    setRateLimitError(null);

    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        // Güvenlik logu
        logSecurityEvent('login_failed', {
          email: data.email,
          error: error.message,
        });

        // Kullanıcı dostu hata mesajları
        if (error.message.includes('Invalid login credentials')) {
          setError('email', { message: 'E-posta veya şifre hatalı' });
        } else if (error.message.includes('Email not confirmed')) {
          setError('email', { message: 'E-posta adresinizi doğrulamanız gerekiyor' });
        } else if (error.message.includes('Too many requests')) {
          setRateLimitError('Çok fazla deneme yapıldı. Lütfen daha sonra tekrar deneyin.');
        } else {
          setError('email', { message: 'Giriş yapılırken bir hata oluştu' });
        }
        return;
      }

      if (authData.user) {
        // Başarılı giriş logu
        logSecurityEvent('login_success', {
          userId: authData.user.id,
          email: data.email,
        });

        console.log('Login successful:', authData.user);
        navigate('/admin/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      logSecurityEvent('login_error', {
        email: data.email,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      setError('email', { message: 'Beklenmeyen bir hata oluştu' });
    } finally {
      setLoading(false);
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
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-posta Adresi</Label>
              <Input
                id="email"
                type="email"
                placeholder="ornek@eposta.com"
                {...register('email')}
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && (
                <div className="flex items-center gap-1 text-sm text-red-600">
                  <AlertCircle size={14} />
                  {errors.email.message}
                </div>
              )}
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
                {...register('password')}
                className={errors.password ? 'border-red-500' : ''}
              />
              {errors.password && (
                <div className="flex items-center gap-1 text-sm text-red-600">
                  <AlertCircle size={14} />
                  {errors.password.message}
                </div>
              )}
            </div>
            {rateLimitError && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
                <AlertCircle size={16} className="text-red-600" />
                <p className="text-sm text-red-600">{rateLimitError}</p>
              </div>
            )}
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
