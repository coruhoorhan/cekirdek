import { createClient } from '@supabase/supabase-js';

// Sabit URL ve anahtar tanımla
const supabaseUrl = "https://uunmmuybfcqiyxbnncjj.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1bm1tdXliZmNxaXl4Ym5uY2pqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwMDA0MTIsImV4cCI6MjA2NjU3NjQxMn0.jp9LSv7iSc_W7bQkuhXYLWm6ngTZBe11uH8hsVKTYX4";

// Supabase istemcisi oluştur
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true
  }
});
