# Anaokulu Yönetim Sistemi - Geliştirme Görev Listesi

Bu döküman, anaokulu yönetim sistemi projesinin geliştirme adımlarını detaylı bir şekilde listeler. Her ana modül ve özellik için alt görevler belirtilmiştir. Tamamlanan görevler işaretlenecektir.

## ⓪. Proje Kurulumu ve Temel Yapılandırma

*   [x] Frontend projesi (React + Vite + TypeScript) temel iskeleti oluşturuldu.
*   [x] Tailwind CSS ve Shadcn/ui entegrasyonu yapıldı.
*   [x] Temel admin paneli layout'u (Sidebar, Header, Content Area) oluşturuldu.
*   [x] Admin paneli için temel routing yapısı (`react-router-dom`) kuruldu.
*   [x] `vercel.json` ile Vercel SPA yönlendirme yapılandırması eklendi.
*   [x] Supabase projesi oluşturulacak ve temel ayarlar yapılacak. (Kullanıcı tarafından proje oluşturuldu, anahtarlar paylaşıldı)
    *   [x] Yeni Supabase projesi oluşturma. (Kullanıcı tarafından yapıldı)
    *   [x] Proje API anahtarları ve URL'lerinin güvenli bir şekilde saklanması (`.env`). (Yapıldı)
    *   [x] Supabase JavaScript client kütüphanesinin projeye entegrasyonu. (package.json güncellendi, client helper oluşturuldu)
*   [x] `TEKNOLOJI.md` dosyası oluşturuldu ve güncel tutulacak. (Oluşturuldu)
*   [x] Bu `TASKLIST.md` dosyası oluşturuldu ve güncel tutulacak. (Oluşturuldu)

## ①. Kimlik Doğrulama ve Kullanıcı Yönetimi (Supabase Auth)

*   **A. Temel Kimlik Doğrulama:**
    *   [x] Kullanıcı rolleri tanımlanacak (Admin, Öğretmen, Veli) - Supabase'de `profiles` tablosu `role` alanı ile oluşturuldu ve trigger ile `auth.users`'a bağlandı (Kullanıcı tarafından yapıldı).
    *   [x] Kayıt olma (Sign Up) sayfası ve işlevselliği (e-posta/şifre ile).
        *   [x] Kayıt formu UI (Shadcn/ui) (`SignUpPage.tsx` oluşturuldu).
        *   [x] Supabase `signUp` entegrasyonu (`SignUpPage.tsx` içinde temel entegrasyon yapıldı).
        *   [ ] Başarılı kayıt sonrası e-posta doğrulama akışı (Supabase varsayılan olarak yönetir, UI'da mesaj gösterildi).
    *   [x] Giriş yapma (Sign In) sayfası ve işlevselliği (e-posta/şifre ile).
        *   [x] Giriş formu UI (`LoginPage.tsx` geliştirildi).
        *   [x] Supabase `signInWithPassword` entegrasyonu (`LoginPage.tsx` içinde temel entegrasyon yapıldı).
        *   [ ] Başarılı giriş sonrası kullanıcıyı rolüne göre doğru dashboard'a yönlendirme (`LoginPage.tsx` içinde TODO bırakıldı, `AuthContext` ile yapılacak).
    *   [x] Çıkış yapma (Sign Out) işlevselliği (`AuthContext` ve `Header.tsx` içinde eklendi).
    *   [ ] Şifre sıfırlama (Forgot Password) akışı.
        *   [ ] Şifre sıfırlama talep formu UI.
        *   [ ] Supabase `resetPasswordForEmail` entegrasyonu.
        *   [ ] Şifre güncelleme formu UI ve Supabase `updateUser` entegrasyonu.
    *   [x] Rol Tabanlı Erişim Kontrolü (RBAC) temelleri atılacak.
        *   [x] Frontend'de route korumaları (`ProtectedRoute.tsx` oluşturuldu ve `/admin` route'ları koruma altına alındı).
        *   [x] Supabase Row Level Security (RLS) politikalarının temel düzeyde planlanması (Kullanıcı tarafından `profiles` için yapıldı).
    *   [x] Auth Context Oluşturma (`src/contexts/AuthContext.tsx`) (Yapıldı).
    *   [x] `App.tsx`'i AuthProvider ile Sarmalama (Yapıldı).
    *   [x] Header'da Kullanıcı Bilgisi ve Logout Butonu (Yapıldı).
