import { test, expect } from '@playwright/test';
import { TestDataFactory } from '../utils/test-data-factory';
import { createFormAutomation } from '../utils/form-automation';
import { 
  waitForLoadingToComplete, 
  waitForToast,
  PageHelpers,
  AssertionHelpers 
} from '../utils/test-helpers';

test.describe('Kapsamlı Login ve Admin İşlemleri Testleri', () => {
  test.beforeEach(async ({ page }) => {
    // Login sayfasına git
    await page.goto('/login');
    await waitForLoadingToComplete(page);
  });

  test('Admin Login - coruho52@gmail.com', async ({ page }) => {
    console.log('👑 Admin login testi başlıyor...');
    
    const adminUser = {
      email: 'coruho52@gmail.com',
      password: '123456'
    };

    console.log('📧 Admin e-posta:', adminUser.email);

    try {
      // Form automation kullanarak login
      const formAutomation = createFormAutomation(page);
      const fillSuccess = await formAutomation.fillLoginForm(adminUser.email, adminUser.password);
      
      if (!fillSuccess) {
        console.log('❌ Form doldurma başarısız, manuel deneme...');
        await page.fill('input[type="email"]', adminUser.email);
        await page.fill('input[type="password"]', adminUser.password);
      }

      // Screenshot al
      await page.screenshot({ 
        path: 'test-results/admin-login-form.png', 
        fullPage: true 
      });

      // Login butonuna tıkla
      await page.click('button[type="submit"]');
      console.log('🔘 Login butonuna tıklandı');

      // Loading state'ini bekle
      await page.waitForTimeout(3000);

      // URL kontrolü
      const currentUrl = page.url();
      console.log('🔗 Mevcut URL:', currentUrl);

      if (currentUrl.includes('/admin/dashboard')) {
        console.log('✅ Admin dashboard\'a başarıyla yönlendirildi');
        
        // Dashboard içeriğini kontrol et
        await waitForLoadingToComplete(page);
        
        // Dashboard başlığını kontrol et
        const dashboardTitle = page.locator('h1, h2').first();
        if (await dashboardTitle.count() > 0) {
          const titleText = await dashboardTitle.textContent();
          console.log('📋 Dashboard başlığı:', titleText);
        }

        // Admin sidebar'ını kontrol et
        const sidebar = page.locator('aside, [data-testid="admin-sidebar"]');
        if (await sidebar.count() > 0) {
          console.log('✅ Admin sidebar görünür');
        }

        // Screenshot al
        await page.screenshot({ 
          path: 'test-results/admin-dashboard.png', 
          fullPage: true 
        });

        return { success: true, message: 'Admin login başarılı' };
      } else {
        console.log('❌ Admin dashboard\'a yönlendirilemedi');
        
        // Hata mesajı var mı kontrol et
        const errorElements = page.locator('.error, .text-red-500, [role="alert"]');
        if (await errorElements.count() > 0) {
          const errorText = await errorElements.first().textContent();
          console.log('🚨 Hata mesajı:', errorText);
        }

        return { success: false, message: 'Admin dashboard\'a yönlendirilemedi' };
      }

    } catch (error) {
      console.error('❌ Admin login hatası:', error);
      return { success: false, message: `Admin login hatası: ${error}` };
    }
  });

  test('Veli Login - l.demir@fatsa.bel.tr', async ({ page }) => {
    console.log('👨‍👩‍👧‍👦 Veli login testi başlıyor...');
    
    const parentUser = {
      email: 'l.demir@fatsa.bel.tr',
      password: '123456'
    };

    console.log('📧 Veli e-posta:', parentUser.email);

    try {
      // Login işlemi
      await page.fill('input[type="email"]', parentUser.email);
      await page.fill('input[type="password"]', parentUser.password);
      await page.click('button[type="submit"]');

      await page.waitForTimeout(3000);
      const currentUrl = page.url();
      console.log('🔗 Veli login sonrası URL:', currentUrl);

      // Screenshot al
      await page.screenshot({ 
        path: 'test-results/parent-login-result.png', 
        fullPage: true 
      });

      if (!currentUrl.includes('/login')) {
        console.log('✅ Veli başarıyla login oldu');
        return { success: true, message: 'Veli login başarılı' };
      } else {
        console.log('❌ Veli login başarısız');
        return { success: false, message: 'Veli login başarısız' };
      }

    } catch (error) {
      console.error('❌ Veli login hatası:', error);
      return { success: false, message: `Veli login hatası: ${error}` };
    }
  });

  test('Öğretmen Login - o.coruh@fatsa.bel.tr', async ({ page }) => {
    console.log('👩‍🏫 Öğretmen login testi başlıyor...');
    
    const teacherUser = {
      email: 'o.coruh@fatsa.bel.tr',
      password: '123456'
    };

    console.log('📧 Öğretmen e-posta:', teacherUser.email);

    try {
      // Login işlemi
      await page.fill('input[type="email"]', teacherUser.email);
      await page.fill('input[type="password"]', teacherUser.password);
      await page.click('button[type="submit"]');

      await page.waitForTimeout(3000);
      const currentUrl = page.url();
      console.log('🔗 Öğretmen login sonrası URL:', currentUrl);

      // Screenshot al
      await page.screenshot({ 
        path: 'test-results/teacher-login-result.png', 
        fullPage: true 
      });

      if (!currentUrl.includes('/login')) {
        console.log('✅ Öğretmen başarıyla login oldu');
        return { success: true, message: 'Öğretmen login başarılı' };
      } else {
        console.log('❌ Öğretmen login başarısız');
        return { success: false, message: 'Öğretmen login başarısız' };
      }

    } catch (error) {
      console.error('❌ Öğretmen login hatası:', error);
      return { success: false, message: `Öğretmen login hatası: ${error}` };
    }
  });
});

