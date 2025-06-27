import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext'; // AuthContext'i import et
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: Array<'admin' | 'teacher' | 'parent' | string>; // İzin verilen roller
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, profile, loading, profileNotFound } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg font-medium text-gray-700">Yükleniyor...</p>
      </div>
    );
  }

  if (!user) {
    // Kullanıcı giriş yapmamışsa, login sayfasına yönlendir.
    // Yönlendirme sonrası geri dönebilmesi için mevcut konumu state olarak ekle.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user && !profile && profileNotFound) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg font-medium text-gray-700">Profiliniz henüz oluşmadı veya yüklenemedi. Lütfen birkaç saniye bekleyin veya tekrar giriş yapmayı deneyin.</p>
      </div>
    );
  }

  if (allowedRoles && profile && !allowedRoles.includes(profile.role)) {
    // Kullanıcı giriş yapmış ama rolü izin verilen roller arasında değilse,
    // bir "Yetkisiz Erişim" sayfasına veya ana sayfaya yönlendir.
    // Şimdilik ana sayfaya yönlendirelim.
    console.warn(`User with role '${profile.role}' tried to access a route allowed for roles: ${allowedRoles.join(', ')}`);
    return <Navigate to="/" replace />;
    // Alternatif: return <Navigate to="/yetkisiz-erisim" replace />;
  }

  // Kullanıcı giriş yapmış ve (eğer belirtilmişse) rolü uygunsa, istenen sayfayı göster.
  return <>{children}</>;
};

export default ProtectedRoute;
