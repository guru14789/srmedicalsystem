<?php
require_once __DIR__ . '/config/cors.php';

// Load .env file if it exists (only for values not already set in environment)
if (file_exists(__DIR__ . '/.env')) {
    $lines = file(__DIR__ . '/.env', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        // Skip comments and empty lines
        if (strpos(trim($line), '#') === 0 || trim($line) === '') {
            continue;
        }
        
        // Parse KEY=VALUE
        if (strpos($line, '=') !== false) {
            list($key, $value) = explode('=', $line, 2);
            $key = trim($key);
            $value = trim($value);
            
            // Only set if not already defined (Replit env vars take priority)
            if (!empty($key) && getenv($key) === false) {
                putenv("$key=$value");
                $_ENV[$key] = $value;
                $_SERVER[$key] = $value;
            }
        }
    }
}

// Validate environment only for production (skip for development/staging)
$isProduction = (getenv('ENVIRONMENT') === 'production') || (isset($_SERVER['HTTP_HOST']) && strpos($_SERVER['HTTP_HOST'], 'sreemeditec.in') !== false);

if ($isProduction) {
    require_once __DIR__ . '/config/validate_env.php';
    $envErrors = validateEnvironment();
    if (!empty($envErrors)) {
        http_response_code(500);
        echo json_encode([
            'error' => 'Server configuration error',
            'message' => 'Please check server logs for details.'
        ]);
        error_log('Environment validation failed: ' . implode(', ', $envErrors));
        exit();
    }
}

$requestUri = $_SERVER['REQUEST_URI'];
$requestMethod = $_SERVER['REQUEST_METHOD'];

$path = parse_url($requestUri, PHP_URL_PATH);
$path = str_replace('/api', '', $path);

switch ($path) {
    case '/create-razorpay-order':
        if ($requestMethod === 'POST') {
            require __DIR__ . '/api/create_razorpay_order.php';
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
        }
        break;
        
    case '/verify-razorpay-payment':
        if ($requestMethod === 'POST') {
            require __DIR__ . '/api/verify_razorpay_payment.php';
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
        }
        break;
        
    case '/payment-callback':
        if ($requestMethod === 'POST') {
            require __DIR__ . '/api/payment-callback.php';
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
        }
        break;
        
    case '/health':
        echo json_encode([
            'status' => 'ok',
            'message' => 'Razorpay API server is running'
        ]);
        break;
        
    default:
        http_response_code(404);
        echo json_encode(['error' => 'Endpoint not found']);
        break;
}
