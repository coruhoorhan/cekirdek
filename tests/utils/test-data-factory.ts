import { faker } from '@faker-js/faker';

// Türkiye'ye özel faker locale ayarı
faker.locale = 'tr';

export interface TestUser {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  tcNo?: string;
}

export interface TestChild {
  name: string;
  birthdate: string;
  gender: 'erkek' | 'kız';
  allergy?: string;
  note?: string;
  emergencyContacts: TestEmergencyContact[];
  medications?: TestMedication[];
}

export interface TestEmergencyContact {
  name: string;
  phone: string;
  relation: string;
}

export interface TestMedication {
  name: string;
  dose?: string;
  usage_note?: string;
}

export interface TestApplication {
  fullName: string;
  email: string;
  phone: string;
  children: TestChild[];
}

/**
 * Test Data Factory Class
 */
export class TestDataFactory {
  /**
   * Geçerli TC Kimlik No oluştur
   */
  static generateValidTCNo(): string {
    // Basit TC kimlik no algoritması (test için)
    const firstDigit = faker.number.int({ min: 1, max: 9 });
    const middleDigits = Array.from({ length: 8 }, () => faker.number.int({ min: 0, max: 9 }));
    
    // 10. hane hesaplama
    const sum1 = (firstDigit + middleDigits[1] + middleDigits[3] + middleDigits[5] + middleDigits[7]) * 7;
    const sum2 = middleDigits[0] + middleDigits[2] + middleDigits[4] + middleDigits[6];
    const tenthDigit = (sum1 - sum2) % 10;
    
    // 11. hane hesaplama
    const totalSum = firstDigit + middleDigits.reduce((a, b) => a + b, 0) + tenthDigit;
    const eleventhDigit = totalSum % 10;
    
    return `${firstDigit}${middleDigits.join('')}${tenthDigit}${eleventhDigit}`;
  }

  /**
   * Türkiye telefon numarası oluştur
   */
  static generateTurkishPhone(): string {
    const operators = ['530', '531', '532', '533', '534', '535', '536', '537', '538', '539', '540', '541', '542', '543', '544', '545', '546', '547', '548', '549'];
    const operator = faker.helpers.arrayElement(operators);
    const number = faker.string.numeric(7);
    return `0${operator}${number}`;
  }

  /**
   * Test kullanıcısı oluştur
   */
  static createTestUser(overrides: Partial<TestUser> = {}): TestUser {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    
    return {
      fullName: `${firstName} ${lastName}`,
      email: faker.internet.email({ firstName, lastName, provider: 'test.cekirdek.com' }).toLowerCase(),
      phone: this.generateTurkishPhone(),
      password: 'Test123!@#', // Güçlü test şifresi
      tcNo: this.generateValidTCNo(),
      ...overrides
    };
  }

  /**
   * Acil durum kişisi oluştur
   */
  static createEmergencyContact(overrides: Partial<TestEmergencyContact> = {}): TestEmergencyContact {
    const relations = ['Anne', 'Baba', 'Büyükanne', 'Büyükbaba', 'Teyze', 'Amca', 'Hala', 'Dayı'];
    
    return {
      name: faker.person.fullName(),
      phone: this.generateTurkishPhone(),
      relation: faker.helpers.arrayElement(relations),
      ...overrides
    };
  }

  /**
   * İlaç bilgisi oluştur
   */
  static createMedication(overrides: Partial<TestMedication> = {}): TestMedication {
    const medications = ['Vitamin D', 'Demir Şurubu', 'Probiyotik', 'Omega 3', 'Multivitamin'];
    const doses = ['1 damla', '5 ml', '1 tablet', '2 kapsül', '1 çay kaşığı'];
    
    return {
      name: faker.helpers.arrayElement(medications),
      dose: faker.helpers.arrayElement(doses),
      usage_note: faker.lorem.sentence(),
      ...overrides
    };
  }

