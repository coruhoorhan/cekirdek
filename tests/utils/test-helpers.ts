import { Page, expect } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';

// Supabase client for tests
export const testSupabase = createClient(
  process.env.VITE_SUPABASE_URL || 'https://uunmmuybfcqiyxbnncjj.supabase.co',
  process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1bm1tdXliZmNxaXl4Ym5uY2pqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwMDA0MTIsImV4cCI6MjA2NjU3NjQxMn0.jp9LSv7iSc_W7bQkuhXYLWm6ngTZBe11uH8hsVKTYX4'
);

// Test credentials
export const TEST_CREDENTIALS = {
  admin: {
    email: 'coruho52@gmail.com',
    password: '123456'
  },
  teacher: {
    email: 'o.coruh@fatsa.bel.tr',
    password: '123456'
  },
  parent: {
    email: 'l.demir@fatsa.bel.tr',
    password: '123456'
  }
};

// Test data
export const TEST_DATA = {
  applications: {
    pending: {
      email: 'orhanfatsa7@gmail.com',
      name: 'Aslıhan coruh'
    },
    approved: {
      email: 'psk.bestenidapersembeli@gmail.com',
      name: 'Beste Nida Perşembeli'
    }
  }
};

/**
 * Login helper function
 */
export async function loginAs(page: Page, role: 'admin' | 'teacher' | 'parent') {
  const credentials = TEST_CREDENTIALS[role];
  
  await page.goto('/login');
  await page.fill('input[type="email"]', credentials.email);
  await page.fill('input[type="password"]', credentials.password);
  await page.click('button[type="submit"]');
  
  // Wait for successful login
  if (role === 'admin') {
    await page.waitForURL('**/admin/dashboard');
  } else {
    await page.waitForURL('**/', { timeout: 10000 });
  }
}

/**
 * Wait for toast notification
 */
export async function waitForToast(page: Page, expectedText?: string) {
  const toast = page.locator('[data-testid="toast"], .toast, [role="alert"]').first();
  await expect(toast).toBeVisible({ timeout: 5000 });
  
  if (expectedText) {
    await expect(toast).toContainText(expectedText);
  }
  
  return toast;
}

/**
 * Wait for loading to complete
 */
export async function waitForLoadingToComplete(page: Page) {
  // Wait for any loading spinners to disappear
  await page.waitForSelector('.animate-spin', { state: 'detached', timeout: 10000 });
  
  // Wait for network to be idle
  await page.waitForLoadState('networkidle');
}

/**
 * Check if element is visible and enabled
 */
export async function expectElementReady(page: Page, selector: string) {
  const element = page.locator(selector);
  await expect(element).toBeVisible();
  await expect(element).toBeEnabled();
  return element;
}

/**
 * Database helpers
 */
export class DatabaseHelpers {
  static async getApplicationByEmail(email: string) {
    const { data, error } = await testSupabase
      .from('applications')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error) throw error;
    return data;
  }

  static async getUserByEmail(email: string) {
    const { data, error } = await testSupabase
      .from('auth.users')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error) throw error;
    return data;
  }

  static async getProfileById(id: string) {
    const { data, error } = await testSupabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  static async createTestApplication(applicationData: any) {
    const { data, error } = await testSupabase
      .from('applications')
      .insert([applicationData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async deleteTestApplication(email: string) {
    const { error } = await testSupabase
      .from('applications')
      .delete()
      .eq('email', email);
    
    if (error) throw error;
  }

  static async updateApplicationStatus(id: string, status: string) {
    const { data, error } = await testSupabase
      .from('applications')
      .update({ status })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
}

/**
 * Page Object helpers
 */
export class PageHelpers {
  static async navigateToAdminPage(page: Page, subPath: string = '') {
    const fullPath = `/admin${subPath ? '/' + subPath : ''}`;
    await page.goto(fullPath);
    await waitForLoadingToComplete(page);
  }

  static async clickAndWaitForNavigation(page: Page, selector: string, expectedUrl?: string) {
    await Promise.all([
      page.waitForLoadState('networkidle'),
      page.click(selector)
    ]);
    
    if (expectedUrl) {
      await page.waitForURL(expectedUrl);
    }
  }

  static async fillFormAndSubmit(page: Page, formData: Record<string, string>, submitSelector: string = 'button[type="submit"]') {
    for (const [field, value] of Object.entries(formData)) {
      await page.fill(`[name="${field}"], #${field}`, value);
    }
    
    await page.click(submitSelector);
  }
}

/**
 * Assertion helpers
 */
export class AssertionHelpers {
  static async expectPageTitle(page: Page, expectedTitle: string) {
    await expect(page).toHaveTitle(new RegExp(expectedTitle, 'i'));
  }

  static async expectUrlContains(page: Page, urlPart: string) {
    await expect(page).toHaveURL(new RegExp(urlPart));
  }

  static async expectElementCount(page: Page, selector: string, count: number) {
    await expect(page.locator(selector)).toHaveCount(count);
  }

  static async expectTableRowCount(page: Page, tableSelector: string, expectedCount: number) {
    const rows = page.locator(`${tableSelector} tbody tr`);
    await expect(rows).toHaveCount(expectedCount);
  }
}

/**
 * Wait for specific conditions
 */
export async function waitForCondition(
  condition: () => Promise<boolean>,
  timeout: number = 5000,
  interval: number = 100
): Promise<void> {
  const startTime = Date.now();
  
  while (Date.now() - startTime < timeout) {
    if (await condition()) {
      return;
    }
    await new Promise(resolve => setTimeout(resolve, interval));
  }
  
  throw new Error(`Condition not met within ${timeout}ms`);
}
