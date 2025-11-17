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
    name VARCHAR(50) NOT NULL CHECK (name IN ('pro', 'premium')),
    duration VARCHAR(20) NOT NULL CHECK (duration IN ('monthly', 'yearly')),
    price DECIMAL(10, 2) NOT NULL,
    original_price DECIMAL(10, 2), -- Yıllık planlar için orijinal fiyat (indirim öncesi)
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
INSERT INTO plans (name, duration, price, original_price) VALUES
    ('pro', 'monthly', 199.00, NULL),
    ('pro', 'yearly', 1910.40, 2388.00), -- 199 * 12 * 0.8 = 1910.40 (20% indirim)
    ('premium', 'monthly', 289.00, NULL),
    ('premium', 'yearly', 2774.40, 3468.00); -- 289 * 12 * 0.8 = 2774.40 (20% indirim)

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
