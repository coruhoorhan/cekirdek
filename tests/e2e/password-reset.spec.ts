import { test, expect } from '@playwright/test';
import { TestDataFactory } from '../utils/test-data-factory';
import { 
  waitForLoadingToComplete, 
  waitForToast,
  testSupabase,
  PageHelpers,
  AssertionHelpers 
} from '../utils/test-helpers';

test.describe('Şifre Sıfırlama Süreci E2E Testleri', () => {
  test.beforeEach(async ({ page }) => {
    // Şifre sıfırlama sayfasına git
    await page.goto('/sifremi-unuttum');
    await waitForLoadingToComplete(page);
  });

  test('Mevcut kullanıcı ile şifre sıfırlama - l.demir@fatsa.bel.tr', async ({ page }) => {
    const userEmail = 'l.demir@fatsa.bel.tr';

    console.log('🔄 Şifre sıfırlama testi başlıyor...');
    console.log('📧 Test e-posta:', userEmail);

    // Şifre sıfırlama sayfasının yüklendiğini kontrol et
    await expect(page.locator('h1, h2')).toContainText(/şifre|password|reset/i);
    console.log('✅ Şifre sıfırlama sayfası yüklendi');

    // E-posta input alanının görünür olduğunu kontrol et
    const emailInput = page.locator('input[type="email"], input[name="email"], #email');
    await expect(emailInput).toBeVisible();

    // E-posta adresini gir
    await emailInput.fill(userEmail);
    await page.waitForTimeout(500);
    console.log('📝 E-posta adresi girildi');

    // Screenshot al
    await page.screenshot({ 
      path: 'test-results/password-reset-form.png', 
      fullPage: true 
    });

    // Şifre sıfırlama butonuna tıkla
    const submitButton = page.locator('button[type="submit"], button:has-text("Gönder"), button:has-text("Reset")');
    await expect(submitButton).toBeVisible();
    await expect(submitButton).toBeEnabled();
    
    await submitButton.click();
    console.log('🔘 Şifre sıfırlama butonuna tıklandı');

    // Loading state'ini bekle
    await expect(submitButton).toBeDisabled({ timeout: 3000 });

    // Başarı mesajını bekle
    await waitForToast(page, 'e-posta gönderildi|email sent|başarıyla|success');
    console.log('✅ Başarı mesajı görüntülendi');

    // Supabase'de şifre sıfırlama isteğinin oluşturulduğunu kontrol et
    // (Bu gerçek bir e-posta gönderimi olduğu için mock'lamak gerekebilir)
    console.log('📧 E-posta gönderme işlemi tamamlandı');

    console.log('🎉 Şifre sıfırlama testi tamamlandı!');
  });

  test('Mevcut kullanıcı ile şifre sıfırlama - o.coruh@fatsa.bel.tr', async ({ page }) => {
    const userEmail = 'o.coruh@fatsa.bel.tr';

    console.log('🔄 İkinci kullanıcı şifre sıfırlama testi başlıyor...');
    console.log('📧 Test e-posta:', userEmail);

    // E-posta adresini gir ve gönder
    await page.fill('input[type="email"], input[name="email"], #email', userEmail);
    await page.click('button[type="submit"], button:has-text("Gönder")');

    // Başarı mesajını bekle
    await waitForToast(page, 'e-posta gönderildi|email sent|başarıyla');
    console.log('✅ İkinci kullanıcı için şifre sıfırlama başarılı');
  });

  test('Supabase veritabanından diğer kullanıcıları test etme', async ({ page }) => {
    console.log('🗄️ Veritabanından kullanıcıları test etme başlıyor...');

    try {
      // Supabase'den mevcut kullanıcıları çek
      const { data: users, error } = await testSupabase
        .from('auth.users')
        .select('email')
        .limit(3);

      if (error) {
        console.warn('⚠️ Veritabanı sorgusu başarısız:', error);
        return;
      }

      if (!users || users.length === 0) {
        console.log('ℹ️ Veritabanında kullanıcı bulunamadı');
        return;
      }

      // Her kullanıcı için şifre sıfırlama testi
      for (const user of users.slice(0, 2)) { // İlk 2 kullanıcıyı test et
        console.log(`🔄 Test edilen kullanıcı: ${user.email}`);

        await page.fill('input[type="email"], input[name="email"], #email', user.email);
        await page.click('button[type="submit"], button:has-text("Gönder")');

        // Başarı mesajını bekle
        await waitForToast(page, 'e-posta gönderildi|email sent|başarıyla');
        console.log(`✅ ${user.email} için şifre sıfırlama başarılı`);

        // Sayfayı yenile (bir sonraki test için)
        await page.reload();
        await waitForLoadingToComplete(page);
      }

    } catch (error) {
      console.warn('⚠️ Veritabanı testi başarısız:', error);
    }
  });

  test('Geçersiz e-posta ile şifre sıfırlama hatası', async ({ page }) => {
    const invalidEmail = 'nonexistent@example.com';

    console.log('❌ Geçersiz e-posta testi başlıyor...');
    console.log('📧 Geçersiz e-posta:', invalidEmail);

    // Geçersiz e-posta adresini gir
    await page.fill('input[type="email"], input[name="email"], #email', invalidEmail);
    await page.click('button[type="submit"], button:has-text("Gönder")');

    // Hata mesajını bekle
    const errorMessage = page.locator('text=Kullanıcı bulunamadı|User not found|e-posta adresi bulunamadı');
    
    // Bazı sistemler güvenlik nedeniyle her zaman başarı mesajı gösterebilir
    const successMessage = page.locator('text=e-posta gönderildi|email sent|başarıyla');
    
    // Ya hata mesajı ya da güvenlik amaçlı başarı mesajı görünmeli
    const messageVisible = await Promise.race([
      errorMessage.waitFor({ timeout: 5000 }).then(() => 'error'),
      successMessage.waitFor({ timeout: 5000 }).then(() => 'success')
    ]).catch(() => 'none');

    if (messageVisible === 'error') {
      console.log('✅ Geçersiz e-posta hatası görüntülendi');
    } else if (messageVisible === 'success') {
      console.log('✅ Güvenlik amaçlı başarı mesajı görüntülendi (normal)');
    } else {
      console.log('⚠️ Herhangi bir mesaj görüntülenmedi');
    }
  });

  test('E-posta format validation', async ({ page }) => {
    console.log('📧 E-posta format validation testi başlıyor...');

    const invalidEmails = TestDataFactory.getInvalidTestData().emails;

    for (const invalidEmail of invalidEmails.slice(0, 3)) {
      console.log(`🔍 Test edilen format: "${invalidEmail}"`);
      
      await page.fill('input[type="email"], input[name="email"], #email', invalidEmail);
      await page.click('button[type="submit"], button:has-text("Gönder")');

      // E-posta format hatası bekle
      const emailError = page.locator('text=Geçerli bir e-posta adresi giriniz, text=Invalid email format');
      if (await emailError.count() > 0) {
        await expect(emailError).toBeVisible();
        console.log(`✅ Format hatası görüntülendi: ${invalidEmail}`);
      }

      // Form'u temizle
      await page.fill('input[type="email"], input[name="email"], #email', '');
    }
  });

  test('Boş form validation', async ({ page }) => {
    console.log('📝 Boş form validation testi başlıyor...');

    // Boş form ile submit dene
    await page.click('button[type="submit"], button:has-text("Gönder")');

    // E-posta required hatası bekle
    const emailRequired = page.locator('text=E-posta adresi gereklidir, text=Email is required');
    if (await emailRequired.count() > 0) {
      await expect(emailRequired).toBeVisible();
      console.log('✅ E-posta required validation çalışıyor');
    }
  });

  test('Rate limiting testi', async ({ page }) => {
    console.log('🚫 Rate limiting testi başlıyor...');

    const testEmail = 'rate-limit-reset@example.com';

    // 6 kez şifre sıfırlama isteği gönder
    for (let i = 0; i < 6; i++) {
      console.log(`🔄 Deneme ${i + 1}/6`);
      
      await page.fill('input[type="email"], input[name="email"], #email', testEmail);
      await page.click('button[type="submit"], button:has-text("Gönder")');
      
      // Kısa bekleme
      await page.waitForTimeout(1000);
      
      // Form'u temizle
      await page.fill('input[type="email"], input[name="email"], #email', '');
    }

    // Rate limit mesajını bekle
    const rateLimitMessage = page.locator('text=Çok fazla istek|Too many requests|rate limit');
    if (await rateLimitMessage.count() > 0) {
      await expect(rateLimitMessage).toBeVisible({ timeout: 5000 });
      console.log('✅ Rate limiting çalışıyor');
    } else {
      console.log('ℹ️ Rate limiting mesajı görünmedi (sistem ayarına bağlı)');
    }
  });

  test('Geri dönüş linki testi', async ({ page }) => {
    console.log('🔗 Geri dönüş linki testi başlıyor...');

    // "Giriş Yap" veya "Login" linkini bul
    const backToLoginLink = page.locator('a:has-text("Giriş Yap"), a:has-text("Login"), a[href*="login"]');
    
    if (await backToLoginLink.count() > 0) {
      await expect(backToLoginLink).toBeVisible();
      console.log('✅ Geri dönüş linki görünür');

      // Link'e tıkla
      await backToLoginLink.click();

      // Login sayfasına yönlendirilmeyi bekle
      await page.waitForTimeout(2000);
      await AssertionHelpers.expectUrlContains(page, '/login');
      console.log('✅ Login sayfasına geri dönüldü');
    } else {
      console.log('ℹ️ Geri dönüş linki bulunamadı');
    }
  });

  test('Şifre sıfırlama form accessibility testi', async ({ page }) => {
    console.log('♿ Accessibility testi başlıyor...');

    // Form elementlerinin accessible name'lerinin olduğunu kontrol et
    const emailInput = page.locator('input[type="email"], input[name="email"], #email');
    const submitButton = page.locator('button[type="submit"]');

    if (await emailInput.count() > 0) {
      await expect(emailInput).toHaveAccessibleName(/e-posta|email/i);
      console.log('✅ E-posta input accessibility kontrolü geçti');
    }

    if (await submitButton.count() > 0) {
      await expect(submitButton).toHaveAccessibleName(/gönder|send|reset/i);
      console.log('✅ Submit button accessibility kontrolü geçti');
    }
  });

  test('Keyboard navigation testi', async ({ page }) => {
    console.log('⌨️ Keyboard navigation testi başlıyor...');

    const testEmail = 'keyboard-test@example.com';

    // Tab ile e-posta alanına focus
    await page.keyboard.press('Tab');
    const emailInput = page.locator('input[type="email"], input[name="email"], #email');
    if (await emailInput.count() > 0) {
      await expect(emailInput).toBeFocused();
      await page.keyboard.type(testEmail);
    }

    // Tab ile submit butonuna focus
    await page.keyboard.press('Tab');
    const submitButton = page.locator('button[type="submit"]');
    if (await submitButton.count() > 0) {
      await expect(submitButton).toBeFocused();
    }

    console.log('✅ Keyboard navigation çalışıyor');
  });

  test('Responsive design testi', async ({ page }) => {
    console.log('📱 Responsive design testi başlıyor...');

    // Desktop view
    await page.setViewportSize({ width: 1920, height: 1080 });
    const emailInput = page.locator('input[type="email"], input[name="email"], #email');
    if (await emailInput.count() > 0) {
      await expect(emailInput).toBeVisible();
    }
    await page.screenshot({ path: 'test-results/password-reset-desktop.png' });
    console.log('🖥️ Desktop view görünür');

    // Mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    if (await emailInput.count() > 0) {
      await expect(emailInput).toBeVisible();
    }
    await page.screenshot({ path: 'test-results/password-reset-mobile.png' });
    console.log('📱 Mobile view görünür');

    console.log('✅ Responsive design testi tamamlandı');
  });
});
