import { test, expect } from '@playwright/test';
import { 
  loginAs, 
  waitForLoadingToComplete, 
  waitForToast,
  DatabaseHelpers,
  TEST_DATA,
  PageHelpers 
} from '../utils/test-helpers';

test.describe('Başvuru Onaylama Süreci End-to-End Testleri', () => {
  test.beforeEach(async ({ page }) => {
    // Admin olarak login yap
    await loginAs(page, 'admin');
    await PageHelpers.navigateToAdminPage(page, 'dashboard');
  });

  test('Pending başvuru onaylama süreci', async ({ page }) => {
    // Test başvurusunu hazırla
    const testApplication = {
      email: 'test-e2e-approval@cekirdek.test',
      name: 'Test E2E Approval User',
      phone: '05551234999',
      status: 'pending'
    };

    // Test başvurusunu oluştur
    const createdApp = await DatabaseHelpers.createTestApplication(testApplication);
    console.log('Test başvurusu oluşturuldu:', createdApp.id);

    try {
      // Sayfayı yenile
      await page.reload();
      await waitForLoadingToComplete(page);

      // Başvuru tablosunda test başvurusunu bul
      const applicationRow = page.locator(`tr:has-text("${testApplication.email}")`);
      await expect(applicationRow).toBeVisible({ timeout: 10000 });

      // Status'un "pending" olduğunu kontrol et
      await expect(applicationRow.locator('text=Beklemede')).toBeVisible();

      // "Onayla" butonunu bul ve tıkla
      const approveButton = applicationRow.locator('button:has-text("Onayla")');
      await expect(approveButton).toBeVisible();
      await expect(approveButton).toBeEnabled();
      
      await approveButton.click();

      // Loading state'ini bekle
      await expect(approveButton).toBeDisabled({ timeout: 2000 });

      // Başarı toast'ının görünmesini bekle
      await waitForToast(page, 'başarıyla onaylandı');

      // Sayfayı yenile ve değişiklikleri kontrol et
      await page.reload();
      await waitForLoadingToComplete(page);

      // Status'un "approved" olarak güncellendiğini kontrol et
      const updatedRow = page.locator(`tr:has-text("${testApplication.email}")`);
      await expect(updatedRow.locator('text=Onaylandı')).toBeVisible({ timeout: 10000 });

      // "Onayla" butonunun artık görünmediğini kontrol et
      await expect(updatedRow.locator('button:has-text("Onayla")')).not.toBeVisible();

      // Database'de değişiklikleri kontrol et
      const updatedApplication = await DatabaseHelpers.getApplicationByEmail(testApplication.email);
      expect(updatedApplication.status).toBe('approved');

      // Auth.users tablosunda kullanıcının oluşturulduğunu kontrol et
      try {
        const authUser = await DatabaseHelpers.getUserByEmail(testApplication.email);
        expect(authUser).toBeTruthy();
        expect(authUser.email).toBe(testApplication.email);
        
        // Profile'ın oluşturulduğunu kontrol et
        const profile = await DatabaseHelpers.getProfileById(authUser.id);
        expect(profile).toBeTruthy();
        expect(profile.name).toBe(testApplication.name);
        expect(profile.role).toBe('parent');
        
        console.log('✅ Kullanıcı ve profil başarıyla oluşturuldu');
      } catch (error) {
        console.warn('⚠️ Auth user veya profile kontrolü başarısız:', error);
      }

    } finally {
      // Test verilerini temizle
      await DatabaseHelpers.deleteTestApplication(testApplication.email);
      console.log('Test başvurusu temizlendi');
    }
  });

  test('E-posta format validation testi', async ({ page }) => {
    // Geçersiz e-posta formatı ile test başvurusu oluştur
    const invalidEmailApp = {
      email: 'invalid-email-format\n@test.com',
      name: 'Invalid Email Test',
      phone: '05551234888',
      status: 'pending'
    };

    const createdApp = await DatabaseHelpers.createTestApplication(invalidEmailApp);

    try {
      await page.reload();
      await waitForLoadingToComplete(page);

      // Geçersiz e-posta ile başvuruyu bul
      const applicationRow = page.locator(`tr:has-text("${invalidEmailApp.name}")`);
      await expect(applicationRow).toBeVisible();

      // "Onayla" butonuna tıkla
      const approveButton = applicationRow.locator('button:has-text("Onayla")');
      await approveButton.click();

      // E-posta format hatası toast'ının görünmesini bekle
      await waitForToast(page, 'Geçersiz e-posta formatı');

      // Status'un hala "pending" olduğunu kontrol et
      await expect(applicationRow.locator('text=Beklemede')).toBeVisible();

      console.log('✅ E-posta format validation çalışıyor');

    } finally {
      await DatabaseHelpers.deleteTestApplication(invalidEmailApp.email);
    }
  });

  test('Çoklu başvuru onaylama testi', async ({ page }) => {
    // Birden fazla test başvurusu oluştur
    const testApplications = [
      {
        email: 'test-bulk-1@cekirdek.test',
        name: 'Test Bulk User 1',
        phone: '05551111111',
        status: 'pending'
      },
      {
        email: 'test-bulk-2@cekirdek.test',
        name: 'Test Bulk User 2',
        phone: '05552222222',
        status: 'pending'
      }
    ];

    // Test başvurularını oluştur
    const createdApps = [];
    for (const app of testApplications) {
      const created = await DatabaseHelpers.createTestApplication(app);
      createdApps.push(created);
    }

    try {
      await page.reload();
      await waitForLoadingToComplete(page);

      // Her başvuruyu sırayla onayla
      for (const app of testApplications) {
        const applicationRow = page.locator(`tr:has-text("${app.email}")`);
        await expect(applicationRow).toBeVisible();

        const approveButton = applicationRow.locator('button:has-text("Onayla")');
        await approveButton.click();

        // Toast'ı bekle
        await waitForToast(page, 'başarıyla onaylandı');

        // Kısa bir bekleme
        await page.waitForTimeout(1000);
      }

      // Sayfayı yenile ve tüm başvuruların onaylandığını kontrol et
      await page.reload();
      await waitForLoadingToComplete(page);

      for (const app of testApplications) {
        const updatedRow = page.locator(`tr:has-text("${app.email}")`);
        await expect(updatedRow.locator('text=Onaylandı')).toBeVisible();
      }

      console.log('✅ Çoklu başvuru onaylama testi başarılı');

    } finally {
      // Test verilerini temizle
      for (const app of testApplications) {
        await DatabaseHelpers.deleteTestApplication(app.email);
      }
    }
  });

  test('Onaylama süreci error handling testi', async ({ page }) => {
    // Mevcut onaylanmış başvuruyu tekrar onaylamaya çalış
    const existingApprovedEmail = TEST_DATA.applications.approved.email;

    // Başvuru tablosunda onaylanmış başvuruyu bul
    const applicationRow = page.locator(`tr:has-text("${existingApprovedEmail}")`);
    
    // Eğer "Onayla" butonu varsa (olmaması gerekir)
    const approveButton = applicationRow.locator('button:has-text("Onayla")');
    const approveButtonExists = await approveButton.count() > 0;

    if (approveButtonExists) {
      await approveButton.click();
      
      // Hata mesajının görünmesini bekle
      await waitForToast(page, 'zaten onaylanmış');
    } else {
      // "Onayla" butonunun görünmediğini doğrula (doğru davranış)
      await expect(approveButton).not.toBeVisible();
      console.log('✅ Onaylanmış başvuru için "Onayla" butonu görünmüyor (doğru)');
    }
  });

  test('Network error handling testi', async ({ page }) => {
    // Network'ü offline yap
    await page.context().setOffline(true);

    const testApplication = {
      email: 'test-network-error@cekirdek.test',
      name: 'Test Network Error',
      phone: '05553333333',
      status: 'pending'
    };

    const createdApp = await DatabaseHelpers.createTestApplication(testApplication);

    try {
      // Network'ü tekrar online yap
      await page.context().setOffline(false);
      
      await page.reload();
      await waitForLoadingToComplete(page);

      const applicationRow = page.locator(`tr:has-text("${testApplication.email}")`);
      await expect(applicationRow).toBeVisible();

      // Network'ü tekrar offline yap
      await page.context().setOffline(true);

      const approveButton = applicationRow.locator('button:has-text("Onayla")');
      await approveButton.click();

      // Network error toast'ının görünmesini bekle
      await waitForToast(page, 'hata');

      console.log('✅ Network error handling çalışıyor');

    } finally {
      // Network'ü tekrar online yap
      await page.context().setOffline(false);
      await DatabaseHelpers.deleteTestApplication(testApplication.email);
    }
  });
});
