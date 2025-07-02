import { supabase } from './supabaseClient';

/**
 * URL'deki boşlukları temizleyen ve düzgün bir şekilde formatlayan yardımcı fonksiyon
 * @param baseUrl Temel URL
 * @param path Yönlendirilecek path
 * @returns Temizlenmiş ve formatlanmış tam URL
 */
const formatCleanUrl = (baseUrl: string, path: string): string => {
  // Başındaki ve sonundaki boşlukları temizle
  let cleanBase = baseUrl.trim();
  let cleanPath = path.trim();

  // URL'deki tüm boşlukları ve özel karakterleri temizle
  cleanBase = cleanBase.replace(/\s+/g, '').replace(/\u0020/g, '');
  cleanPath = cleanPath.replace(/\s+/g, '').replace(/\u0020/g, '');

  // Başında / varsa kaldır
  const formattedPath = cleanPath.startsWith('/') ? cleanPath.substring(1) : cleanPath;

  // Son / karakterini kaldır (eğer varsa)
  const normalizedBase = cleanBase.endsWith('/') ? cleanBase.slice(0, -1) : cleanBase;

  // URL'yi birleştir
  const fullUrl = `${normalizedBase}/${formattedPath}`;

  // URL'nin geçerli olduğunu kontrol et
  try {
    new URL(fullUrl);
    console.log('✅ Temizlenmiş URL:', fullUrl);
    return fullUrl;
  } catch (error) {
    console.error('❌ Invalid URL format:', fullUrl, error);
    // Fallback olarak localhost kullan
    const fallbackUrl = `http://localhost:5173/${formattedPath}`;
    console.log('🔄 Fallback URL:', fallbackUrl);
    return fallbackUrl;
  }
};

/**
 * Belirtilen e-posta adresine şifre sıfırlama linki gönderir
 * @param email Şifre sıfırlanacak e-posta adresi
 * @returns Promise<{success: boolean, error?: string}>
 */
export const sendPasswordResetEmail = async (email: string): Promise<{success: boolean, error?: string}> => {
  try {
    // Temiz URL oluştur - Yeni şifre güncelleme sayfasına yönlendir
    const redirectUrl = formatCleanUrl(window.location.origin, 'sifre-guncelle');
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl
    });

    if (error) {
      console.error("Şifre sıfırlama e-postası gönderilirken hata:", error);
      return { 
        success: false, 
        error: `E-posta gönderilirken bir hata oluştu: ${error.message}` 
      };
    }

    console.log(`Şifre sıfırlama e-postası başarıyla gönderildi: ${email}. Yönlendirme adresi: ${redirectUrl}`);
    return { success: true };
  } catch (err) {
    console.error("Beklenmeyen bir hata oluştu:", err);
    return { 
      success: false, 
      error: `Beklenmeyen bir hata oluştu: ${err instanceof Error ? err.message : 'Bilinmeyen hata'}` 
    };
  }
}; 