# Diyet Şablonları API Dokümantasyonu

Bu dokümantasyon, diyetisyenlerin profesyonel diyet listeleri oluşturması ve bunları danışanlarına ataması için geliştirilmiş API endpoint'lerini açıklar.

## 📋 Genel Bakış

Diyet şablonları sistemi, diyetisyenlerin:
- Profesyonel diyet listeleri oluşturmasına
- Bu listeleri kategorize etmesine
- Şablonlara öğünler eklemesine
- Şablonları birden fazla danışana atamasına olanak sağlar

## 🗄️ Veritabanı Yapısı

### Tablolar
- `diet_templates`: Diyet şablonları
- `diet_template_meals`: Şablon öğünleri

### Migration
Yeni tabloları eklemek için migration script'ini çalıştırın:
```bash
psql -U your_user -d your_database -f backend/db/migration-add-diet-templates.sql
```

## 🔐 Authentication

Tüm endpoint'ler `verifyToken` middleware'i gerektirir. Request header'ında token gönderilmelidir:
```
Authorization: Bearer <token>
```

## 📡 API Endpoints

### 1. Şablon Oluşturma

**POST** `/api/diet-templates`

Yeni bir diyet şablonu oluşturur.

**Request Body:**
```json
{
  "title": "Kilo Verme Programı - 1200 Kalori",
  "description": "Sağlıklı kilo verme için dengeli beslenme programı",
  "category": "kilo_verme",
  "total_calories": 1200,
  "duration_days": 30,
  "is_active": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Diyet şablonu başarıyla oluşturuldu",
  "template": {
    "id": "uuid",
    "dietitian_id": "uuid",
    "title": "Kilo Verme Programı - 1200 Kalori",
    "description": "...",
    "category": "kilo_verme",
    "total_calories": 1200,
    "duration_days": 30,
    "is_active": true,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

---

### 2. Şablonları Listeleme

**GET** `/api/diet-templates`

Diyetisyenin tüm şablonlarını listeler.

**Query Parameters:**
- `category` (optional): Kategoriye göre filtreleme
- `is_active` (optional): Aktif/pasif şablonları filtreleme (`true`/`false`)
- `search` (optional): Başlık veya açıklamada arama

**Example:**
```
GET /api/diet-templates?category=kilo_verme&is_active=true&search=kalori
```

**Response:**
```json
{
  "success": true,
  "templates": [
    {
      "id": "uuid",
      "title": "Kilo Verme Programı",
      "category": "kilo_verme",
      "meal_count": 21,
      ...
    }
  ]
}
```

---

### 3. Şablon Detayı

**GET** `/api/diet-templates/:id`

Şablonun detayını ve öğünlerini getirir.

**Response:**
```json
{
  "success": true,
  "template": {
    "id": "uuid",
    "title": "Kilo Verme Programı",
    "meals": [
      {
        "id": "uuid",
        "meal_time": "kahvalti",
        "foods": [
          {
            "name": "Yumurta",
            "amount": "2 adet",
            "calories": 140
          },
          {
            "name": "Tam buğday ekmeği",
            "amount": "1 dilim",
            "calories": 80
          }
        ],
        "calories": 220,
        "day_of_week": null,
        "notes": "Protein açısından zengin kahvaltı"
      }
    ]
  }
}
```

---

### 4. Şablon Güncelleme

**PUT** `/api/diet-templates/:id`

Şablon bilgilerini günceller.

**Request Body:**
```json
{
  "title": "Güncellenmiş Başlık",
  "is_active": false
}
```

---

### 5. Şablon Silme

**DELETE** `/api/diet-templates/:id`

Şablonu ve tüm öğünlerini siler.

---

### 6. Şablona Öğün Ekleme

**POST** `/api/diet-templates/:templateId/meals`

Şablona yeni bir öğün ekler.

**Request Body:**
```json
{
  "meal_time": "kahvalti",
  "foods": [
    {
      "name": "Yumurta",
      "amount": "2 adet",
      "calories": 140
    },
    {
      "name": "Tam buğday ekmeği",
      "amount": "1 dilim",
      "calories": 80
    },
    {
      "name": "Zeytin",
      "amount": "5 adet",
      "calories": 50
    }
  ],
  "calories": 270,
  "day_of_week": null,
  "notes": "Protein ve lif açısından zengin kahvaltı"
}
```

**Notlar:**
- `meal_time`: `kahvalti`, `ogle_yemegi`, `aksam_yemegi`, `atistirma` vb.
- `day_of_week`: `null` = her gün aynı, `0-6` = haftanın belirli bir günü (0=Pazar)
- `foods`: JSONB array formatında yiyecek listesi

---

### 7. Şablon Öğününü Güncelleme

**PUT** `/api/diet-templates/meals/:mealId`

Şablon öğününü günceller.

---

### 8. Şablon Öğününü Silme

**DELETE** `/api/diet-templates/meals/:mealId`

Şablon öğününü siler.

---

### 9. Şablonu Danışanlara Atama ⭐

**POST** `/api/diet-templates/:templateId/assign`

Şablonu bir veya birden fazla danışana atar. Bu işlem şablonu kopyalayarak her danışan için ayrı bir `diet_plan` oluşturur.

**Request Body:**
```json
{
  "client_ids": [
    "client-uuid-1",
    "client-uuid-2",
    "client-uuid-3"
  ],
  "title": "Özel Başlık (opsiyonel)",
  "description": "Özel açıklama (opsiyonel)",
  "start_date": "2024-01-01",
  "end_date": "2024-01-31"
}
```

**Response:**
```json
{
  "success": true,
  "message": "3 danışana şablon başarıyla atandı",
  "assigned_plans": [
    {
      "client_id": "uuid",
      "client_name": "Ahmet Yılmaz",
      "plan_id": "uuid",
      "plan_title": "Kilo Verme Programı"
    },
    ...
  ]
}
```

**Önemli Notlar:**
- Şablonun en az bir öğünü olmalıdır
- Tüm client ID'leri geçerli ve diyetisyene ait olmalıdır
- Her danışan için ayrı bir `diet_plan` oluşturulur
- Şablon öğünleri `diet_plan_meals` tablosuna kopyalanır

---

## 📝 Kategori Örnekleri

- `kilo_verme`: Kilo verme programları
- `kilo_alma`: Kilo alma programları
- `saglikli_beslenme`: Genel sağlıklı beslenme
- `sporcu_beslenmesi`: Sporcu beslenme programları
- `diyabet`: Diyabet hastaları için özel programlar
- `vegan`: Vegan beslenme programları
- `ketojenik`: Ketojenik diyet programları

## 🎯 Kullanım Senaryosu

1. **Şablon Oluştur**: Diyetisyen yeni bir şablon oluşturur
2. **Öğünler Ekle**: Şablona günlük öğünleri ekler (kahvaltı, öğle, akşam, atıştırmalık)
3. **Şablonu Kaydet**: Şablon hazır hale gelir
4. **Danışanlara Ata**: Şablonu birden fazla danışana tek seferde atar
5. **Takip Et**: Her danışan için ayrı oluşturulan planları takip eder

## 🔄 İş Akışı

```
Diyetisyen
    ↓
Şablon Oluştur (diet_templates)
    ↓
Öğünler Ekle (diet_template_meals)
    ↓
Şablonu Danışanlara Ata
    ↓
Her Danışan İçin:
    - diet_plans tablosuna yeni plan
    - diet_plan_meals tablosuna öğünler kopyalanır
```

## ⚠️ Hata Durumları

- `404`: Şablon bulunamadı
- `400`: Geçersiz veri veya şablonun öğünleri yok
- `403`: Yetki hatası (şablon başka diyetisyene ait)
- `500`: Sunucu hatası

## 📚 İlgili Endpoint'ler

- `/api/clients/:clientId/diet-plans` - Danışanın diyet planlarını görüntüleme
- `/api/diet-plan-meals` - Diyet planı öğünlerini yönetme

