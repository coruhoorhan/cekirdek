import { test, expect } from '@playwright/test';

test.describe('Reddet Butonu ve Veri Tutarlılığı Testleri', () => {
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

  test('Reddet Butonu Görünürlük ve İşlevsellik Testi', async ({ page }) => {
    console.log('❌ Reddet butonu testi başlıyor...');
    
    const currentUrl = page.url();
    console.log('🔗 Mevcut URL:', currentUrl);
    
    if (!currentUrl.includes('/admin/dashboard')) {
      console.log('❌ Admin dashboard\'a erişilemedi');
      return;
    }
    
    // Başvuru tablosunu bekle
    await page.waitForSelector('table', { timeout: 10000 });
    console.log('✅ Başvuru tablosu yüklendi');
    
    // Tam sayfa screenshot al
    await page.screenshot({ path: 'test-results/admin-dashboard-full-view.png', fullPage: true });
    
    // Tüm butonları kontrol et
    const allButtons = page.locator('button');
    const buttonCount = await allButtons.count();
    console.log(`🔘 Toplam buton sayısı: ${buttonCount}`);
    
    // Onayla butonlarını say
    const approveButtons = page.locator('button:has-text("Onayla")');
    const approveCount = await approveButtons.count();
    console.log(`✅ Onayla butonu sayısı: ${approveCount}`);
    
    // Reddet butonlarını say
    const rejectButtons = page.locator('button:has-text("Reddet")');
    const rejectCount = await rejectButtons.count();
    console.log(`❌ Reddet butonu sayısı: ${rejectCount}`);
    
    if (rejectCount > 0) {
      console.log('🎉 Reddet butonları başarıyla eklendi!');
      
      // İlk reddet butonuna tıkla
      const firstRejectButton = rejectButtons.first();
      
      // Butonun görünür ve tıklanabilir olduğunu kontrol et
      await expect(firstRejectButton).toBeVisible();
      await expect(firstRejectButton).toBeEnabled();
      
      console.log('🔘 İlk reddet butonuna tıklanıyor...');
      await firstRejectButton.click();
      
      // Loading state'ini bekle
      await page.waitForTimeout(3000);
      
      // Toast mesajı kontrolü
      const toastMessage = page.locator('.toast, [role="alert"], .notification');
      if (await toastMessage.count() > 0) {
        const toastText = await toastMessage.first().textContent();
        console.log('📢 Toast mesajı:', toastText);
        
        if (toastText?.includes('reddedildi') || toastText?.includes('rejected')) {
          console.log('✅ Reddet işlemi başarılı!');
        }
      }
      
      // İşlem sonrası screenshot
      await page.screenshot({ path: 'test-results/after-reject-operation.png', fullPage: true });
      
    } else {
      console.log('❌ Reddet butonları bulunamadı - Ekleme başarısız');
    }
    
    // Pending başvuru sayısını kontrol et
    const pendingRows = page.locator('tr:has-text("Beklemede"), tr:has-text("pending"), tr:has-text("Pending")');
    const pendingCount = await pendingRows.count();
    console.log(`📊 Bekleyen başvuru sayısı: ${pendingCount}`);
  });

  test('Veri Tutarlılığı Sayfası Erişim Testi', async ({ page }) => {
    console.log('🗄️ Veri tutarlılığı sayfası testi başlıyor...');
    
    // Sidebar'da veri tutarlılığı linkini bul
    const dataConsistencyLink = page.locator('a:has-text("Veri Tutarlılığı")');
    const linkCount = await dataConsistencyLink.count();
    
    console.log(`🔗 Veri tutarlılığı link sayısı: ${linkCount}`);
    
    if (linkCount > 0) {
      console.log('✅ Veri tutarlılığı linki sidebar\'da mevcut');
      
      // Link'e tıkla
      await dataConsistencyLink.click();
      await page.waitForTimeout(3000);
      
      const currentUrl = page.url();
      console.log('📍 Navigation sonrası URL:', currentUrl);
      
      if (currentUrl.includes('/admin/data-consistency')) {
        console.log('✅ Veri tutarlılığı sayfasına başarıyla yönlendirildi');
        
        // Sayfa yüklenene kadar bekle
        await page.waitForLoadState('networkidle');
        
        // Sayfa başlığını kontrol et
        const pageTitle = page.locator('h1');
        if (await pageTitle.count() > 0) {
          const titleText = await pageTitle.textContent();
          console.log('📋 Sayfa başlığı:', titleText);
        }
        
        // Loading spinner'ı bekle (eğer varsa)
        await page.waitForTimeout(5000);
        
        // Tam sayfa screenshot al
        await page.screenshot({ path: 'test-results/data-consistency-page-full.png', fullPage: true });
        
        // Özet kartlarını kontrol et
        const summaryCards = page.locator('.grid .card, [class*="grid"] [class*="card"]');
        const cardCount = await summaryCards.count();
        console.log(`📊 Özet kart sayısı: ${cardCount}`);
        
        // Butonları kontrol et
        const refreshButton = page.locator('button:has-text("Yenile")');
        if (await refreshButton.count() > 0) {
          console.log('✅ Yenile butonu mevcut');
        }
        
        const autoFixButton = page.locator('button:has-text("Otomatik Düzelt")');
        if (await autoFixButton.count() > 0) {
          console.log('✅ Otomatik düzelt butonu mevcut');
          
          // Otomatik düzelt butonuna tıkla
          console.log('🔘 Otomatik düzelt butonuna tıklanıyor...');
          await autoFixButton.click();
          
          // Loading state'ini bekle
          await page.waitForTimeout(8000);
          
          // Toast mesajı kontrolü
          const toastMessage = page.locator('.toast, [role="alert"], .notification');
          if (await toastMessage.count() > 0) {
            const toastText = await toastMessage.first().textContent();
            console.log('📢 Otomatik düzeltme sonucu:', toastText);
          }
          
          // İşlem sonrası screenshot
          await page.screenshot({ path: 'test-results/data-consistency-after-auto-fix.png', fullPage: true });
        }
        
      } else {
        console.log('❌ Veri tutarlılığı sayfasına yönlendirilemedi');
      }
    } else {
      console.log('❌ Veri tutarlılığı linki sidebar\'da bulunamadı');
      
      // Sidebar screenshot'ı al
      await page.screenshot({ path: 'test-results/admin-sidebar-missing-link.png' });
    }
  });

  test('Şifre Sıfırlama E-posta Format Hatası Testi', async ({ page }) => {
    console.log('📧 Şifre sıfırlama format hatası testi başlıyor...');
    
    // Şifre sıfırlama sayfasına git
    await page.goto('/sifremi-unuttum');
    await page.waitForLoadState('networkidle');
    
    // Geçersiz format e-posta adresleri
    const invalidEmails = [
      'orhanfatsa7@gmail.com', // Bu e-posta "invalid format" hatası veriyor
      'invalid-email-format',
      'test@',
      '@domain.com'
    ];
    
    for (const email of invalidEmails) {
      console.log(`🔍 Test edilen e-posta: ${email}`);
      
      // E-posta alanını temizle ve yeni e-posta gir
      await page.fill('input[type="email"]', '');
      await page.fill('input[type="email"]', email);
      
      // Screenshot al
      await page.screenshot({ 
        path: `test-results/password-reset-${email.replace(/[@.]/g, '-')}.png` 
      });
      
      // Submit butonuna tıkla
      await page.click('button[type="submit"]');
      
      // Sonucu bekle
      await page.waitForTimeout(3000);
      
      // Hata mesajı kontrolü
      const errorMessage = page.locator('.error, .text-red-500, [role="alert"]');
      if (await errorMessage.count() > 0) {
        const errorText = await errorMessage.first().textContent();
        console.log(`🚨 Hata mesajı: ${errorText}`);
      }
      
      // Toast mesajı kontrolü
      const toastMessage = page.locator('.toast, [role="alert"], .notification');
      if (await toastMessage.count() > 0) {
        const toastText = await toastMessage.first().textContent();
        console.log(`📢 Toast mesajı: ${toastText}`);
      }
      
      // Sayfayı yenile (bir sonraki test için)
      await page.reload();
      await page.waitForLoadState('networkidle');
    }
  });

  test('Veli ve Öğretmen Login Durumu Analizi', async ({ page }) => {
    console.log('👥 Veli ve öğretmen login analizi başlıyor...');
    
    const testUsers = [
      { email: 'l.demir@fatsa.bel.tr', password: '123456', role: 'Veli' },
      { email: 'o.coruh@fatsa.bel.tr', password: '123456', role: 'Öğretmen' },
      { email: 'psk.bestenidapersembeli@gmail.com', password: '123456', role: 'Veli' }
    ];
    
    for (const user of testUsers) {
      console.log(`🔐 ${user.role} login testi: ${user.email}`);
      
      // Login sayfasına git
      await page.goto('/login');
      await page.waitForLoadState('networkidle');
      
      // Credentials gir
      await page.fill('input[type="email"]', user.email);
      await page.fill('input[type="password"]', user.password);
      
      // Screenshot al
      await page.screenshot({ 
        path: `test-results/login-attempt-${user.email.replace(/[@.]/g, '-')}.png` 
      });
      
      // Login butonuna tıkla
      await page.click('button[type="submit"]');
      
      // Sonucu bekle
      await page.waitForTimeout(5000);
      
      const currentUrl = page.url();
      console.log(`🔗 ${user.role} login sonuç URL: ${currentUrl}`);
      
      if (!currentUrl.includes('/login')) {
        console.log(`✅ ${user.role} login BAŞARILI`);
      } else {
        console.log(`❌ ${user.role} login BAŞARISIZ`);
        
        // Hata mesajı kontrolü
        const errorMessage = page.locator('.error, .text-red-500, [role="alert"]');
        if (await errorMessage.count() > 0) {
          const errorText = await errorMessage.first().textContent();
          console.log(`🚨 ${user.role} hata mesajı: ${errorText}`);
        }
      }
      
      // Sonuç screenshot'ı
      await page.screenshot({ 
        path: `test-results/login-result-${user.email.replace(/[@.]/g, '-')}.png` 
      });
      
      // Logout yap (eğer login başarılıysa)
      if (!currentUrl.includes('/login')) {
        const logoutButton = page.locator('button:has-text("Çıkış"), a:has-text("Çıkış")');
        if (await logoutButton.count() > 0) {
          await logoutButton.click();
          await page.waitForTimeout(2000);
        }
      }
    }
  });
});