*   **B. Admin Paneli - Kullanıcı Yönetimi:**
    *   [ ] Kullanıcıları (Admin, Öğretmen, Veli) listeleme arayüzü.
        *   [ ] Filtreleme (role, isme göre vb.) ve arama.
    *   [ ] Yeni kullanıcı (Öğretmen, Veli) ekleme formu ve işlevselliği (Admin tarafından).
        *   [ ] Rol atama.
        *   [ ] Geçici şifre oluşturma veya e-posta ile davet gönderme.
    *   [ ] Kullanıcı bilgilerini düzenleme arayüzü.
    *   [ ] Kullanıcı rolünü değiştirme.
    *   [ ] Kullanıcı hesabını aktifleştirme/pasifleştirme.
    *   [ ] Öğretmenleri sınıflara atama arayüzü.
    *   [ ] Velileri çocuklara atama arayüzü.

## ②. Yönetici (Admin) Paneli Modülleri

*   **A. Admin Dashboard:**
    *   [x] Temel Dashboard sayfası oluşturuldu (`DashboardPage.tsx`).
    *   [ ] Özet istatistiklerin gösterimi (Toplam öğrenci, öğretmen, veli; sınıf dolulukları; ödenmemiş faturalar - Backend bağlantısı sonrası).
    *   [ ] Son duyurular listesi.
    *   [ ] Sistemdeki son aktiviteler log'u (opsiyonel, basit düzeyde).
*   **B. Öğrenci Yönetimi:**
    *   [ ] Öğrencileri listeleme arayüzü (sınıfa göre filtreleme, arama).
    *   [ ] Yeni öğrenci kayıt formu UI ve Supabase entegrasyonu.
        *   [ ] Ad, soyad, doğum tarihi, cinsiyet.
        *   [ ] Veli atama (mevcut velilerden seçme veya yeni veli oluşturma seçeneği).
        *   [ ] Sınıf atama.
        *   [ ] Alerjiler, özel sağlık notları, acil durum kişileri.
        *   [ ] Fotoğraf yükleme.
    *   [ ] Öğrenci detay sayfası (tüm bilgileri, ilişkili veli, sınıf, raporlar vb.).
    *   [ ] Öğrenci bilgilerini düzenleme.
    *   [ ] Öğrenciyi okuldan silme/pasife alma.
*   **C. Sınıf Yönetimi:**
    *   [ ] Sınıfları listeleme arayüzü.
    *   [ ] Yeni sınıf oluşturma formu (Sınıf adı, yaş grubu, kontenjan, sorumlu öğretmen atama).
    *   [ ] Sınıf bilgilerini düzenleme.
    *   [ ] Sınıfa öğrenci ekleme/çıkarma.
    *   [ ] Sınıfa öğretmen atama/değiştirme.
*   **D. Duyuru ve Bildirim Yönetimi:**
    *   [ ] Duyuruları listeleme arayüzü.
    *   [ ] Yeni duyuru oluşturma formu (Başlık, içerik, hedef kitle - tüm okul, belirli sınıflar, belirli veliler).
    *   [ ] Duyuruları düzenleme/silme.
    *   [ ] Duyuruların veli ve öğretmen panellerinde gösterilmesi.
    *   [ ] Anlık bildirim (Push Notification) gönderme arayüzü (Supabase Functions ile entegrasyon).
*   **E. İçerik Yönetimi:**
    *   [ ] **Yemek Menüsü Yönetimi:**
        *   [ ] Haftalık/aylık yemek menüsü oluşturma/düzenleme arayüzü (sabah, öğle, ikindi).
        *   [ ] Menünün veli panelinde gösterilmesi.
    *   [ ] **Etkinlik Takvimi Yönetimi:**
        *   [ ] Yeni etkinlik ekleme formu (Başlık, tarih, saat, açıklama, hedef kitle).
        *   [ ] Etkinlikleri takvim üzerinde gösterme ve yönetme.
        *   [ ] Etkinliklerin veli/öğretmen panellerinde gösterilmesi.
    *   [ ] **Döküman Merkezi Yönetimi:**
        *   [ ] Genel dökümanları (sözleşme, formlar vb.) yükleme/yönetme.
        *   [ ] Dökümanların ilgili panellerde erişilebilir olması.
