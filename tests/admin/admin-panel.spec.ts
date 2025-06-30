import { test, expect } from '@playwright/test';
import { 
  loginAs, 
  waitForLoadingToComplete, 
  expectElementReady,
  PageHelpers,
  AssertionHelpers 
} from '../utils/test-helpers';

test.describe('Admin Panel Fonksiyonel Testleri', () => {
  test.beforeEach(async ({ page }) => {
    // Her test öncesi admin olarak login yap
    await loginAs(page, 'admin');
  });

  test('Admin Dashboard erişimi ve içerik kontrolü', async ({ page }) => {
    // Dashboard sayfasının yüklenmesini bekle
    await waitForLoadingToComplete(page);
    
    // Sayfa başlığını kontrol et
    await AssertionHelpers.expectPageTitle(page, 'Admin');
    
    // URL'nin doğru olduğunu kontrol et
    await AssertionHelpers.expectUrlContains(page, '/admin/dashboard');
    
    // Dashboard başlığının görünür olduğunu kontrol et
    await expect(page.locator('h1')).toContainText('Dashboard');
    
    // Başvuru kartının mevcut olduğunu kontrol et
    await expectElementReady(page, '[data-testid="applications-card"], .card');
    
    // Başvuru tablosunun yüklendiğini kontrol et
    const applicationsTable = page.locator('table');
    await expect(applicationsTable).toBeVisible();
    
    // En az bir başvuru satırının olduğunu kontrol et
    const tableRows = page.locator('table tbody tr');
    await expect(tableRows).toHaveCount({ min: 1 });
  });

  test('AdminSidebar navigation testleri', async ({ page }) => {
    // Sidebar'ın görünür olduğunu kontrol et
    const sidebar = page.locator('aside, [data-testid="admin-sidebar"]');
    await expect(sidebar).toBeVisible();
    
    // Navigation linklerini test et
    const navLinks = [
      { path: 'dashboard', text: 'Dashboard' },
      { path: 'user-management', text: 'Kullanıcı Yönetimi' },
      { path: 'home-settings', text: 'Anasayfa Yönetimi' },
      { path: 'about-settings', text: 'Hakkımızda Yönetimi' },
      { path: 'education-settings', text: 'Eğitim Yönetimi' },
      { path: 'gallery-settings', text: 'Galeri Yönetimi' },
      { path: 'news-settings', text: 'Haberler Yönetimi' },
      { path: 'teachers-settings', text: 'Öğretmenler Yönetimi' },
      { path: 'contact-settings', text: 'İletişim Yönetimi' }
    ];

    for (const link of navLinks) {
      // Link'e tıkla
      await page.click(`a[href="/admin/${link.path}"]`);
      
      // Sayfa yüklenmesini bekle
      await waitForLoadingToComplete(page);
      
      // URL'nin doğru olduğunu kontrol et
      await AssertionHelpers.expectUrlContains(page, `/admin/${link.path}`);
      
      // Sayfa içeriğinin yüklendiğini kontrol et
      await expect(page.locator('h1, h2, h3')).toBeVisible();
      
      console.log(`✅ Navigation test passed for: ${link.text}`);
    }
  });

  test('User Management sayfası tab testleri', async ({ page }) => {
    // User Management sayfasına git
    await PageHelpers.navigateToAdminPage(page, 'user-management');
    
    // Sayfa başlığını kontrol et
    await expect(page.locator('h1')).toContainText('Kullanıcı Yönetimi');
    
    // Tab'ların mevcut olduğunu kontrol et
    const tabs = [
      { value: 'auth-users', text: 'Kayıtlı Kullanıcılar' },
      { value: 'profiles', text: 'Profiller' },
      { value: 'applications', text: 'Başvurular' }
    ];

    for (const tab of tabs) {
      // Tab'a tıkla
      await page.click(`[data-value="${tab.value}"], button:has-text("${tab.text}")`);
      
      // Tab içeriğinin yüklenmesini bekle
      await waitForLoadingToComplete(page);
      
      // Tab içeriğinin görünür olduğunu kontrol et
      const tabContent = page.locator(`[data-value="${tab.value}"] table, table`);
      await expect(tabContent).toBeVisible();
      
      // Tablo başlıklarının mevcut olduğunu kontrol et
      const tableHeaders = page.locator('table thead th');
      await expect(tableHeaders).toHaveCount({ min: 3 });
      
      console.log(`✅ Tab test passed for: ${tab.text}`);
    }
  });

  test('Dashboard responsive design testi', async ({ page }) => {
    // Desktop view
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.reload();
    await waitForLoadingToComplete(page);
    
    // Sidebar'ın görünür olduğunu kontrol et
    await expect(page.locator('aside')).toBeVisible();
    
    // Tablet view
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.reload();
    await waitForLoadingToComplete(page);
    
    // İçeriğin hala erişilebilir olduğunu kontrol et
    await expect(page.locator('h1')).toBeVisible();
    
    // Mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    await waitForLoadingToComplete(page);
    
    // İçeriğin mobile'da da görünür olduğunu kontrol et
    await expect(page.locator('h1')).toBeVisible();
    
    console.log('✅ Responsive design test passed');
  });

  test('Admin panel error handling testi', async ({ page }) => {
    // Geçersiz bir admin sayfasına gitmeyi dene
    await page.goto('/admin/nonexistent-page');
    
    // 404 veya redirect'in çalıştığını kontrol et
    await page.waitForTimeout(2000);
    
    // Ya 404 sayfası ya da dashboard'a redirect olmalı
    const currentUrl = page.url();
    const isValidResponse = currentUrl.includes('/admin/dashboard') || 
                           currentUrl.includes('404') ||
                           await page.locator('h1').textContent() === 'Page Not Found';
    
    expect(isValidResponse).toBeTruthy();
    
    console.log('✅ Error handling test passed');
  });

  test('Admin panel performance testi', async ({ page }) => {
    // Performance metrics'i başlat
    await page.goto('/admin/dashboard');
    
    const startTime = Date.now();
    await waitForLoadingToComplete(page);
    const loadTime = Date.now() - startTime;
    
    // Sayfa yükleme süresinin 5 saniyeden az olduğunu kontrol et
    expect(loadTime).toBeLessThan(5000);
    
    // Tüm kritik elementlerin yüklendiğini kontrol et
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('aside')).toBeVisible();
    await expect(page.locator('table')).toBeVisible();
    
    console.log(`✅ Performance test passed - Load time: ${loadTime}ms`);
  });
});
