import { test, expect } from '@playwright/test';

test.describe('Demo Test - Görsel İzleme', () => {
  test('Ana sayfa demo testi', async ({ page }) => {
    console.log('🚀 Test başlıyor...');
    
    // Ana sayfaya git
    await page.goto('/');
    console.log('📍 Ana sayfaya gidildi');
    
    // Sayfa yüklenmesini bekle
    await page.waitForLoadState('networkidle');
    console.log('⏳ Sayfa yüklendi');
    
    // Başlık kontrolü
    const title = await page.title();
    console.log(`📄 Sayfa başlığı: ${title}`);
    
    // Ana başlığı bul
    const mainHeading = page.locator('h1, h2, h3').first();
    await expect(mainHeading).toBeVisible({ timeout: 10000 });
    console.log('✅ Ana başlık görünür');
    
    // Screenshot al
    await page.screenshot({ path: 'test-results/ana-sayfa.png', fullPage: true });
    console.log('📸 Screenshot alındı');
    
    // 2 saniye bekle (görsel için)
    await page.waitForTimeout(2000);
    
    console.log('🎉 Test tamamlandı!');
  });

  test('Login sayfası demo testi', async ({ page }) => {
    console.log('🔐 Login test başlıyor...');
    
    // Login sayfasına git
    await page.goto('/login');
    console.log('📍 Login sayfasına gidildi');
    
    // Form elementlerini kontrol et
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    const submitButton = page.locator('button[type="submit"]');
    
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(submitButton).toBeVisible();
    console.log('✅ Login form elementleri görünür');
    
    // Form alanlarını doldur (demo için)
    await emailInput.fill('demo@example.com');
    await page.waitForTimeout(1000); // Görsel için bekleme
    
    await passwordInput.fill('demo123');
    await page.waitForTimeout(1000); // Görsel için bekleme
    
    console.log('📝 Form alanları dolduruldu');
    
    // Screenshot al
    await page.screenshot({ path: 'test-results/login-form.png', fullPage: true });
    console.log('📸 Login form screenshot alındı');
    
    // Form'u temizle
    await emailInput.clear();
    await passwordInput.clear();
    
    console.log('🧹 Form temizlendi');
    console.log('🎉 Login demo testi tamamlandı!');
  });

  test('Navigation demo testi', async ({ page }) => {
    console.log('🧭 Navigation test başlıyor...');
    
    // Ana sayfaya git
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Navigation linklerini bul
    const navLinks = [
      { text: 'Hakkımızda', url: '/hakkimizda' },
      { text: 'İletişim', url: '/iletisim' },
      { text: 'Başvuru', url: '/basvuru' }
    ];
    
    for (const link of navLinks) {
      console.log(`🔗 ${link.text} linkine tıklanıyor...`);
      
      // Link'i bul ve tıkla
      const linkElement = page.locator(`a:has-text("${link.text}"), a[href="${link.url}"]`).first();
      
      if (await linkElement.count() > 0) {
        await linkElement.click();
        await page.waitForLoadState('networkidle');
        
        // URL kontrolü
        expect(page.url()).toContain(link.url);
        console.log(`✅ ${link.text} sayfasına başarıyla gidildi`);
        
        // Screenshot al
        await page.screenshot({ 
          path: `test-results/${link.text.toLowerCase()}-sayfa.png`, 
          fullPage: true 
        });
        
        // 1 saniye bekle (görsel için)
        await page.waitForTimeout(1000);
      } else {
        console.log(`⚠️ ${link.text} linki bulunamadı`);
      }
    }
    
    console.log('🎉 Navigation demo testi tamamlandı!');
  });

  test('Responsive design demo testi', async ({ page }) => {
    console.log('📱 Responsive test başlıyor...');
    
    await page.goto('/');
    
    // Desktop view
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'test-results/desktop-view.png', fullPage: true });
    console.log('🖥️ Desktop screenshot alındı');
    
    // Tablet view
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'test-results/tablet-view.png', fullPage: true });
    console.log('📱 Tablet screenshot alındı');
    
    // Mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'test-results/mobile-view.png', fullPage: true });
    console.log('📱 Mobile screenshot alındı');
    
    console.log('🎉 Responsive demo testi tamamlandı!');
  });
});
