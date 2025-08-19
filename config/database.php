<?php
// Veritabanı bağlantı ayarları
$host = 'localhost';
$dbname = 'u123456789_gopak'; // Hostinger veritabanı adı
$username = 'u123456789_gopak'; // Hostinger kullanıcı adı
$password = 'STRONG_PASSWORD'; // Güçlü şifre

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch(PDOException $e) {
    die("Veritabanı bağlantı hatası: " . $e->getMessage());
}
?>
