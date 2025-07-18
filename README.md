# Alışverişmatik - Akıllı Alışveriş Listesi Uygulaması

Modern, kullanıcı dostu bir React Native alışveriş listesi uygulaması.

## 🚀 Özellikler

- ✅ Kullanıcı kimlik doğrulama (Kayıt/Giriş)
- ✅ Alışveriş listeleri oluşturma ve yönetimi
- ✅ Modern, minimalist UI tasarımı
- ✅ Yeşil tema ile temiz görünüm
- ✅ Bottom tab navigasyonu
- ✅ Responsive tasarım

## 🛠 Teknolojiler

- **React Native** (Expo)
- **TypeScript** 
- **NativeWind** (Tailwind CSS for React Native)
- **Supabase** (Backend ve Authentication)
- **React Navigation** (Navigasyon)

## 📱 Kurulum

### 1. Projeyi klonlayın
```bash
git clone <repo-url>
cd alisverismatik_app
```

### 2. Bağımlılıkları yükleyin
```bash
npm install
```

### 3. Supabase Kurulumu

1. [Supabase](https://supabase.com) hesabı oluşturun
2. Yeni bir proje oluşturun
3. Proje root dizininde `.env` dosyası oluşturun:

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Supabase Veritabanı Şeması

Supabase SQL Editor'da aşağıdaki tabloları oluşturun:

```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

CREATE TABLE shopping_lists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE shopping_list_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  shopping_list_id UUID REFERENCES shopping_lists(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  quantity INTEGER DEFAULT 1,
  is_completed BOOLEAN DEFAULT FALSE,
  category_id TEXT,
  category_name TEXT,
  unit_price DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopping_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopping_list_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can view own lists" ON shopping_lists FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own lists" ON shopping_lists FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own lists" ON shopping_lists FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own lists" ON shopping_lists FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own list items" ON shopping_list_items FOR SELECT USING (
  auth.uid() IN (SELECT user_id FROM shopping_lists WHERE id = shopping_list_items.shopping_list_id)
);
CREATE POLICY "Users can create own list items" ON shopping_list_items FOR INSERT WITH CHECK (
  auth.uid() IN (SELECT user_id FROM shopping_lists WHERE id = shopping_list_items.shopping_list_id)
);
CREATE POLICY "Users can update own list items" ON shopping_list_items FOR UPDATE USING (
  auth.uid() IN (SELECT user_id FROM shopping_lists WHERE id = shopping_list_items.shopping_list_id)
);
CREATE POLICY "Users can delete own list items" ON shopping_list_items FOR DELETE USING (
  auth.uid() IN (SELECT user_id FROM shopping_lists WHERE id = shopping_list_items.shopping_list_id)
);
```

### 5. Uygulamayı çalıştırın

```bash
# iOS simülatörü için
npm run ios

# Android emülatörü için
npm run android

# Web tarayıcısı için
npm run web

# Expo Go ile
npm start
```

## 📂 Proje Yapısı

```
src/
├── app/
│   ├── navigation/          # Navigasyon konfigürasyonları
│   └── screens/            # Uygulama ekranları
│       ├── auth/          # Kimlik doğrulama ekranları
│       └── main/          # Ana uygulama ekranları
├── components/            # Yeniden kullanılabilir bileşenler
├── contexts/             # React Context'ler (AuthContext)
├── hooks/               # Özel hook'lar
├── lib/                # Harici kütüphane konfigürasyonları
├── services/           # API ve Supabase servisleri
└── types/             # TypeScript tip tanımlamaları
```

## 🎨 Tasarım Sistemi

- **Ana Renk:** #2b703b (Yeşil)
- **Kart Stilleri:** Yuvarlatılmış köşeler, yumuşak gölgeler
- **Tipografi:** Sistem fontları, temiz ve okunabilir
- **İkonlar:** Expo Vector Icons, outline stili

## 🔧 Geliştirme

### Yeni Özellik Ekleme

1. İlgili service'i `src/services/` içinde oluşturun
2. Hook'u `src/hooks/` içinde oluşturun  
3. Component'i `src/components/` veya screen'i `src/app/screens/` içinde oluşturun
4. Gerekirse tip tanımlarını `src/types/` içinde güncelleyin

### Stil Kuralları

- NativeWind (Tailwind CSS) kullanın
- Özel renkler için `tailwind.config.js` içindeki renk paletini kullanın
- Tutarlılık için tasarım sistem kurallarını takip edin

## 📄 Lisans

Bu proje [MIT Lisansı](LICENSE) altında lisanslanmıştır.

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/yeni-ozellik`)
3. Değişikliklerinizi commit edin (`git commit -m 'Yeni özellik eklendi'`)
4. Branch'inizi push edin (`git push origin feature/yeni-ozellik`)
5. Pull Request oluşturun

## 📞 İletişim

Herhangi bir sorunuz veya öneriniz varsa lütfen issue oluşturun. 