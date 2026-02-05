<?php
/**
 * Environment Validation for Production Deployment
 * 
 * This script validates that all required environment variables
 * are set correctly before the application runs.
 */

function validateEnvironment() {
    $errors = [];
    
    // Check Razorpay Keys
    $razorpayKeyId = getenv('RAZORPAY_KEY_ID');
    $razorpayKeySecret = getenv('RAZORPAY_KEY_SECRET');
    
    if (empty($razorpayKeyId)) {
        $errors[] = "RAZORPAY_KEY_ID is not set";
    } elseif (substr($razorpayKeyId, 0, 9) !== 'rzp_live_') {
        $errors[] = "RAZORPAY_KEY_ID must use LIVE keys (rzp_live_) in production, found: " . substr($razorpayKeyId, 0, 10) . "...";
    }
    
    if (empty($razorpayKeySecret)) {
        $errors[] = "RAZORPAY_KEY_SECRET is not set";
    }
    
    // Check Firebase Service Account
    $firebaseServiceAccount = getenv('FIREBASE_SERVICE_ACCOUNT');
    if (empty($firebaseServiceAccount)) {
        $errors[] = "FIREBASE_SERVICE_ACCOUNT is not set";
    } else {
        $json = json_decode($firebaseServiceAccount, true);
        if (!$json || !isset($json['project_id']) || !isset($json['private_key'])) {
            $errors[] = "FIREBASE_SERVICE_ACCOUNT is not valid JSON or missing required fields";
        }
    }
    
    // Check URLs
    $frontendUrl = getenv('FRONTEND_URL');
    if (empty($frontendUrl)) {
        $errors[] = "FRONTEND_URL is not set";
    } elseif (substr($frontendUrl, 0, 8) !== 'https://' && substr($frontendUrl, 0, 7) !== 'http://') {
        $errors[] = "FRONTEND_URL must be a valid URL, found: " . $frontendUrl;
    }
    
    $callbackUrl = getenv('PAYMENT_CALLBACK_URL');
    if (empty($callbackUrl)) {
        $errors[] = "PAYMENT_CALLBACK_URL is not set";
    } elseif (substr($callbackUrl, 0, 8) !== 'https://' && substr($callbackUrl, 0, 7) !== 'http://') {
        $errors[] = "PAYMENT_CALLBACK_URL must be a valid URL, found: " . $callbackUrl;
    }
    
    // Check PHP Extensions
    $requiredExtensions = ['curl', 'json', 'mbstring', 'openssl'];
    foreach ($requiredExtensions as $ext) {
        if (!extension_loaded($ext)) {
            $errors[] = "Required PHP extension '$ext' is not loaded";
        }
    }
    
    return $errors;
}

// Auto-validate if called directly
if (php_sapi_name() === 'cli') {
    $errors = validateEnvironment();
    if (empty($errors)) {
        echo "✅ All environment variables are configured correctly!\n";
        exit(0);
    } else {
        echo "❌ Environment validation failed:\n";
        foreach ($errors as $error) {
            echo "  - $error\n";
        }
        exit(1);
    }
}
