import { Page, Locator } from '@playwright/test';
import { TestDataFactory, TestUser, TestApplication } from './test-data-factory';

/**
 * Form Automation Utilities
 * MCP tabanlı form doldurma otomasyonu
 */
export class FormAutomation {
  constructor(private page: Page) {}

  /**
   * Akıllı form field bulma
   * Çeşitli selector stratejileri kullanarak form alanlarını bulur
   */
  private async findFormField(fieldName: string, fieldType?: string): Promise<Locator | null> {
    const selectors = [
      `input[name="${fieldName}"]`,
      `#${fieldName}`,
      `input[id="${fieldName}"]`,
      `input[placeholder*="${fieldName}"]`,
      `input[aria-label*="${fieldName}"]`,
      `input[data-testid="${fieldName}"]`,
      `input[data-field="${fieldName}"]`
    ];

    if (fieldType) {
      selectors.unshift(`input[type="${fieldType}"][name="${fieldName}"]`);
      selectors.unshift(`input[type="${fieldType}"]#${fieldName}`);
    }

    for (const selector of selectors) {
      const element = this.page.locator(selector);
      if (await element.count() > 0) {
        return element;
      }
    }

    // Fuzzy matching - benzer isimleri ara
    const fuzzySelectors = [
      `input:has-text("${fieldName}")`,
      `input[placeholder*="${fieldName.toLowerCase()}"]`,
      `input[aria-label*="${fieldName.toLowerCase()}"]`
    ];

    for (const selector of fuzzySelectors) {
      const element = this.page.locator(selector);
      if (await element.count() > 0) {
        return element;
      }
    }

    return null;
  }

  /**
   * Güvenli form field doldurma
   */
  private async fillFormField(fieldName: string, value: string, fieldType?: string): Promise<boolean> {
    const field = await this.findFormField(fieldName, fieldType);
    
    if (!field) {
      console.warn(`⚠️ Form field bulunamadı: ${fieldName}`);
      return false;
    }

    try {
      // Field'ın görünür ve aktif olduğunu kontrol et
      await field.waitFor({ state: 'visible', timeout: 5000 });
      
      // Mevcut değeri temizle
      await field.clear();
      
      // Yeni değeri gir
      await field.fill(value);
      
      // Kısa bekleme (UI güncellemesi için)
      await this.page.waitForTimeout(300);
      
      console.log(`✅ ${fieldName} alanı dolduruldu: ${value}`);
      return true;
    } catch (_error) {
      console.error(`❌ ${fieldName} alanı doldurulurken hata:`, error);
      return false;
    }
  }

  /**
   * Kayıt formu otomatik doldurma
   */
  async fillRegistrationForm(userData?: Partial<TestUser>): Promise<TestUser> {
    console.log('🤖 Kayıt formu otomatik doldurma başlıyor...');
    
    const testUser = TestDataFactory.createTestUser(userData);
    
    const fields = [
      { name: 'fullName', value: testUser.fullName, type: 'text' },
      { name: 'email', value: testUser.email, type: 'email' },
      { name: 'phone', value: testUser.phone, type: 'tel' },
      { name: 'password', value: testUser.password, type: 'password' },
      { name: 'confirmPassword', value: testUser.password, type: 'password' }
    ];

    if (testUser.tcNo) {
      fields.push({ name: 'tcNo', value: testUser.tcNo, type: 'text' });
    }

    let successCount = 0;
    for (const field of fields) {
      const success = await this.fillFormField(field.name, field.value, field.type);
      if (success) successCount++;
    }

    console.log(`📊 ${successCount}/${fields.length} alan başarıyla dolduruldu`);
    
    // Screenshot al
    await this.page.screenshot({ 
      path: 'test-results/auto-filled-registration.png', 
      fullPage: true 
    });

    return testUser;
  }

  /**
   * Login formu otomatik doldurma
   */
  async fillLoginForm(email: string, password: string): Promise<boolean> {
    console.log('🔐 Login formu otomatik doldurma başlıyor...');
    
    const emailSuccess = await this.fillFormField('email', email, 'email');
    const passwordSuccess = await this.fillFormField('password', password, 'password');
    
    if (emailSuccess && passwordSuccess) {
      console.log('✅ Login formu başarıyla dolduruldu');
      
      // Screenshot al
      await this.page.screenshot({ 
        path: 'test-results/auto-filled-login.png', 
        fullPage: true 
      });
      
      return true;
    }
    
    console.log('❌ Login formu doldurma başarısız');
    return false;
  }

  /**
   * Şifre sıfırlama formu otomatik doldurma
   */
  async fillPasswordResetForm(email: string): Promise<boolean> {
    console.log('🔄 Şifre sıfırlama formu otomatik doldurma başlıyor...');
    
    const success = await this.fillFormField('email', email, 'email');
    
    if (success) {
      console.log('✅ Şifre sıfırlama formu başarıyla dolduruldu');
      
      // Screenshot al
      await this.page.screenshot({ 
        path: 'test-results/auto-filled-password-reset.png', 
        fullPage: true 
      });
      
      return true;
    }
    
    console.log('❌ Şifre sıfırlama formu doldurma başarısız');
    return false;
  }

