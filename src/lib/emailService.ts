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
 * Veli kaydı onaylandığında şifre belirleme e-postası gönderir
 * @param email - Veli e-posta adresi
 * @param name - Velinin adı 
 * @returns Promise<{success: boolean, error?: string}>
 */
export const sendPasswordSetupEmail = async (email: string, name: string): Promise<{success: boolean, error?: string}> => {
  try {
    // E-posta adresini temizle
    const cleanEmail = email.trim().toLowerCase();

    // E-posta format kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return {
        success: false,
        error: `Geçersiz e-posta formatı: ${cleanEmail}`
      };
    }

    // Temiz URL oluştur
    const redirectUrl = formatCleanUrl(window.location.origin, 'velisifre');

    const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
      redirectTo: redirectUrl
    });

    if (error) {
      console.error("Şifre belirleme e-postası gönderilirken hata:", error);
      return { 
        success: false, 
        error: `E-posta gönderilirken bir hata oluştu: ${error.message}` 
      };
    }

    console.log(`Şifre belirleme e-postası başarıyla gönderildi: ${cleanEmail}. Yönlendirme adresi: ${redirectUrl}`);
    return { success: true };
  } catch (err) {
    console.error("Beklenmeyen bir hata oluştu:", err);
    return { 
      success: false, 
      error: `Beklenmeyen bir hata oluştu: ${err instanceof Error ? err.message : 'Bilinmeyen hata'}` 
    };
  }
}; 