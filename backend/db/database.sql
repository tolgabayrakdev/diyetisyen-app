CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Kullanıcılar
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    is_verified BOOLEAN DEFAULT false,
    is_email_verified BOOLEAN DEFAULT false,
    is_sms_verified BOOLEAN DEFAULT false,
    email_verify_token VARCHAR(255),
    email_verify_token_created_at TIMESTAMP,
    email_verify_code VARCHAR(6),
    email_verify_code_created_at TIMESTAMP,
    sms_verify_code VARCHAR(6),
    sms_verify_code_created_at TIMESTAMP,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

-- Şifre sıfırlama token'ları
CREATE TABLE password_reset_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT now()
);

-- Planlar
CREATE TABLE plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL CHECK (name IN ('standard', 'pro')),
    duration VARCHAR(20) NOT NULL CHECK (duration IN ('monthly', 'yearly')),
    price DECIMAL(10, 2) NOT NULL,
    original_price DECIMAL(10, 2), -- Yıllık planlar için orijinal fiyat (indirim öncesi)
    client_limit INTEGER, -- NULL = sınırsız, sayı = limit
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now(),
    UNIQUE(name, duration)
);

-- Abonelikler
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    plan_id UUID REFERENCES plans(id) ON DELETE RESTRICT, -- NULL olabilir (trial için)
    status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired')),
    is_trial BOOLEAN DEFAULT false,
    trial_end_date TIMESTAMP,
    start_date TIMESTAMP NOT NULL DEFAULT now(),
    end_date TIMESTAMP,
    payment_method VARCHAR(50),
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

-- Plan verilerini ekle
INSERT INTO plans (name, duration, price, original_price, client_limit) VALUES
    ('standard', 'monthly', 299.00, NULL, 100), -- Standard: 100 danışan limiti
    ('standard', 'yearly', 2870.40, 3588.00, 100), -- 299 * 12 * 0.8 = 2870.40 (20% indirim)
    ('pro', 'monthly', 399.00, NULL, NULL), -- Pro: Sınırsız danışan (NULL = sınırsız)
    ('pro', 'yearly', 3830.40, 4788.00, NULL); -- 399 * 12 * 0.8 = 3830.40 (20% indirim)




-- 1️⃣ Danışanlar
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dietitian_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    birth_date DATE,
    gender VARCHAR(10),
    height_cm NUMERIC,
    weight_kg NUMERIC,
    chronic_conditions TEXT,
    allergies TEXT,
    medications TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 2️⃣ Danışan Belgeleri
CREATE TABLE client_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    file_url TEXT NOT NULL,
    file_type VARCHAR(50),
    description TEXT,
    uploaded_at TIMESTAMP DEFAULT NOW()
);

-- 3️⃣ Diyet Planları
CREATE TABLE diet_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 4️⃣ Diyet Planı Öğünleri
CREATE TABLE diet_plan_meals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    diet_plan_id UUID NOT NULL REFERENCES diet_plans(id) ON DELETE CASCADE,
    meal_time VARCHAR(50),
    foods JSONB,
    calories NUMERIC,
    day_of_week INTEGER, -- 0=Pazar, 1=Pazartesi, ..., 6=Cumartesi (opsiyonel)
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 4️⃣.1 Diyet Şablonları (Diyetisyenlerin oluşturduğu profesyonel diyet listeleri)
CREATE TABLE diet_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dietitian_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100), -- Örn: 'kilo_verme', 'kilo_alma', 'saglikli_beslenme', 'sporcu_beslenmesi'
    total_calories NUMERIC, -- Günlük toplam kalori
    duration_days INTEGER, -- Şablonun kaç günlük olduğu (örn: 7, 14, 30)
    pdf_url TEXT, -- PDF dosyası URL'i (opsiyonel)
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 4️⃣.2 Diyet Şablonu Öğünleri
CREATE TABLE diet_template_meals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    diet_template_id UUID NOT NULL REFERENCES diet_templates(id) ON DELETE CASCADE,
    meal_time VARCHAR(50) NOT NULL, -- Örn: 'kahvalti', 'ogle_yemegi', 'aksam_yemegi', 'atistirma'
    foods JSONB NOT NULL, -- Yiyecek listesi: [{"name": "Yumurta", "amount": "2 adet", "calories": 140}, ...]
    calories NUMERIC,
    day_of_week INTEGER, -- 0=Pazar, 1=Pazartesi, ..., 6=Cumartesi (NULL = her gün aynı)
    notes TEXT, -- Özel notlar
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 5️⃣ Danışan Notları
CREATE TABLE client_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    note_type VARCHAR(50),
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 6️⃣ Finansal Kayıtlar
CREATE TABLE financial_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    amount NUMERIC NOT NULL,
    currency VARCHAR(10) DEFAULT 'TRY',
    payment_date DATE,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending','paid','overdue')),
    payment_method VARCHAR(50),
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 7️⃣ İlerleme Kayıtları
CREATE TABLE progress_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    log_date DATE DEFAULT NOW(),
    weight_kg NUMERIC,
    body_fat_percent NUMERIC,
    muscle_mass_kg NUMERIC,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 8️⃣ Aktivite / Audit Logları
CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
    user_id UUID NOT NULL REFERENCES users(id),
    entity_type VARCHAR(50),    -- Örn: 'diet_plan', 'note', 'financial_record'
    action_type VARCHAR(50),    -- Örn: 'create', 'update', 'delete'
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Seed Data: 100 Örnek Danışan
-- NOT: Bu script'i çalıştırmadan önce bir diyetisyen kullanıcısı oluşturmanız gerekiyor
-- Ayrı seed dosyası için: backend/db/seed-clients.sql dosyasına bakın
