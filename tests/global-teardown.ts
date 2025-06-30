import { FullConfig } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';

async function globalTeardown(config: FullConfig) {
  console.log('🧹 Global Teardown: Cleaning up test environment...');

  // Supabase test client
  const supabase = createClient(
    process.env.VITE_SUPABASE_URL || 'https://uunmmuybfcqiyxbnncjj.supabase.co',
    process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1bm1tdXliZmNxaXl4Ym5uY2pqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwMDA0MTIsImV4cCI6MjA2NjU3NjQxMn0.jp9LSv7iSc_W7bQkuhXYLWm6ngTZBe11uH8hsVKTYX4'
  );

  try {
    // Test verilerini temizle (opsiyonel - production'da dikkatli olun!)
    await cleanupTestData(supabase);

    // Test session dosyalarını temizle
    cleanupTestFiles();

    console.log('✅ Global Teardown completed successfully');
  } catch (error) {
    console.error('❌ Global Teardown failed:', error);
    // Don't throw error to avoid failing the test run
  }
}

async function cleanupTestData(supabase: any) {
  console.log('🗑️ Cleaning up test data...');

  try {
    // Test e-posta adreslerini temizle (sadece test verilerini)
    const testEmailPatterns = [
      'test-admin@cekirdek.test',
      'test-teacher@cekirdek.test',
      'test-parent@cekirdek.test',
      'test-pending@cekirdek.test',
      'test-approved@cekirdek.test'
    ];

    // Test applications'ları temizle
    for (const email of testEmailPatterns) {
      const { error } = await supabase
        .from('applications')
        .delete()
        .eq('email', email);
      
      if (error) {
        console.warn(`Warning: Could not delete test application ${email}:`, error.message);
      }
    }

    // Test auth users'ları temizle (dikkatli olun!)
    // Bu kısım production'da çalıştırılmamalı
    if (process.env.NODE_ENV === 'test') {
      for (const email of testEmailPatterns) {
        try {
          // Auth users'ı silmek için admin API gerekir
          // Şimdilik sadece log yapalım
          console.log(`Would delete test user: ${email}`);
        } catch (error) {
          console.warn(`Could not delete test user ${email}:`, error);
        }
      }
    }

    console.log('✅ Test data cleanup completed');
  } catch (error) {
    console.warn('⚠️ Test data cleanup had issues:', error);
  }
}

function cleanupTestFiles() {
  console.log('📁 Cleaning up test files...');

  try {
    // Session dosyalarını temizle
    const sessionFile = 'tests/fixtures/admin-session.json';
    if (fs.existsSync(sessionFile)) {
      fs.unlinkSync(sessionFile);
      console.log('✅ Admin session file cleaned up');
    }

    // Test screenshots ve videos'ları temizle (opsiyonel)
    const testResultsDir = 'test-results';
    if (fs.existsSync(testResultsDir)) {
      // Sadece eski dosyaları temizle, son test sonuçlarını koru
      console.log('📊 Test results preserved in test-results/');
    }

    console.log('✅ Test files cleanup completed');
  } catch (error) {
    console.warn('⚠️ Test files cleanup had issues:', error);
  }
}

export default globalTeardown;
