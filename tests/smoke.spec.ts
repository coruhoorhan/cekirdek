import { test, expect } from '@playwright/test';

test.describe('Smoke Tests - Temel Sayfa Yüklemeleri', () => {
  test('Ana sayfa yüklenmesi', async ({ page }) => {
    await page.goto('/');

    // Sayfa başlığının yüklendiğini kontrol et (ilk h1 elementi)
    await expect(page.locator('h1').first()).toBeVisible({ timeout: 10000 });

    // Sayfa içeriğinin yüklendiğini kontrol et
    await expect(page.locator('main').first()).toBeVisible();

    console.log('✅ Ana sayfa yüklendi');
  });

  test('Login sayfası yüklenmesi', async ({ page }) => {
    await page.goto('/login');
    
    // Login form elementlerinin yüklendiğini kontrol et
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
    
    console.log('✅ Login sayfası yüklendi');
  });

  test('Başvuru sayfası yüklenmesi', async ({ page }) => {
    await page.goto('/basvuru');
    
    // Başvuru formunun yüklendiğini kontrol et
    await expect(page.locator('form, h1, h2')).toBeVisible({ timeout: 10000 });
    
    console.log('✅ Başvuru sayfası yüklendi');
  });

  test('Hakkımızda sayfası yüklenmesi', async ({ page }) => {
    await page.goto('/hakkimizda');

    // Sayfa içeriğinin yüklendiğini kontrol et (ilk h1 elementi)
    await expect(page.locator('h1').first()).toBeVisible({ timeout: 10000 });

    // Main content'in yüklendiğini kontrol et
    await expect(page.locator('main')).toBeVisible();

    console.log('✅ Hakkımızda sayfası yüklendi');
  });

  test('İletişim sayfası yüklenmesi', async ({ page }) => {
    await page.goto('/iletisim');

    // Sayfa içeriğinin yüklendiğini kontrol et (ilk h1 elementi)
    await expect(page.locator('h1').first()).toBeVisible({ timeout: 10000 });

    // Main content'in yüklendiğini kontrol et
    await expect(page.locator('main')).toBeVisible();

    console.log('✅ İletişim sayfası yüklendi');
  });
});