*   **F. Personel Yönetimi (Öğretmenler dışındaki personel için):**
    *   [ ] Personel listeleme (aşçı, temizlik, psikolog, servis şoförü vb.).
    *   [ ] Yeni personel ekleme/düzenleme/silme.
    *   [ ] Rol ve yetki atama (Örn: Aşçı sadece yemek menüsünü görür).
    *   [ ] Personel özlük bilgileri, iletişim.
*   **G. Servis ve Ulaşım Takip Modülü (Admin Kısmı):**
    *   [ ] Servis araçlarını tanımlama (Plaka, kapasite, sorumlu şoför/hostes).
    *   [ ] Servis güzergahları oluşturma/yönetme.
    *   [ ] Öğrencileri servislere atama.
    *   [ ] Servislerin canlı konum takibi için harita arayüzü (Veli panelindeki ile entegre).
    *   [ ] Servis yoklama raporları.
*   **H. Envanter ve Stok Yönetimi:**
    *   [ ] Envanter (demirbaş, oyuncak) ve sarf malzemesi (boya, kağıt) listeleme/yönetme.
    *   [ ] Stok giriş/çıkış işlemleri.
    *   [ ] Kritik stok seviyesi uyarıları.
*   **I. Raporlama Modülü (Admin için kapsamlı raporlar):**
    *   [ ] Öğrenci devamlılık raporları.
    *   [ ] Sınıf bazlı genel gelişim özetleri.
    *   [ ] Veli-öğretmen görüşme sıklığı/oranları.
    *   [ ] Finansal raporlar (gelir-gider, ödenmemiş alacaklar vb. - Finans modülü ile entegre).
*   **J. Genel Ayarlar:**
    *   [ ] Okul adı, logosu, iletişim bilgileri gibi temel site ayarları.
    *   [ ] Otomatik bildirim şablonları yönetimi.
    *   [ ] Ödeme ayarları (Iyzico API keyleri vb. - güvenli bir şekilde).
    *   [ ] Vergi oranları tanımlama.

## ③. Finans ve Ödeme Sistemi (Iyzico Entegrasyonu)

*   **A. Admin Paneli - Finans Yapılandırması:**
    *   [ ] Hizmet paketleri (Tam gün, yarım gün vb.) ve aylık ücretlerini tanımlama.
    *   [ ] Ek hizmetler (Servis, bale, İngilizce) ve ücretlerini tanımlama.
    *   [ ] İndirim kuralları (kardeş indirimi vb.) tanımlama.
    *   [ ] Iyzico API anahtarlarının güvenli bir şekilde sisteme girilmesi.
*   **B. Otomatik Fatura Üretimi:**
    *   [ ] Supabase Function: Her ayın başında (veya belirlenen günde) her öğrenci için otomatik fatura oluşturma.
        *   [ ] Öğrencinin kayıtlı olduğu hizmet ve ek hizmetlere göre tutar hesaplama.
        *   [ ] İndirimleri uygulama.
        *   [ ] Fatura detaylarını (`Payments` tablosuna benzer bir `Invoices` tablosuna) kaydetme (durum: 'pending').
    *   [ ] Fatura numara serisi yönetimi.
*   **C. Admin Paneli - Fatura Yönetimi:**
    *   [ ] Oluşturulan tüm faturaları listeleme (öğrenci, veli, tarih, tutar, durum - pending, paid, overdue, failed).
    *   [ ] Faturaları filtreleme/arama.
    *   [ ] Manuel fatura oluşturma/düzenleme (tek seferlik giderler için).
    *   [ ] Fatura detaylarını görüntüleme.
    *   [ ] Ödeme durumunu manuel güncelleme (nadir durumlar için).
