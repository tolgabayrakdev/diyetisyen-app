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
    original_price DECIMAL(10, 2),
    client_limit INTEGER,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now(),
    UNIQUE(name, duration)
);

-- Abonelikler
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    plan_id UUID REFERENCES plans(id) ON DELETE RESTRICT,
    status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired')),
    is_trial BOOLEAN DEFAULT false,
    trial_end_date TIMESTAMP,
    start_date TIMESTAMP NOT NULL DEFAULT now(),
    end_date TIMESTAMP,
    payment_method VARCHAR(50),
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

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

-- Plan verilerini ekle
INSERT INTO plans (name, duration, price, original_price, client_limit) VALUES
    ('standard', 'monthly', 299.00, NULL, 100),
    ('standard', 'yearly', 2870.40, 3588.00, 100),
    ('pro', 'monthly', 399.00, NULL, NULL),
    ('pro', 'yearly', 3830.40, 4788.00, NULL);

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

-- 2️⃣ Diyet Planları
CREATE TABLE diet_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    content TEXT,
    start_date DATE,
    end_date DATE,
    pdf_url TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 3️⃣ Danışan Notları
CREATE TABLE client_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    note_type VARCHAR(50),
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 4️⃣ Finansal Kayıtlar
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

-- 5️⃣ İlerleme Kayıtları
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

-- 6️⃣ Aktivite / Audit Logları
CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
    user_id UUID NOT NULL REFERENCES users(id),
    entity_type VARCHAR(50),
    action_type VARCHAR(50),
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 7️⃣ Besin Kategorileri
CREATE TABLE food_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dietitian_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(50), -- Icon adı (örn: "Apple", "Wheat")
    color VARCHAR(50), -- Renk kodu (örn: "text-green-600")
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(dietitian_id, name)
);

-- 8️⃣ Besinler
CREATE TABLE foods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dietitian_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id UUID REFERENCES food_categories(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    unit VARCHAR(50) DEFAULT '100g', -- Birim (100g, 1 adet, 1 porsiyon, vb.)
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(dietitian_id, name)
);

-- 9️⃣ Besin Değerleri (Nutrition Facts)
CREATE TABLE food_nutrients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    food_id UUID NOT NULL REFERENCES foods(id) ON DELETE CASCADE,
    -- Enerji
    energy_kcal NUMERIC(10, 2),
    energy_kj NUMERIC(10, 2),
    -- Makro besinler
    protein_g NUMERIC(10, 2),
    carbohydrates_g NUMERIC(10, 2),
    fat_g NUMERIC(10, 2),
    saturated_fat_g NUMERIC(10, 2),
    trans_fat_g NUMERIC(10, 2),
    fiber_g NUMERIC(10, 2),
    sugar_g NUMERIC(10, 2),
    -- Mineraller
    sodium_mg NUMERIC(10, 2),
    salt_g NUMERIC(10, 2),
    potassium_mg NUMERIC(10, 2),
    calcium_mg NUMERIC(10, 2),
    iron_mg NUMERIC(10, 2),
    magnesium_mg NUMERIC(10, 2),
    phosphorus_mg NUMERIC(10, 2),
    zinc_mg NUMERIC(10, 2),
    -- Vitaminler
    vitamin_a_mcg NUMERIC(10, 2),
    vitamin_c_mg NUMERIC(10, 2),
    vitamin_d_mcg NUMERIC(10, 2),
    vitamin_e_mg NUMERIC(10, 2),
    vitamin_k_mcg NUMERIC(10, 2),
    thiamin_mg NUMERIC(10, 2), -- B1
    riboflavin_mg NUMERIC(10, 2), -- B2
    niacin_mg NUMERIC(10, 2), -- B3
    vitamin_b6_mg NUMERIC(10, 2),
    folate_mcg NUMERIC(10, 2), -- B9
    vitamin_b12_mcg NUMERIC(10, 2),
    biotin_mcg NUMERIC(10, 2),
    pantothenic_acid_mg NUMERIC(10, 2), -- B5
    -- Diğer
    cholesterol_mg NUMERIC(10, 2),
    caffeine_mg NUMERIC(10, 2),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(food_id)
);