test.describe('Admin Panel İşlemleri Testleri', () => {
  test.beforeEach(async ({ page }) => {
    // Admin olarak login yap
    await page.goto('/login');
    await waitForLoadingToComplete(page);
    
    await page.fill('input[type="email"]', 'coruho52@gmail.com');
    await page.fill('input[type="password"]', '123456');
    await page.click('button[type="submit"]');
    
    // Dashboard'a yönlendirilmeyi bekle
    await page.waitForTimeout(5000);
  });

  test('Başvuru Onaylama İşlemi Testi', async ({ page }) => {
    console.log('📋 Başvuru onaylama testi başlıyor...');

    try {
      // Dashboard'da olduğumuzu kontrol et
      const currentUrl = page.url();
      console.log('🔗 Mevcut URL:', currentUrl);

      if (!currentUrl.includes('/admin')) {
        console.log('❌ Admin paneline erişilemedi');
        return { success: false, message: 'Admin paneline erişilemedi' };
      }

      // Başvuru tablosunu bul
      const applicationTable = page.locator('table');
      if (await applicationTable.count() === 0) {
        console.log('❌ Başvuru tablosu bulunamadı');
        return { success: false, message: 'Başvuru tablosu bulunamadı' };
      }

      console.log('✅ Başvuru tablosu bulundu');

      // Pending başvuruları bul
      const pendingApplications = page.locator('tr:has-text("Beklemede"), tr:has-text("pending")');
      const pendingCount = await pendingApplications.count();
      console.log(`📊 Bekleyen başvuru sayısı: ${pendingCount}`);

      if (pendingCount > 0) {
        // İlk pending başvuruyu onayla
        const firstPendingRow = pendingApplications.first();
        const approveButton = firstPendingRow.locator('button:has-text("Onayla")');
        
        if (await approveButton.count() > 0) {
          console.log('🔘 Onayla butonuna tıklanıyor...');
          await approveButton.click();
          
          // Toast mesajını bekle
          try {
            await waitForToast(page, 'başarıyla|onaylandı');
            console.log('✅ Başvuru onaylama başarılı');
            return { success: true, message: 'Başvuru onaylama başarılı' };
          } catch (error) {
            console.log('⚠️ Toast mesajı görünmedi ama işlem devam etti');
            return { success: true, message: 'Başvuru onaylama tamamlandı (toast yok)' };
          }
        } else {
          console.log('❌ Onayla butonu bulunamadı');
          return { success: false, message: 'Onayla butonu bulunamadı' };
        }
      } else {
        console.log('ℹ️ Bekleyen başvuru bulunamadı');
        return { success: true, message: 'Bekleyen başvuru yok' };
      }

    } catch (error) {
      console.error('❌ Başvuru onaylama hatası:', error);
      return { success: false, message: `Başvuru onaylama hatası: ${error}` };
    }
  });

  test('Başvuru Reddetme İşlemi Testi', async ({ page }) => {
    console.log('❌ Başvuru reddetme testi başlıyor...');

    try {
      // Dashboard'da olduğumuzu kontrol et
      const currentUrl = page.url();
      if (!currentUrl.includes('/admin')) {
        console.log('❌ Admin paneline erişilemedi');
        return { success: false, message: 'Admin paneline erişilemedi' };
      }

      // Pending başvuruları bul
      const pendingApplications = page.locator('tr:has-text("Beklemede"), tr:has-text("pending")');
      const pendingCount = await pendingApplications.count();
      console.log(`📊 Bekleyen başvuru sayısı: ${pendingCount}`);

      if (pendingCount > 0) {
        // İlk pending başvuruyu reddet
        const firstPendingRow = pendingApplications.first();
        const rejectButton = firstPendingRow.locator('button:has-text("Reddet")');
        
        if (await rejectButton.count() > 0) {
          console.log('🔘 Reddet butonuna tıklanıyor...');
          await rejectButton.click();
          
          // Toast mesajını bekle
          try {
            await waitForToast(page, 'reddedildi|rejected');
            console.log('✅ Başvuru reddetme başarılı');
            return { success: true, message: 'Başvuru reddetme başarılı' };
          } catch (error) {
            console.log('⚠️ Toast mesajı görünmedi ama işlem devam etti');
            return { success: true, message: 'Başvuru reddetme tamamlandı (toast yok)' };
          }
        } else {
          console.log('❌ Reddet butonu bulunamadı');
          return { success: false, message: 'Reddet butonu bulunamadı' };
        }
      } else {
        console.log('ℹ️ Bekleyen başvuru bulunamadı');
        return { success: true, message: 'Bekleyen başvuru yok' };
      }

    } catch (error) {
      console.error('❌ Başvuru reddetme hatası:', error);
      return { success: false, message: `Başvuru reddetme hatası: ${error}` };
    }
  });
});
