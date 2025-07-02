import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/hooks/use-toast';

/**
 * Supabase auth redirect'lerini handle eden component
 * E-posta doğrulama linklerinden gelen kullanıcıları doğru sayfaya yönlendirir
 */
const AuthRedirectHandler: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const handleAuthRedirect = async () => {
      const urlParams = new URLSearchParams(location.search);
      const accessToken = urlParams.get('access_token');
      const refreshToken = urlParams.get('refresh_token');
      const type = urlParams.get('type');
      const error = urlParams.get('error');
      const errorDescription = urlParams.get('error_description');

      console.log('🔗 Auth redirect parametreleri:', {
        accessToken: accessToken ? 'mevcut' : 'yok',
        refreshToken: refreshToken ? 'mevcut' : 'yok',
        type,
        error,
        errorDescription
      });

      // Hata durumu
      if (error) {
        console.error('❌ Auth redirect hatası:', error, errorDescription);
        toast({
          title: "Doğrulama Hatası",
          description: errorDescription || "E-posta doğrulama sırasında bir hata oluştu.",
          variant: "destructive"
        });
        navigate('/login');
        return;
      }

      // Recovery (şifre sıfırlama) durumu
      if (type === 'recovery' && accessToken && refreshToken) {
        console.log('🔄 Şifre sıfırlama doğrulaması tespit edildi');
        
        try {
          // Session'ı ayarla
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          });

          if (sessionError) {
            console.error('❌ Session ayarlama hatası:', sessionError);
            toast({
              title: "Oturum Hatası",
              description: "Şifre sıfırlama oturumu başlatılamadı.",
              variant: "destructive"
            });
            navigate('/login');
            return;
          }

          console.log('✅ Session başarıyla ayarlandı, şifre güncelleme sayfasına yönlendiriliyor');
          
          // Şifre güncelleme sayfasına yönlendir
          navigate(`/sifre-guncelle?access_token=${accessToken}&refresh_token=${refreshToken}`);
          
          toast({
            title: "E-posta Doğrulandı",
            description: "Şimdi yeni şifrenizi belirleyebilirsiniz.",
          });

        } catch (error) {
          console.error('❌ Auth redirect işleme hatası:', error);
          toast({
            title: "Hata",
            description: "E-posta doğrulama işlenirken bir hata oluştu.",
            variant: "destructive"
          });
          navigate('/login');
        }
        return;
      }

      // Email confirmation (kayıt doğrulama) durumu
      if (type === 'signup' && accessToken && refreshToken) {
        console.log('📧 E-posta doğrulaması tespit edildi');
        
        try {
          // Session'ı ayarla
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          });

          if (sessionError) {
            console.error('❌ Session ayarlama hatası:', sessionError);
            toast({
              title: "Oturum Hatası",
              description: "E-posta doğrulama oturumu başlatılamadı.",
              variant: "destructive"
            });
            navigate('/login');
            return;
          }

          console.log('✅ E-posta başarıyla doğrulandı');
          
          toast({
            title: "E-posta Doğrulandı",
            description: "Hesabınız başarıyla doğrulandı. Giriş yapabilirsiniz.",
          });

          // Login sayfasına yönlendir
          navigate('/login');

        } catch (error) {
          console.error('❌ E-posta doğrulama işleme hatası:', error);
          toast({
            title: "Hata",
            description: "E-posta doğrulama işlenirken bir hata oluştu.",
            variant: "destructive"
          });
          navigate('/login');
        }
        return;
      }

      // Magic link durumu
      if (type === 'magiclink' && accessToken && refreshToken) {
        console.log('🔗 Magic link tespit edildi');
        
        try {
          // Session'ı ayarla
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          });

          if (sessionError) {
            console.error('❌ Session ayarlama hatası:', sessionError);
            navigate('/login');
            return;
          }

          // Ana sayfaya yönlendir
          navigate('/');

        } catch (error) {
          console.error('❌ Magic link işleme hatası:', error);
          navigate('/login');
        }
        return;
      }

      // Hiçbir özel durum yoksa login sayfasına yönlendir
      if (location.pathname === '/auth/callback' || location.search.includes('access_token')) {
        console.log('🔄 Genel auth callback, login sayfasına yönlendiriliyor');
        navigate('/login');
      }
    };

    // URL'de auth parametreleri varsa işle
    if (location.search.includes('access_token') || location.search.includes('error')) {
      handleAuthRedirect();
    }
  }, [location, navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">E-posta doğrulaması işleniyor...</p>
      </div>
    </div>
  );
};

export default AuthRedirectHandler;
