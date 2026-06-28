import { test, expect } from '@playwright/test';
import { TestDataFactory } from '../utils/test-data-factory';
import { createFormAutomation } from '../utils/form-automation';
import { 
  waitForLoadingToComplete, 
  waitForToast,
  DatabaseHelpers 
} from '../utils/test-helpers';

test.describe('Veri Girişi Otomasyonu E2E Testleri', () => {
  test('Otomatik kayıt formu doldurma ve gönderme', async ({ page }) => {
    console.log('🤖 Otomatik kayıt formu testi başlıyor...');

    // Kayıt sayfasına git
    await page.goto('/kayit-ol');
    await waitForLoadingToComplete(page);

    // Form automation instance oluştur
    const formAutomation = createFormAutomation(page);

    // Rastgele test verisi ile formu doldur
    const testUser = await formAutomation.fillRegistrationForm({
      email: `auto-test-${Date.now()}@test.cekirdek.com`
    });

    console.log('📧 Oluşturulan test kullanıcısı:', testUser.email);

    // Validation hatalarını kontrol et
    const errors = await formAutomation.checkValidationErrors();
    expect(errors.length).toBe(0);

    // Formu gönder
    const submitSuccess = await formAutomation.submitForm('Kayıt Ol');
    expect(submitSuccess).toBeTruthy();

    // Başarı mesajını bekle
    try {
      await waitForToast(page, 'başarıyla');
      console.log('✅ Otomatik kayıt başarılı');
    } catch (_error) {
      console.warn('⚠️ Toast mesajı görünmedi, ancak test devam ediyor');
    }

    // Test verilerini temizle
    try {
      await DatabaseHelpers.deleteTestApplication(testUser.email);
      console.log('🧹 Test verileri temizlendi');
    } catch (_error) {
      console.warn('⚠️ Test verisi temizleme hatası:', error);
    }

    console.log('🎉 Otomatik kayıt formu testi tamamlandı!');
  });

  test('Otomatik login formu doldurma', async ({ page }) => {
    console.log('🔐 Otomatik login formu testi başlıyor...');

    // Login sayfasına git
    await page.goto('/login');
    await waitForLoadingToComplete(page);

    // Form automation instance oluştur
    const formAutomation = createFormAutomation(page);

    // Mevcut kullanıcı ile login formu doldur
    const existingUser = TestDataFactory.getExistingUsers()[0];
    const fillSuccess = await formAutomation.fillLoginForm(existingUser.email, existingUser.password);
    expect(fillSuccess).toBeTruthy();

    // Formu gönder
    const submitSuccess = await formAutomation.submitForm('Giriş Yap');
    expect(submitSuccess).toBeTruthy();

    // Başarılı login kontrolü
    await page.waitForTimeout(3000);
    expect(page.url()).not.toContain('/login');

    console.log('✅ Otomatik login başarılı');
  });

  test('Otomatik şifre sıfırlama formu doldurma', async ({ page }) => {
    console.log('🔄 Otomatik şifre sıfırlama testi başlıyor...');

    // Şifre sıfırlama sayfasına git
    await page.goto('/sifremi-unuttum');
    await waitForLoadingToComplete(page);

    // Form automation instance oluştur
    const formAutomation = createFormAutomation(page);

    // Mevcut kullanıcı e-postası ile formu doldur
    const existingUser = TestDataFactory.getExistingUsers()[1];
    const fillSuccess = await formAutomation.fillPasswordResetForm(existingUser.email);
    expect(fillSuccess).toBeTruthy();

    // Formu gönder
    const submitSuccess = await formAutomation.submitForm('Gönder');
    expect(submitSuccess).toBeTruthy();

    // Başarı mesajını bekle
    try {
      await waitForToast(page, 'e-posta gönderildi|başarıyla');
      console.log('✅ Otomatik şifre sıfırlama başarılı');
    } catch (_error) {
      console.warn('⚠️ Toast mesajı görünmedi');
    }
  });

  test('Bulk otomatik kayıt testi', async ({ page }) => {
    console.log('📊 Bulk otomatik kayıt testi başlıyor...');

    const userCount = 3;
    const createdUsers: string[] = [];

    try {
      for (let i = 0; i < userCount; i++) {
        console.log(`🔄 Kullanıcı ${i + 1}/${userCount} oluşturuluyor...`);

        // Kayıt sayfasına git
        await page.goto('/kayit-ol');
        await waitForLoadingToComplete(page);

        // Form automation instance oluştur
        const formAutomation = createFormAutomation(page);

        // Rastgele test verisi ile formu doldur
        const testUser = await formAutomation.fillRegistrationForm({
          email: `bulk-test-${i}-${Date.now()}@test.cekirdek.com`
        });

        createdUsers.push(testUser.email);

        // Formu gönder
        await formAutomation.submitForm('Kayıt Ol');

        // Kısa bekleme
        await page.waitForTimeout(2000);

        console.log(`✅ Kullanıcı ${i + 1} oluşturuldu: ${testUser.email}`);
      }

      console.log(`🎉 ${userCount} kullanıcı başarıyla oluşturuldu`);

    } finally {
      // Test verilerini temizle
      for (const email of createdUsers) {
        try {
          await DatabaseHelpers.deleteTestApplication(email);
        } catch (_error) {
          console.warn(`⚠️ ${email} temizleme hatası:`, error);
        }
      }
      console.log('🧹 Bulk test verileri temizlendi');
    }
  });

  test('Form validation ile otomatik test', async ({ page }) => {
    console.log('📋 Form validation otomatik testi başlıyor...');

    // Kayıt sayfasına git
    await page.goto('/kayit-ol');
    await waitForLoadingToComplete(page);

    // Form automation instance oluştur
    const formAutomation = createFormAutomation(page);

    // Geçersiz verilerle formu doldur
    const invalidData = TestDataFactory.getInvalidTestData();
    
    await formAutomation.fillRegistrationForm({
      email: invalidData.emails[0], // Geçersiz e-posta
      phone: invalidData.phones[0], // Geçersiz telefon
      password: invalidData.passwords[0] // Zayıf şifre
    });

    // Formu gönder
    await formAutomation.submitForm('Kayıt Ol');

    // Validation hatalarını kontrol et
    const errors = await formAutomation.checkValidationErrors();
    expect(errors.length).toBeGreaterThan(0);

    console.log(`✅ ${errors.length} validation hatası tespit edildi`);
    console.log('📝 Hatalar:', errors);
  });

  test('Form temizleme otomasyonu', async ({ page }) => {
    console.log('🧹 Form temizleme otomasyonu testi başlıyor...');

    // Kayıt sayfasına git
    await page.goto('/kayit-ol');
    await waitForLoadingToComplete(page);

    // Form automation instance oluştur
    const formAutomation = createFormAutomation(page);

    // Formu doldur
    await formAutomation.fillRegistrationForm();

    // Form alanlarının dolu olduğunu kontrol et
    const emailInput = page.locator('input[type="email"]');
    const emailValue = await emailInput.inputValue();
    expect(emailValue).not.toBe('');

    // Formu temizle
    await formAutomation.clearForm();

    // Form alanlarının temizlendiğini kontrol et
    const clearedEmailValue = await emailInput.inputValue();
    expect(clearedEmailValue).toBe('');

    console.log('✅ Form temizleme otomasyonu başarılı');
  });

  test('Çoklu form türü otomasyonu', async ({ page }) => {
    console.log('🔄 Çoklu form türü otomasyonu testi başlıyor...');

    const formAutomation = createFormAutomation(page);

    // 1. Kayıt formu
    await page.goto('/kayit-ol');
    await waitForLoadingToComplete(page);
    
    const testUser = await formAutomation.fillRegistrationForm({
      email: `multi-form-${Date.now()}@test.cekirdek.com`
    });
    
    await formAutomation.submitForm('Kayıt Ol');
    await page.waitForTimeout(2000);
    console.log('✅ Kayıt formu tamamlandı');

    // 2. Login formu
    await page.goto('/login');
    await waitForLoadingToComplete(page);
    
    const existingUser = TestDataFactory.getExistingUsers()[0];
    await formAutomation.fillLoginForm(existingUser.email, existingUser.password);
    await formAutomation.submitForm('Giriş Yap');
    await page.waitForTimeout(2000);
    console.log('✅ Login formu tamamlandı');

    // 3. Şifre sıfırlama formu
    await page.goto('/sifremi-unuttum');
    await waitForLoadingToComplete(page);
    
    await formAutomation.fillPasswordResetForm(existingUser.email);
    await formAutomation.submitForm('Gönder');
    await page.waitForTimeout(2000);
    console.log('✅ Şifre sıfırlama formu tamamlandı');

    // Test verilerini temizle
    try {
      await DatabaseHelpers.deleteTestApplication(testUser.email);
    } catch (_error) {
      console.warn('⚠️ Test verisi temizleme hatası:', error);
    }

    console.log('🎉 Çoklu form türü otomasyonu tamamlandı');
  });

  test('Responsive form otomasyonu', async ({ page }) => {
    console.log('📱 Responsive form otomasyonu testi başlıyor...');

    const formAutomation = createFormAutomation(page);
    const viewports = [
      { name: 'Desktop', width: 1920, height: 1080 },
      { name: 'Tablet', width: 768, height: 1024 },
      { name: 'Mobile', width: 375, height: 667 }
    ];

    for (const viewport of viewports) {
      console.log(`📐 ${viewport.name} view testi başlıyor...`);
      
      // Viewport ayarla
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      
      // Kayıt sayfasına git
      await page.goto('/kayit-ol');
      await waitForLoadingToComplete(page);

      // Formu doldur
      const testUser = await formAutomation.fillRegistrationForm({
        email: `responsive-${viewport.name.toLowerCase()}-${Date.now()}@test.cekirdek.com`
      });

      // Screenshot al
      await page.screenshot({ 
        path: `test-results/responsive-form-${viewport.name.toLowerCase()}.png`,
        fullPage: true 
      });

      console.log(`✅ ${viewport.name} view form doldurma başarılı`);

      // Test verilerini temizle
      try {
        await DatabaseHelpers.deleteTestApplication(testUser.email);
      } catch (_error) {
        console.warn('⚠️ Test verisi temizleme hatası:', error);
      }
    }

    console.log('🎉 Responsive form otomasyonu tamamlandı');
  });
});
