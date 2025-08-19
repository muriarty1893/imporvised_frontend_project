# Gopak Website Hostinger Deployment Rehberi

## 🚀 Hostinger'a Deployment Adımları

### 1. Hostinger Hesap Kurulumu
```
1. Hostinger.com.tr adresinden Premium Shared Hosting (~4€/ay) satın alın
2. Domain seçin (örn: gopak.com.tr)
3. hPanel kontrol paneline erişin
4. MySQL veritabanı oluşturun
```

### 2. Dosya Yapısı (Hostinger'a yüklenecek)
```
public_html/
├── index.html          (ana sayfa)
├── style.css           (mevcut stilleriniz)
├── app.js              (güncellenmiş JavaScript)
├── img/                (resim klasörü)
├── config/
│   └── database.php    (veritabanı bağlantısı)
├── api/
│   ├── contact.php     (iletişim formu)
│   ├── products.php    (ürün API'leri)
│   └── auth.php        (kullanıcı girişi)
└── admin/
    └── index.php       (admin paneli)
```

### 3. Veritabanı Kurulumu
```sql
1. hPanel > Veritabanları > MySQL Veritabanları
2. Veritabanı oluştur: u123456789_gopak
3. sql/database_setup.sql dosyasını çalıştır
4. config/database.php'de bağlantı bilgilerini güncelle
```

### 4. GitHub Otomatik Deployment (Opsiyonel)
```php
// public_html/webhook.php
<?php
if ($_POST['secret'] === 'GIZLI_ANAHTAR') {
    shell_exec('cd /path/to/your/site && git pull origin main');
    echo "Site updated successfully!";
}
?>
```

## 💳 Ödeme Sistemleri Seçenekleri

### Option 1: iyzico (Önerilen)
- **Komisyon**: %2.9 + 0.25₺ (kart)
- **Minimum Ödeme**: 100₺
- **Entegrasyon**: PHP SDK mevcut
- **Desteklenen Kartlar**: Tüm yerel/uluslararası kartlar

### Option 2: PayTR
- **Komisyon**: %2.8 + 0.25₺ (kart)
- **Minimum Ödeme**: 50₺
- **Entegrasyon**: Basit API
- **Ek Özellik**: Havale/EFT de destekler

### Option 3: Stripe (Uluslararası müşteriler için)
- **Komisyon**: %2.9 + 0.30₺
- **Özellik**: Global ödeme desteği

## 📱 GitHub Workflow Kurulumu

### 1. GitHub Actions (Otomatik Deploy)
```yaml
# .github/workflows/deploy.yml
name: Deploy to Hostinger
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Deploy via FTP
      uses: SamKirkland/FTP-Deploy-Action@4.3.3
      with:
        server: ftp.hostinger.com
        username: ${{ secrets.FTP_USERNAME }}
        password: ${{ secrets.FTP_PASSWORD }}
        local-dir: ./
        server-dir: /public_html/
```

### 2. Manuel Deployment
```
1. FileZilla ile FTP bağlantısı kur
2. Dosyaları public_html/ klasörüne yükle
3. Veritabanını phpMyAdmin'den import et
```

## ⚙️ Hostinger Ayarları

### SSL Sertifikası
- hPanel > SSL > Let's Encrypt SSL etkinleştir (ücretsiz)

### PHP Sürümü
- hPanel > Gelişmiş > PHP Sürümü > PHP 8.1 seç

### Cron Jobs (Otomatik görevler için)
```
# Örnek: Günlük rapor gönderimi
0 9 * * * /usr/bin/php /home/u123456789/public_html/cron/daily_report.php
```

## 🔧 Sonraki Adımlar

1. **Hemen**: Hostinger hesabı aç ve domain seç
2. **Bu hafta**: Dosyaları yükle ve veritabanını kur  
3. **Gelecek hafta**: İletişim formunu test et
4. **2 hafta sonra**: Ödeme sistemi entegrasyonu
5. **1 ay sonra**: Admin paneli ve kullanıcı sistemi

## 💰 Maliyet Hesabı
- **Hosting**: 4€/ay (Hostinger Premium)
- **Domain**: 1€/ay (ilk yıl ücretsiz)
- **SSL**: Ücretsiz
- **Ödeme Sistemi**: İşlem başına %2.9
- **Toplam**: ~5€/ay + satış komisyonları

## 🎯 Test Checklist
- [ ] Site Hostinger'da açılıyor
- [ ] İletişim formu çalışıyor
- [ ] Veritabanı bağlantısı OK
- [ ] SSL sertifikası aktif
- [ ] Mobile responsive test
- [ ] Ödeme sistemi test (sandbox)