*   **D. Veli Paneli - Faturalarım ve Ödeme:**
    *   [ ] Veliye ait ödenmemiş ve ödenmiş faturaları listeleme.
    *   [ ] Fatura detaylarını (hizmet kalemleri, tutarlar) şeffaf bir şekilde gösterme.
    *   [ ] "Hemen Öde" butonu ile Iyzilink API'sine yönlendirme veya Iyzico'nun gömülü formunu kullanma.
        *   [ ] Gerekli parametrelerin (tutar, sipariş no vb.) Iyzico'ya doğru gönderilmesi.
    *   [ ] Kredi kartı saklama seçeneği (Iyzico altyapısında güvenli).
    *   [ ] Otomatik ödeme talimatı verme arayüzü ve işlevselliği.
    *   [ ] Ödeme geçmişini ve dekontları (PDF oluşturma - opsiyonel) görüntüleme.
*   **E. Webhook Entegrasyonu (Supabase Function):**
    *   [ ] Iyzico'dan gelen başarılı/başarısız ödeme bildirimlerini (webhook) dinleyen bir Supabase Function oluşturma.
    *   [ ] Webhook verisini doğrulama (güvenlik için).
    *   [ ] Başarılı ödeme sonrası ilgili faturanın durumunu `Invoices` tablosunda "paid" olarak güncelleme.
    *   [ ] Başarısız ödeme durumunda loglama ve gerekirse veliye/admine bildirim.
*   **F. Otomatik Hatırlatıcılar (Supabase Functions):**
    *   [ ] Son ödeme tarihi yaklaşan faturalar için velilere e-posta/anlık bildirim gönderme.
    *   [ ] Son ödeme tarihi geçmiş faturalar için "Gecikmiş Fatura" hatırlatmaları.
*   **G. İptal/İade Süreçleri:**
    *   [ ] Admin panelinden iade talebi başlatma (Iyzico API ile entegrasyon).
    *   [ ] Fatura durumunu 'refunded' olarak güncelleme.

## ④. Öğretmen Paneli Modülleri

*   **A. Öğretmen Dashboard (Sınıfım):**
    *   [ ] Sorumlu olduğu sınıfın öğrenci listesi (hızlı erişim kartları).
    *   [ ] Bugün doğum günü olan öğrenciler için uyarı/kutlama.
    *   [ ] Velilerden gelen okunmamış mesaj sayısı.
    *   [ ] Yöneticiden gelen son duyurular.
*   **B. Günlük Akış Raporu (Her Çocuk İçin):**
    *   [ ] Rapor giriş formu UI (Yemek, Uyku, Tuvalet/Bez, Genel Mod, Öğretmen Notu).
        *   [ ] Seçenekler (Yedi/Az Yedi/Yemedi) ve metin alanları.
    *   [ ] Raporu kaydetme ve Supabase'e gönderme.
    *   [ ] Geçmiş raporları görüntüleme/düzenleme (sınırlı bir süre için).
    *   [ ] Raporun anında veli paneline yansıması (Realtime).
*   **C. Portfolyo (Fotoğraf ve Video Galerisi):**
    *   [ ] Fotoğraf/video yükleme arayüzü (Drag & Drop destekli).
        *   [ ] Supabase Storage'a dosya yükleme.
        *   [ ] Yüklerken fotoğraftaki çocukları etiketleme (öğrenci listesinden seçme).
        *   [ ] Kısa açıklama ekleme.
    *   [ ] Yüklenen medyaları yönetme (silme, açıklama düzenleme).
    *   [ ] Veli panelinde sadece etiketlenen çocuğa ait medyaların gösterilmesi (RLS ile).
*   **D. Gelişim Takibi (Her Çocuk İçin):**
    *   [ ] Periyodik (aylık/3 aylık) gelişim değerlendirme formu UI.
        *   [ ] Alanlar: Psikomotor, Sosyal-Duygusal, Bilişsel, Dil Gelişimi.
        *   [ ] Değerlendirme seçenekleri (Başarılı/Desteklenmeli/Henüz Gözlenmedi vb.) ve not alanları.
    *   [ ] Değerlendirmeyi kaydetme ve Supabase'e gönderme.
    *   [ ] Çocuğun geçmiş gelişim raporlarını ve grafiklerini görüntüleme.
    *   [ ] Raporların veli paneline yansıması.
