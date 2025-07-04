import { test, expect } from '@playwright/test';

test.describe('E-posta Doğrulama Yönetimi Testleri', () => {
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

  test('E-posta Doğrulama Sayfası Erişimi', async ({ page }) => {
    console.log('📧 E-posta doğrulama sayfası testi başlıyor...');
    
    // Sidebar'da e-posta doğrulama linkini bul
    const emailVerificationLink = page.locator('a:has-text("E-posta Doğrulama")');
    const linkCount = await emailVerificationLink.count();
    
    console.log(`🔗 E-posta doğrulama link sayısı: ${linkCount}`);
    
    if (linkCount > 0) {
      console.log('✅ E-posta doğrulama linki sidebar\'da mevcut');
      
      // Link'e tıkla
      await emailVerificationLink.click();
      await page.waitForTimeout(3000);
      
      const currentUrl = page.url();
      console.log('📍 Navigation sonrası URL:', currentUrl);
      
      if (currentUrl.includes('/admin/email-verification')) {
        console.log('✅ E-posta doğrulama sayfasına başarıyla yönlendirildi');
        
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
        await page.screenshot({ path: 'test-results/email-verification-page-full.png', fullPage: true });
        
        // Özet kartlarını kontrol et
        const summaryCards = page.locator('.grid .card, [class*="grid"] [class*="card"]');
        const cardCount = await summaryCards.count();
        console.log(`📊 Özet kart sayısı: ${cardCount}`);
        
        // Butonları kontrol et
        const refreshButton = page.locator('button:has-text("Yenile")');
        if (await refreshButton.count() > 0) {
          console.log('✅ Yenile butonu mevcut');
        }
        
        const sendAllButton = page.locator('button:has-text("Tümüne Gönder")');
        if (await sendAllButton.count() > 0) {
          console.log('✅ Tümüne gönder butonu mevcut');
        }
        
      } else {
        console.log('❌ E-posta doğrulama sayfasına yönlendirilemedi');
      }
    } else {
      console.log('❌ E-posta doğrulama linki sidebar\'da bulunamadı');
      
      // Sidebar screenshot'ı al
      await page.screenshot({ path: 'test-results/admin-sidebar-email-verification.png' });
    }
  });

  test('E-posta Doğrulama Raporu Kontrolü', async ({ page }) => {
    console.log('📊 E-posta doğrulama raporu testi başlıyor...');
    
    // E-posta doğrulama sayfasına git
    await page.goto('/admin/email-verification');
    await page.waitForLoadState('networkidle');
    
    // Rapor yüklenene kadar bekle
    await page.waitForTimeout(8000);
    
    // Özet kartlarını kontrol et
    const totalUsersCard = page.locator('text=Toplam Kullanıcı').locator('..').locator('..').locator('.text-2xl');
    if (await totalUsersCard.count() > 0) {
      const totalUsers = await totalUsersCard.textContent();
      console.log(`👥 Toplam kullanıcı sayısı: ${totalUsers}`);
    }
    
    const verifiedCard = page.locator('text=Doğrulanmış').locator('..').locator('..').locator('.text-2xl');
    if (await verifiedCard.count() > 0) {
      const verified = await verifiedCard.textContent();
      console.log(`✅ Doğrulanmış kullanıcı sayısı: ${verified}`);
    }
    
    const unverifiedCard = page.locator('text=Doğrulanmamış').locator('..').locator('..').locator('.text-2xl');
    if (await unverifiedCard.count() > 0) {
      const unverified = await unverifiedCard.textContent();
      console.log(`📧 Doğrulanmamış kullanıcı sayısı: ${unverified}`);
    }
    
    const invalidCard = page.locator('text=Geçersiz Format').locator('..').locator('..').locator('.text-2xl');
    if (await invalidCard.count() > 0) {
      const invalid = await invalidCard.textContent();
      console.log(`❌ Geçersiz format sayısı: ${invalid}`);
    }
    
    // Screenshot al
    await page.screenshot({ path: 'test-results/email-verification-report.png', fullPage: true });
    
    console.log('✅ E-posta doğrulama raporu kontrolü tamamlandı');
  });

  test('Tekil E-posta Doğrulama Gönderimi', async ({ page }) => {
    console.log('📤 Tekil e-posta gönderimi testi başlıyor...');
    
    // E-posta doğrulama sayfasına git
    await page.goto('/admin/email-verification');
    await page.waitForLoadState('networkidle');
    
    // Rapor yüklenene kadar bekle
    await page.waitForTimeout(8000);
    
    // Doğrulanmamış kullanıcılar tablosunu kontrol et
    const unverifiedTable = page.locator('text=Doğrulanmamış E-postalar').locator('..').locator('table');
    
    if (await unverifiedTable.count() > 0) {
      console.log('✅ Doğrulanmamış kullanıcılar tablosu bulundu');
      
      // İlk kullanıcının gönder butonunu bul
      const firstSendButton = unverifiedTable.locator('button').first();
      
      if (await firstSendButton.count() > 0) {
        console.log('🔘 İlk kullanıcının gönder butonuna tıklanıyor...');
        
        await firstSendButton.click();
        
        // Loading state'ini bekle
        await page.waitForTimeout(3000);
        
        // Toast mesajı kontrolü
        const toastMessage = page.locator('.toast, [role="alert"], .notification');
        if (await toastMessage.count() > 0) {
          const toastText = await toastMessage.first().textContent();
          console.log('📢 Toast mesajı:', toastText);
        }
        
        console.log('✅ Tekil e-posta gönderimi testi tamamlandı');
      } else {
        console.log('❌ Gönder butonu bulunamadı');
      }
    } else {
      console.log('ℹ️ Doğrulanmamış kullanıcı tablosu bulunamadı');
    }
    
    // Screenshot al
    await page.screenshot({ path: 'test-results/email-verification-single-send.png', fullPage: true });
  });

  test('Toplu E-posta Gönderimi', async ({ page }) => {
    console.log('📤📤 Toplu e-posta gönderimi testi başlıyor...');
    
    // E-posta doğrulama sayfasına git
    await page.goto('/admin/email-verification');
    await page.waitForLoadState('networkidle');
    
    // Rapor yüklenene kadar bekle
    await page.waitForTimeout(8000);
    
    // "Tümüne Gönder" butonunu bul
    const sendAllButton = page.locator('button:has-text("Tümüne Gönder")');
    
    if (await sendAllButton.count() > 0) {
      console.log('✅ Tümüne gönder butonu bulundu');
      
      // Butona tıkla
      await sendAllButton.click();
      console.log('🔘 Tümüne gönder butonuna tıklandı');
      
      // Loading state'ini bekle (toplu işlem uzun sürebilir)
      await page.waitForTimeout(10000);
      
      // Toast mesajı kontrolü
      const toastMessage = page.locator('.toast, [role="alert"], .notification');
      if (await toastMessage.count() > 0) {
        const toastText = await toastMessage.first().textContent();
        console.log('📢 Toplu gönderim sonucu:', toastText);
      }
      
      console.log('✅ Toplu e-posta gönderimi testi tamamlandı');
    } else {
      console.log('ℹ️ Tümüne gönder butonu bulunamadı (doğrulanmamış kullanıcı yok)');
    }
    
    // Screenshot al
    await page.screenshot({ path: 'test-results/email-verification-bulk-send.png', fullPage: true });
  });

  test('Geçersiz E-posta Formatları Kontrolü', async ({ page }) => {
    console.log('❌ Geçersiz e-posta formatları testi başlıyor...');
    
    // E-posta doğrulama sayfasına git
    await page.goto('/admin/email-verification');
    await page.waitForLoadState('networkidle');
    
    // Rapor yüklenene kadar bekle
    await page.waitForTimeout(8000);
    
    // Geçersiz format tablosunu kontrol et
    const invalidTable = page.locator('text=Geçersiz E-posta Formatları').locator('..').locator('table');
    
    if (await invalidTable.count() > 0) {
      console.log('✅ Geçersiz e-posta formatları tablosu bulundu');
      
      // Tablo satırlarını say
      const tableRows = invalidTable.locator('tbody tr');
      const rowCount = await tableRows.count();
      console.log(`📊 Geçersiz format sayısı: ${rowCount}`);
      
      // İlk geçersiz e-postayı logla
      if (rowCount > 0) {
        const firstInvalidEmail = tableRows.first().locator('td').first();
        const emailText = await firstInvalidEmail.textContent();
        console.log(`📧 İlk geçersiz e-posta: ${emailText}`);
      }
      
    } else {
      console.log('ℹ️ Geçersiz e-posta formatı bulunamadı (iyi haber!)');
    }
    
    // Screenshot al
    await page.screenshot({ path: 'test-results/email-verification-invalid-formats.png', fullPage: true });
    
    console.log('✅ Geçersiz e-posta formatları kontrolü tamamlandı');
  });

  test('E-posta Doğrulama Sayfası Responsive Testi', async ({ page }) => {
    console.log('📱 E-posta doğrulama responsive testi başlıyor...');
    
    const viewports = [
      { name: 'Desktop', width: 1920, height: 1080 },
      { name: 'Tablet', width: 768, height: 1024 },
      { name: 'Mobile', width: 375, height: 667 }
    ];

    for (const viewport of viewports) {
      console.log(`📐 ${viewport.name} view testi başlıyor...`);
      
      // Viewport ayarla
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      
      // E-posta doğrulama sayfasına git
      await page.goto('/admin/email-verification');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(5000);

      // Ana elementlerin görünür olduğunu kontrol et
      const pageTitle = page.locator('h1');
      if (await pageTitle.count() > 0) {
        await expect(pageTitle).toBeVisible();
      }

      // Screenshot al
      await page.screenshot({ 
        path: `test-results/email-verification-${viewport.name.toLowerCase()}.png`,
        fullPage: true 
      });

      console.log(`✅ ${viewport.name} view görünür`);
    }

    console.log('🎉 E-posta doğrulama responsive testi tamamlandı!');
  });
});
