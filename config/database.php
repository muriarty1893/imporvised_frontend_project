<?php
// Veritabanı bağlantı ayarları - Güvenli versiyon
// Veritabanı bilgileri database.env dosyasından okunur

// Environment dosyasından veritabanı bilgilerini oku
$envFile = __DIR__ . '/database.env';
if (!file_exists($envFile)) {
    die("Veritabanı konfigürasyon dosyası bulunamadı!");
}

$envContent = file_get_contents($envFile);
$envLines = explode("\n", $envContent);

$dbConfig = [];
foreach ($envLines as $line) {
    $line = trim($line);
    if (empty($line) || strpos($line, '#') === 0) continue;
    
    if (strpos($line, '=') !== false) {
        list($key, $value) = explode('=', $line, 2);
        $dbConfig[trim($key)] = trim($value);
    }
}

// Veritabanı bağlantısını kur
$host = $dbConfig['DB_HOST'] ?? 'localhost';
$dbname = $dbConfig['DB_NAME'] ?? '';
$username = $dbConfig['DB_USER'] ?? '';
$password = $dbConfig['DB_PASS'] ?? '';

if (empty($dbname) || empty($username) || empty($password)) {
    die("Veritabanı bilgileri eksik! database.env dosyasını kontrol edin.");
}

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch(PDOException $e) {
    die("Veritabanı bağlantı hatası: " . $e->getMessage());
}
?>