*   **E. Mesajlaşma (Öğretmen-Veli):**
    *   [ ] Sınıfındaki velilerle birebir mesajlaşma arayüzü.
        *   [ ] Supabase Realtime ile anlık mesajlaşma.
        *   [ ] Okundu bilgisi.
    *   [ ] Sınıfına toplu mesaj/duyuru gönderme.
    *   [ ] Yöneticiden gelen duyuruları görme.
*   **F. Yoklama:**
    *   [ ] Sınıf listesi üzerinden hızlı yoklama alma arayüzü (Geldi/Gelmedi/İzinli).
    *   [ ] Yoklama verisinin Supabase'e kaydedilmesi.
    *   [ ] Yoklama bilgisinin anında yönetici ve veli paneline yansıması.
*   **G. "Günün Anları" Hikaye Formatı:**
    *   [ ] Kısa video/fotoğraf yükleme (24 saat sonra kaybolacak şekilde).
    *   [ ] Çocukları etiketleme.
    *   [ ] Veli panelinde gösterimi ve velilerin emoji ile tepki verebilmesi.
*   **H. İnteraktif Randevu Sistemi (Öğretmen Kısmı):**
    *   [ ] Uygun olduğu gün ve saat aralıklarını takvimde işaretleme arayüzü.
    *   [ ] Gelen randevu taleplerini görme/onaylama.
    *   [ ] Kendi takvimini görüntüleme.
*   **I. Gelişim Hedefleri ve Ev Ödevleri (Öğretmen Kısmı):**
    *   [ ] Bir çocuk için "Haftanın Hedefi" atama arayüzü.
    *   [ ] Veliden gelen "Tamamlandı" geri bildirimlerini ve yüklenen fotoğrafları görme.
*   **J. İlaç Takip Modülü (Öğretmen Kısmı):**
    *   [ ] Veliden gelen ilaç verme taleplerini görme.
    *   [ ] İlacı verdiğinde "Verildi" olarak işaretleme ve saati kaydetme.
*   **K. Çocuk Teslim Alma Yetkilendirmesi (Öğretmen Kısmı):**
    *   [ ] Veli tarafından yetkilendirilen kişilerin listesini ve bilgilerini görme (çocuk bazlı).
    *   [ ] Çocuğu teslim ederken teyit etme.

## ⑤. Veli Paneli Modülleri

*   **A. Veli Dashboard:**
    *   [ ] Çocuğunun/çocuklarının o günkü günlük akış raporu özeti.
    *   [ ] Öğretmenden gelen son fotoğraflar/videolar ("Günün Anları" dahil).
    *   [ ] Okunmamış mesajlar ve okul duyuruları.
    *   [ ] Yaklaşan etkinlikler ve randevular.
    *   [ ] Ödenmemiş fatura varsa uyarı.
*   **B. Çocuğum Detay Sayfası (Her çocuk için ayrı):**
    *   [ ] **Günlük Raporlar:** Geçmişe dönük tüm günlük akış raporlarını takvim veya liste formatında görme.
    *   [ ] **Galeri:** Sadece kendi çocuğunun olduğu (etiketlendiği) fotoğrafları ve videoları görme, indirme, beğenme/yorum yapma (opsiyonel).
    *   [ ] **Gelişim Raporları:** Öğretmenin doldurduğu periyodik gelişim raporlarını ve interaktif gelişim grafiklerini görme.
    *   [ ] **Sağlık Bilgileri:** Çocuğun alerjileri, kullanması gereken ilaçlar, acil durumda aranacak kişiler gibi bilgileri görüntüleme ve güncelleme talebi gönderme (admine).
    *   [ ] **Yoklama Geçmişi:** Çocuğunun devam-devamsızlık durumunu takvim veya liste üzerinde takip etme.
