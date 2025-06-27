# Proje Teknolojileri

Bu döküman, anaokulu yönetim sistemi projesinde kullanılacak ve mevcut durumda kurulu olan teknolojileri listeler.

## Mevcut Kurulu Teknolojiler (Frontend İskeleti)

Bu teknolojiler, projenin `feat/admin-panel-skeleton` branch'inde oluşturulan temel admin paneli iskeletinde zaten mevcuttur ve yapılandırılmıştır.

*   **Programlama Dili:**
    *   **TypeScript:** Statik tip denetimi sağlayarak geliştirme sürecinde hataları azaltır ve kod okunabilirliğini artırır.
*   **Frontend Kütüphanesi/Framework:**
    *   **React.js (v18+):** Kullanıcı arayüzleri oluşturmak için popüler ve güçlü bir JavaScript kütüphanesi.
*   **Build Aracı ve Geliştirme Sunucusu:**
    *   **Vite:** Hızlı geliştirme sunucusu ve optimize edilmiş build süreçleri sunan modern bir frontend aracı.
*   **Styling:**
    *   **Tailwind CSS (v3+):** Utility-first CSS framework'ü ile hızlı ve özelleştirilebilir tasarımlar.
    *   **PostCSS:** Tailwind CSS tarafından kullanılan bir CSS işleme aracı.
*   **UI Bileşen Kütüphanesi:**
    *   **Shadcn/ui:** Yeniden kullanılabilir, erişilebilir ve özelleştirilebilir UI bileşenleri sunar. Temelde Radix UI ve Tailwind CSS üzerine kuruludur.
        *   **Radix UI:** Erişilebilirlik ve işlevsellik odaklı, stilize edilmemiş temel UI bileşenleri sağlar.
*   **Routing (Sayfa Yönlendirme):**
    *   **React Router DOM (v6+):** React uygulamaları için standart sayfa yönlendirme kütüphanesi.
*   **İkonlar:**
    *   **Lucide React:** Açık kaynaklı ve kapsamlı bir ikon seti.
*   **Linting/Formatlama:**
    *   **ESLint:** JavaScript ve TypeScript kod kalitesini ve stilini denetler.
    *   **Prettier (Muhtemelen ESLint ile entegre):** Otomatik kod formatlama sağlar. (Proje dosyalarında `eslint.config.js` mevcut, Prettier yapılandırması da genellikle bununla birlikte gelir.)
*   **Paket Yöneticisi:**
    *   **pnpm:** Hızlı ve disk alanı açısından verimli bir paket yöneticisi (`pnpm-lock.yaml` dosyasından anlaşılıyor).

## Planlanan Ek Teknolojiler ve Servisler (Backend ve Entegrasyonlar)

Bu teknolojiler, projenin tam işlevselliğe kavuşması için eklenecek veya entegre edilecektir.

*   **Backend as a Service (BaaS):**
    *   **Supabase:**
        *   **Veritabanı:** PostgreSQL (İlişkisel veriler, RLS - Row Level Security).
        *   **Kimlik Doğrulama (Authentication):** Kullanıcı yönetimi (Admin, Öğretmen, Veli rolleri), e-posta/şifre ile giriş, şifre sıfırlama.
        *   **Depolama (Storage):** Resimler, videolar, dökümanlar için güvenli dosya depolama.
        *   **Realtime Subscriptions:** Anlık veri güncellemeleri (mesajlaşma, bildirimler, canlı takip).
        *   **Serverless Fonksiyonlar (Edge Functions):** Arka plan işlemleri, webhook yönetimi, otomatik fatura oluşturma, bildirim gönderme gibi özel sunucu tarafı mantıkları için.
*   **Ödeme Entegrasyonu:**
    *   **Iyzico (Iyzilink API):** Türkiye için yerel bir ödeme geçidi. Velilerin online ödeme yapabilmesi için kullanılacak. Supabase fonksiyonları ile webhook entegrasyonu yapılacak.
*   **Form Yönetimi ve Validasyon (Frontend):**
    *   **React Hook Form:** Performanslı ve esnek form yönetimi.
    *   **Zod:** Şema tabanlı veri validasyonu (TypeScript ile mükemmel uyum).
*   **State Management (Frontend - Gerekirse):**
    *   **Zustand veya Jotai (Context API'ye alternatif olarak):** Daha karmaşık global state yönetimi gerektiğinde (örneğin, kullanıcı bilgileri, roller, bildirimler). Başlangıçta React Context API yeterli olabilir.
*   **Push Bildirimleri:**
    *   **Supabase (Realtime/Functions) + Platforma Özgü Servisler (örn: Firebase Cloud Messaging - FCM):** Web ve mobil (ileride düşünülürse) için anlık bildirimler.
*   **Harita ve Konum Servisleri (Servis Takip Modülü için):**
    *   **Leaflet / Mapbox GL JS / Google Maps API (React component'leri ile):** Servislerin canlı takibi için.
*   **Takvim Yönetimi (Etkinlikler, Randevular):**
    *   **FullCalendar / React Big Calendar:** İnteraktif takvimler oluşturmak için.
*   **Grafik ve Raporlama (Gelişim Takibi, Finansal Raporlar):**
    *   **Chart.js (React sarmalayıcıları ile) / Recharts / Nivo:** Verileri görselleştirmek için. (Projede `recharts` zaten mevcut bağımlılıklarda var.)
*   **E-posta Gönderimi:**
    *   **Supabase (Auth içindeki veya özel SMTP ile Functions üzerinden):** Otomatik e-postalar (hoşgeldin, şifre sıfırlama, fatura hatırlatma, duyurular).
*   **SMS Gönderimi (Opsiyonel - Acil Durum, Önemli Bildirimler):**
    *   **Twilio / Vonage (Supabase Functions üzerinden API entegrasyonu):**
*   **Hata Takibi ve Loglama (Opsiyonel ama Önerilir):**
    *   **Sentry / LogRocket:** Üretim ortamındaki hataları yakalamak ve analiz etmek için.

## Hosting ve Deploy

*   **Frontend:**
    *   **Vercel:** React projeleri için optimize edilmiş, kolay deploy ve CI/CD süreçleri sunan platform. (Mevcut proje `vercel.json` ile zaten Vercel'e deploy edilmeye uygun.)
*   **Backend:**
    *   **Supabase Cloud:** Supabase'in kendi hosting platformu.

Bu teknoloji yığını, modern, ölçeklenebilir ve kullanıcı dostu bir anaokulu yönetim sistemi geliştirmek için sağlam bir temel oluşturacaktır.
