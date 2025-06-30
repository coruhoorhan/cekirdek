import { supabase } from './supabaseClient';

/**
 * URL'deki boşlukları temizleyen ve düzgün bir şekilde formatlayan yardımcı fonksiyon
 * @param baseUrl Temel URL
 * @param path Yönlendirilecek path
 * @returns Temizlenmiş ve formatlanmış tam URL
 */
const formatCleanUrl = (baseUrl: string, path: string): string => {
  // Başındaki ve sonundaki boşlukları temizle
  const cleanBase = baseUrl.trim();
  const cleanPath = path.trim();
  
  // Başında / varsa kaldır
  const formattedPath = cleanPath.startsWith('/') ? cleanPath.substring(1) : cleanPath;
  
  // URL'nin sonunda / olup olmadığına göre birleştir
  return cleanBase.endsWith('/') ? `${cleanBase}${formattedPath}` : `${cleanBase}/${formattedPath}`;
};

/**
 * Belirtilen e-posta adresine şifre sıfırlama linki gönderir
 * @param email Şifre sıfırlanacak e-posta adresi
 * @returns Promise<{success: boolean, error?: string}>
 */
export const sendPasswordResetEmail = async (email: string): Promise<{success: boolean, error?: string}> => {
  try {
    // Temiz URL oluştur
    const redirectUrl = formatCleanUrl(window.location.origin, 'sifreyenileme');
    
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