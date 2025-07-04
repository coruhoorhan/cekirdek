import { chromium, FullConfig } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';

async function globalSetup(config: FullConfig) {
  console.log('🚀 Global Setup: Preparing test environment...');

  // Supabase test client
  const supabase = createClient(
    process.env.VITE_SUPABASE_URL || 'https://uunmmuybfcqiyxbnncjj.supabase.co',
    process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1bm1tdXliZmNxaXl4Ym5uY2pqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwMDA0MTIsImV4cCI6MjA2NjU3NjQxMn0.jp9LSv7iSc_W7bQkuhXYLWm6ngTZBe11uH8hsVKTYX4'
  );

  try {
    // Test database connection
    const { data, error } = await supabase.from('profiles').select('count').limit(1);
    if (error) {
      console.error('❌ Database connection failed:', error.message);
      throw new Error(`Database connection failed: ${error.message}`);
    }
    console.log('✅ Database connection successful');

    // Prepare test data
    await prepareTestData(supabase);

    // Create admin user session for tests
    await createTestAdminSession();

    console.log('✅ Global Setup completed successfully');
  } catch (error) {
    console.error('❌ Global Setup failed:', error);
    throw error;
  }
}

async function prepareTestData(supabase: any) {
  console.log('📝 Preparing test data...');

  // Test kullanıcıları için gerekli veriler
  const testUsers = [
    {
      email: 'test-admin@cekirdek.test',
      name: 'Test Admin User',
      role: 'admin'
    },
    {
      email: 'test-teacher@cekirdek.test',
      name: 'Test Teacher User',
      role: 'teacher'
    },
    {
      email: 'test-parent@cekirdek.test',
      name: 'Test Parent User',
      role: 'parent'
    }
  ];

  // Test başvuruları
  const testApplications = [
    {
      email: 'test-pending@cekirdek.test',
      name: 'Test Pending Application',
      phone: '05551234567',
      status: 'pending'
    },
    {
      email: 'test-approved@cekirdek.test',
      name: 'Test Approved Application',
      phone: '05551234568',
      status: 'approved'
    }
  ];

  try {
    // Test applications ekle (eğer yoksa)
    for (const app of testApplications) {
      const { data: existing } = await supabase
        .from('applications')
        .select('id')
        .eq('email', app.email)
        .single();

      if (!existing) {
        const { error } = await supabase
          .from('applications')
          .insert([app]);
        
        if (error) {
          console.warn(`Warning: Could not insert test application ${app.email}:`, error.message);
        } else {
          console.log(`✅ Test application created: ${app.email}`);
        }
      }
    }

    console.log('✅ Test data preparation completed');
  } catch (error) {
    console.warn('⚠️ Test data preparation had issues:', error);
    // Don't fail the setup for test data issues
  }
}

async function createTestAdminSession() {
  console.log('👤 Creating test admin session...');
  
  // Browser'ı başlat ve admin login yap
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Development server'ın hazır olmasını bekle
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
    
    // Login sayfasına git
    await page.goto('http://localhost:5173/login');
    
    // Admin credentials ile login yap
    await page.fill('input[type="email"]', 'coruho52@gmail.com'); // Bilinen admin e-posta
    await page.fill('input[type="password"]', 'test123'); // Test şifresi
    
    // Login butonuna tıkla
    await page.click('button[type="submit"]');
    
    // Dashboard'a yönlendirilmeyi bekle
    await page.waitForURL('**/admin/dashboard', { timeout: 10000 });
    
    // Session'ı kaydet
    const storageState = await context.storageState();
    
    // Session'ı dosyaya kaydet
    require('fs').writeFileSync('tests/fixtures/admin-session.json', JSON.stringify(storageState, null, 2));
    
    console.log('✅ Admin session created and saved');
  } catch (error) {
    console.warn('⚠️ Could not create admin session:', error);
    // Don't fail setup for session creation issues
  } finally {
    await browser.close();
  }
}

export default globalSetup;
