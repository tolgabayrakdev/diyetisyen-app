-- Seed Data: Besin Veritabanı
-- 
-- Kullanım:
-- psql -U postgres -d your_database -f backend/db/seed-foods.sql
-- veya
-- psql içinde: \i backend/db/seed-foods.sql

-- Diyetisyen UUID'si (seed-clients.sql ile aynı)
DO $$
DECLARE
    dietitian_uuid UUID := '2621e622-fd8d-487a-a3f6-5e4d6d1473ef';
    
    -- Kategori ID'leri
    cat_meyve UUID;
    cat_sebze UUID;
    cat_et_tavuk UUID;
    cat_balik UUID;
    cat_sut_urunleri UUID;
    cat_tahil_baklagil UUID;
    cat_yag_tohum UUID;
    cat_atistirmalik UUID;
    cat_icecek UUID;
    
    -- Besin ID'leri
    food_id UUID;
BEGIN
    -- Diyetisyen kullanıcısının var olduğunu kontrol et
    IF NOT EXISTS (SELECT 1 FROM users WHERE id = dietitian_uuid) THEN
        RAISE EXCEPTION 'Diyetisyen kullanıcısı bulunamadı! UUID: %', dietitian_uuid;
    END IF;

    RAISE NOTICE 'Diyetisyen ID: %', dietitian_uuid;
    RAISE NOTICE 'Besin kategorileri ve besinler oluşturuluyor...';

    -- ============================================
    -- 1. BESİN KATEGORİLERİ
    -- ============================================
    
    -- Meyveler
    INSERT INTO food_categories (dietitian_id, name, description, icon, color, sort_order)
    VALUES (dietitian_uuid, 'Meyveler', 'Taze ve kurutulmuş meyveler', 'Apple', 'text-red-500', 1)
    RETURNING id INTO cat_meyve;
    
    -- Sebzeler
    INSERT INTO food_categories (dietitian_id, name, description, icon, color, sort_order)
    VALUES (dietitian_uuid, 'Sebzeler', 'Taze sebzeler', 'Carrot', 'text-green-500', 2)
    RETURNING id INTO cat_sebze;
    
    -- Et ve Tavuk
    INSERT INTO food_categories (dietitian_id, name, description, icon, color, sort_order)
    VALUES (dietitian_uuid, 'Et ve Tavuk', 'Kırmızı et, tavuk, hindi', 'Drumstick', 'text-orange-500', 3)
    RETURNING id INTO cat_et_tavuk;
    
    -- Balık
    INSERT INTO food_categories (dietitian_id, name, description, icon, color, sort_order)
    VALUES (dietitian_uuid, 'Balık ve Deniz Ürünleri', 'Balık, karides, midye', 'Fish', 'text-blue-500', 4)
    RETURNING id INTO cat_balik;
    
    -- Süt Ürünleri
    INSERT INTO food_categories (dietitian_id, name, description, icon, color, sort_order)
    VALUES (dietitian_uuid, 'Süt Ürünleri', 'Süt, yoğurt, peynir', 'Milk', 'text-yellow-500', 5)
    RETURNING id INTO cat_sut_urunleri;
    
    -- Tahıl ve Baklagiller
    INSERT INTO food_categories (dietitian_id, name, description, icon, color, sort_order)
    VALUES (dietitian_uuid, 'Tahıl ve Baklagiller', 'Pirinç, bulgur, mercimek, nohut', 'Wheat', 'text-amber-600', 6)
    RETURNING id INTO cat_tahil_baklagil;
    
    -- Yağ ve Tohumlar
    INSERT INTO food_categories (dietitian_id, name, description, icon, color, sort_order)
    VALUES (dietitian_uuid, 'Yağ ve Tohumlar', 'Zeytinyağı, ceviz, badem, fındık', 'Nut', 'text-purple-500', 7)
    RETURNING id INTO cat_yag_tohum;
    
    -- Atıştırmalıklar
    INSERT INTO food_categories (dietitian_id, name, description, icon, color, sort_order)
    VALUES (dietitian_uuid, 'Atıştırmalıklar', 'Kuruyemiş, çikolata, bisküvi', 'Cookie', 'text-pink-500', 8)
    RETURNING id INTO cat_atistirmalik;
    
    -- İçecekler
    INSERT INTO food_categories (dietitian_id, name, description, icon, color, sort_order)
    VALUES (dietitian_uuid, 'İçecekler', 'Su, çay, kahve, meyve suyu', 'Coffee', 'text-indigo-500', 9)
    RETURNING id INTO cat_icecek;

    RAISE NOTICE 'Kategoriler oluşturuldu. Besinler ekleniyor...';

    -- ============================================
    -- 2. MEYVELER
    -- ============================================
    
    -- Elma
    INSERT INTO foods (dietitian_id, category_id, name, description, unit)
    VALUES (dietitian_uuid, cat_meyve, 'Elma', 'Kırmızı elma', '100g')
    RETURNING id INTO food_id;
    INSERT INTO food_nutrients (food_id, energy_kcal, energy_kj, protein_g, carbohydrates_g, fat_g, fiber_g, sugar_g, vitamin_c_mg, potassium_mg, calcium_mg)
    VALUES (food_id, 52, 218, 0.26, 13.81, 0.17, 2.4, 10.39, 4.6, 107, 6);

    -- Muz
    INSERT INTO foods (dietitian_id, category_id, name, description, unit)
    VALUES (dietitian_uuid, cat_meyve, 'Muz', 'Olgun muz', '100g')
    RETURNING id INTO food_id;
    INSERT INTO food_nutrients (food_id, energy_kcal, energy_kj, protein_g, carbohydrates_g, fat_g, fiber_g, sugar_g, vitamin_c_mg, potassium_mg, magnesium_mg, vitamin_b6_mg)
    VALUES (food_id, 89, 372, 1.09, 22.84, 0.33, 2.6, 12.23, 8.7, 358, 27, 0.367);

    -- Portakal
    INSERT INTO foods (dietitian_id, category_id, name, description, unit)
    VALUES (dietitian_uuid, cat_meyve, 'Portakal', 'Taze portakal', '100g')
    RETURNING id INTO food_id;
    INSERT INTO food_nutrients (food_id, energy_kcal, energy_kj, protein_g, carbohydrates_g, fat_g, fiber_g, sugar_g, vitamin_c_mg, folate_mcg, potassium_mg, calcium_mg)
    VALUES (food_id, 47, 197, 0.94, 11.75, 0.12, 2.4, 9.35, 53.2, 30, 181, 40);

    -- Çilek
    INSERT INTO foods (dietitian_id, category_id, name, description, unit)
    VALUES (dietitian_uuid, cat_meyve, 'Çilek', 'Taze çilek', '100g')
    RETURNING id INTO food_id;
    INSERT INTO food_nutrients (food_id, energy_kcal, energy_kj, protein_g, carbohydrates_g, fat_g, fiber_g, sugar_g, vitamin_c_mg, folate_mcg, potassium_mg)
    VALUES (food_id, 32, 134, 0.67, 7.68, 0.3, 2.0, 4.89, 58.8, 24, 153);

    -- Üzüm
    INSERT INTO foods (dietitian_id, category_id, name, description, unit)
    VALUES (dietitian_uuid, cat_meyve, 'Üzüm', 'Siyah üzüm', '100g')
    RETURNING id INTO food_id;
    INSERT INTO food_nutrients (food_id, energy_kcal, energy_kj, protein_g, carbohydrates_g, fat_g, fiber_g, sugar_g, vitamin_c_mg, vitamin_k_mcg, potassium_mg)
    VALUES (food_id, 69, 288, 0.72, 18.1, 0.16, 0.9, 16.25, 10.8, 14.6, 191);

    -- Karpuz
    INSERT INTO foods (dietitian_id, category_id, name, description, unit)
    VALUES (dietitian_uuid, cat_meyve, 'Karpuz', 'Taze karpuz', '100g')
    RETURNING id INTO food_id;
    INSERT INTO food_nutrients (food_id, energy_kcal, energy_kj, protein_g, carbohydrates_g, fat_g, fiber_g, sugar_g, vitamin_c_mg, vitamin_a_mcg, potassium_mg)
    VALUES (food_id, 30, 127, 0.61, 7.55, 0.15, 0.4, 6.2, 8.1, 28, 112);

    -- ============================================
    -- 3. SEBZELER
    -- ============================================
    
    -- Domates
    INSERT INTO foods (dietitian_id, category_id, name, description, unit)
    VALUES (dietitian_uuid, cat_sebze, 'Domates', 'Taze domates', '100g')
    RETURNING id INTO food_id;
    INSERT INTO food_nutrients (food_id, energy_kcal, energy_kj, protein_g, carbohydrates_g, fat_g, fiber_g, sugar_g, vitamin_c_mg, vitamin_k_mcg, potassium_mg)
    VALUES (food_id, 18, 74, 0.88, 3.89, 0.2, 1.2, 2.63, 13.7, 7.9, 237);

    -- Salatalık
    INSERT INTO foods (dietitian_id, category_id, name, description, unit)
    VALUES (dietitian_uuid, cat_sebze, 'Salatalık', 'Taze salatalık', '100g')
    RETURNING id INTO food_id;
    INSERT INTO food_nutrients (food_id, energy_kcal, energy_kj, protein_g, carbohydrates_g, fat_g, fiber_g, sugar_g, vitamin_c_mg, vitamin_k_mcg, potassium_mg)
    VALUES (food_id, 16, 65, 0.65, 3.63, 0.11, 0.5, 1.67, 2.8, 16.4, 147);

    -- Brokoli
    INSERT INTO foods (dietitian_id, category_id, name, description, unit)
    VALUES (dietitian_uuid, cat_sebze, 'Brokoli', 'Taze brokoli', '100g')
    RETURNING id INTO food_id;
    INSERT INTO food_nutrients (food_id, energy_kcal, energy_kj, protein_g, carbohydrates_g, fat_g, fiber_g, sugar_g, vitamin_c_mg, vitamin_k_mcg, folate_mcg, potassium_mg, calcium_mg)
    VALUES (food_id, 34, 141, 2.82, 6.64, 0.37, 2.6, 1.7, 89.2, 101.6, 63, 316, 47);

    -- Ispanak
    INSERT INTO foods (dietitian_id, category_id, name, description, unit)
    VALUES (dietitian_uuid, cat_sebze, 'Ispanak', 'Taze ıspanak', '100g')
    RETURNING id INTO food_id;
    INSERT INTO food_nutrients (food_id, energy_kcal, energy_kj, protein_g, carbohydrates_g, fat_g, fiber_g, sugar_g, vitamin_a_mcg, vitamin_c_mg, vitamin_k_mcg, folate_mcg, iron_mg, calcium_mg, magnesium_mg)
    VALUES (food_id, 23, 97, 2.86, 3.63, 0.39, 2.2, 0.42, 469, 28.1, 482.9, 194, 2.71, 99, 79);

    -- Havuç
    INSERT INTO foods (dietitian_id, category_id, name, description, unit)
    VALUES (dietitian_uuid, cat_sebze, 'Havuç', 'Taze havuç', '100g')
    RETURNING id INTO food_id;
    INSERT INTO food_nutrients (food_id, energy_kcal, energy_kj, protein_g, carbohydrates_g, fat_g, fiber_g, sugar_g, vitamin_a_mcg, vitamin_c_mg, vitamin_k_mcg, potassium_mg)
    VALUES (food_id, 41, 173, 0.93, 9.58, 0.24, 2.8, 4.74, 835, 5.9, 13.2, 320);

    -- Patates
    INSERT INTO foods (dietitian_id, category_id, name, description, unit)
    VALUES (dietitian_uuid, cat_sebze, 'Patates', 'Haşlanmış patates', '100g')
    RETURNING id INTO food_id;
    INSERT INTO food_nutrients (food_id, energy_kcal, energy_kj, protein_g, carbohydrates_g, fat_g, fiber_g, sugar_g, vitamin_c_mg, potassium_mg, vitamin_b6_mg)
    VALUES (food_id, 77, 322, 2.0, 17.49, 0.1, 2.2, 0.78, 19.7, 421, 0.298);

    -- Soğan
    INSERT INTO foods (dietitian_id, category_id, name, description, unit)
    VALUES (dietitian_uuid, cat_sebze, 'Soğan', 'Taze soğan', '100g')
    RETURNING id INTO food_id;
    INSERT INTO food_nutrients (food_id, energy_kcal, energy_kj, protein_g, carbohydrates_g, fat_g, fiber_g, sugar_g, vitamin_c_mg, folate_mcg, potassium_mg)
    VALUES (food_id, 40, 166, 1.1, 9.34, 0.1, 1.7, 4.24, 7.4, 19, 146);

    -- Biber (Kırmızı)
    INSERT INTO foods (dietitian_id, category_id, name, description, unit)
    VALUES (dietitian_uuid, cat_sebze, 'Kırmızı Biber', 'Taze kırmızı biber', '100g')
    RETURNING id INTO food_id;
    INSERT INTO food_nutrients (food_id, energy_kcal, energy_kj, protein_g, carbohydrates_g, fat_g, fiber_g, sugar_g, vitamin_a_mcg, vitamin_c_mg, vitamin_k_mcg, potassium_mg)
    VALUES (food_id, 31, 130, 1.0, 7.31, 0.3, 2.5, 5.3, 157, 142, 14, 211);

    -- ============================================
    -- 4. ET VE TAVUK
    -- ============================================
    
    -- Tavuk Göğsü (Haşlanmış)
    INSERT INTO foods (dietitian_id, category_id, name, description, unit)
    VALUES (dietitian_uuid, cat_et_tavuk, 'Tavuk Göğsü', 'Haşlanmış tavuk göğsü, derisiz', '100g')
    RETURNING id INTO food_id;
    INSERT INTO food_nutrients (food_id, energy_kcal, energy_kj, protein_g, carbohydrates_g, fat_g, saturated_fat_g, cholesterol_mg, sodium_mg, phosphorus_mg, niacin_mg, vitamin_b6_mg)
    VALUES (food_id, 165, 691, 31.02, 0, 3.57, 1.01, 85, 74, 220, 14.782, 0.64);

    -- Kırmızı Et (Dana)
    INSERT INTO foods (dietitian_id, category_id, name, description, unit)
    VALUES (dietitian_uuid, cat_et_tavuk, 'Dana Eti', 'Yağsız dana eti, ızgara', '100g')
    RETURNING id INTO food_id;
    INSERT INTO food_nutrients (food_id, energy_kcal, energy_kj, protein_g, carbohydrates_g, fat_g, saturated_fat_g, cholesterol_mg, iron_mg, zinc_mg, vitamin_b12_mcg, niacin_mg)
    VALUES (food_id, 250, 1046, 26, 0, 15, 6, 90, 2.6, 5.2, 2.0, 5.4);

    -- Hindi Göğsü
    INSERT INTO foods (dietitian_id, category_id, name, description, unit)
    VALUES (dietitian_uuid, cat_et_tavuk, 'Hindi Göğsü', 'Haşlanmış hindi göğsü', '100g')
    RETURNING id INTO food_id;
    INSERT INTO food_nutrients (food_id, energy_kcal, energy_kj, protein_g, carbohydrates_g, fat_g, saturated_fat_g, cholesterol_mg, sodium_mg, phosphorus_mg, niacin_mg)
    VALUES (food_id, 135, 565, 29.55, 0, 0.74, 0.21, 104, 49, 223, 9.573);

    -- Kıyma (Dana)
    INSERT INTO foods (dietitian_id, category_id, name, description, unit)
    VALUES (dietitian_uuid, cat_et_tavuk, 'Dana Kıyma', 'Yağsız dana kıyma', '100g')
    RETURNING id INTO food_id;
    INSERT INTO food_nutrients (food_id, energy_kcal, energy_kj, protein_g, carbohydrates_g, fat_g, saturated_fat_g, cholesterol_mg, iron_mg, zinc_mg, vitamin_b12_mcg)
    VALUES (food_id, 250, 1046, 26, 0, 15, 6, 90, 2.6, 5.2, 2.0);

    -- ============================================
    -- 5. BALIK VE DENİZ ÜRÜNLERİ
    -- ============================================
    
    -- Somon
    INSERT INTO foods (dietitian_id, category_id, name, description, unit)
    VALUES (dietitian_uuid, cat_balik, 'Somon', 'Izgara somon', '100g')
    RETURNING id INTO food_id;
    INSERT INTO food_nutrients (food_id, energy_kcal, energy_kj, protein_g, carbohydrates_g, fat_g, saturated_fat_g, cholesterol_mg, vitamin_d_mcg, vitamin_b12_mcg)
    VALUES (food_id, 206, 862, 25.4, 0, 12, 1.9, 55, 13.1, 4.5);

    -- Ton Balığı
    INSERT INTO foods (dietitian_id, category_id, name, description, unit)
    VALUES (dietitian_uuid, cat_balik, 'Ton Balığı', 'Izgara ton balığı', '100g')
    RETURNING id INTO food_id;
    INSERT INTO food_nutrients (food_id, energy_kcal, energy_kj, protein_g, carbohydrates_g, fat_g, saturated_fat_g, cholesterol_mg, vitamin_d_mcg, niacin_mg)
    VALUES (food_id, 184, 770, 30, 0, 6, 1.3, 49, 5.7, 22.1);

    -- Levrek
    INSERT INTO foods (dietitian_id, category_id, name, description, unit)
    VALUES (dietitian_uuid, cat_balik, 'Levrek', 'Izgara levrek', '100g')
    RETURNING id INTO food_id;
    INSERT INTO food_nutrients (food_id, energy_kcal, energy_kj, protein_g, carbohydrates_g, fat_g, saturated_fat_g, cholesterol_mg, vitamin_d_mcg, phosphorus_mg)
    VALUES (food_id, 124, 519, 24, 0, 2.5, 0.5, 60, 4.2, 200);

    -- Karides
    INSERT INTO foods (dietitian_id, category_id, name, description, unit)
    VALUES (dietitian_uuid, cat_balik, 'Karides', 'Haşlanmış karides', '100g')
    RETURNING id INTO food_id;
    INSERT INTO food_nutrients (food_id, energy_kcal, energy_kj, protein_g, carbohydrates_g, fat_g, saturated_fat_g, cholesterol_mg, vitamin_b12_mcg, phosphorus_mg)
    VALUES (food_id, 99, 414, 24, 0.2, 0.3, 0.1, 189, 1.5, 237);

    -- ============================================
    -- 6. SÜT ÜRÜNLERİ
    -- ============================================
    
    -- Tam Yağlı Süt
    INSERT INTO foods (dietitian_id, category_id, name, description, unit)
    VALUES (dietitian_uuid, cat_sut_urunleri, 'Tam Yağlı Süt', 'Tam yağlı inek sütü', '100ml')
    RETURNING id INTO food_id;
    INSERT INTO food_nutrients (food_id, energy_kcal, energy_kj, protein_g, carbohydrates_g, fat_g, saturated_fat_g, cholesterol_mg, calcium_mg, vitamin_d_mcg, vitamin_b12_mcg, phosphorus_mg)
    VALUES (food_id, 61, 255, 3.15, 4.8, 3.25, 1.87, 10, 113, 1.0, 0.45, 91);

    -- Az Yağlı Süt
    INSERT INTO foods (dietitian_id, category_id, name, description, unit)
    VALUES (dietitian_uuid, cat_sut_urunleri, 'Az Yağlı Süt', 'Az yağlı inek sütü (%1)', '100ml')
    RETURNING id INTO food_id;
    INSERT INTO food_nutrients (food_id, energy_kcal, energy_kj, protein_g, carbohydrates_g, fat_g, saturated_fat_g, cholesterol_mg, calcium_mg, vitamin_d_mcg, vitamin_b12_mcg)
    VALUES (food_id, 42, 176, 3.37, 4.99, 0.97, 0.63, 5, 125, 1.0, 0.47);

    -- Yoğurt (Tam Yağlı)
    INSERT INTO foods (dietitian_id, category_id, name, description, unit)
    VALUES (dietitian_uuid, cat_sut_urunleri, 'Tam Yağlı Yoğurt', 'Tam yağlı yoğurt', '100g')
    RETURNING id INTO food_id;
    INSERT INTO food_nutrients (food_id, energy_kcal, energy_kj, protein_g, carbohydrates_g, fat_g, saturated_fat_g, calcium_mg, phosphorus_mg, vitamin_b12_mcg)
    VALUES (food_id, 61, 255, 3.47, 4.66, 3.25, 2.1, 110, 95, 0.37);

    -- Az Yağlı Yoğurt
    INSERT INTO foods (dietitian_id, category_id, name, description, unit)
    VALUES (dietitian_uuid, cat_sut_urunleri, 'Az Yağlı Yoğurt', 'Az yağlı yoğurt (%1.5)', '100g')
    RETURNING id INTO food_id;
    INSERT INTO food_nutrients (food_id, energy_kcal, energy_kj, protein_g, carbohydrates_g, fat_g, saturated_fat_g, calcium_mg, phosphorus_mg, vitamin_b12_mcg)
    VALUES (food_id, 59, 247, 10, 3.6, 1.5, 1.0, 110, 95, 0.37);

    -- Beyaz Peynir (Tam Yağlı)
    INSERT INTO foods (dietitian_id, category_id, name, description, unit)
    VALUES (dietitian_uuid, cat_sut_urunleri, 'Beyaz Peynir', 'Tam yağlı beyaz peynir', '100g')
    RETURNING id INTO food_id;
    INSERT INTO food_nutrients (food_id, energy_kcal, energy_kj, protein_g, carbohydrates_g, fat_g, saturated_fat_g, cholesterol_mg, sodium_mg, calcium_mg, phosphorus_mg)
    VALUES (food_id, 264, 1105, 14.21, 4.09, 21.28, 13.3, 89, 1116, 493, 338);

    -- Kaşar Peyniri
    INSERT INTO foods (dietitian_id, category_id, name, description, unit)
    VALUES (dietitian_uuid, cat_sut_urunleri, 'Kaşar Peyniri', 'Tam yağlı kaşar peyniri', '100g')
    RETURNING id INTO food_id;
    INSERT INTO food_nutrients (food_id, energy_kcal, energy_kj, protein_g, carbohydrates_g, fat_g, saturated_fat_g, cholesterol_mg, sodium_mg, calcium_mg, phosphorus_mg, vitamin_b12_mcg)
    VALUES (food_id, 364, 1523, 25, 1.5, 28, 18, 89, 621, 721, 512, 1.1);

    -- Yumurta
    INSERT INTO foods (dietitian_id, category_id, name, description, unit)
    VALUES (dietitian_uuid, cat_sut_urunleri, 'Yumurta', 'Haşlanmış yumurta', '1 adet (50g)')
    RETURNING id INTO food_id;
    INSERT INTO food_nutrients (food_id, energy_kcal, energy_kj, protein_g, carbohydrates_g, fat_g, saturated_fat_g, cholesterol_mg, vitamin_d_mcg, vitamin_b12_mcg)
    VALUES (food_id, 78, 326, 6.29, 0.56, 5.3, 1.63, 186, 1.0, 0.56);

    -- ============================================
    -- 7. TAHIL VE BAKLAGİLLER
    -- ============================================
    
    -- Pirinç (Haşlanmış)
    INSERT INTO foods (dietitian_id, category_id, name, description, unit)
    VALUES (dietitian_uuid, cat_tahil_baklagil, 'Pirinç', 'Haşlanmış beyaz pirinç', '100g')
    RETURNING id INTO food_id;
    INSERT INTO food_nutrients (food_id, energy_kcal, energy_kj, protein_g, carbohydrates_g, fat_g, fiber_g, thiamin_mg, niacin_mg, folate_mcg, iron_mg)
    VALUES (food_id, 130, 544, 2.69, 28.17, 0.28, 0.4, 0.163, 1.476, 3, 0.8);

    -- Bulgur (Haşlanmış)
    INSERT INTO foods (dietitian_id, category_id, name, description, unit)
    VALUES (dietitian_uuid, cat_tahil_baklagil, 'Bulgur', 'Haşlanmış bulgur', '100g')
    RETURNING id INTO food_id;
    INSERT INTO food_nutrients (food_id, energy_kcal, energy_kj, protein_g, carbohydrates_g, fat_g, fiber_g, thiamin_mg, niacin_mg, folate_mcg, iron_mg, magnesium_mg)
    VALUES (food_id, 83, 347, 3.08, 18.58, 0.24, 4.5, 0.057, 1, 18, 0.96, 32);

    -- Makarna (Haşlanmış)
    INSERT INTO foods (dietitian_id, category_id, name, description, unit)
    VALUES (dietitian_uuid, cat_tahil_baklagil, 'Makarna', 'Haşlanmış makarna', '100g')
    RETURNING id INTO food_id;
    INSERT INTO food_nutrients (food_id, energy_kcal, energy_kj, protein_g, carbohydrates_g, fat_g, fiber_g, thiamin_mg, folate_mcg, iron_mg)
    VALUES (food_id, 131, 548, 5, 25, 1.1, 1.8, 0.02, 7, 1.3);

    -- Ekmek (Tam Buğday)
    INSERT INTO foods (dietitian_id, category_id, name, description, unit)
    VALUES (dietitian_uuid, cat_tahil_baklagil, 'Tam Buğday Ekmek', 'Tam buğday ekmeği', '1 dilim (25g)')
    RETURNING id INTO food_id;
    INSERT INTO food_nutrients (food_id, energy_kcal, energy_kj, protein_g, carbohydrates_g, fat_g, fiber_g, thiamin_mg, folate_mcg, iron_mg, magnesium_mg)
    VALUES (food_id, 67, 280, 3.6, 12.5, 1.0, 2.0, 0.1, 14, 0.9, 23);

    -- Mercimek (Haşlanmış)
    INSERT INTO foods (dietitian_id, category_id, name, description, unit)
    VALUES (dietitian_uuid, cat_tahil_baklagil, 'Kırmızı Mercimek', 'Haşlanmış kırmızı mercimek', '100g')
    RETURNING id INTO food_id;
    INSERT INTO food_nutrients (food_id, energy_kcal, energy_kj, protein_g, carbohydrates_g, fat_g, fiber_g, folate_mcg, iron_mg, magnesium_mg, phosphorus_mg, potassium_mg)
    VALUES (food_id, 116, 486, 9.02, 20.13, 0.38, 7.9, 181, 3.33, 36, 180, 369);

    -- Nohut (Haşlanmış)
    INSERT INTO foods (dietitian_id, category_id, name, description, unit)
    VALUES (dietitian_uuid, cat_tahil_baklagil, 'Nohut', 'Haşlanmış nohut', '100g')
    RETURNING id INTO food_id;
    INSERT INTO food_nutrients (food_id, energy_kcal, energy_kj, protein_g, carbohydrates_g, fat_g, fiber_g, folate_mcg, iron_mg, magnesium_mg, phosphorus_mg, zinc_mg)
    VALUES (food_id, 164, 686, 8.86, 27.42, 2.59, 7.6, 172, 2.89, 48, 168, 1.53);

    -- Kuru Fasulye (Haşlanmış)
    INSERT INTO foods (dietitian_id, category_id, name, description, unit)
    VALUES (dietitian_uuid, cat_tahil_baklagil, 'Kuru Fasulye', 'Haşlanmış kuru fasulye', '100g')
    RETURNING id INTO food_id;
    INSERT INTO food_nutrients (food_id, energy_kcal, energy_kj, protein_g, carbohydrates_g, fat_g, fiber_g, folate_mcg, iron_mg, magnesium_mg, phosphorus_mg, potassium_mg)
    VALUES (food_id, 127, 532, 8.67, 22.8, 0.5, 6.4, 130, 2.1, 50, 142, 405);

    -- Yulaf
    INSERT INTO foods (dietitian_id, category_id, name, description, unit)
    VALUES (dietitian_uuid, cat_tahil_baklagil, 'Yulaf', 'Pişmiş yulaf', '100g')
    RETURNING id INTO food_id;
    INSERT INTO food_nutrients (food_id, energy_kcal, energy_kj, protein_g, carbohydrates_g, fat_g, fiber_g, thiamin_mg, folate_mcg, iron_mg, magnesium_mg, phosphorus_mg)
    VALUES (food_id, 68, 285, 2.37, 11.67, 1.36, 1.7, 0.08, 5, 0.7, 27, 77);

    -- ============================================
    -- 8. YAĞ VE TOHUMLAR
    -- ============================================
    
    -- Zeytinyağı
    INSERT INTO foods (dietitian_id, category_id, name, description, unit)
    VALUES (dietitian_uuid, cat_yag_tohum, 'Zeytinyağı', 'Sızma zeytinyağı', '1 yemek kaşığı (15ml)')
    RETURNING id INTO food_id;
    INSERT INTO food_nutrients (food_id, energy_kcal, energy_kj, protein_g, carbohydrates_g, fat_g, saturated_fat_g, vitamin_e_mg, vitamin_k_mcg)
    VALUES (food_id, 119, 498, 0, 0, 13.5, 1.86, 1.94, 8.1);

    -- Ceviz
    INSERT INTO foods (dietitian_id, category_id, name, description, unit)
    VALUES (dietitian_uuid, cat_yag_tohum, 'Ceviz', 'Kabuklu ceviz', '100g')
    RETURNING id INTO food_id;
    INSERT INTO food_nutrients (food_id, energy_kcal, energy_kj, protein_g, carbohydrates_g, fat_g, saturated_fat_g, fiber_g, magnesium_mg, phosphorus_mg, vitamin_e_mg)
    VALUES (food_id, 654, 2738, 15.23, 13.71, 65.21, 6.13, 6.7, 158, 346, 0.7);

    -- Badem
    INSERT INTO foods (dietitian_id, category_id, name, description, unit)
    VALUES (dietitian_uuid, cat_yag_tohum, 'Badem', 'Kabuksuz badem', '100g')
    RETURNING id INTO food_id;
    INSERT INTO food_nutrients (food_id, energy_kcal, energy_kj, protein_g, carbohydrates_g, fat_g, saturated_fat_g, fiber_g, vitamin_e_mg, magnesium_mg, calcium_mg, phosphorus_mg)
    VALUES (food_id, 579, 2423, 21.15, 21.55, 49.93, 3.8, 12.5, 25.63, 270, 269, 481);

    -- Fındık
    INSERT INTO foods (dietitian_id, category_id, name, description, unit)
    VALUES (dietitian_uuid, cat_yag_tohum, 'Fındık', 'Kabuklu fındık', '100g')
    RETURNING id INTO food_id;
    INSERT INTO food_nutrients (food_id, energy_kcal, energy_kj, protein_g, carbohydrates_g, fat_g, saturated_fat_g, fiber_g, vitamin_e_mg, magnesium_mg, folate_mcg)
    VALUES (food_id, 628, 2629, 14.95, 16.7, 60.75, 4.46, 9.7, 15.03, 163, 113);

    -- Ayçiçek Yağı
    INSERT INTO foods (dietitian_id, category_id, name, description, unit)
    VALUES (dietitian_uuid, cat_yag_tohum, 'Ayçiçek Yağı', 'Rafine ayçiçek yağı', '1 yemek kaşığı (15ml)')
    RETURNING id INTO food_id;
    INSERT INTO food_nutrients (food_id, energy_kcal, energy_kj, protein_g, carbohydrates_g, fat_g, saturated_fat_g, vitamin_e_mg)
    VALUES (food_id, 120, 502, 0, 0, 13.6, 1.4, 5.6);

    -- ============================================
    -- 9. ATIŞTIRMALIKLAR
    -- ============================================
    
    -- Bitter Çikolata (%70 kakao)
    INSERT INTO foods (dietitian_id, category_id, name, description, unit)
    VALUES (dietitian_uuid, cat_atistirmalik, 'Bitter Çikolata', 'Bitter çikolata %70 kakao', '100g')
    RETURNING id INTO food_id;
    INSERT INTO food_nutrients (food_id, energy_kcal, energy_kj, protein_g, carbohydrates_g, fat_g, saturated_fat_g, fiber_g, sugar_g, iron_mg, magnesium_mg, caffeine_mg)
    VALUES (food_id, 598, 2503, 7.79, 45.9, 42.6, 24.5, 10.9, 24, 12, 228, 80);

    -- Fıstık
    INSERT INTO foods (dietitian_id, category_id, name, description, unit)
    VALUES (dietitian_uuid, cat_atistirmalik, 'Fıstık', 'Kavrulmuş fıstık', '100g')
    RETURNING id INTO food_id;
    INSERT INTO food_nutrients (food_id, energy_kcal, energy_kj, protein_g, carbohydrates_g, fat_g, saturated_fat_g, fiber_g, niacin_mg, folate_mcg, magnesium_mg, phosphorus_mg)
    VALUES (food_id, 567, 2374, 25.8, 16.13, 49.24, 6.28, 8.5, 12.07, 240, 168, 376);

    -- ============================================
    -- 10. İÇECEKLER
    -- ============================================
    
    -- Su
    INSERT INTO foods (dietitian_id, category_id, name, description, unit)
    VALUES (dietitian_uuid, cat_icecek, 'Su', 'İçme suyu', '100ml')
    RETURNING id INTO food_id;
    INSERT INTO food_nutrients (food_id, energy_kcal, energy_kj)
    VALUES (food_id, 0, 0);

    -- Türk Kahvesi
    INSERT INTO foods (dietitian_id, category_id, name, description, unit)
    VALUES (dietitian_uuid, cat_icecek, 'Türk Kahvesi', 'Şekersiz Türk kahvesi', '1 fincan (50ml)')
    RETURNING id INTO food_id;
    INSERT INTO food_nutrients (food_id, energy_kcal, energy_kj, protein_g, carbohydrates_g, fat_g, caffeine_mg, potassium_mg, niacin_mg)
    VALUES (food_id, 2, 8, 0.1, 0, 0, 50, 49, 0.2);

    -- Çay (Siyah)
    INSERT INTO foods (dietitian_id, category_id, name, description, unit)
    VALUES (dietitian_uuid, cat_icecek, 'Siyah Çay', 'Şekersiz siyah çay', '1 fincan (200ml)')
    RETURNING id INTO food_id;
    INSERT INTO food_nutrients (food_id, energy_kcal, energy_kj, protein_g, carbohydrates_g, fat_g, caffeine_mg, potassium_mg)
    VALUES (food_id, 2, 8, 0, 0.3, 0, 40, 37);

    RAISE NOTICE 'Besin veritabanı seed işlemi tamamlandı!';
    RAISE NOTICE 'Kategoriler: 9';
    RAISE NOTICE 'Besinler: ~50+';
END $$;

