-- Migration: Diyet Şablonları Tablolarını Ekle
-- Bu migration diet_templates ve diet_template_meals tablolarını ekler
-- Çalıştırmak için: psql -U your_user -d your_database -f migration-add-diet-templates.sql

-- diet_plan_meals tablosuna day_of_week kolonu ekle (eğer yoksa)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'diet_plan_meals' AND column_name = 'day_of_week'
    ) THEN
        ALTER TABLE diet_plan_meals ADD COLUMN day_of_week INTEGER;
        COMMENT ON COLUMN diet_plan_meals.day_of_week IS '0=Pazar, 1=Pazartesi, ..., 6=Cumartesi (opsiyonel)';
    END IF;
END $$;

-- diet_templates tablosuna pdf_url kolonu ekle (eğer yoksa)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'diet_templates' AND column_name = 'pdf_url'
    ) THEN
        ALTER TABLE diet_templates ADD COLUMN pdf_url TEXT;
        COMMENT ON COLUMN diet_templates.pdf_url IS 'PDF dosyası URL''i (opsiyonel)';
    END IF;
END $$;

-- Diyet Şablonları Tablosu
CREATE TABLE IF NOT EXISTS diet_templates (
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

-- Diyet Şablonu Öğünleri Tablosu
CREATE TABLE IF NOT EXISTS diet_template_meals (
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

-- İndeksler (performans için)
CREATE INDEX IF NOT EXISTS idx_diet_templates_dietitian_id ON diet_templates(dietitian_id);
CREATE INDEX IF NOT EXISTS idx_diet_templates_category ON diet_templates(category);
CREATE INDEX IF NOT EXISTS idx_diet_templates_is_active ON diet_templates(is_active);
CREATE INDEX IF NOT EXISTS idx_diet_template_meals_template_id ON diet_template_meals(diet_template_id);
CREATE INDEX IF NOT EXISTS idx_diet_template_meals_day_of_week ON diet_template_meals(day_of_week);

-- Yorumlar
COMMENT ON TABLE diet_templates IS 'Diyetisyenlerin oluşturduğu profesyonel diyet listesi şablonları';
COMMENT ON TABLE diet_template_meals IS 'Diyet şablonlarının öğün bilgileri';
COMMENT ON COLUMN diet_templates.category IS 'Şablon kategorisi: kilo_verme, kilo_alma, saglikli_beslenme, sporcu_beslenmesi vb.';
COMMENT ON COLUMN diet_templates.total_calories IS 'Şablonun günlük toplam kalori değeri';
COMMENT ON COLUMN diet_templates.duration_days IS 'Şablonun kaç günlük olduğu (örn: 7, 14, 30)';
COMMENT ON COLUMN diet_template_meals.meal_time IS 'Öğün zamanı: kahvalti, ogle_yemegi, aksam_yemegi, atistirma vb.';
COMMENT ON COLUMN diet_template_meals.foods IS 'JSONB formatında yiyecek listesi';
COMMENT ON COLUMN diet_template_meals.day_of_week IS 'Haftanın hangi günü için geçerli (NULL = her gün aynı)';

-- Migration tamamlandı
SELECT 'Migration completed successfully: diet_templates tables added' AS status;