  /**
   * Başvuru formu otomatik doldurma
   */
  async fillApplicationForm(applicationData?: Partial<TestApplication>): Promise<TestApplication> {
    console.log('📝 Başvuru formu otomatik doldurma başlıyor...');
    
    const testApplication = TestDataFactory.createTestApplication(applicationData);
    
    // Ana başvuru bilgileri
    const mainFields = [
      { name: 'fullName', value: testApplication.fullName },
      { name: 'email', value: testApplication.email },
      { name: 'phone', value: testApplication.phone }
    ];

    for (const field of mainFields) {
      await this.fillFormField(field.name, field.value);
    }

    // Çocuk bilgileri (ilk çocuk)
    if (testApplication.children.length > 0) {
      const child = testApplication.children[0];
      
      const childFields = [
        { name: 'childName', value: child.name },
        { name: 'childBirthdate', value: child.birthdate },
        { name: 'childGender', value: child.gender },
        { name: 'childAllergy', value: child.allergy || '' },
        { name: 'childNote', value: child.note || '' }
      ];

      for (const field of childFields) {
        await this.fillFormField(field.name, field.value);
      }

      // Cinsiyet seçimi (radio button veya select)
      await this.selectGender(child.gender);

      // Acil durum kişileri
      if (child.emergencyContacts.length > 0) {
        await this.fillEmergencyContacts(child.emergencyContacts);
      }
    }

    console.log('✅ Başvuru formu başarıyla dolduruldu');
    
    // Screenshot al
    await this.page.screenshot({ 
      path: 'test-results/auto-filled-application.png', 
      fullPage: true 
    });

    return testApplication;
  }

  /**
   * Cinsiyet seçimi
   */
  private async selectGender(gender: 'erkek' | 'kız'): Promise<void> {
    // Radio button seçimi
    const radioSelectors = [
      `input[type="radio"][value="${gender}"]`,
      `input[type="radio"][name="gender"][value="${gender}"]`,
      `input[type="radio"][name="childGender"][value="${gender}"]`
    ];

    for (const selector of radioSelectors) {
      const radio = this.page.locator(selector);
      if (await radio.count() > 0) {
        await radio.click();
        console.log(`✅ Cinsiyet seçildi: ${gender}`);
        return;
      }
    }

    // Select dropdown seçimi
    const selectSelectors = [
      'select[name="gender"]',
      'select[name="childGender"]',
      '#gender',
      '#childGender'
    ];

    for (const selector of selectSelectors) {
      const select = this.page.locator(selector);
      if (await select.count() > 0) {
        await select.selectOption(gender);
        console.log(`✅ Cinsiyet seçildi (dropdown): ${gender}`);
        return;
      }
    }

    console.warn(`⚠️ Cinsiyet seçimi bulunamadı: ${gender}`);
  }

  /**
   * Acil durum kişilerini doldur
   */
  private async fillEmergencyContacts(contacts: any[]): Promise<void> {
    for (let i = 0; i < Math.min(contacts.length, 2); i++) {
      const contact = contacts[i];
      const index = i + 1;

      await this.fillFormField(`emergencyContact${index}Name`, contact.name);
      await this.fillFormField(`emergencyContact${index}Phone`, contact.phone);
      await this.fillFormField(`emergencyContact${index}Relation`, contact.relation);
    }
  }

  /**
   * Form submit
   */
  async submitForm(buttonText?: string): Promise<boolean> {
    const submitSelectors = [
      'button[type="submit"]',
      `button:has-text("${buttonText || 'Gönder'}")`,
      `button:has-text("Kayıt Ol")`,
      `button:has-text("Submit")`,
      'input[type="submit"]'
    ];

    for (const selector of submitSelectors) {
      const button = this.page.locator(selector);
      if (await button.count() > 0) {
        try {
          await button.click();
          console.log('✅ Form submit edildi');
          return true;
        } catch (_error) {
          console.warn(`⚠️ Submit button tıklanamadı: ${selector}`);
        }
      }
    }

    console.error('❌ Submit button bulunamadı');
    return false;
  }

  /**
   * Form validation hatalarını kontrol et
   */
  async checkValidationErrors(): Promise<string[]> {
    const errorSelectors = [
      '.error',
      '.error-message',
      '.field-error',
      '.invalid-feedback',
      '[role="alert"]',
      '.text-red-500',
      '.text-red-600',
      '.text-danger'
    ];

    const errors: string[] = [];

    for (const selector of errorSelectors) {
      const errorElements = this.page.locator(selector);
      const count = await errorElements.count();

      for (let i = 0; i < count; i++) {
        const errorText = await errorElements.nth(i).textContent();
        if (errorText && errorText.trim()) {
          errors.push(errorText.trim());
        }
      }
    }

    if (errors.length > 0) {
      console.log('⚠️ Validation hataları bulundu:', errors);
    }

    return errors;
  }

  /**
   * Form alanlarını temizle
   */
  async clearForm(): Promise<void> {
    const inputSelectors = [
      'input[type="text"]',
      'input[type="email"]',
      'input[type="tel"]',
      'input[type="password"]',
      'textarea'
    ];

    for (const selector of inputSelectors) {
      const inputs = this.page.locator(selector);
      const count = await inputs.count();

      for (let i = 0; i < count; i++) {
        try {
          await inputs.nth(i).clear();
        } catch (_error) {
          // Ignore errors for readonly or disabled fields
        }
      }
    }

    console.log('🧹 Form alanları temizlendi');
  }
}

/**
 * Form Automation Factory
 */
export const createFormAutomation = (page: Page): FormAutomation => {
  return new FormAutomation(page);
};
