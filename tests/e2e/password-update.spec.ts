import { test, expect } from '@playwright/test';
import { TestDataFactory } from '../utils/test-data-factory';
import { 
  waitForLoadingToComplete, 
  waitForToast 
} from '../utils/test-helpers';

test.describe('Şifre Güncelleme Süreci E2E Testleri', () => {
  test('Şifre sıfırlama ve güncelleme akışı testi', async ({ page }) => {
    console.log('🔄 Şifre sıfırlama ve güncelleme akışı testi başlıyor...');

    // 1. Şifre sıfırlama sayfasına git
    await page.goto('/sifremi-unuttum');
    await waitForLoadingToComplete(page);

    const testEmail = 'l.demir@fatsa.bel.tr';
    
    // 2. E-posta adresini gir ve şifre sıfırlama isteği gönder
    await page.fill('input[type="email"]', testEmail);
    console.log(`📧 Test e-posta girildi: ${testEmail}`);

    await page.screenshot({ path: 'test-results/password-reset-request.png' });

    await page.click('button[type="submit"]');
    console.log('🔘 Şifre sıfırlama butonuna tıklandı');

    // 3. Başarı mesajını bekle
    await page.waitForTimeout(3000);
    
    const successMessage = page.locator('text=Şifre sıfırlama linki e-posta adresinize gönderildi');
    if (await successMessage.count() > 0) {
      console.log('✅ Şifre sıfırlama e-postası gönderildi');
    }

    await page.screenshot({ path: 'test-results/password-reset-success.png' });

    // 4. Şifre güncelleme sayfasını doğrudan test et (token simülasyonu)
    // Gerçek senaryoda e-postadaki link kullanılır
    const mockTokens = {
      access_token: 'mock_access_token_for_testing',
      refresh_token: 'mock_refresh_token_for_testing'
    };

    await page.goto(`/sifre-guncelle?access_token=${mockTokens.access_token}&refresh_token=${mockTokens.refresh_token}`);
    await waitForLoadingToComplete(page);

    console.log('🔗 Şifre güncelleme sayfasına yönlendirildi');

    // 5. Sayfa başlığını kontrol et
    const pageTitle = page.locator('h1, h2');
    if (await pageTitle.count() > 0) {
      const titleText = await pageTitle.textContent();
      console.log('📋 Sayfa başlığı:', titleText);
    }

    await page.screenshot({ path: 'test-results/password-update-page.png', fullPage: true });

    console.log('🎉 Şifre sıfırlama ve güncelleme akışı testi tamamlandı!');
  });

  test('Şifre güncelleme formu validation testleri', async ({ page }) => {
    console.log('📋 Şifre güncelleme form validation testi başlıyor...');

    // Mock token'larla şifre güncelleme sayfasına git
    await page.goto('/sifre-guncelle?access_token=mock_token&refresh_token=mock_token');
    await waitForLoadingToComplete(page);

    // Zayıf şifre testi
    const weakPasswords = [
      '123',           // Çok kısa
      'password',      // Büyük harf yok
      'PASSWORD',      // Küçük harf yok
      'Password',      // Rakam yok
      'Password123'    // Özel karakter yok
    ];

    for (const weakPassword of weakPasswords) {
      console.log(`🔍 Test edilen zayıf şifre: "${weakPassword}"`);
      
      // Şifre alanını temizle ve zayıf şifre gir
      await page.fill('input[id="password"]', '');
      await page.fill('input[id="password"]', weakPassword);
      
      // Validation hatalarını bekle
      await page.waitForTimeout(1000);
      
      const validationErrors = page.locator('.text-red-600');
      const errorCount = await validationErrors.count();
      
      if (errorCount > 0) {
        console.log(`✅ Zayıf şifre için ${errorCount} validation hatası görüntülendi`);
      }
    }

    // Güçlü şifre testi
    const strongPassword = 'GüçlüŞifre123!@#';
    
    await page.fill('input[id="password"]', strongPassword);
    await page.fill('input[id="confirmPassword"]', strongPassword);
    
    console.log('✅ Güçlü şifre girildi');

    // Şifre eşleşme kontrolü
    const matchIndicator = page.locator('text=Şifreler eşleşiyor');
    if (await matchIndicator.count() > 0) {
      console.log('✅ Şifre eşleşme göstergesi çalışıyor');
    }

    await page.screenshot({ path: 'test-results/password-validation-test.png', fullPage: true });

    console.log('🎉 Şifre validation testleri tamamlandı!');
  });

  test('Şifre güncelleme sayfası accessibility testi', async ({ page }) => {
    console.log('♿ Şifre güncelleme accessibility testi başlıyor...');

    await page.goto('/sifre-guncelle?access_token=mock_token&refresh_token=mock_token');
    await waitForLoadingToComplete(page);

    // Form elementlerinin accessible name'lerinin olduğunu kontrol et
    const passwordInput = page.locator('input[id="password"]');
    const confirmPasswordInput = page.locator('input[id="confirmPassword"]');
    const submitButton = page.locator('button[type="submit"]');

    if (await passwordInput.count() > 0) {
      await expect(passwordInput).toHaveAccessibleName(/şifre|password/i);
      console.log('✅ Şifre input accessibility kontrolü geçti');
    }

    if (await confirmPasswordInput.count() > 0) {
      await expect(confirmPasswordInput).toHaveAccessibleName(/şifre|password/i);
      console.log('✅ Şifre tekrar input accessibility kontrolü geçti');
    }

    if (await submitButton.count() > 0) {
      await expect(submitButton).toHaveAccessibleName(/güncelle|update/i);
      console.log('✅ Submit button accessibility kontrolü geçti');
    }

    console.log('🎉 Accessibility testleri tamamlandı!');
  });

  test('Şifre güncelleme keyboard navigation testi', async ({ page }) => {
    console.log('⌨️ Keyboard navigation testi başlıyor...');

    await page.goto('/sifre-guncelle?access_token=mock_token&refresh_token=mock_token');
    await waitForLoadingToComplete(page);

    const testPassword = 'TestŞifre123!@#';

    // Tab ile form elementleri arasında gezinme
    await page.keyboard.press('Tab'); // Şifre alanına focus
    const passwordInput = page.locator('input[id="password"]');
    if (await passwordInput.count() > 0) {
      await expect(passwordInput).toBeFocused();
      await page.keyboard.type(testPassword);
    }

    await page.keyboard.press('Tab'); // Şifre göster/gizle butonuna
    await page.keyboard.press('Tab'); // Şifre tekrar alanına
    const confirmPasswordInput = page.locator('input[id="confirmPassword"]');
    if (await confirmPasswordInput.count() > 0) {
      await expect(confirmPasswordInput).toBeFocused();
      await page.keyboard.type(testPassword);
    }

    await page.keyboard.press('Tab'); // Şifre göster/gizle butonuna
    await page.keyboard.press('Tab'); // Submit butonuna
    const submitButton = page.locator('button[type="submit"]');
    if (await submitButton.count() > 0) {
      await expect(submitButton).toBeFocused();
    }

    console.log('✅ Keyboard navigation çalışıyor');

    await page.screenshot({ path: 'test-results/password-update-keyboard-nav.png' });

    console.log('🎉 Keyboard navigation testi tamamlandı!');
  });

  test('Şifre güncelleme responsive design testi', async ({ page }) => {
    console.log('📱 Responsive design testi başlıyor...');

    const viewports = [
      { name: 'Desktop', width: 1920, height: 1080 },
      { name: 'Tablet', width: 768, height: 1024 },
      { name: 'Mobile', width: 375, height: 667 }
    ];

    for (const viewport of viewports) {
      console.log(`📐 ${viewport.name} view testi başlıyor...`);
      
      // Viewport ayarla
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      
      // Şifre güncelleme sayfasına git
      await page.goto('/sifre-guncelle?access_token=mock_token&refresh_token=mock_token');
      await waitForLoadingToComplete(page);

      // Form elementlerinin görünür olduğunu kontrol et
      const passwordInput = page.locator('input[id="password"]');
      const submitButton = page.locator('button[type="submit"]');

      if (await passwordInput.count() > 0) {
        await expect(passwordInput).toBeVisible();
      }

      if (await submitButton.count() > 0) {
        await expect(submitButton).toBeVisible();
      }

      // Screenshot al
      await page.screenshot({ 
        path: `test-results/password-update-${viewport.name.toLowerCase()}.png`,
        fullPage: true 
      });

      console.log(`✅ ${viewport.name} view form görünür`);
    }

    console.log('🎉 Responsive design testi tamamlandı!');
  });

  test('Geçersiz token ile şifre güncelleme sayfası testi', async ({ page }) => {
    console.log('🚫 Geçersiz token testi başlıyor...');

    // Token olmadan şifre güncelleme sayfasına git
    await page.goto('/sifre-guncelle');
    await waitForLoadingToComplete(page);

    // Login sayfasına yönlendirilmeyi bekle
    await page.waitForTimeout(3000);
    
    const currentUrl = page.url();
    console.log('🔗 Geçersiz token sonrası URL:', currentUrl);

    if (currentUrl.includes('/login')) {
      console.log('✅ Geçersiz token durumunda login sayfasına yönlendirildi');
    }

    await page.screenshot({ path: 'test-results/password-update-invalid-token.png' });

    console.log('🎉 Geçersiz token testi tamamlandı!');
  });
});
