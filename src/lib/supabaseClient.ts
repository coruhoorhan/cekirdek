import { createClient } from '@supabase/supabase-js';

// Ortam değişkenlerinden URL ve anahtarı al
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Değişkenlerin varlığını kontrol et
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL and Anon Key must be defined in the .env file");
}

// Supabase istemcisi oluştur
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storageKey: 'supabase.auth.token',
    storage: localStorage
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  },
  global: {
    headers: {
      'x-application-name': 'cekirdek-app',
    },
  },
});

// Ek olarak supabase durumunu kontrol edecek yardımcı fonksiyon
export const checkSupabaseConnection = async (): Promise<boolean> => {
  try {
    // Basit bir sorgu ile Supabase bağlantısını test et
    const { data, error } = await supabase.from('profiles').select('id').limit(1);
    
    if (error) {
      console.error('Supabase connection check failed:', error.message);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error('Supabase connection error:', err);
    return false;
  }
};
