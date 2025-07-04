import { test, expect } from '@playwright/test';

test.describe('Hızlı Login Testleri', () => {
  test('Admin Login Test - coruho52@gmail.com', async ({ page }) => {
    console.log('🚀 Admin login testi başlıyor...');
    
    // Login sayfasına git
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    
    // Credentials gir
    await page.fill('input[type="email"]', 'coruho52@gmail.com');
    await page.fill('input[type="password"]', '123456');
    
    console.log('📝 Admin credentials girildi');
    
    // Screenshot al
    await page.screenshot({ path: 'test-results/admin-login-attempt.png' });
    
    // Login butonuna tıkla
    await page.click('button[type="submit"]');
    console.log('🔘 Login butonuna tıklandı');
    
    // Sonucu bekle
    await page.waitForTimeout(5000);
    
    const currentUrl = page.url();
    console.log('🔗 Sonuç URL:', currentUrl);
    
    // Screenshot al
    await page.screenshot({ path: 'test-results/admin-login-result.png' });
    
    if (currentUrl.includes('/admin')) {
      console.log('✅ Admin login BAŞARILI');
    } else {
      console.log('❌ Admin login BAŞARISIZ');
      
      // Hata mesajı var mı kontrol et
      const errorMessage = page.locator('.error, .text-red-500, [role="alert"]');
      if (await errorMessage.count() > 0) {
        const errorText = await errorMessage.first().textContent();
        console.log('🚨 Hata mesajı:', errorText);
      }
    }
  });

  test('Veli Login Test - l.demir@fatsa.bel.tr', async ({ page }) => {
    console.log('👨‍👩‍👧‍👦 Veli login testi başlıyor...');
    
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    
    await page.fill('input[type="email"]', 'l.demir@fatsa.bel.tr');
    await page.fill('input[type="password"]', '123456');
    
    console.log('📝 Veli credentials girildi');
    
    await page.screenshot({ path: 'test-results/parent-login-attempt.png' });
    
    await page.click('button[type="submit"]');
    console.log('🔘 Login butonuna tıklandı');
    
    await page.waitForTimeout(5000);
    
    const currentUrl = page.url();
    console.log('🔗 Veli sonuç URL:', currentUrl);
    
    await page.screenshot({ path: 'test-results/parent-login-result.png' });
    
    if (!currentUrl.includes('/login')) {
      console.log('✅ Veli login BAŞARILI');
    } else {
      console.log('❌ Veli login BAŞARISIZ');
    }
  });

  test('Öğretmen Login Test - o.coruh@fatsa.bel.tr', async ({ page }) => {
    console.log('👩‍🏫 Öğretmen login testi başlıyor...');
    
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    
    await page.fill('input[type="email"]', 'o.coruh@fatsa.bel.tr');
    await page.fill('input[type="password"]', '123456');
    
    console.log('📝 Öğretmen credentials girildi');
    
    await page.screenshot({ path: 'test-results/teacher-login-attempt.png' });
    
    await page.click('button[type="submit"]');
    console.log('🔘 Login butonuna tıklandı');
    
    await page.waitForTimeout(5000);
    
    const currentUrl = page.url();
    console.log('🔗 Öğretmen sonuç URL:', currentUrl);
    
    await page.screenshot({ path: 'test-results/teacher-login-result.png' });
    
    if (!currentUrl.includes('/login')) {
      console.log('✅ Öğretmen login BAŞARILI');
    } else {
      console.log('❌ Öğretmen login BAŞARISIZ');
    }
  });
});
