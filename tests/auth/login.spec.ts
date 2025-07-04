import { test, expect } from '@playwright/test';
import { 
  waitForLoadingToComplete, 
  waitForToast,
  TEST_CREDENTIALS,
  PageHelpers,
  AssertionHelpers 
} from '../utils/test-helpers';

test.describe('Authentication Testleri', () => {
  test.beforeEach(async ({ page }) => {
    // Her test öncesi login sayfasına git
    await page.goto('/login');
  });

  test('Başarılı admin login testi', async ({ page }) => {
    // Login sayfasının yüklendiğini kontrol et
    await AssertionHelpers.expectPageTitle(page, 'Login');
    
    // Form elementlerinin mevcut olduğunu kontrol et
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();

    // Admin credentials ile login yap
    await page.fill('input[type="email"]', TEST_CREDENTIALS.admin.email);
    await page.fill('input[type="password"]', TEST_CREDENTIALS.admin.password);
    
    // Login butonuna tıkla
    await page.click('button[type="submit"]');

    // Loading state'ini kontrol et
    await expect(page.locator('button[type="submit"]')).toBeDisabled({ timeout: 2000 });

    // Admin dashboard'a yönlendirilmeyi bekle
    await page.waitForURL('**/admin/dashboard', { timeout: 10000 });
    
    // Dashboard'ın yüklendiğini kontrol et
    await waitForLoadingToComplete(page);
    await expect(page.locator('h1')).toContainText('Dashboard');

    console.log('✅ Admin login başarılı');
  });

  test('Geçersiz credentials ile login testi', async ({ page }) => {
    // Geçersiz e-posta ve şifre ile login dene
    await page.fill('input[type="email"]', 'invalid@email.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    
    await page.click('button[type="submit"]');

    // Hata mesajının görünmesini bekle
    const errorMessage = page.locator('text=E-posta veya şifre hatalı, text=Invalid login credentials');
    await expect(errorMessage).toBeVisible({ timeout: 5000 });

    // Hala login sayfasında olduğunu kontrol et
    await AssertionHelpers.expectUrlContains(page, '/login');

    console.log('✅ Geçersiz credentials error handling çalışıyor');
  });

  test('E-posta format validation testi', async ({ page }) => {
    // Geçersiz e-posta formatı
    await page.fill('input[type="email"]', 'invalid-email-format');
    await page.fill('input[type="password"]', 'somepassword');
    
    // Submit butonuna tıkla
    await page.click('button[type="submit"]');

    // E-posta format hata mesajının görünmesini bekle
    const emailError = page.locator('text=Geçerli bir e-posta adresi giriniz');
    await expect(emailError).toBeVisible();

    console.log('✅ E-posta format validation çalışıyor');
  });

  test('Boş form validation testi', async ({ page }) => {
    // Boş form ile submit dene
    await page.click('button[type="submit"]');

    // Validation mesajlarının görünmesini bekle
    const emailRequired = page.locator('text=E-posta adresi gereklidir');
    const passwordRequired = page.locator('text=Şifre gereklidir');
    
    await expect(emailRequired).toBeVisible();
    await expect(passwordRequired).toBeVisible();

    console.log('✅ Boş form validation çalışıyor');
  });

  test('Rate limiting testi', async ({ page }) => {
    const invalidCredentials = {
      email: 'test-rate-limit@example.com',
      password: 'wrongpassword'
    };

    // 6 kez hatalı login denemesi yap (rate limit: 5)
    for (let i = 0; i < 6; i++) {
      await page.fill('input[type="email"]', invalidCredentials.email);
      await page.fill('input[type="password"]', invalidCredentials.password);
      await page.click('button[type="submit"]');
      
      // Kısa bekleme
      await page.waitForTimeout(500);
      
      // Formu temizle
      await page.fill('input[type="email"]', '');
      await page.fill('input[type="password"]', '');
    }

    // Rate limit mesajının görünmesini bekle
    const rateLimitMessage = page.locator('text=Çok fazla başarısız giriş denemesi');
    await expect(rateLimitMessage).toBeVisible({ timeout: 5000 });

    console.log('✅ Rate limiting çalışıyor');
  });

  test('Password visibility toggle testi', async ({ page }) => {
    const passwordInput = page.locator('input[type="password"]');
    
    // Şifre alanına bir değer gir
    await passwordInput.fill('testpassword');
    
    // Şifre alanının type'ının "password" olduğunu kontrol et
    await expect(passwordInput).toHaveAttribute('type', 'password');

    // Şifre göster butonunu bul ve tıkla (eğer varsa)
    const showPasswordButton = page.locator('button[aria-label="Show password"], [data-testid="show-password"]');
    const showButtonExists = await showPasswordButton.count() > 0;

    if (showButtonExists) {
      await showPasswordButton.click();
      
      // Type'ın "text" olarak değiştiğini kontrol et
      await expect(passwordInput).toHaveAttribute('type', 'text');
      
      // Tekrar tıkla
      await showPasswordButton.click();
      
      // Type'ın tekrar "password" olduğunu kontrol et
      await expect(passwordInput).toHaveAttribute('type', 'password');
      
      console.log('✅ Password visibility toggle çalışıyor');
    } else {
      console.log('ℹ️ Password visibility toggle bulunamadı (opsiyonel feature)');
    }
  });

  test('Şifremi unuttum link testi', async ({ page }) => {
    // "Şifremi Unuttum" linkini bul
    const forgotPasswordLink = page.locator('a:has-text("Şifremi Unuttum")');
    await expect(forgotPasswordLink).toBeVisible();

    // Link'e tıkla
    await forgotPasswordLink.click();

    // Şifre sıfırlama sayfasına yönlendirilmeyi bekle
    await page.waitForURL('**/sifremi-unuttum', { timeout: 5000 });
    
    // Şifre sıfırlama sayfasının yüklendiğini kontrol et
    await expect(page.locator('h1, h2')).toContainText(/şifre|unuttum/i);

    console.log('✅ Şifremi unuttum link çalışıyor');
  });

  test('Login form accessibility testi', async ({ page }) => {
    // Form elementlerinin label'larının olduğunu kontrol et
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    
    // Label'ların mevcut olduğunu kontrol et
    await expect(page.locator('label[for="email"], label:has-text("E-posta")')).toBeVisible();
    await expect(page.locator('label[for="password"], label:has-text("Şifre")')).toBeVisible();

    // Input'ların accessible name'lerinin olduğunu kontrol et
    await expect(emailInput).toHaveAccessibleName(/e-posta|email/i);
    await expect(passwordInput).toHaveAccessibleName(/şifre|password/i);

    // Submit butonunun accessible name'inin olduğunu kontrol et
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toHaveAccessibleName(/giriş|login/i);

    console.log('✅ Login form accessibility kontrolleri geçti');
  });

  test('Login form keyboard navigation testi', async ({ page }) => {
    // Tab ile form elementleri arasında gezinme
    await page.keyboard.press('Tab'); // E-posta alanına focus
    await expect(page.locator('input[type="email"]')).toBeFocused();

    await page.keyboard.press('Tab'); // Şifre alanına focus
    await expect(page.locator('input[type="password"]')).toBeFocused();

    await page.keyboard.press('Tab'); // Submit butonuna focus
    await expect(page.locator('button[type="submit"]')).toBeFocused();

    // Enter ile form submit
    await page.fill('input[type="email"]', TEST_CREDENTIALS.admin.email);
    await page.fill('input[type="password"]', TEST_CREDENTIALS.admin.password);
    
    // Submit butonuna focus et ve Enter'a bas
    await page.locator('button[type="submit"]').focus();
    await page.keyboard.press('Enter');

    // Login'in başarılı olduğunu kontrol et
    await page.waitForURL('**/admin/dashboard', { timeout: 10000 });

    console.log('✅ Keyboard navigation çalışıyor');
  });
});
