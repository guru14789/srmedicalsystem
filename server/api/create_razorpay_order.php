<?php
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../vendor/autoload.php';

use Razorpay\Api\Api;

try {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['amount']) || !isset($data['order_id'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'amount and order_id are required']);
        exit;
    }

    $amount = $data['amount'];
    $orderId = $data['order_id'];
    $customerName = $data['customer_name'] ?? '';
    $customerEmail = $data['customer_email'] ?? '';
    $customerContact = $data['customer_contact'] ?? '';
    
    $razorpayKeyId = getenv('RAZORPAY_KEY_ID');
    $razorpayKeySecret = getenv('RAZORPAY_KEY_SECRET');
    
    if (!$razorpayKeyId || !$razorpayKeySecret) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Razorpay credentials not configured']);
        exit;
    }
    
    // Build callback URL - MUST use HTTPS for Razorpay
    $callbackUrl = 'https://02aab10a-18b4-4218-b5de-1b79d180dfc2-00-10xijw07ml0xc.worf.replit.dev:8000/api/payment-callback';
    
    // Override if env var explicitly set
    if (getenv('PAYMENT_CALLBACK_URL')) {
        $callbackUrl = getenv('PAYMENT_CALLBACK_URL');
    }
    
    error_log("Creating Razorpay order - Amount: $amount, Order: $orderId, Callback: $callbackUrl");
    
    $api = new Api($razorpayKeyId, $razorpayKeySecret);
    
    $razorpayOrder = $api->order->create([
        'amount' => intval($amount * 100),
        'currency' => 'INR',
        'receipt' => $orderId,
        'notes' => [
            'order_id' => $orderId
        ]
    ]);
    
    error_log("Razorpay order created successfully: " . $razorpayOrder['id']);
    
    echo json_encode([
        'success' => true,
        'razorpay_order_id' => $razorpayOrder['id'],
        'amount' => $amount,
        'currency' => 'INR',
        'razorpay_key_id' => $razorpayKeyId,
        'callback_url' => $callbackUrl,
        'prefill' => [
            'name' => $customerName,
            'email' => $customerEmail,
            'contact' => $customerContact
        ]
    ]);
    
} catch (Exception $e) {
    error_log("Razorpay order creation error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
        'debug' => [
            'message' => $e->getMessage(),
            'code' => $e->getCode()
        ]
    ]);
}
