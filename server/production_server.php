<?php
/**
 * Production Server Router
 * Serves built frontend from client/dist and handles API endpoints
 */

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Handle API requests
if (strpos($uri, '/api/') === 0) {
    // Route to the API handler
    require_once __DIR__ . '/index.php';
    exit;
}

// Serve static files from client/dist
$frontendPath = __DIR__ . '/../client/dist';

// If file exists in dist, serve it
if ($uri !== '/' && file_exists($frontendPath . $uri)) {
    $filePath = $frontendPath . $uri;
    
    // Get file extension
    $ext = pathinfo($filePath, PATHINFO_EXTENSION);
    
    // Set appropriate content type
    $contentTypes = [
        'html' => 'text/html',
        'css' => 'text/css',
        'js' => 'application/javascript',
        'json' => 'application/json',
        'png' => 'image/png',
        'jpg' => 'image/jpeg',
        'jpeg' => 'image/jpeg',
        'gif' => 'image/gif',
        'svg' => 'image/svg+xml',
        'ico' => 'image/x-icon',
        'woff' => 'font/woff',
        'woff2' => 'font/woff2',
        'ttf' => 'font/ttf',
        'eot' => 'application/vnd.ms-fontobject'
    ];
    
    if (isset($contentTypes[$ext])) {
        header('Content-Type: ' . $contentTypes[$ext]);
    }
    
    readfile($filePath);
    exit;
}

// For all other routes, serve index.html (SPA routing)
if (file_exists($frontendPath . '/index.html')) {
    header('Content-Type: text/html');
    readfile($frontendPath . '/index.html');
    exit;
}

// If index.html doesn't exist, show error
http_response_code(500);
echo "Frontend build not found. Please run 'cd client && npm run build' first.";
