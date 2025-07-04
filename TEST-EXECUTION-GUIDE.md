# 🎭 Çekirdek Anaokulu E2E Test Execution Rehberi

## 📋 Test Komutları

### Temel Test Komutları
```bash
# Tüm testleri çalıştır
pnpm test

# Headed mode (tarayıcı görünür)
pnpm test:headed

# UI mode (interaktif arayüz)
pnpm test:ui

# Debug mode
pnpm test:debug

# Test raporu görüntüle
pnpm test:report
```

### E2E Test Komutları
```bash
# Tüm E2E testleri
pnpm test:e2e

# Kayıt olma testleri
pnpm test:registration

# Login testleri
pnpm test:login

# Şifre sıfırlama testleri
pnpm test:password-reset

# Form otomasyonu testleri
pnpm test:form-automation
```

### Özel Test Komutları
```bash
# Smoke testleri (hızlı kontrol)
pnpm test:smoke

# Demo testleri (görsel izleme)
pnpm test:demo

# Admin panel testleri
pnpm test:admin

# Authentication testleri
pnpm test:auth
```

## 🎯 Test Senaryoları

### 1. Kayıt Olma Süreci (registration.spec.ts)
- ✅ Başarılı kullanıcı kaydı oluşturma
- ✅ Duplicate email ile kayıt hatası
- ✅ Form validation testleri
- ✅ Şifre eşleşme kontrolü
- ✅ Boş form submission testi
- ✅ Form accessibility testi
- ✅ Keyboard navigation testi

### 2. Login Süreci (login.spec.ts)
- ✅ Mevcut kullanıcılar ile başarılı login
  - l.demir@fatsa.bel.tr
  - o.coruh@fatsa.bel.tr
  - coruho52@gmail.com (admin)
- ✅ Geçersiz credentials ile hata handling
- ✅ Rate limiting testleri
- ✅ E-posta format validation
- ✅ Responsive design testleri

### 3. Şifre Sıfırlama (password-reset.spec.ts)
- ✅ Mevcut kullanıcılar ile şifre sıfırlama
- ✅ Supabase veritabanından kullanıcı testleri
- ✅ Geçersiz e-posta ile hata handling
- ✅ E-posta format validation
- ✅ Rate limiting testleri

### 4. Form Otomasyonu (form-automation.spec.ts)
- ✅ Otomatik form doldurma
- ✅ Bulk test data generation
- ✅ Validation error handling
- ✅ Form temizleme otomasyonu
- ✅ Responsive form testleri

## 🛠️ Troubleshooting Rehberi

### Yaygın Sorunlar ve Çözümleri

#### 1. Development Server Bağlantı Sorunu
```bash
# Hata: ECONNREFUSED localhost:5173
# Çözüm: Development server'ın çalıştığından emin olun
pnpm dev

# Alternatif port kontrolü
netstat -an | findstr :5173
```

#### 2. Supabase Bağlantı Hatası
```bash
# Hata: Database connection failed
# Çözüm: .env dosyasındaki Supabase credentials'ları kontrol edin
```

#### 3. Test Timeout Hataları
```bash
# Hata: Test timeout exceeded
# Çözüm: playwright.config.ts'de timeout değerlerini artırın
```

#### 4. Element Bulunamadı Hataları
```bash
# Hata: Element not found
# Çözüm: Selector'ları güncelleyin veya waitFor kullanın
```

#### 5. Rate Limiting Sorunları
```bash
# Hata: Too many requests
# Çözüm: Test'ler arasında bekleme süresi ekleyin
```

### Debug Teknikleri

#### 1. Screenshot Debug
```typescript
// Test sırasında screenshot al
await page.screenshot({ path: 'debug-screenshot.png', fullPage: true });
```

#### 2. Console Log Debug
```typescript
// Browser console'u dinle
page.on('console', msg => console.log('PAGE LOG:', msg.text()));
```

#### 3. Network Debug
```typescript
// Network isteklerini izle
page.on('request', request => console.log('REQUEST:', request.url()));
page.on('response', response => console.log('RESPONSE:', response.url(), response.status()));
```

#### 4. Element Debug
```typescript
// Element'in varlığını kontrol et
const element = page.locator('selector');
console.log('Element count:', await element.count());
console.log('Element visible:', await element.isVisible());
```

## 📊 Test Data Management

### Test Kullanıcıları
```typescript
// Mevcut kullanıcılar (Supabase'de kayıtlı)
const existingUsers = [
  { email: 'l.demir@fatsa.bel.tr', password: process.env.TEST_USER_PASSWORD, role: 'parent' },
  { email: 'o.coruh@fatsa.bel.tr', password: process.env.TEST_USER_PASSWORD, role: 'parent' },
  { email: 'coruho52@gmail.com', password: process.env.TEST_ADMIN_PASSWORD, role: 'admin' }
];
// NOT: Şifreler güvenlik nedeniyle koddan kaldırıldı.
// Testleri çalıştırmak için .env dosyanızda aşağıdaki gibi değişkenler tanımlanmalıdır:
// TEST_USER_PASSWORD=your_test_password
// TEST_ADMIN_PASSWORD=your_admin_password
```

### Test Data Factory Kullanımı
```typescript
import { TestDataFactory } from './tests/utils/test-data-factory';

// Rastgele test kullanıcısı oluştur
const testUser = TestDataFactory.createTestUser();

// Özel verilerle test kullanıcısı
const customUser = TestDataFactory.createTestUser({
  email: 'custom@test.com',
  fullName: 'Custom Test User'
});

// Bulk test verileri
const bulkUsers = TestDataFactory.createBulkTestUsers(10);
```

## 🔧 Konfigürasyon

### Environment Variables
```bash
# .env dosyasında gerekli değişkenler
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Playwright Konfigürasyonu
```typescript
// playwright.config.ts'de önemli ayarlar
export default defineConfig({
  baseURL: 'http://localhost:5173', // Development server URL
  timeout: 30 * 1000, // Test timeout
  expect: { timeout: 5000 }, // Assertion timeout
  retries: process.env.CI ? 2 : 0, // Retry count
});
```

## 📈 Test Raporları

### HTML Raporu
```bash
# Test çalıştırdıktan sonra raporu görüntüle
pnpm test:report
```

### JSON Raporu
```bash
# Test sonuçları JSON formatında
cat test-results/results.json
```

### Screenshot'lar ve Videolar
```bash
# Test artifacts'ları
ls test-results/
# - screenshots/
# - videos/
# - traces/
```

## 🚀 CI/CD Entegrasyonu

### GitHub Actions Örneği
```yaml
name: E2E Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: pnpm install
      - run: pnpm test:e2e
      - uses: actions/upload-artifact@v3
        with:
          name: test-results
          path: test-results/
```

## 📞 Destek

### Test Hatası Durumunda
1. Test loglarını kontrol edin
2. Screenshot'ları inceleyin
3. Network tab'ını kontrol edin
4. Browser console'unu kontrol edin
5. Supabase dashboard'unu kontrol edin

### İletişim
- Test sorunları için: GitHub Issues
- Acil durumlar için: Proje maintainer'ları
