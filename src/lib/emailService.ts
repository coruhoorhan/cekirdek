import { supabase } from './supabaseClient';

/**
 * Veli kaydı onaylandığında şifre belirleme e-postası gönderir
 * @param email - Veli e-posta adresi
 * @param name - Velinin adı 
 * @returns Promise<{success: boolean, error?: string}>
 */
export const sendPasswordSetupEmail = async (email: string, name: string): Promise<{success: boolean, error?: string}> => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/velisifre`
    });

    if (error) {
      console.error("Şifre sıfırlama e-postası gönderilirken hata:", error);
      return { 
        success: false, 
        error: `E-posta gönderilirken bir hata oluştu: ${error.message}` 
      };
    }

    return { success: true };
  } catch (err) {
    console.error("Beklenmeyen bir hata oluştu:", err);
    return { 
      success: false, 
      error: `Beklenmeyen bir hata oluştu: ${err instanceof Error ? err.message : 'Bilinmeyen hata'}` 
    };
  }
}; 