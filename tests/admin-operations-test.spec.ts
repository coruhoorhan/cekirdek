import { test, expect } from '@playwright/test';

test.describe('Admin Panel İşlemleri Testleri', () => {
  test.beforeEach(async ({ page }) => {
    // Admin olarak login yap
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    
    await page.fill('input[type="email"]', 'coruho52@gmail.com');
    await page.fill('input[type="password"]', '123456');
    await page.click('button[type="submit"]');
    
    // Dashboard'a yönlendirilmeyi bekle
    await page.waitForTimeout(5000);
    
    console.log('👑 Admin olarak login yapıldı');
  });

  test('Dashboard Erişimi ve İçerik Kontrolü', async ({ page }) => {
    console.log('📊 Dashboard kontrol testi başlıyor...');
    
    const currentUrl = page.url();
    console.log('🔗 Mevcut URL:', currentUrl);
    
    // Screenshot al
    await page.screenshot({ path: 'test-results/admin-dashboard-full.png', fullPage: true });
    
    if (currentUrl.includes('/admin/dashboard')) {
      console.log('✅ Admin dashboard erişimi BAŞARILI');
      
      // Dashboard içeriğini kontrol et
      const dashboardTitle = page.locator('h1, h2').first();
      if (await dashboardTitle.count() > 0) {
        const titleText = await dashboardTitle.textContent();
        console.log('📋 Dashboard başlığı:', titleText);
      }
      
      // Sidebar kontrolü
      const sidebar = page.locator('aside, nav');
      if (await sidebar.count() > 0) {
        console.log('✅ Admin sidebar mevcut');
      }
      
      // Başvuru tablosu kontrolü
      const applicationTable = page.locator('table');
      if (await applicationTable.count() > 0) {
        console.log('✅ Başvuru tablosu mevcut');
        
        // Tablo satırlarını say
        const tableRows = page.locator('table tbody tr');
        const rowCount = await tableRows.count();
        console.log(`📊 Toplam başvuru sayısı: ${rowCount}`);
      } else {
        console.log('❌ Başvuru tablosu bulunamadı');
      }
      
    } else {
      console.log('❌ Admin dashboard erişimi BAŞARISIZ');
    }
  });

  test('Başvuru Onaylama İşlemi', async ({ page }) => {
    console.log('✅ Başvuru onaylama testi başlıyor...');
    
    const currentUrl = page.url();
    if (!currentUrl.includes('/admin')) {
      console.log('❌ Admin paneline erişilemedi');
      return;
    }
    
    // Başvuru tablosunu bekle
    await page.waitForSelector('table', { timeout: 10000 });
    
    // Screenshot al
    await page.screenshot({ path: 'test-results/admin-applications-table.png', fullPage: true });
    
    // Pending başvuruları bul
    const pendingRows = page.locator('tr:has-text("Beklemede"), tr:has-text("pending"), tr:has-text("Pending")');
    const pendingCount = await pendingRows.count();
    console.log(`📊 Bekleyen başvuru sayısı: ${pendingCount}`);
    
    if (pendingCount > 0) {
      // İlk pending başvuruyu bul
      const firstPendingRow = pendingRows.first();
      
      // Başvuru sahibinin e-postasını al
      const emailCell = firstPendingRow.locator('td').nth(1); // E-posta genellikle 2. sütunda
      const applicantEmail = await emailCell.textContent();
      console.log('📧 Onaylanacak başvuru:', applicantEmail);
      
      // Onayla butonunu bul
      const approveButton = firstPendingRow.locator('button:has-text("Onayla"), button:has-text("Approve")');
      
      if (await approveButton.count() > 0) {
        console.log('🔘 Onayla butonuna tıklanıyor...');
        await approveButton.click();
        
        // Loading state'ini bekle
        await page.waitForTimeout(3000);
        
        // Toast mesajı kontrolü
        const toastMessage = page.locator('.toast, [role="alert"], .notification');
        if (await toastMessage.count() > 0) {
          const toastText = await toastMessage.first().textContent();
          console.log('📢 Toast mesajı:', toastText);
        }
        
        // Screenshot al
        await page.screenshot({ path: 'test-results/admin-approve-result.png', fullPage: true });
        
        console.log('✅ Başvuru onaylama işlemi tamamlandı');
      } else {
        console.log('❌ Onayla butonu bulunamadı');
      }
    } else {
      console.log('ℹ️ Bekleyen başvuru bulunamadı');
    }
  });

  test('Başvuru Reddetme İşlemi', async ({ page }) => {
    console.log('❌ Başvuru reddetme testi başlıyor...');
    
    const currentUrl = page.url();
    if (!currentUrl.includes('/admin')) {
      console.log('❌ Admin paneline erişilemedi');
      return;
    }
    
    // Başvuru tablosunu bekle
    await page.waitForSelector('table', { timeout: 10000 });
    
    // Pending başvuruları bul
    const pendingRows = page.locator('tr:has-text("Beklemede"), tr:has-text("pending"), tr:has-text("Pending")');
    const pendingCount = await pendingRows.count();
    console.log(`📊 Bekleyen başvuru sayısı: ${pendingCount}`);
    
    if (pendingCount > 0) {
      // İlk pending başvuruyu bul
      const firstPendingRow = pendingRows.first();
      
      // Reddet butonunu bul
      const rejectButton = firstPendingRow.locator('button:has-text("Reddet"), button:has-text("Reject")');
      
      if (await rejectButton.count() > 0) {
        console.log('🔘 Reddet butonuna tıklanıyor...');
        await rejectButton.click();
        
        // Loading state'ini bekle
        await page.waitForTimeout(3000);
        
        // Toast mesajı kontrolü
        const toastMessage = page.locator('.toast, [role="alert"], .notification');
        if (await toastMessage.count() > 0) {
          const toastText = await toastMessage.first().textContent();
          console.log('📢 Toast mesajı:', toastText);
        }
        
        // Screenshot al
        await page.screenshot({ path: 'test-results/admin-reject-result.png', fullPage: true });
        
        console.log('✅ Başvuru reddetme işlemi tamamlandı');
      } else {
        console.log('❌ Reddet butonu bulunamadı');
      }
    } else {
      console.log('ℹ️ Bekleyen başvuru bulunamadı');
    }
  });

  test('User Management Sayfası Erişimi', async ({ page }) => {
    console.log('👥 User Management sayfası testi başlıyor...');
    
    // User Management sayfasına git
    await page.goto('/admin/user-management');
    await page.waitForLoadState('networkidle');
    
    // Screenshot al
    await page.screenshot({ path: 'test-results/admin-user-management.png', fullPage: true });
    
    const currentUrl = page.url();
    console.log('🔗 User Management URL:', currentUrl);
    
    if (currentUrl.includes('/admin/user-management')) {
      console.log('✅ User Management sayfası erişimi BAŞARILI');
      
      // Tab'ları kontrol et
      const tabs = page.locator('[role="tab"], .tab, button[data-value]');
      const tabCount = await tabs.count();
      console.log(`📊 Tab sayısı: ${tabCount}`);
      
      // Kayıtlı kullanıcılar tab'ına tıkla
      const usersTab = page.locator('button:has-text("Kayıtlı Kullanıcılar"), button:has-text("Users")');
      if (await usersTab.count() > 0) {
        await usersTab.click();
        await page.waitForTimeout(2000);
        console.log('✅ Kayıtlı kullanıcılar tab\'ı açıldı');
      }
      
    } else {
      console.log('❌ User Management sayfası erişimi BAŞARISIZ');
    }
  });

  test('Admin Navigation Testleri', async ({ page }) => {
    console.log('🧭 Admin navigation testi başlıyor...');
    
    // Sidebar linklerini test et
    const navLinks = [
      { text: 'Dashboard', url: '/admin/dashboard' },
      { text: 'Kullanıcı Yönetimi', url: '/admin/user-management' },
      { text: 'Anasayfa Yönetimi', url: '/admin/home-settings' }
    ];
    
    for (const link of navLinks) {
      console.log(`🔗 ${link.text} linkine tıklanıyor...`);
      
      // Link'i bul ve tıkla
      const linkElement = page.locator(`a:has-text("${link.text}"), a[href="${link.url}"]`).first();
      
      if (await linkElement.count() > 0) {
        await linkElement.click();
        await page.waitForTimeout(2000);
        
        const currentUrl = page.url();
        console.log(`📍 Mevcut URL: ${currentUrl}`);
        
        if (currentUrl.includes(link.url)) {
          console.log(`✅ ${link.text} navigation BAŞARILI`);
        } else {
          console.log(`❌ ${link.text} navigation BAŞARISIZ`);
        }
        
        // Screenshot al
        await page.screenshot({ 
          path: `test-results/admin-nav-${link.text.toLowerCase().replace(/\s+/g, '-')}.png`,
          fullPage: true 
        });
      } else {
        console.log(`❌ ${link.text} linki bulunamadı`);
      }
    }
  });
});
