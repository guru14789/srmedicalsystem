<?php
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../vendor/autoload.php';

use Razorpay\Api\Api;
use Razorpay\Api\Errors\SignatureVerificationError;

try {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $requiredFields = ['razorpay_order_id', 'razorpay_payment_id', 'razorpay_signature'];
    foreach ($requiredFields as $field) {
        if (!isset($data[$field])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => "$field is required"]);
            exit;
        }
    }
    
    $razorpayKeyId = getenv('RAZORPAY_KEY_ID');
    $razorpayKeySecret = getenv('RAZORPAY_KEY_SECRET');
    
    if (!$razorpayKeyId || !$razorpayKeySecret) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Razorpay credentials not configured']);
        exit;
    }
    
    $api = new Api($razorpayKeyId, $razorpayKeySecret);
    
    $attributes = [
        'razorpay_order_id' => $data['razorpay_order_id'],
        'razorpay_payment_id' => $data['razorpay_payment_id'],
        'razorpay_signature' => $data['razorpay_signature']
    ];
    
    try {
        $api->utility->verifyPaymentSignature($attributes);
        
        echo json_encode([
            'success' => true,
            'verified' => true,
            'message' => 'Payment signature verified successfully'
        ]);
        
    } catch (SignatureVerificationError $e) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'verified' => false,
            'error' => 'Invalid payment signature'
        ]);
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
