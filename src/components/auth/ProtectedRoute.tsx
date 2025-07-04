import React, { ReactNode, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: Array<'admin' | 'teacher' | 'parent' | string>;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, profile, loading, profileNotFound, refreshProfile } = useAuth();
  const location = useLocation();
  const [retryCount, setRetryCount] = useState(0);
  const [localLoading, setLocalLoading] = useState(false);

  // Profil bulunamadığında yeniden deneme mantığı
  useEffect(() => {
    if (user && profileNotFound && retryCount < 3) {
      const retryProfileFetch = async () => {
        setLocalLoading(true);
        console.log(`Retrying profile fetch, attempt ${retryCount + 1}`);
        await refreshProfile();
        setRetryCount(prevCount => prevCount + 1);
        setLocalLoading(false);
      };

      const timer = setTimeout(retryProfileFetch, 1000 * (retryCount + 1));
      return () => clearTimeout(timer);
    }
  }, [user, profileNotFound, retryCount, refreshProfile]);

  // Ana yükleme durumu
  if (loading || localLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="ml-4 text-lg font-medium text-gray-700 text-center">Yükleniyor...</p>
      </div>
    );
  }

  // Kullanıcı giriş yapmamış
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Profil bulunamadı ve tüm yeniden denemeler tükendi
  if (user && !profile && profileNotFound && retryCount >= 3) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h2 className="text-xl font-semibold text-red-700 mb-3">Profil Yüklenemiyor</h2>
          <p className="text-gray-700 mb-4">
            Profil bilgileriniz yüklenemedi. Bu sorun şunlardan kaynaklanabilir:
          </p>
          <ul className="list-disc pl-5 mb-4 text-gray-700">
            <li>Bağlantı sorunu</li>
            <li>Sunucu sorunu</li>
            <li>Profil bilgileriniz henüz oluşturulmamış olabilir</li>
          </ul>
          <div className="flex justify-between">
            <button 
              onClick={() => setRetryCount(0)} 
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Tekrar Dene
            </button>
            <button 
              onClick={() => window.location.href = '/login'} 
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
            >
              Çıkış Yap
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Rol kontrolü - yetki hatası
  if (allowedRoles && profile && !allowedRoles.includes(profile.role)) {
    console.warn(`User with role '${profile.role}' tried to access a route allowed for roles: ${allowedRoles.join(', ')}`);
    return <Navigate to="/" replace />;
  }

  // Başarılı erişim
  return <>{children}</>;
};

export default ProtectedRoute;