  /**
   * Test çocuğu oluştur
   */
  static createTestChild(overrides: Partial<TestChild> = {}): TestChild {
    const birthDate = faker.date.between({ 
      from: new Date('2018-01-01'), 
      to: new Date('2023-12-31') 
    });
    
    const allergies = ['Yok', 'Fındık', 'Süt', 'Yumurta', 'Bal', 'Çilek'];
    
    return {
      name: faker.person.firstName(),
      birthdate: birthDate.toISOString().split('T')[0],
      gender: faker.helpers.arrayElement(['erkek', 'kız']),
      allergy: faker.helpers.arrayElement(allergies),
      note: faker.lorem.sentence(),
      emergencyContacts: [
        this.createEmergencyContact({ relation: 'Anne' }),
        this.createEmergencyContact({ relation: 'Baba' })
      ],
      medications: faker.helpers.maybe(() => [this.createMedication()], { probability: 0.3 }),
      ...overrides
    };
  }

  /**
   * Test başvurusu oluştur
   */
  static createTestApplication(overrides: Partial<TestApplication> = {}): TestApplication {
    const user = this.createTestUser();
    
    return {
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      children: [this.createTestChild()],
      ...overrides
    };
  }

  /**
   * Mevcut kullanıcı credentials'ları
   */
  static getExistingUsers(): { email: string; password: string; role: string }[] {
    return [
      {
        email: 'l.demir@fatsa.bel.tr',
        password: '123456',
        role: 'parent'
      },
      {
        email: 'o.coruh@fatsa.bel.tr',
        password: '123456',
        role: 'parent'
      },
      {
        email: 'coruho52@gmail.com',
        password: '123456',
        role: 'admin'
      },
      {
        email: 'psk.bestenidapersembeli@gmail.com',
        password: '123456',
        role: 'parent'
      },
      {
        email: 'orhan_coruh@hotmail.com',
        password: '123456',
        role: 'parent'
      }
    ];
  }

  /**
   * Geçersiz test verileri
   */
  static getInvalidTestData() {
    return {
      emails: [
        'invalid-email',
        'test@',
        '@domain.com',
        'test..test@domain.com',
        'test@domain',
        ''
      ],
      phones: [
        '123',
        '05001234567', // Geçersiz operator
        '1234567890',
        '+90 555 123 45 67', // Format hatası
        ''
      ],
      passwords: [
        '123', // Çok kısa
        'password', // Büyük harf yok
        'PASSWORD', // Küçük harf yok
        'Password', // Rakam yok
        'Password123', // Özel karakter yok
        ''
      ],
      tcNos: [
        '12345678901', // Geçersiz algoritma
        '01234567890', // 0 ile başlayamaz
        '123456789', // Çok kısa
        '123456789012', // Çok uzun
        'abcdefghijk', // Harf içeriyor
        ''
      ]
    };
  }

  /**
   * Bulk test data oluştur
   */
  static createBulkTestUsers(count: number): TestUser[] {
    return Array.from({ length: count }, () => this.createTestUser());
  }

  static createBulkTestApplications(count: number): TestApplication[] {
    return Array.from({ length: count }, () => this.createTestApplication());
  }

  /**
   * Test senaryoları için özel veriler
   */
  static getTestScenarios() {
    return {
      // Başarılı kayıt senaryosu
      successfulRegistration: this.createTestUser({
        email: `success-${Date.now()}@test.cekirdek.com`
      }),
      
      // Duplicate email senaryosu
      duplicateEmail: {
        ...this.createTestUser(),
        email: 'l.demir@fatsa.bel.tr' // Mevcut kullanıcı
      },
      
      // Geçersiz format senaryoları
      invalidFormats: {
        email: this.createTestUser({ email: 'invalid-email-format' }),
        phone: this.createTestUser({ phone: '123' }),
        password: this.createTestUser({ password: '123' })
      },
      
      // Rate limiting senaryosu
      rateLimiting: Array.from({ length: 6 }, (_, i) => 
        this.createTestUser({ 
          email: `rate-limit-${i}@test.cekirdek.com`,
          password: 'wrongpassword'
        })
      )
    };
  }
}

// Export default instance
export const testDataFactory = new TestDataFactory();
