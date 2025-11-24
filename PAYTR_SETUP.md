# PayTR Ödeme Entegrasyonu Kurulum Rehberi

Bu dokümantasyon, DiyetKa projesine PayTR iFrame API entegrasyonunun nasıl yapıldığını açıklar.

## Gereksinimler

1. PayTR mağaza hesabı
2. PayTR'den alınan Merchant ID, Merchant Key ve Merchant Salt bilgileri

## Environment Variables

Backend `.env` dosyasına aşağıdaki değişkenleri ekleyin:

```env
# PayTR Ödeme Ayarları
PAYTR_MERCHANT_ID=your_merchant_id
PAYTR_MERCHANT_KEY=your_merchant_key
PAYTR_MERCHANT_SALT=your_merchant_salt
PAYTR_TEST_MODE=1  # Test modu için 1, canlı mod için 0

# Frontend URL (PayTR callback için)
FRONTEND_URL=http://localhost:5173  # Development
# FRONTEND_URL=https://yourdomain.com  # Production
```

## Kurulum Adımları

### 1. Database Migration

Database'e `payment_transactions` tablosu eklendi. Migration çalıştırın:

```sql
-- Ödeme İşlemleri (PayTR için)
CREATE TABLE payment_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    plan_id UUID REFERENCES plans(id) ON DELETE RESTRICT,
    merchant_oid VARCHAR(255) UNIQUE NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'TL',
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
    payment_method VARCHAR(50) DEFAULT 'paytr',
    payment_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);
```

### 2. Backend Endpoints

- **POST `/api/payment/paytr-token`**: PayTR token oluşturma (giriş gerekli)
- **POST `/api/payment/paytr-callback`**: PayTR callback işleme (giriş gerekmez)

### 3. Frontend Sayfaları

- `/subscription/payment`: PayTR iFrame ile ödeme sayfası
- `/payment/success`: Ödeme başarılı sayfası
- `/payment/fail`: Ödeme başarısız sayfası

## Ödeme Akışı

1. Kullanıcı plan seçer (`/subscription`)
2. Ödeme sayfasına yönlendirilir (`/subscription/payment?planId=xxx`)
3. Backend'den PayTR token alınır
4. PayTR iFrame gösterilir
5. Kullanıcı ödeme yapar
6. PayTR callback'i backend'e gönderilir
7. Subscription oluşturulur
8. Kullanıcı success/fail sayfasına yönlendirilir

## Test Modu

Test modunda PayTR test kartları kullanılabilir:
- Kart No: `4355 0814 3508 4358`
- CVV: `000`
- Son Kullanma: Gelecek bir tarih

## Güvenlik

- Hash doğrulama: Callback'de PayTR'den gelen hash değeri doğrulanır
- IP kontrolü: Token oluştururken kullanıcı IP'si PayTR'ye gönderilir
- Merchant OID: Her ödeme için benzersiz sipariş numarası oluşturulur

## Sorun Giderme

1. **Token alınamıyor**: 
   - Environment variables'ları kontrol edin
   - IP adresinin doğru gönderildiğinden emin olun
   - PayTR panelinden API erişimini kontrol edin

2. **Callback çalışmıyor**:
   - PayTR panelinde callback URL'ini kontrol edin: `https://yourdomain.com/api/payment/paytr-callback`
   - Callback route'unun rate limit dışında olduğundan emin olun

3. **Subscription oluşturulmuyor**:
   - Database'de `payment_transactions` tablosunun olduğundan emin olun
   - Callback loglarını kontrol edin

## Kaynaklar

- [PayTR iFrame API Dokümantasyonu](https://dev.paytr.com/iframe-api/iframe-api-1-adim)
- [PayTR iFrame API 2. Adım](https://dev.paytr.com/iframe-api/iframe-api-2-adim)

