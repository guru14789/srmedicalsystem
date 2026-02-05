<?php
/**
 * CORS Configuration for Production (Hostinger)
 * 
 * IMPORTANT: Copy this file to cors.php on Hostinger
 * and update $allowedOrigins with your actual domain(s).
 * 
 * This replaces the development cors.php which allows all origins (*).
 */

// ======================================
// UPDATE THESE WITH YOUR ACTUAL DOMAINS
// ======================================
$allowedOrigins = [
    'https://sreemeditec.com',
    'https://www.sreemeditec.com'
];

// Get the requesting origin
$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';

// Check if the origin is allowed
if (in_array($origin, $allowedOrigins)) {
    header("Access-Control-Allow-Origin: $origin");
} else {
    // Fallback to primary domain (or deny by not setting header)
    header("Access-Control-Allow-Origin: https://sreemeditec.com");
}

header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
