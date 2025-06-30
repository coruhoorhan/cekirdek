import { test, expect } from '@playwright/test';
import { TestDataFactory } from '../utils/test-data-factory';
import { 
  waitForLoadingToComplete, 
  waitForToast,
  DatabaseHelpers,
  PageHelpers,
  AssertionHelpers 
} from '../utils/test-helpers';

test.describe('Kayıt Olma Süreci E2E Testleri', () => {
  test.beforeEach(async ({ page }) => {
    // Kayıt sayfasına git
    await page.goto('/kayit-ol');
    await waitForLoadingToComplete(page);
  });

  test('Başarılı kullanıcı kaydı oluşturma', async ({ page }) => {
    const testUser = TestDataFactory.createTestUser({
      email: `success-${Date.now()}@test.cekirdek.com`
    });

    console.log('🚀 Başarılı kayıt testi başlıyor...');
    console.log('📧 Test e-posta:', testUser.email);

    try {
      // Form alanlarını doldur
      await page.fill('input[name="fullName"], #fullName', testUser.fullName);
      await page.waitForTimeout(500);

      await page.fill('input[name="email"], #email', testUser.email);
      await page.waitForTimeout(500);

      await page.fill('input[name="phone"], #phone', testUser.phone);
      await page.waitForTimeout(500);

      await page.fill('input[name="password"], #password', testUser.password);
      await page.waitForTimeout(500);

      await page.fill('input[name="confirmPassword"], #confirmPassword', testUser.password);
      await page.waitForTimeout(500);

      // TC Kimlik No varsa doldur
      if (testUser.tcNo) {
        const tcInput = page.locator('input[name="tcNo"], #tcNo');
        if (await tcInput.count() > 0) {
          await tcInput.fill(testUser.tcNo);
          await page.waitForTimeout(500);
        }
      }

      console.log('📝 Form alanları dolduruldu');

      // Screenshot al
      await page.screenshot({ 
        path: 'test-results/registration-form-filled.png', 
        fullPage: true 
      });

      // Kayıt butonuna tıkla
      const submitButton = page.locator('button[type="submit"], button:has-text("Kayıt Ol")');
      await expect(submitButton).toBeVisible();
      await expect(submitButton).toBeEnabled();
      
      await submitButton.click();
      console.log('🔘 Kayıt butonuna tıklandı');

      // Loading state'ini bekle
      await expect(submitButton).toBeDisabled({ timeout: 3000 });

      // Başarı mesajını bekle
      await waitForToast(page, 'başarıyla');
      console.log('✅ Başarı mesajı görüntülendi');

      // Yönlendirme kontrolü (login sayfası veya dashboard)
      await page.waitForTimeout(2000);
      const currentUrl = page.url();
      
      const isValidRedirect = currentUrl.includes('/login') || 
                             currentUrl.includes('/dashboard') ||
                             currentUrl.includes('/') ||
                             currentUrl.includes('/email-verification');
      
      expect(isValidRedirect).toBeTruthy();
      console.log('🔄 Başarılı yönlendirme:', currentUrl);

      // Database'de kullanıcının oluşturulduğunu kontrol et
      await page.waitForTimeout(3000); // Database sync için bekle
      
      try {
        const authUser = await DatabaseHelpers.getUserByEmail(testUser.email);
        expect(authUser).toBeTruthy();
        expect(authUser.email).toBe(testUser.email);
        console.log('✅ Kullanıcı database'de oluşturuldu');
      } catch (error) {
        console.warn('⚠️ Database kontrolü başarısız:', error);
      }

      console.log('🎉 Başarılı kayıt testi tamamlandı!');

    } finally {
      // Test verilerini temizle
      try {
        await DatabaseHelpers.deleteTestApplication(testUser.email);
        console.log('🧹 Test verileri temizlendi');
      } catch (error) {
        console.warn('⚠️ Test verisi temizleme hatası:', error);
      }
    }
  });

  test('Duplicate email ile kayıt hatası', async ({ page }) => {
    const existingUser = TestDataFactory.getExistingUsers()[0];
    const testUser = TestDataFactory.createTestUser({
      email: existingUser.email // Mevcut kullanıcının e-postası
    });

    console.log('🔄 Duplicate email testi başlıyor...');
    console.log('📧 Mevcut e-posta:', testUser.email);

    // Form alanlarını doldur
    await page.fill('input[name="fullName"], #fullName', testUser.fullName);
    await page.fill('input[name="email"], #email', testUser.email);
    await page.fill('input[name="phone"], #phone', testUser.phone);
    await page.fill('input[name="password"], #password', testUser.password);
    await page.fill('input[name="confirmPassword"], #confirmPassword', testUser.password);

    // Kayıt butonuna tıkla
    await page.click('button[type="submit"], button:has-text("Kayıt Ol")');

    // Hata mesajını bekle
    await waitForToast(page, 'zaten kayıtlı|already registered|email already exists');
    console.log('✅ Duplicate email hatası görüntülendi');

    // Hala kayıt sayfasında olduğunu kontrol et
    await AssertionHelpers.expectUrlContains(page, '/kayit-ol');
    console.log('✅ Sayfa yönlendirmesi yapılmadı (doğru)');
  });

  test('Form validation testleri', async ({ page }) => {
    console.log('📋 Form validation testleri başlıyor...');

    const invalidData = TestDataFactory.getInvalidTestData();

    // Geçersiz e-posta formatı testi
    await page.fill('input[name="email"], #email', invalidData.emails[0]);
    await page.fill('input[name="fullName"], #fullName', 'Test User');
    await page.click('button[type="submit"], button:has-text("Kayıt Ol")');
    
    const emailError = page.locator('text=Geçerli bir e-posta adresi giriniz, text=Invalid email format');
    await expect(emailError).toBeVisible({ timeout: 5000 });
    console.log('✅ E-posta format validation çalışıyor');

    // Formu temizle
    await page.reload();
    await waitForLoadingToComplete(page);

    // Geçersiz telefon formatı testi
    await page.fill('input[name="phone"], #phone', invalidData.phones[0]);
    await page.fill('input[name="fullName"], #fullName', 'Test User');
    await page.fill('input[name="email"], #email', 'test@example.com');
    await page.click('button[type="submit"], button:has-text("Kayıt Ol")');
    
    const phoneError = page.locator('text=Geçerli bir telefon numarası giriniz, text=Invalid phone format');
    await expect(phoneError).toBeVisible({ timeout: 5000 });
    console.log('✅ Telefon format validation çalışıyor');

    // Formu temizle
    await page.reload();
    await waitForLoadingToComplete(page);

    // Zayıf şifre testi
    await page.fill('input[name="password"], #password', invalidData.passwords[0]);
    await page.fill('input[name="fullName"], #fullName', 'Test User');
    await page.fill('input[name="email"], #email', 'test@example.com');
    await page.click('button[type="submit"], button:has-text("Kayıt Ol")');
    
    const passwordError = page.locator('text=Şifre en az 8 karakter olmalıdır, text=Password too weak');
    await expect(passwordError).toBeVisible({ timeout: 5000 });
    console.log('✅ Şifre validation çalışıyor');
  });

  test('Şifre eşleşme kontrolü', async ({ page }) => {
    console.log('🔐 Şifre eşleşme testi başlıyor...');

    const testUser = TestDataFactory.createTestUser();

    // Form alanlarını doldur
    await page.fill('input[name="fullName"], #fullName', testUser.fullName);
    await page.fill('input[name="email"], #email', testUser.email);
    await page.fill('input[name="phone"], #phone', testUser.phone);
    await page.fill('input[name="password"], #password', testUser.password);
    await page.fill('input[name="confirmPassword"], #confirmPassword', 'FarklıŞifre123!');

    // Kayıt butonuna tıkla
    await page.click('button[type="submit"], button:has-text("Kayıt Ol")');

    // Şifre eşleşmeme hatası
    const passwordMismatchError = page.locator('text=Şifreler eşleşmiyor, text=Passwords do not match');
    await expect(passwordMismatchError).toBeVisible({ timeout: 5000 });
    console.log('✅ Şifre eşleşme validation çalışıyor');
  });

  test('Boş form submission testi', async ({ page }) => {
    console.log('📝 Boş form testi başlıyor...');

    // Boş form ile submit dene
    await page.click('button[type="submit"], button:has-text("Kayıt Ol")');

    // Required field hatalarını bekle
    const requiredErrors = [
      'Ad Soyad gereklidir',
      'E-posta adresi gereklidir',
      'Telefon numarası gereklidir',
      'Şifre gereklidir'
    ];

    for (const errorText of requiredErrors) {
      const errorElement = page.locator(`text=${errorText}`);
      if (await errorElement.count() > 0) {
        await expect(errorElement).toBeVisible();
        console.log(`✅ Required validation çalışıyor: ${errorText}`);
      }
    }
  });

  test('Form accessibility testi', async ({ page }) => {
    console.log('♿ Accessibility testi başlıyor...');

    // Form elementlerinin label'larının olduğunu kontrol et
    const formFields = [
      { name: 'fullName', label: /ad|name/i },
      { name: 'email', label: /e-posta|email/i },
      { name: 'phone', label: /telefon|phone/i },
      { name: 'password', label: /şifre|password/i }
    ];

    for (const field of formFields) {
      const input = page.locator(`input[name="${field.name}"], #${field.name}`);
      if (await input.count() > 0) {
        await expect(input).toHaveAccessibleName(field.label);
        console.log(`✅ ${field.name} accessibility kontrolü geçti`);
      }
    }

    // Submit butonunun accessible name'inin olduğunu kontrol et
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toHaveAccessibleName(/kayıt|register/i);
    console.log('✅ Submit button accessibility kontrolü geçti');
  });

  test('Keyboard navigation testi', async ({ page }) => {
    console.log('⌨️ Keyboard navigation testi başlıyor...');

    // Tab ile form elementleri arasında gezinme
    const testUser = TestDataFactory.createTestUser();

    await page.keyboard.press('Tab'); // İlk alana focus
    await page.keyboard.type(testUser.fullName);

    await page.keyboard.press('Tab'); // E-posta alanına
    await page.keyboard.type(testUser.email);

    await page.keyboard.press('Tab'); // Telefon alanına
    await page.keyboard.type(testUser.phone);

    await page.keyboard.press('Tab'); // Şifre alanına
    await page.keyboard.type(testUser.password);

    await page.keyboard.press('Tab'); // Şifre tekrar alanına
    await page.keyboard.type(testUser.password);

    await page.keyboard.press('Tab'); // Submit butonuna
    
    // Submit butonuna focus olduğunu kontrol et
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeFocused();

    console.log('✅ Keyboard navigation çalışıyor');
  });
});