*   **C. Okul İle İletişim:**
    *   [ ] **Mesajlar:** Çocuğunun öğretmeniyle doğrudan ve güvenli bir şekilde mesajlaşma.
    *   [ ] **Duyurular:** Okul yönetiminden ve öğretmenden gelen tüm duyuruları görme.
    *   [ ] **Etkinlik Takvimi:** Okul ve sınıf etkinliklerini görme, kendi dijital takvimine (Google Calendar vb.) ekleme seçeneği.
    *   [ ] **Yemek Menüsü:** Haftalık/aylık yemek menüsünü görme.
*   **D. Hesabım (Veli):**
    *   [ ] **Faturalarım:** (Bkz. Finans Modülü - Veli Kısmı).
    *   [ ] **Dökümanlar:** Okulun yüklediği sözleşme gibi kişisel veya genel belgeleri görme.
    *   [ ] **Profilim:** Kendi iletişim bilgilerini (telefon, e-posta) güncelleme, şifre değiştirme.
    *   [ ] **Çocuklarım:** Sahip olduğu çocukların listesi, yeni çocuk ekleme talebi (admine).
*   **E. İnteraktif Randevu Sistemi (Veli Kısmı):**
    *   [ ] Öğretmenin uygun takvimini görme ve randevu alma.
    *   [ ] Mevcut randevularını görme, iptal etme (belirli bir süre öncesine kadar).
*   **F. Gelişim Hedefleri ve Ev Ödevleri (Veli Kısmı):**
    *   [ ] Öğretmenden gelen "Haftanın Hedefi"ni görme.
    *   [ ] Hedefi "Tamamlandı" olarak işaretleme ve fotoğraf/not yükleme.
*   **G. İlaç Takip Modülü (Veli Kısmı):**
    *   [ ] Çocuğu için ilaç verme talebi oluşturma (ilaç adı, doz, saat, notlar).
    *   [ ] Öğretmenin ilacı verdiğine dair bildirimi görme.
*   **H. Çocuk Teslim Alma Yetkilendirmesi (Veli Kısmı):**
    *   [ ] Belirli bir gün için çocuğu teslim alacak farklı bir kişiyi (ad, soyad, TC, telefon, fotoğraf) yetkilendirme.
    *   [ ] Yetkilendirme geçmişini görme.
*   **I. "Evde Bu Hafta" Öneri Köşesi:**
    *   [ ] Öğretmenin o haftaki konuyla ilgili önerdiği ev etkinliklerini/kitaplarını görme.
*   **J. Anket ve Geri Bildirim Modülü (Veli Kısmı):**
    *   [ ] Yöneticinin oluşturduğu anketlere katılma.
    *   [ ] Okula genel geri bildirim gönderme formu.
*   **K. Servis ve Ulaşım Takip Modülü (Veli Kısmı):**
    *   [ ] Çocuğunun bindiği servisin anlık konumunu harita üzerinden takip etme.
    *   [ ] "Servis yaklaşıyor", "Çocuk okula ulaştı", "Çocuk servise bindi (eve dönüş)" gibi otomatik bildirimler alma.
    *   [ ] Servis şoförü/hostes bilgilerini görme.

## ⑥. Genel Sistem Özellikleri ve İyileştirmeler

*   **A. Bildirim Sistemi (Kapsamlı):**
    *   [ ] In-app bildirim merkezi (tüm roller için, okunmamış bildirim sayısı göstergesi).
    *   [ ] E-posta bildirimleri (Supabase Auth ve Functions ile).
    *   [ ] Push bildirimleri (Web Push - Supabase Realtime/Functions + FCM).
    *   [ ] Kullanıcıların hangi bildirimleri almak istediklerini seçebileceği ayarlar sayfası.
*   **B. Arama ve Filtreleme:**
    *   [ ] Tüm listeleme sayfalarında (öğrenci, veli, öğretmen, fatura, duyuru vb.) gelişmiş arama ve filtreleme özellikleri.
*   **C. Mobil Uyumluluk ve Responsive Tasarım:**
    *   [ ] Tüm panellerin tablet ve mobil cihazlarda sorunsuz çalışması.
