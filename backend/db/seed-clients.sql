    -- Seed Data: 100 Örnek Danışan
    -- 
    -- Kullanım:
    -- psql -U postgres -d your_database -f backend/db/seed-clients.sql
    -- veya
    -- psql içinde: \i backend/db/seed-clients.sql

    -- Türk isimleri ve soyisimleri ile 100 farklı danışan oluşturur
    DO $$
    DECLARE
        dietitian_uuid UUID := '2621e622-fd8d-487a-a3f6-5e4d6d1473ef';
        first_names TEXT[] := ARRAY[
            'Ahmet', 'Mehmet', 'Ali', 'Mustafa', 'Hasan', 'Hüseyin', 'İbrahim', 'İsmail', 'Osman', 'Süleyman',
            'Ayşe', 'Fatma', 'Hatice', 'Zeynep', 'Emine', 'Fadime', 'Şerife', 'Meryem', 'Elif', 'Merve',
            'Burak', 'Can', 'Deniz', 'Ege', 'Emre', 'Kerem', 'Kaan', 'Arda', 'Berk', 'Cem',
            'Selin', 'Derya', 'Burcu', 'Gizem', 'Seda', 'Pınar', 'Özge', 'Esra', 'Gamze', 'Melis',
            'Onur', 'Serkan', 'Tolga', 'Uğur', 'Volkan', 'Yasin', 'Yusuf', 'Zafer', 'Barış', 'Cengiz',
            'Aslı', 'Banu', 'Ceren', 'Dilek', 'Ebru', 'Gülay', 'Hande', 'İpek', 'Jale', 'Kıvanç',
            'Levent', 'Murat', 'Nazım', 'Okan', 'Poyraz', 'Rıza', 'Sinan', 'Tarkan', 'Umut', 'Veli',
            'Aylin', 'Beste', 'Cansu', 'Defne', 'Ece', 'Fulya', 'Güneş', 'Hazal', 'Işıl', 'Janset',
            'Kemal', 'Lütfi', 'Metin', 'Necati', 'Orhan', 'Pelin', 'Rüya', 'Sibel', 'Tuğba', 'Ülkü',
            'Vedat', 'Yavuz', 'Zeki', 'Ata', 'Bora', 'Cemal', 'Derya', 'Eren', 'Fikret', 'Gökhan'
        ];
        last_names TEXT[] := ARRAY[
            'Yılmaz', 'Kaya', 'Demir', 'Şahin', 'Çelik', 'Yıldız', 'Yıldırım', 'Öztürk', 'Aydın', 'Özdemir',
            'Arslan', 'Doğan', 'Kılıç', 'Aslan', 'Çetin', 'Kara', 'Koç', 'Kurt', 'Özkan', 'Şimşek',
            'Polat', 'Özkan', 'Erdoğan', 'Ateş', 'Bulut', 'Güneş', 'Taş', 'Toprak', 'Çakır', 'Korkmaz',
            'Aktaş', 'Aksoy', 'Altın', 'Avcı', 'Başar', 'Bayram', 'Bektaş', 'Bozkurt', 'Çağlar', 'Çiftçi',
            'Dede', 'Duran', 'Efe', 'Erdem', 'Güler', 'Gündüz', 'Işık', 'Karaca', 'Keskin', 'Kılıç',
            'Koçak', 'Kurtuluş', 'Mert', 'Nalbant', 'Özer', 'Özmen', 'Pektaş', 'Sarı', 'Sezer', 'Şen',
            'Tekin', 'Tunç', 'Türk', 'Uçar', 'Ünal', 'Vural', 'Yaman', 'Yavuz', 'Yücel', 'Zengin',
            'Akar', 'Bal', 'Bekir', 'Cengiz', 'Duman', 'Erol', 'Fırat', 'Gök', 'Hakan', 'İlhan',
            'Kartal', 'Lale', 'Mavi', 'Nazlı', 'Okan', 'Parlak', 'Rüzgar', 'Soylu', 'Tuna', 'Uyanık',
            'Vatan', 'Yalçın', 'Zorlu', 'Akın', 'Bilge', 'Cemil', 'Derya', 'Emin', 'Ferhat', 'Görkem'
        ];
        genders TEXT[] := ARRAY['male', 'female'];
        chronic_conditions_list TEXT[] := ARRAY[
            'Diyabet Tip 2', 'Hipertansiyon', 'Kolesterol yüksekliği', 'Tiroid hastalığı', 
            'İBS (İrritabl Bağırsak Sendromu)', 'Çölyak hastalığı', 'Gastrit', 'Reflü',
            'Böbrek taşı', 'Gut hastalığı', NULL, NULL, NULL, NULL, NULL
        ];
        allergies_list TEXT[] := ARRAY[
            'Fındık alerjisi', 'Yumurta alerjisi', 'Süt alerjisi', 'Balık alerjisi',
            'Gluten intoleransı', 'Laktoz intoleransı', 'Kabuklu deniz ürünleri alerjisi',
            'Soya alerjisi', NULL, NULL, NULL, NULL, NULL, NULL, NULL
        ];
        medications_list TEXT[] := ARRAY[
            'Metformin', 'İnsülin', 'Levotiroksin', 'Atorvastatin',
            'Lansoprazol', 'Omeprazol', 'Antibiyotik', 'Vitamin D',
            'Demir takviyesi', 'B12 vitamini', NULL, NULL, NULL, NULL, NULL
        ];
        i INTEGER;
        selected_first_name TEXT;
        selected_last_name TEXT;
        selected_gender TEXT;
        birth_year INTEGER;
        birth_month INTEGER;
        birth_day INTEGER;
        birth_date_val DATE;
        height_val NUMERIC;
        weight_val NUMERIC;
        email_val TEXT;
        phone_val TEXT;
        chronic_condition_val TEXT;
        allergy_val TEXT;
        medication_val TEXT;
    BEGIN
        -- Diyetisyen kullanıcısının var olduğunu kontrol et
        IF NOT EXISTS (SELECT 1 FROM users WHERE id = dietitian_uuid) THEN
            RAISE EXCEPTION 'Diyetisyen kullanıcısı bulunamadı! UUID: %', dietitian_uuid;
        END IF;

        RAISE NOTICE 'Diyetisyen ID: %', dietitian_uuid;
        RAISE NOTICE '100 danışan oluşturuluyor...';

        -- 100 danışan oluştur
        FOR i IN 1..100 LOOP
            -- Rastgele isim seç
            selected_first_name := first_names[1 + floor(random() * array_length(first_names, 1))::int];
            selected_last_name := last_names[1 + floor(random() * array_length(last_names, 1))::int];
            selected_gender := genders[1 + floor(random() * array_length(genders, 1))::int];
            
            -- Rastgele doğum tarihi (18-75 yaş arası)
            birth_year := 1949 + floor(random() * 57)::int; -- 1949-2006
            birth_month := 1 + floor(random() * 12)::int;
            birth_day := 1 + floor(random() * 28)::int; -- 28 gün güvenli
            birth_date_val := make_date(birth_year, birth_month, birth_day);
            
            -- Rastgele boy (150-200 cm)
            height_val := 150 + floor(random() * 50)::int;
            
            -- Rastgele kilo (45-120 kg) - BMI'ye göre ayarlanabilir
            weight_val := 45 + floor(random() * 75)::int;
            
            -- E-posta oluştur (benzersiz)
            email_val := lower(replace(selected_first_name, 'ı', 'i')) || '.' || 
                        lower(replace(selected_last_name, 'ı', 'i')) || i || '@example.com';
            
            -- Telefon oluştur (benzersiz)
            phone_val := '555' || lpad((1000000 + i)::text, 7, '0');
            
            -- Rastgele kronik hastalık (70% şans)
            IF random() < 0.7 THEN
                chronic_condition_val := chronic_conditions_list[1 + floor(random() * array_length(chronic_conditions_list, 1))::int];
            ELSE
                chronic_condition_val := NULL;
            END IF;
            
            -- Rastgele alerji (40% şans)
            IF random() < 0.4 THEN
                allergy_val := allergies_list[1 + floor(random() * array_length(allergies_list, 1))::int];
            ELSE
                allergy_val := NULL;
            END IF;
            
            -- Rastgele ilaç (60% şans)
            IF random() < 0.6 THEN
                medication_val := medications_list[1 + floor(random() * array_length(medications_list, 1))::int];
            ELSE
                medication_val := NULL;
            END IF;
            
            -- Danışanı ekle
            INSERT INTO clients (
                dietitian_id, first_name, last_name, email, phone,
                birth_date, gender, height_cm, weight_kg,
                chronic_conditions, allergies, medications,
                created_at
            ) VALUES (
                dietitian_uuid,
                selected_first_name,
                selected_last_name,
                email_val,
                phone_val,
                birth_date_val,
                selected_gender,
                height_val,
                weight_val,
                chronic_condition_val,
                allergy_val,
                medication_val,
                NOW() - (random() * interval '365 days') -- Son 1 yıl içinde rastgele tarih
            );
        END LOOP;
        
        RAISE NOTICE '100 danışan başarıyla oluşturuldu!';
    END $$;
