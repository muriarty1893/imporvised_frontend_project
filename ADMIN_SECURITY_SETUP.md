# 🔐 Gopak Admin Panel Güvenlik Kurulum Rehberi

Bu rehber, admin panelinizi güvenli hale getirmek için gerekli adımları açıklar.

## 📋 Kurulum Adımları

### 1. Admin Kullanıcı Sistemi Kurulumu

İlk olarak admin kullanıcı tablosunu oluşturun:

```bash
# Tarayıcınızda şu adresi ziyaret edin:
http://yourdomain.com/admin_user_setup.php
```

Bu script:
- `admin_users` tablosunu oluşturur
- Varsayılan admin kullanıcısı ekler:
  - **Kullanıcı Adı:** `admin`
  - **Şifre:** `admin123`
  - **Rol:** `super_admin`

⚠️ **ÖNEMLİ:** Kurulum tamamlandıktan sonra bu dosyayı sunucudan silin!

### 2. Admin Giriş Sistemi

Admin paneline erişmek için:

```bash
# Admin giriş sayfası:
http://yourdomain.com/admin_login.php

# Güvenli admin paneli:
http://yourdomain.com/admin_panel.php
```

### 3. Güvenlik Özellikleri

#### Oturum Yönetimi
- Session tabanlı kimlik doğrulama
- Otomatik oturum sonlandırma
- Güvenli çıkış işlemi

#### Erişim Kontrolü
- Sadece giriş yapmış kullanıcılar admin paneline erişebilir
- `admin.html` dosyasına doğrudan erişim engellendi
- API endpoint'leri korundu

#### Rol Tabanlı Yetkilendirme
- `admin`: Normal admin yetkileri
- `super_admin`: Tüm yetkilere sahip

## 🛡️ Güvenlik Önlemleri

### Dosya Koruması
- `.htaccess` ile `admin.html` dosyası korundu
- Dizin listelemesi kapatıldı
- Güvenlik başlıkları eklendi

### API Güvenliği
- Tüm admin API'leri kimlik doğrulama gerektirir
- CSRF koruması (session tabanlı)
- Input validation ve sanitization

### Veritabanı Güvenliği
- Prepared statements kullanılıyor
- SQL injection koruması
- Şifre hash'leme (bcrypt)

## 🔧 Yapılandırma

### Veritabanı Ayarları
`config/database.php` dosyasında veritabanı bilgilerinizi güncelleyin:

```php
$host = 'localhost';
$dbname = 'your_database_name';
$username = 'your_username';
$password = 'your_password';
```

### Admin Kullanıcı Ekleme
Yeni admin kullanıcısı eklemek için:

```sql
INSERT INTO admin_users (username, password_hash, email, full_name, role) 
VALUES (
    'newadmin', 
    '$2y$10$...', -- password_hash() ile oluşturulan hash
    'admin@example.com', 
    'Yeni Admin', 
    'admin'
);
```

## 📱 Kullanım

### Admin Girişi
1. `admin_login.php` sayfasına gidin
2. Kullanıcı adı ve şifrenizi girin
3. Başarılı girişte `admin_panel.php`'ye yönlendirilirsiniz

### Admin Panel Özellikleri
- **Dashboard:** Genel istatistikler
- **Siparişler:** Sipariş yönetimi ve durum güncelleme
- **Müşteriler:** Müşteri bilgileri görüntüleme
- **Ürünler:** Ürün ekleme, düzenleme, silme

### Çıkış Yapma
Sağ üst köşedeki "Çıkış" butonuna tıklayın veya `api/admin_logout.php` endpoint'ini çağırın.

## 🚨 Güvenlik Uyarıları

### Yapılması Gerekenler
1. Varsayılan şifreyi değiştirin (`admin123`)
2. Güçlü şifreler kullanın
3. Kurulum dosyalarını silin
4. Düzenli güvenlik güncellemeleri yapın
5. SSL sertifikası kullanın (HTTPS)

### Yapılmaması Gerekenler
1. Admin bilgilerini paylaşmayın
2. Şifreleri plain text olarak saklamayın
3. Güvenlik dosyalarını public dizinde bırakmayın
4. Eski admin hesaplarını aktif bırakmayın

## 🔍 Sorun Giderme

### Yaygın Sorunlar

#### "Yetkisiz erişim" Hatası
- Oturum süresi dolmuş olabilir
- `admin_login.php` ile tekrar giriş yapın

#### Veritabanı Bağlantı Hatası
- `config/database.php` dosyasındaki bilgileri kontrol edin
- Veritabanı sunucusunun çalıştığından emin olun

#### .htaccess Çalışmıyor
- Apache'de `mod_rewrite` modülünün aktif olduğundan emin olun
- Sunucu yapılandırmasını kontrol edin

### Log Kontrolü
Hata ayıklama için PHP error log'larını kontrol edin:
- Apache error log
- PHP error log
- Veritabanı error log

## 📞 Destek

Güvenlik sorunları için:
1. Hata mesajlarını kaydedin
2. Sunucu log'larını kontrol edin
3. Veritabanı bağlantısını test edin
4. Dosya izinlerini kontrol edin

## 🔄 Güncellemeler

Sistem güncellemeleri için:
1. Mevcut verileri yedekleyin
2. Yeni dosyaları yükleyin
3. Veritabanı şemasını güncelleyin
4. Test edin

---

**Son Güncelleme:** <?php echo date('Y-m-d'); ?>
**Versiyon:** 1.0
**Güvenlik Seviyesi:** Yüksek
