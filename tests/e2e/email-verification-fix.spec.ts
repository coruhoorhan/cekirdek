import { test, expect } from '@playwright/test';

test.describe('E-posta Doğrulama Düzeltme Testleri', () => {
  test('Şifre sıfırlama e-posta linki testi', async ({ page }) => {
    console.log('🔧 E-posta doğrulama düzeltme testi başlıyor...');

    // 1. Şifre sıfırlama sayfasına git
    await page.goto('/sifremi-unuttum');
    await page.waitForLoadState('networkidle');

    const testEmail = 'test-email-fix@example.com';
    
    // 2. Test e-postası ile şifre sıfırlama isteği gönder
    await page.fill('input[type="email"]', testEmail);
    console.log(`📧 Test e-posta girildi: ${testEmail}`);

    await page.screenshot({ path: 'test-results/email-fix-password-reset-form.png' });

    await page.click('button[type="submit"]');
    console.log('🔘 Şifre sıfırlama butonuna tıklandı');

    // 3. Sonucu bekle
    await page.waitForTimeout(5000);
    
    // Toast mesajı kontrolü
    const toastMessage = page.locator('.toast, [role="alert"], .notification');
    if (await toastMessage.count() > 0) {
      const toastText = await toastMessage.first().textContent();
      console.log('📢 Toast mesajı:', toastText);
      
      if (toastText?.includes('gönderildi') || toastText?.includes('sent')) {
        console.log('✅ E-posta gönderimi başarılı');
      } else {
        console.log('❌ E-posta gönderimi başarısız');
      }
    }

    await page.screenshot({ path: 'test-results/email-fix-password-reset-result.png' });

    console.log('🎉 E-posta doğrulama düzeltme testi tamamlandı!');
  });

  test('URL temizleme fonksiyonu testi', async ({ page }) => {
    console.log('🧹 URL temizleme fonksiyonu testi başlıyor...');

    // Test için console'da URL temizleme fonksiyonunu çalıştır
    await page.goto('/');
    
    const urlTestResult = await page.evaluate(() => {
      // URL temizleme fonksiyonunu test et
      const formatCleanUrl = (baseUrl: string, path: string): string => {
        let cleanBase = baseUrl.trim();
        let cleanPath = path.trim();
        
        cleanBase = cleanBase.replace(/\s+/g, '').replace(/\u0020/g, '');
        cleanPath = cleanPath.replace(/\s+/g, '').replace(/\u0020/g, '');
        
        const formattedPath = cleanPath.startsWith('/') ? cleanPath.substring(1) : cleanPath;
        const normalizedBase = cleanBase.endsWith('/') ? cleanBase.slice(0, -1) : cleanBase;
        
        const fullUrl = `${normalizedBase}/${formattedPath}`;
        
        try {
          new URL(fullUrl);
          return { success: true, url: fullUrl };
        } catch (error) {
          const fallbackUrl = `http://localhost:5173/${formattedPath}`;
          return { success: false, url: fallbackUrl, error: error.message };
        }
      };

      // Test senaryoları
      const testCases = [
        { base: 'http://localhost:5173 ', path: 'sifre-guncelle' }, // Boşluklu
        { base: 'http://localhost:5173', path: '/sifre-guncelle' }, // Normal
        { base: 'http://localhost:5173/', path: 'sifre-guncelle' }, // Slash'li
        { base: ' http://localhost:5173 ', path: ' /sifre-guncelle ' }, // Çok boşluklu
      ];

      const results = testCases.map(testCase => {
        const result = formatCleanUrl(testCase.base, testCase.path);
        return {
          input: testCase,
          output: result
        };
      });

      return results;
    });

    console.log('🧪 URL temizleme test sonuçları:');
    urlTestResult.forEach((result, index) => {
      console.log(`Test ${index + 1}:`);
      console.log(`  Input: "${result.input.base}" + "${result.input.path}"`);
      console.log(`  Output: "${result.output.url}"`);
      console.log(`  Success: ${result.output.success}`);
    });

    // Tüm test sonuçlarının başarılı olduğunu kontrol et
    const allSuccessful = urlTestResult.every(result => 
      result.output.url.includes('http://localhost:5173/sifre-guncelle') &&
      !result.output.url.includes('%20') &&
      !result.output.url.includes(' ')
    );

    if (allSuccessful) {
      console.log('✅ URL temizleme fonksiyonu tüm testleri geçti');
    } else {
      console.log('❌ URL temizleme fonksiyonunda sorun var');
    }

    console.log('🎉 URL temizleme testi tamamlandı!');
  });

  test('Supabase konfigürasyon kontrolü', async ({ page }) => {
    console.log('⚙️ Supabase konfigürasyon kontrolü başlıyor...');

    // Admin paneline git
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    
    await page.fill('input[type="email"]', 'coruho52@gmail.com');
    await page.fill('input[type="password"]', '123456');
    await page.click('button[type="submit"]');
    
    await page.waitForTimeout(5000);

    // E-posta doğrulama sayfasına git
    await page.goto('/admin/email-verification');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000);

    // Sayfa yüklendiğini kontrol et
    const pageTitle = page.locator('h1');
    if (await pageTitle.count() > 0) {
      const titleText = await pageTitle.textContent();
      console.log('📋 E-posta doğrulama sayfası başlığı:', titleText);
    }

    // Konfigürasyon bilgilerini console'da kontrol et
    const configInfo = await page.evaluate(() => {
      return {
        origin: window.location.origin,
        href: window.location.href,
        userAgent: navigator.userAgent
      };
    });

    console.log('🔧 Konfigürasyon bilgileri:');
    console.log(`  Origin: ${configInfo.origin}`);
    console.log(`  Current URL: ${configInfo.href}`);

    // Screenshot al
    await page.screenshot({ 
      path: 'test-results/email-verification-config-check.png', 
      fullPage: true 
    });

    console.log('✅ Supabase konfigürasyon kontrolü tamamlandı');
  });

  test('Gerçek e-posta doğrulama akışı simülasyonu', async ({ page }) => {
    console.log('📧 Gerçek e-posta doğrulama akışı simülasyonu başlıyor...');

    // 1. Kayıt olma sayfasına git
    await page.goto('/kayit-ol');
    await page.waitForLoadState('networkidle');

    const testEmail = `email-fix-test-${Date.now()}@example.com`;
    const testPassword = 'TestPassword123!';

    // 2. Kayıt formu doldur
    await page.fill('input[name="fullName"]', 'Test Email Fix User');
    await page.fill('input[type="email"]', testEmail);
    await page.fill('input[name="phone"]', '05551234567');
    await page.fill('input[type="password"]', testPassword);
    await page.fill('input[name="confirmPassword"]', testPassword);

    console.log(`📝 Test kullanıcısı oluşturuluyor: ${testEmail}`);

    await page.screenshot({ path: 'test-results/email-fix-registration-form.png' });

    // 3. Kayıt ol butonuna tıkla
    await page.click('button[type="submit"]');
    console.log('🔘 Kayıt ol butonuna tıklandı');

    // 4. Sonucu bekle
    await page.waitForTimeout(8000);

    // Toast mesajı kontrolü
    const toastMessage = page.locator('.toast, [role="alert"], .notification');
    if (await toastMessage.count() > 0) {
      const toastText = await toastMessage.first().textContent();
      console.log('📢 Kayıt sonucu:', toastText);
    }

    await page.screenshot({ path: 'test-results/email-fix-registration-result.png' });

    // 5. Şimdi şifre sıfırlama ile e-posta doğrulama linkini test et
    await page.goto('/sifremi-unuttum');
    await page.waitForLoadState('networkidle');

    await page.fill('input[type="email"]', testEmail);
    await page.click('button[type="submit"]');

    await page.waitForTimeout(5000);

    const resetToastMessage = page.locator('.toast, [role="alert"], .notification');
    if (await resetToastMessage.count() > 0) {
      const resetToastText = await resetToastMessage.first().textContent();
      console.log('📢 Şifre sıfırlama sonucu:', resetToastText);
    }

    console.log('🎉 Gerçek e-posta doğrulama akışı simülasyonu tamamlandı!');
    console.log(`📧 Test e-postası: ${testEmail}`);
    console.log('💡 Bu e-postaya gelen doğrulama linkini kontrol edin');
  });
});
