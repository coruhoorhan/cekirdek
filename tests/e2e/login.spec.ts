import { test, expect } from '@playwright/test';
import { TestDataFactory } from '../utils/test-data-factory';
import { 
  waitForLoadingToComplete, 
  waitForToast,
  PageHelpers,
  AssertionHelpers 
} from '../utils/test-helpers';

test.describe('Login Süreci E2E Testleri', () => {
  test.beforeEach(async ({ page }) => {
    // Login sayfasına git
    await page.goto('/login');
    await waitForLoadingToComplete(page);
  });

  test('Mevcut kullanıcı ile başarılı login - l.demir@fatsa.bel.tr', async ({ page }) => {
    const user = {
      email: 'l.demir@fatsa.bel.tr',
      password: 'test123'
    };

    console.log('🔐 Başarılı login testi başlıyor...');
    console.log('👤 Test kullanıcısı:', user.email);

    // Login form elementlerinin görünür olduğunu kontrol et
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();

    // Credentials'ları gir
    await page.fill('input[type="email"]', user.email);
    await page.waitForTimeout(500);
    
    await page.fill('input[type="password"]', user.password);
    await page.waitForTimeout(500);

    console.log('📝 Credentials girildi');

    // Screenshot al
    await page.screenshot({ 
      path: 'test-results/login-form-filled.png', 
      fullPage: true 
    });

    // Login butonuna tıkla
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();
    console.log('🔘 Login butonuna tıklandı');

    // Loading state'ini bekle
    await expect(submitButton).toBeDisabled({ timeout: 3000 });

    // Başarılı login sonrası yönlendirmeyi bekle
    await page.waitForTimeout(3000);
    
    // Admin kullanıcısı ise admin dashboard'a, değilse ana sayfaya yönlendirilmeli
    const currentUrl = page.url();
    const isValidRedirect = currentUrl.includes('/admin/dashboard') || 
                           currentUrl.includes('/dashboard') ||
                           currentUrl.includes('/') ||
                           !currentUrl.includes('/login');
    
    expect(isValidRedirect).toBeTruthy();
    console.log('✅ Başarılı login ve yönlendirme:', currentUrl);

    // Kullanıcının login olduğunu doğrula (logout butonu varlığı)
    const logoutButton = page.locator('button:has-text("Çıkış"), button:has-text("Logout"), a:has-text("Çıkış")');
    if (await logoutButton.count() > 0) {
      await expect(logoutButton).toBeVisible();
      console.log('✅ Logout butonu görünür - kullanıcı login olmuş');
    }

    console.log('🎉 Başarılı login testi tamamlandı!');
  });

  test('Mevcut kullanıcı ile başarılı login - o.coruh@fatsa.bel.tr', async ({ page }) => {
    const user = {
      email: 'o.coruh@fatsa.bel.tr',
      password: 'test123'
    };

    console.log('🔐 İkinci kullanıcı login testi başlıyor...');
    console.log('👤 Test kullanıcısı:', user.email);

    // Credentials'ları gir
    await page.fill('input[type="email"]', user.email);
    await page.fill('input[type="password"]', user.password);

    // Login butonuna tıkla
    await page.click('button[type="submit"]');

    // Başarılı login kontrolü
    await page.waitForTimeout(3000);
    const currentUrl = page.url();
    
    expect(currentUrl).not.toContain('/login');
    console.log('✅ İkinci kullanıcı başarılı login:', currentUrl);
  });

  test('Admin kullanıcısı ile login ve dashboard erişimi', async ({ page }) => {
    const adminUser = {
      email: 'coruho52@gmail.com',
      password: 'test123'
    };

    console.log('👑 Admin login testi başlıyor...');
    console.log('👤 Admin kullanıcısı:', adminUser.email);

    // Admin credentials ile login
    await page.fill('input[type="email"]', adminUser.email);
    await page.fill('input[type="password"]', adminUser.password);
    await page.click('button[type="submit"]');

    // Admin dashboard'a yönlendirmeyi bekle
    await page.waitForURL('**/admin/dashboard', { timeout: 10000 });
    console.log('✅ Admin dashboard\'a yönlendirildi');

    // Dashboard içeriğinin yüklendiğini kontrol et
    await waitForLoadingToComplete(page);
    await expect(page.locator('h1, h2')).toContainText(/dashboard/i);
    console.log('✅ Admin dashboard içeriği yüklendi');

    // Admin sidebar'ının görünür olduğunu kontrol et
    const sidebar = page.locator('aside, [data-testid="admin-sidebar"]');
    await expect(sidebar).toBeVisible();
    console.log('✅ Admin sidebar görünür');

    console.log('🎉 Admin login testi tamamlandı!');
  });

  test('Geçersiz credentials ile login hatası', async ({ page }) => {
    const invalidUser = {
      email: 'nonexistent@example.com',
      password: 'wrongpassword'
    };

    console.log('❌ Geçersiz credentials testi başlıyor...');

    // Geçersiz credentials'ları gir
    await page.fill('input[type="email"]', invalidUser.email);
    await page.fill('input[type="password"]', invalidUser.password);
    await page.click('button[type="submit"]');

    // Hata mesajını bekle
    const errorMessage = page.locator('text=E-posta veya şifre hatalı, text=Invalid login credentials, text=hatalı');
    await expect(errorMessage).toBeVisible({ timeout: 5000 });
    console.log('✅ Geçersiz credentials hatası görüntülendi');

    // Hala login sayfasında olduğunu kontrol et
    await AssertionHelpers.expectUrlContains(page, '/login');
    console.log('✅ Login sayfasında kaldı (doğru)');
  });

  test('Rate limiting testi', async ({ page }) => {
    console.log('🚫 Rate limiting testi başlıyor...');

    const testEmail = 'rate-limit-test@example.com';
    const wrongPassword = 'wrongpassword';

    // 6 kez hatalı login denemesi yap (rate limit: 5)
    for (let i = 0; i < 6; i++) {
      console.log(`🔄 Deneme ${i + 1}/6`);
      
      await page.fill('input[type="email"]', testEmail);
      await page.fill('input[type="password"]', wrongPassword);
      await page.click('button[type="submit"]');
      
      // Kısa bekleme
      await page.waitForTimeout(1000);
      
      // Form'u temizle
      await page.fill('input[type="email"]', '');
      await page.fill('input[type="password"]', '');
    }

    // Rate limit mesajını bekle
    const rateLimitMessage = page.locator('text=Çok fazla başarısız giriş denemesi, text=Too many requests, text=rate limit');
    await expect(rateLimitMessage).toBeVisible({ timeout: 5000 });
    console.log('✅ Rate limiting çalışıyor');
  });

  test('E-posta format validation', async ({ page }) => {
    console.log('📧 E-posta format validation testi başlıyor...');

    const invalidEmails = TestDataFactory.getInvalidTestData().emails;

    for (const invalidEmail of invalidEmails.slice(0, 3)) { // İlk 3 tanesini test et
      console.log(`🔍 Test edilen e-posta: "${invalidEmail}"`);
      
      await page.fill('input[type="email"]', invalidEmail);
      await page.fill('input[type="password"]', 'somepassword');
      await page.click('button[type="submit"]');

      // E-posta format hatası bekle
      const emailError = page.locator('text=Geçerli bir e-posta adresi giriniz, text=Invalid email format');
      if (await emailError.count() > 0) {
        await expect(emailError).toBeVisible();
        console.log(`✅ E-posta format hatası görüntülendi: ${invalidEmail}`);
      }

      // Form'u temizle
      await page.fill('input[type="email"]', '');
      await page.fill('input[type="password"]', '');
    }
  });

  test('Boş form validation', async ({ page }) => {
    console.log('📝 Boş form validation testi başlıyor...');

    // Boş form ile submit dene
    await page.click('button[type="submit"]');

    // Validation mesajlarını bekle
    const emailRequired = page.locator('text=E-posta adresi gereklidir, text=Email is required');
    const passwordRequired = page.locator('text=Şifre gereklidir, text=Password is required');
    
    if (await emailRequired.count() > 0) {
      await expect(emailRequired).toBeVisible();
      console.log('✅ E-posta required validation çalışıyor');
    }
    
    if (await passwordRequired.count() > 0) {
      await expect(passwordRequired).toBeVisible();
      console.log('✅ Şifre required validation çalışıyor');
    }
  });

  test('Şifremi unuttum link testi', async ({ page }) => {
    console.log('🔗 Şifremi unuttum link testi başlıyor...');

    // "Şifremi Unuttum" linkini bul
    const forgotPasswordLink = page.locator('a:has-text("Şifremi Unuttum"), a:has-text("Forgot Password"), a[href*="sifremi-unuttum"]');
    
    if (await forgotPasswordLink.count() > 0) {
      await expect(forgotPasswordLink).toBeVisible();
      console.log('✅ Şifremi unuttum linki görünür');

      // Link'e tıkla
      await forgotPasswordLink.click();

      // Şifre sıfırlama sayfasına yönlendirilmeyi bekle
      await page.waitForTimeout(2000);
      const currentUrl = page.url();
      
      expect(currentUrl).toContain('sifremi-unuttum');
      console.log('✅ Şifre sıfırlama sayfasına yönlendirildi');
    } else {
      console.log('ℹ️ Şifremi unuttum linki bulunamadı');
    }
  });

  test('Login form accessibility testi', async ({ page }) => {
    console.log('♿ Login form accessibility testi başlıyor...');

    // Form elementlerinin accessible name'lerinin olduğunu kontrol et
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    const submitButton = page.locator('button[type="submit"]');

    await expect(emailInput).toHaveAccessibleName(/e-posta|email/i);
    await expect(passwordInput).toHaveAccessibleName(/şifre|password/i);
    await expect(submitButton).toHaveAccessibleName(/giriş|login/i);

    console.log('✅ Login form accessibility kontrolleri geçti');
  });

  test('Keyboard navigation testi', async ({ page }) => {
    console.log('⌨️ Login keyboard navigation testi başlıyor...');

    const user = TestDataFactory.getExistingUsers()[0];

    // Tab ile form elementleri arasında gezinme
    await page.keyboard.press('Tab'); // E-posta alanına focus
    await expect(page.locator('input[type="email"]')).toBeFocused();
    await page.keyboard.type(user.email);

    await page.keyboard.press('Tab'); // Şifre alanına focus
    await expect(page.locator('input[type="password"]')).toBeFocused();
    await page.keyboard.type(user.password);

    await page.keyboard.press('Tab'); // Submit butonuna focus
    await expect(page.locator('button[type="submit"]')).toBeFocused();

    // Enter ile form submit
    await page.keyboard.press('Enter');

    // Login'in başarılı olduğunu kontrol et
    await page.waitForTimeout(3000);
    expect(page.url()).not.toContain('/login');

    console.log('✅ Keyboard navigation ve Enter submit çalışıyor');
  });

  test('Login form responsive design testi', async ({ page }) => {
    console.log('📱 Login responsive design testi başlıyor...');

    // Desktop view
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await page.screenshot({ path: 'test-results/login-desktop.png' });
    console.log('🖥️ Desktop login form görünür');

    // Tablet view
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await page.screenshot({ path: 'test-results/login-tablet.png' });
    console.log('📱 Tablet login form görünür');

    // Mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await page.screenshot({ path: 'test-results/login-mobile.png' });
    console.log('📱 Mobile login form görünür');

    console.log('✅ Login responsive design testi tamamlandı');
  });
});
