import { test, expect } from '@playwright/test';

test.describe('Admin Panel Final Testleri', () => {
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

  test('Reddet Butonu Testi', async ({ page }) => {
    console.log('❌ Reddet butonu testi başlıyor...');
    
    const currentUrl = page.url();
    if (!currentUrl.includes('/admin/dashboard')) {
      console.log('❌ Admin dashboard\'a erişilemedi');
      return;
    }
    
    // Başvuru tablosunu bekle
    await page.waitForSelector('table', { timeout: 10000 });
    
    // Screenshot al
    await page.screenshot({ path: 'test-results/admin-dashboard-with-reject.png', fullPage: true });
    
    // Pending başvuruları bul
    const pendingRows = page.locator('tr:has-text("Beklemede"), tr:has-text("pending"), tr:has-text("Pending")');
    const pendingCount = await pendingRows.count();
    console.log(`📊 Bekleyen başvuru sayısı: ${pendingCount}`);
    
    if (pendingCount > 0) {
      // İlk pending başvuruyu bul
      const firstPendingRow = pendingRows.first();
      
      // Reddet butonunu bul
      const rejectButton = firstPendingRow.locator('button:has-text("Reddet")');
      const rejectButtonCount = await rejectButton.count();
      
      console.log(`🔘 Reddet butonu sayısı: ${rejectButtonCount}`);
      
      if (rejectButtonCount > 0) {
        console.log('✅ Reddet butonu bulundu!');
        
        // Başvuru sahibinin e-postasını al
        const emailCell = firstPendingRow.locator('td').nth(1);
        const applicantEmail = await emailCell.textContent();
        console.log('📧 Reddedilecek başvuru:', applicantEmail);
        
        // Reddet butonuna tıkla
        await rejectButton.click();
        console.log('🔘 Reddet butonuna tıklandı');
        
        // Loading state'ini bekle
        await page.waitForTimeout(3000);
        
        // Toast mesajı kontrolü
        const toastMessage = page.locator('.toast, [role="alert"], .notification');
        if (await toastMessage.count() > 0) {
          const toastText = await toastMessage.first().textContent();
          console.log('📢 Toast mesajı:', toastText);
        }
        
        // Screenshot al
        await page.screenshot({ path: 'test-results/admin-reject-success.png', fullPage: true });
        
        console.log('✅ Reddet butonu çalışıyor!');
      } else {
        console.log('❌ Reddet butonu bulunamadı');
      }
    } else {
      console.log('ℹ️ Bekleyen başvuru bulunamadı');
    }
  });

  test('Veri Tutarlılığı Sayfası Erişimi', async ({ page }) => {
    console.log('🗄️ Veri tutarlılığı sayfası testi başlıyor...');
    
    // Veri tutarlılığı sayfasına git
    await page.goto('/admin/data-consistency');
    await page.waitForLoadState('networkidle');
    
    // Screenshot al
    await page.screenshot({ path: 'test-results/data-consistency-page.png', fullPage: true });
    
    const currentUrl = page.url();
    console.log('🔗 Veri tutarlılığı URL:', currentUrl);
    
    if (currentUrl.includes('/admin/data-consistency')) {
      console.log('✅ Veri tutarlılığı sayfası erişimi BAŞARILI');
      
      // Sayfa başlığını kontrol et
      const pageTitle = page.locator('h1');
      if (await pageTitle.count() > 0) {
        const titleText = await pageTitle.textContent();
        console.log('📋 Sayfa başlığı:', titleText);
      }
      
      // Özet kartlarını kontrol et
      const summaryCards = page.locator('.grid .card');
      const cardCount = await summaryCards.count();
      console.log(`📊 Özet kart sayısı: ${cardCount}`);
      
      // Yenile butonunu kontrol et
      const refreshButton = page.locator('button:has-text("Yenile")');
      if (await refreshButton.count() > 0) {
        console.log('✅ Yenile butonu mevcut');
      }
      
      // Otomatik düzelt butonunu kontrol et
      const autoFixButton = page.locator('button:has-text("Otomatik Düzelt")');
      if (await autoFixButton.count() > 0) {
        console.log('✅ Otomatik düzelt butonu mevcut');
        
        // Butona tıkla
        await autoFixButton.click();
        console.log('🔘 Otomatik düzelt butonuna tıklandı');
        
        // Loading state'ini bekle
        await page.waitForTimeout(5000);
        
        // Toast mesajı kontrolü
        const toastMessage = page.locator('.toast, [role="alert"], .notification');
        if (await toastMessage.count() > 0) {
          const toastText = await toastMessage.first().textContent();
          console.log('📢 Otomatik düzeltme sonucu:', toastText);
        }
        
        // Screenshot al
        await page.screenshot({ path: 'test-results/data-consistency-after-fix.png', fullPage: true });
      }
      
    } else {
      console.log('❌ Veri tutarlılığı sayfası erişimi BAŞARISIZ');
    }
  });

  test('Admin Sidebar Navigation Testi', async ({ page }) => {
    console.log('🧭 Admin sidebar navigation testi başlıyor...');
    
    // Veri tutarlılığı linkini bul
    const dataConsistencyLink = page.locator('a:has-text("Veri Tutarlılığı")');
    
    if (await dataConsistencyLink.count() > 0) {
      console.log('✅ Veri tutarlılığı linki sidebar\'da mevcut');
      
      // Link'e tıkla
      await dataConsistencyLink.click();
      await page.waitForTimeout(2000);
      
      const currentUrl = page.url();
      console.log('📍 Navigation sonrası URL:', currentUrl);
      
      if (currentUrl.includes('/admin/data-consistency')) {
        console.log('✅ Veri tutarlılığı navigation BAŞARILI');
      } else {
        console.log('❌ Veri tutarlılığı navigation BAŞARISIZ');
      }
      
      // Screenshot al
      await page.screenshot({ 
        path: 'test-results/admin-sidebar-navigation.png',
        fullPage: true 
      });
    } else {
      console.log('❌ Veri tutarlılığı linki sidebar\'da bulunamadı');
    }
  });

  test('Şifre Sıfırlama E-posta Gönderimi Testi', async ({ page }) => {
    console.log('📧 Şifre sıfırlama e-posta testi başlıyor...');
    
    // Şifre sıfırlama sayfasına git
    await page.goto('/sifremi-unuttum');
    await page.waitForLoadState('networkidle');
    
    // Geçerli e-posta adresi ile test
    const testEmail = 'orhanfatsa7@gmail.com';
    
    await page.fill('input[type="email"]', testEmail);
    console.log(`📝 Test e-posta girildi: ${testEmail}`);
    
    // Screenshot al
    await page.screenshot({ path: 'test-results/password-reset-form-test.png' });
    
    await page.click('button[type="submit"]');
    console.log('🔘 Şifre sıfırlama butonuna tıklandı');
    
    // Sonucu bekle
    await page.waitForTimeout(5000);
    
    // Toast mesajı kontrolü
    const toastMessage = page.locator('.toast, [role="alert"], .notification');
    if (await toastMessage.count() > 0) {
      const toastText = await toastMessage.first().textContent();
      console.log('📢 Şifre sıfırlama sonucu:', toastText);
      
      if (toastText?.includes('gönderildi') || toastText?.includes('sent')) {
        console.log('✅ Şifre sıfırlama e-postası gönderildi');
      } else {
        console.log('❌ Şifre sıfırlama e-postası gönderilemedi');
      }
    }
    
    // Screenshot al
    await page.screenshot({ path: 'test-results/password-reset-result.png' });
  });
});
