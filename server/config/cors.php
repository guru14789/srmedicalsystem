<?php
// CORS Configuration - Production and Development
$allowedOrigins = [
    'https://sreemeditec.in',
    'https://www.sreemeditec.in'
];

// Add Replit dev domain for testing (auto-detect)
if (isset($_SERVER['HTTP_ORIGIN'])) {
    if (strpos($_SERVER['HTTP_ORIGIN'], 'replit.dev') !== false || 
        strpos($_SERVER['HTTP_ORIGIN'], 'repl.co') !== false) {
        // Allow all Replit dev domains for testing
        $allowedOrigins[] = $_SERVER['HTTP_ORIGIN'];
    }
}

$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';

// Handle OPTIONS preflight first
if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    if (in_array($origin, $allowedOrigins)) {
        header("Access-Control-Allow-Origin: $origin");
        header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Authorization");
        http_response_code(200);
    } else {
        http_response_code(403);
    }
    exit();
}

// For actual requests, check origin
if (in_array($origin, $allowedOrigins)) {
    header("Access-Control-Allow-Origin: $origin");
    header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
}

header("Content-Type: application/json");
