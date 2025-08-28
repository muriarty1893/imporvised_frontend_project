<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// Get JSON input
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid JSON data']);
    exit;
}

// Validate required fields
$required_fields = ['firstName', 'lastName', 'phone', 'email', 'address', 'cartItem'];
foreach ($required_fields as $field) {
    if (empty($data[$field])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => "Missing required field: $field"]);
        exit;
    }
}

// Validate email
if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid email format']);
    exit;
}

try {
    // Include database connection
    require_once '../config/database.php';
    
    // Prepare order data
    $firstName = trim($data['firstName']);
    $lastName = trim($data['lastName']);
    $phone = trim($data['phone']);
    $email = trim($data['email']);
    $address = trim($data['address']);
    $cartItem = $data['cartItem'];
    
    // Generate order number
    $orderNumber = 'GOP-' . date('Ymd') . '-' . str_pad(rand(1, 9999), 4, '0', STR_PAD_LEFT);
    
    // Start transaction
    $pdo->beginTransaction();
    
    // Insert customer data
    $customerStmt = $pdo->prepare("
        INSERT INTO customers (first_name, last_name, phone, email, address, created_at) 
        VALUES (?, ?, ?, ?, ?, NOW())
        ON DUPLICATE KEY UPDATE 
        first_name = VALUES(first_name),
        last_name = VALUES(last_name),
        phone = VALUES(phone),
        address = VALUES(address),
        updated_at = NOW()
    ");
    
    $customerStmt->execute([$firstName, $lastName, $phone, $email, $address]);
    $customerId = $pdo->lastInsertId();
    
    // If customer already exists, get the ID
    if ($customerId == 0) {
        $existingCustomer = $pdo->prepare("SELECT id FROM customers WHERE email = ?");
        $existingCustomer->execute([$email]);
        $customerId = $existingCustomer->fetchColumn();
    }
    
    // Insert order
    $orderStmt = $pdo->prepare("
        INSERT INTO orders (
            order_number, customer_id, product_type, product_color, product_size, 
            quantity, unit_price, size_multiplier, subtotal, discount, total, 
            status, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', NOW())
    ");
    
    $orderStmt->execute([
        $orderNumber,
        $customerId,
        $cartItem['typeName'],
        $cartItem['colorName'],
        $cartItem['size'],
        $cartItem['quantity'],
        $cartItem['unitPrice'],
        $cartItem['sizeMultiplier'],
        $cartItem['subtotal'],
        $cartItem['discount'],
        $cartItem['total']
    ]);
    
    $orderId = $pdo->lastInsertId();
    
    // Commit transaction
    $pdo->commit();
    
    // Send success response
    echo json_encode([
        'success' => true,
        'message' => 'Siparişiniz başarıyla alındı!',
        'order_number' => $orderNumber,
        'order_id' => $orderId
    ]);
    
} catch (PDOException $e) {
    // Rollback transaction on error
    if ($pdo->inTransaction()) {
        $pdo->rollback();
    }
    
    error_log("Order submission error: " . $e->getMessage());
    
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Veritabanı hatası oluştu. Lütfen tekrar deneyiniz.'
    ]);
    
} catch (Exception $e) {
    error_log("General order error: " . $e->getMessage());
    
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Bir hata oluştu. Lütfen tekrar deneyiniz.'
    ]);
}
?>
