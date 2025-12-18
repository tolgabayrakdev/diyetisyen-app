# Diyetisyen Yönetim Uygulaması

Modern ve kapsamlı bir diyetisyen yönetim platformu. Diyetisyenlerin danışanlarını yönetmelerine, diyet planları oluşturmalarına, ilerlemeyi takip etmelerine ve işletmelerini yönetmelerine olanak sağlar.

## 📋 İçindekiler

- [Özellikler](#özellikler)
- [Teknoloji Stack](#teknoloji-stack)
- [Proje Yapısı](#proje-yapısı)
- [Kurulum](#kurulum)
- [Yapılandırma](#yapılandırma)
- [Kullanım](#kullanım)
- [API Dokümantasyonu](#api-dokümantasyonu)
- [Güvenlik](#güvenlik)
- [Production Deployment](#production-deployment)
- [Katkıda Bulunma](#katkıda-bulunma)

## ✨ Özellikler

### 🔐 Kimlik Doğrulama ve Güvenlik
- Email ve SMS ile çift faktörlü doğrulama
- JWT tabanlı kimlik doğrulama
- Şifre sıfırlama sistemi
- Rate limiting ve güvenlik middleware'leri
- HTTPOnly cookie'ler ile XSS koruması

### 👥 Danışan Yönetimi
- Danışan ekleme, düzenleme ve silme
- Detaylı danışan profilleri (yaş, cinsiyet, boy, kilo, kronik hastalıklar, alerjiler)
- Danışan notları ve görüşme kayıtları
- Danışan arama ve filtreleme

### 📊 Diyet Planı Yönetimi
- Özelleştirilebilir diyet planları oluşturma
- Günlük öğün planlaması (kahvaltı, öğle, akşam, ara öğünler)
- Besin veritabanı entegrasyonu
- Plan şablonları ve kopyalama
- Plan geçmişi ve versiyon takibi

### 📈 İlerleme Takibi
- Kilo, vücut yağ oranı, kas kütlesi takibi
- Görsel grafikler ve istatistikler
- AI destekli ilerleme analizi (Groq API)
- Haftalık ve aylık raporlar
- Otomatik ilerleme yorumları

### 🤖 AI Özellikleri
- Kilo değişimi özeti (AI destekli)
- Haftalık ilerleme yorumları
- Groq API entegrasyonu

### 💰 Finansal Yönetim
- Danışan bazlı gelir takibi
- Ödeme kayıtları
- Finansal raporlar ve istatistikler
- Abonelik yönetimi

### 💳 Abonelik ve Ödeme
- PayTR entegrasyonu ile ödeme sistemi
- Standart ve Pro plan seçenekleri
- Aylık ve yıllık abonelik seçenekleri
- Deneme süresi (trial) desteği
- Otomatik abonelik yönetimi

### 🍎 Besin Veritabanı
- Kapsamlı besin veritabanı
- Besin kategorileri
- Kalori ve makro besin bilgileri
- Besin arama ve filtreleme

### 📊 İstatistikler ve Raporlama
- Dashboard istatistikleri
- Danışan sayısı ve büyüme grafikleri
- Gelir istatistikleri
- Aktivite logları

### 🧮 Hesaplayıcılar
- BMI (Vücut Kitle İndeksi) hesaplama
- Günlük kalori ihtiyacı hesaplama
- Makro besin hesaplamaları

### 💬 Geri Bildirim Sistemi
- Kullanıcı geri bildirimleri
- Destek talepleri
- İyileştirme önerileri

### 📱 Modern UI/UX
- Responsive tasarım
- Dark/Light tema desteği
- Drag & drop özellikleri
- Kullanıcı dostu arayüz
- Animasyonlar ve geçişler

## 🛠 Teknoloji Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **PostgreSQL** - Veritabanı
- **JWT** - Kimlik doğrulama
- **bcrypt** - Şifre hashleme
- **Cloudinary** - Dosya yükleme ve görsel yönetimi
- **Nodemailer** - Email gönderimi
- **NetGSM** - SMS gönderimi
- **Winston** - Logging
- **PayTR** - Ödeme entegrasyonu
- **Groq API** - AI özellikleri

### Frontend (Web)
- **React 19** - UI kütüphanesi
- **TypeScript** - Tip güvenliği
- **Vite** - Build tool
- **React Router** - Routing
- **Tailwind CSS** - Styling
- **Radix UI** - UI bileşenleri
- **Recharts** - Grafik kütüphanesi
- **TipTap** - Rich text editor
- **Lucide React** - İkonlar

### Landing Page
- **Next.js 16** - React framework
- **TypeScript** - Tip güvenliği
- **Tailwind CSS** - Styling
- **Framer Motion** - Animasyonlar

### Veritabanı
- **PostgreSQL** - İlişkisel veritabanı
- **Docker** - Containerization

## 📁 Proje Yapısı

```
diyetisyen-app/
├── backend/                 # Backend API
│   ├── src/
│   │   ├── app.js          # Ana uygulama dosyası
│   │   ├── config/         # Yapılandırma dosyaları
│   │   ├── controller/     # Controller'lar
│   │   ├── service/        # Business logic
│   │   ├── routes/         # API route'ları
│   │   ├── middleware/     # Middleware'ler
│   │   ├── util/           # Yardımcı fonksiyonlar
│   │   └── exceptions/     # Exception sınıfları
│   ├── db/                 # Veritabanı şemaları ve seed dosyaları
│   └── package.json
│
├── web/                     # Frontend React uygulaması
│   ├── src/
│   │   ├── pages/          # Sayfa bileşenleri
│   │   ├── components/     # UI bileşenleri
│   │   ├── contexts/       # React context'ler
│   │   ├── hooks/          # Custom hook'lar
│   │   ├── lib/            # Yardımcı kütüphaneler
│   │   ├── router/         # Routing yapılandırması
│   │   └── types/          # TypeScript type tanımları
│   └── package.json
│
├── landing/                 # Landing page (Next.js)
│   ├── app/                # Next.js app directory
│   ├── content/            # Blog içerikleri
│   └── package.json
│
├── docker-compose.yml       # Docker yapılandırması
└── README.md               # Bu dosya
```

## 🚀 Kurulum

### Gereksinimler

- Node.js (v18 veya üzeri)
- PostgreSQL (v14 veya üzeri)
- npm veya yarn
- Docker (opsiyonel, PostgreSQL için)

### Adım 1: Repository'yi Klonlayın

```bash
git clone <repository-url>
cd diyetisyen-app
```

### Adım 2: PostgreSQL Veritabanını Başlatın

Docker kullanarak:

```bash
docker-compose up -d
```

Veya manuel olarak PostgreSQL kurulumu yapabilirsiniz.

### Adım 3: Backend Kurulumu

```bash
cd backend
npm install
```

### Adım 4: Frontend Kurulumu

```bash
cd ../web
npm install
```

### Adım 5: Landing Page Kurulumu

```bash
cd ../landing
npm install
```

## ⚙️ Yapılandırma

### Backend Environment Variables

`backend/.env` dosyası oluşturun:

```env
# Veritabanı
DB_HOST=localhost
DB_PORT=5435
DB_USER=root5
DB_PASSWORD=root5
DB_DATABASE=db5

# JWT
JWT_SECRET_KEY=your-super-secret-jwt-key-min-32-chars
JWT_EXPIRES_IN=7d

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Email Ayarları (Nodemailer)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587

# SMS Ayarları (NetGSM)
NETGSM_NUMBER=your-netgsm-number
NETGSM_PASSWORD=your-netgsm-password
NETGSM_USERNAME=your-netgsm-username

# Cloudinary (Dosya Yükleme)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# PayTR Ödeme Sistemi
PAYTR_MERCHANT_ID=your-merchant-id
PAYTR_MERCHANT_KEY=your-merchant-key
PAYTR_MERCHANT_SALT=your-merchant-salt
PAYTR_TEST_MODE=1

# AI (Groq API)
GROQ_API_KEY=your-groq-api-key

# Server
PORT=1234
NODE_ENV=development
```

### Veritabanı Kurulumu

```bash
cd backend/db
psql -U root5 -d db5 -f database.sql
```

Seed verilerini yüklemek için (opsiyonel):

```bash
psql -U root5 -d db5 -f seed-foods.sql
psql -U root5 -d db5 -f seed-clients.sql
```

## 🎯 Kullanım

### Development Modunda Çalıştırma

#### Backend

```bash
cd backend
npm run dev
```

Backend `http://localhost:1234` adresinde çalışacaktır.

#### Frontend

```bash
cd web
npm run dev
```

Frontend `http://localhost:5173` adresinde çalışacaktır.

#### Landing Page

```bash
cd landing
npm run dev
```

Landing page `http://localhost:3000` adresinde çalışacaktır.

### Production Build

#### Backend

```bash
cd backend
npm install --production
NODE_ENV=production npm start
```

#### Frontend

```bash
cd web
npm run build
npm run preview
```

#### Landing Page

```bash
cd landing
npm run build
npm start
```

## 📚 API Dokümantasyonu

### Authentication Endpoints

- `POST /api/auth/register` - Kullanıcı kaydı
- `POST /api/auth/login` - Giriş yapma
- `POST /api/auth/logout` - Çıkış yapma
- `GET /api/auth/me` - Kullanıcı bilgilerini getir
- `POST /api/auth/verify-email-otp` - Email doğrulama
- `POST /api/auth/verify-sms-otp` - SMS doğrulama
- `POST /api/auth/forgot-password` - Şifre sıfırlama talebi
- `POST /api/auth/reset-password` - Şifre sıfırlama

### Client Endpoints

- `GET /api/clients` - Tüm danışanları listele
- `POST /api/clients` - Yeni danışan ekle
- `GET /api/clients/:id` - Danışan detayı
- `PUT /api/clients/:id` - Danışan güncelle
- `DELETE /api/clients/:id` - Danışan sil

### Diet Plan Endpoints

- `GET /api/clients/:clientId/diet-plans` - Danışan diyet planları
- `POST /api/clients/:clientId/diet-plans` - Yeni diyet planı oluştur
- `GET /api/diet-plans/:id` - Diyet planı detayı
- `PUT /api/diet-plans/:id` - Diyet planı güncelle
- `DELETE /api/diet-plans/:id` - Diyet planı sil

### Progress Log Endpoints

- `GET /api/clients/:clientId/progress-logs` - İlerleme kayıtları
- `POST /api/clients/:clientId/progress-logs` - Yeni ilerleme kaydı
- `PUT /api/progress-logs/:id` - İlerleme kaydı güncelle
- `DELETE /api/progress-logs/:id` - İlerleme kaydı sil

### AI Endpoints

- `GET /api/clients/:clientId/ai/weight-summary` - AI kilo özeti
- `GET /api/clients/:clientId/ai/weekly-comment` - AI haftalık yorum

### Payment Endpoints

- `POST /api/payment/paytr-token` - PayTR token oluştur
- `POST /api/payment/paytr-callback` - PayTR callback işle

### Diğer Endpoints

- `GET /health` - Health check
- `GET /api/foods` - Besin listesi
- `GET /api/statistics` - İstatistikler
- `GET /api/calculator/*` - Hesaplayıcılar

Tüm endpoint'ler için detaylı dokümantasyon için API route dosyalarına bakabilirsiniz.

## 🔒 Güvenlik

### Uygulanan Güvenlik Önlemleri

- ✅ **SQL Injection Koruması**: Tüm sorgular parameterized queries kullanıyor
- ✅ **Rate Limiting**: API istekleri için rate limiting aktif
- ✅ **Request Timeout**: 30 saniye timeout ile backend çökmesi önleniyor
- ✅ **JWT Authentication**: Token-based authentication sistemi
- ✅ **Password Hashing**: bcrypt ile şifre hashleme
- ✅ **HTTPOnly Cookies**: XSS saldırılarına karşı koruma
- ✅ **Secure Cookies**: HTTPS için secure flag
- ✅ **CORS Protection**: Frontend URL kontrolü
- ✅ **Environment Variable Validation**: Production'da eksik değişkenler için uygulama başlamıyor
- ✅ **Error Handling**: Production'da sensitive bilgi sızıntısı önleniyor

### Production Güvenlik Checklist

- [ ] HTTPS kullanımı aktif
- [ ] SSL/TLS sertifikası kuruldu
- [ ] Environment variable'lar güvenli bir şekilde saklanıyor
- [ ] Database backup stratejisi oluşturuldu
- [ ] Monitoring ve alerting kuruldu
- [ ] Log rotation yapılandırıldı
- [ ] Rate limiting ayarları optimize edildi
- [ ] Security audit yapıldı

## 🚢 Production Deployment

### Ön Hazırlık

1. **Environment Variables**: Tüm environment variable'ları production değerleriyle ayarlayın
2. **Database**: Production veritabanını oluşturun ve migration'ları çalıştırın
3. **SSL/TLS**: SSL sertifikası kurun (Let's Encrypt veya başka bir sağlayıcı)
4. **Domain**: Domain adresinizi yapılandırın

### Deployment Adımları

1. **Backend Deployment**
   ```bash
   cd backend
   npm install --production
   NODE_ENV=production npm start
   ```

2. **Frontend Build**
   ```bash
   cd web
   npm run build
   # Build çıktısını web sunucunuza deploy edin
   ```

3. **Landing Page Build**
   ```bash
   cd landing
   npm run build
   npm start
   ```

### Monitoring

- Health check endpoint: `GET /health`
- Log monitoring: Winston logger kullanılıyor
- Error tracking: Sentry veya benzeri bir servis önerilir

Detaylı production hazırlık bilgileri için `backend/PRODUCTION-READINESS.md` dosyasına bakabilirsiniz.

## 📝 Önemli Notlar

### PayTR Entegrasyonu

PayTR ödeme entegrasyonu için detaylı kurulum bilgileri `PAYTR_SETUP.md` dosyasında bulunmaktadır.

### AI Özellikleri

AI özellikleri Groq API kullanmaktadır. Ücretsiz bir API key almak için [Groq Console](https://console.groq.com/) adresini ziyaret edebilirsiniz.

### Veritabanı

PostgreSQL veritabanı şeması `backend/db/database.sql` dosyasında tanımlanmıştır. Seed dosyaları ile örnek veriler yüklenebilir.

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit edin (`git commit -m 'Add some amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📄 Lisans

Bu proje özel bir projedir. Tüm hakları saklıdır.

## 📞 İletişim

Sorularınız veya önerileriniz için issue açabilirsiniz.

---

**Not**: Bu dokümantasyon sürekli güncellenmektedir. Son güncellemeler için repository'yi kontrol edin.
