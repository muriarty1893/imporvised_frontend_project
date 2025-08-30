# Gopak Admin Panel Kullanım Kılavuzu

## 🚀 Kurulum

### 1. Veritabanı Kurulumu
Admin panelini kullanmaya başlamadan önce gerekli veritabanı tablolarını oluşturmanız gerekiyor:

1. `admin_setup.php` dosyasını web sunucunuzda çalıştırın
2. Tarayıcınızda `http://yoursite.com/admin_setup.php` adresine gidin
3. Kurulum tamamlandıktan sonra `admin_setup.php` dosyasını güvenlik için silin

### 2. Veritabanı Bağlantısı
`config/database.php` dosyasında veritabanı bilgilerinizi güncelleyin:

```php
$host = 'localhost';
$dbname = 'your_database_name';
$username = 'your_username';
$password = 'your_password';
```

## 🔐 Admin Paneli Özellikleri

### 📊 Dashboard
- Toplam sipariş sayısı
- Toplam müşteri sayısı  
- Toplam ürün sayısı
- Bekleyen sipariş sayısı
- Son siparişler listesi

### 📋 Sipariş Yönetimi
- Tüm siparişleri görüntüleme
- Sipariş detaylarını inceleme
- Sipariş durumunu güncelleme (Bekliyor, Onaylandı, Üretimde, Kargoda, Teslim Edildi, İptal Edildi)
- Sipariş iptal etme

### 👥 Müşteri Yönetimi
- Tüm müşteri bilgilerini görüntüleme
- Müşteri sipariş geçmişi
- Müşteri toplam harcama tutarı

### 🛍️ Ürün Yönetimi
- Mevcut ürünleri görüntüleme
- Yeni ürün ekleme
- Ürün bilgilerini düzenleme
- Ürün silme (siparişi olmayan ürünler)

## 🎯 Kullanım

### Admin Paneline Erişim
1. Ana sayfada sağ üst köşedeki 🔐 ikonuna tıklayın
2. Veya doğrudan `admin.html` sayfasına gidin

### Sipariş Durumu Güncelleme
1. Siparişler sekmesine gidin
2. İlgili siparişin "Görüntüle" butonuna tıklayın
3. Durum dropdown'ından yeni durumu seçin
4. "Güncelle" butonuna tıklayın

### Yeni Ürün Ekleme
1. Ürünler sekmesine gidin
2. "Yeni Ürün Ekle" butonuna tıklayın
3. Gerekli bilgileri doldurun:
   - Ürün Adı (zorunlu)
   - Açıklama
   - Fiyat (zorunlu)
   - Stok Miktarı (zorunlu)
   - Kategori
   - Resim URL
   - Özel ürün mü?
4. "Ürün Ekle" butonuna tıklayın

### Ürün Düzenleme
1. Ürünler sekmesinde ilgili ürünün "Düzenle" butonuna tıklayın
2. Bilgileri güncelleyin
3. "Güncelle" butonuna tıklayın

### Ürün Silme
1. Ürünler sekmesinde ilgili ürünün "Sil" butonuna tıklayın
2. Onay verin
3. **Not:** Siparişi olan ürünler silinemez

## 🔧 Teknik Detaylar

### API Endpoints
- `api/admin_orders.php` - Sipariş yönetimi
- `api/admin_customers.php` - Müşteri bilgileri
- `api/admin_products.php` - Ürün yönetimi

### Veritabanı Tabloları
- `customers` - Müşteri bilgileri
- `orders` - Sipariş bilgileri
- `products` - Ürün bilgileri
- `contact_messages` - İletişim mesajları

### Güvenlik
- CORS ayarları yapılandırıldı
- SQL injection koruması (PDO prepared statements)
- Input validation
- Error handling

## 📱 Responsive Tasarım
Admin paneli mobil cihazlarda da kullanılabilir:
- Mobil uyumlu navigasyon
- Responsive tablolar
- Touch-friendly butonlar
- Mobil optimize edilmiş modaller

## 🚨 Hata Giderme

### Veritabanı Bağlantı Hatası
- `config/database.php` dosyasındaki bilgileri kontrol edin
- Veritabanı sunucusunun çalıştığından emin olun
- Kullanıcı yetkilerini kontrol edin

### API Hataları
- Tarayıcı konsolunda hata mesajlarını kontrol edin
- PHP error log'larını kontrol edin
- API dosyalarının doğru konumda olduğundan emin olun

### Tablo Oluşturma Hataları
- `admin_setup.php` dosyasını tekrar çalıştırın
- Veritabanı kullanıcısının CREATE TABLE yetkisine sahip olduğundan emin olun

## 📞 Destek
Herhangi bir sorun yaşarsanız:
1. Hata mesajlarını not edin
2. Tarayıcı konsolundaki hataları kontrol edin
3. PHP error log'larını inceleyin
4. Gerekirse veritabanı bağlantısını test edin

## 🔄 Güncellemeler
Admin paneli sürekli geliştirilmektedir. Yeni özellikler için:
- GitHub repository'yi takip edin
- Release notlarını kontrol edin
- Gerekli güncellemeleri yapın

---

**Not:** Bu admin paneli production ortamında kullanılmadan önce ek güvenlik önlemleri alınması önerilir (örn. admin authentication, rate limiting, IP whitelisting).