*   **D. Erişilebilirlik (a11y):**
    *   [ ] WCAG standartlarına uygunluk için temel kontroller (renk kontrastı, klavye navigasyonu, ARIA etiketleri).
*   **E. Çok Dilli Destek (Opsiyonel - Başlangıç için Türkçe):**
    *   [ ] i18n kütüphanesi (örn: `react-i18next`) entegrasyonu için altyapı.
*   **F. Güvenlik:**
    *   [ ] Supabase RLS politikalarının tüm tablolarda detaylı bir şekilde uygulanması.
    *   [ ] API isteklerinde yetkilendirme kontrolleri.
    *   [ ] XSS, CSRF gibi temel web zafiyetlerine karşı önlemler.
    *   [ ] Hassas verilerin (örn: API keyleri) güvenli saklanması.
    *   [ ] İki Faktörlü Kimlik Doğrulama (2FA) seçeneği (Supabase Auth destekliyorsa).
*   **G. Performans Optimizasyonları:**
    *   [ ] Veritabanı sorgularının optimizasyonu (indeksleme).
    *   [ ] Resim optimizasyonu (yüklemeden önce sıkıştırma, farklı boyutlarda sunma).
    *   [ ] Lazy loading (React componentleri ve resimler için).
    *   [ ] Kod bölme (Code Splitting).
    *   [ ] Caching stratejileri (hem frontend hem backend tarafında).
*   **H. Testler:**
    *   [ ] Birim testleri (Jest, React Testing Library) - Kritik componentler ve fonksiyonlar için.
    *   [ ] Entegrasyon testleri - Modüller arası etkileşimler için.
    *   [ ] E2E (End-to-End) testleri (Cypress, Playwright) - Ana kullanıcı akışları için (opsiyonel, ileri aşama).
*   **I. Hata Takibi ve Loglama:**
    *   [ ] Frontend ve backend (Supabase Functions) için hata takip sistemi (Sentry vb.) entegrasyonu.
    *   [ ] Önemli olayların loglanması.
*   **J. Dökümantasyon:**
    *   [ ] Kod içi dökümantasyon (JSDoc/TSDoc).
    *   [ ] API dökümantasyonu (Supabase otomatik sağlar, gerekirse ek açıklamalar).
    *   [ ] Kullanıcı kılavuzları (Admin, Öğretmen, Veli için temel kullanım).

## ⑦. Topluluk ve Forum Alanı (Detay)

*   **A. Admin Paneli - Forum Yönetimi:**
    *   [ ] Kategori/Başlık oluşturma (örn: "Genel Sohbet", "Kayıp Eşya", "Sınıf A Duyuruları").
    *   [ ] Moderasyon araçları (mesaj silme, kullanıcı engelleme).
*   **B. Kullanıcı Panelleri (Veli/Öğretmen) - Forum Erişimi:**
    *   [ ] Başlıklara göz atma, yeni konu açma, mevcut konulara cevap yazma.
    *   [ ] Kendi mesajlarını düzenleme/silme.
    *   [ ] Bildirimler (yeni cevap, etiketleme).

## ⑧. Acil Durum Protokolü (Detay)

*   **A. Admin/Öğretmen Paneli - Acil Durum Butonu:**
    *   [ ] "ACİL DURUM" butonu ve onay mekanizması (yanlışlıkla basmayı önlemek için).
    *   [ ] Önceden tanımlanmış acil durum mesaj şablonları seçme veya özel mesaj yazma.
    *   [ ] Hedef kitle seçimi (Tüm okul, belirli sınıflar).
*   **B. Supabase Function - Acil Durum Bildirimi:**
    *   [ ] Tetiklendiğinde seçilen kitleye anında SMS ve Push Bildirimi gönderme.
    *   [ ] E-posta ile de destekleyici bilgi gönderme.
    *   [ ] Gönderim loglarının tutulması.

Bu `TASKLIST.md`, projenin mevcut vizyonunu yansıtan çok daha kapsamlı bir görev listesidir. Her bir ana başlık kendi içinde mini bir proje gibi düşünülebilir. Bu listeyi kullanarak adım adım ilerleyebilir ve tamamlanan görevleri işaretleyebiliriz.
