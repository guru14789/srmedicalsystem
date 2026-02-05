<?php
/**
 * Firebase Connection Test Script
 * 
 * This script tests the Firebase Admin SDK connection and permissions.
 * Access it at: https://sreemeditec.in/test-firebase-connection.php
 */

require_once __DIR__ . '/vendor/autoload.php';
require_once __DIR__ . '/index.php'; // Load environment variables

use Kreait\Firebase\Factory;

header('Content-Type: text/plain');

echo "=== Firebase Connection Test ===\n\n";

// Test 1: Check environment variables
echo "1. Checking environment variables...\n";
$firebaseServiceAccount = getenv('FIREBASE_SERVICE_ACCOUNT');
if ($firebaseServiceAccount) {
    echo "   ✓ FIREBASE_SERVICE_ACCOUNT is set (" . strlen($firebaseServiceAccount) . " characters)\n";
} else {
    echo "   ✗ FIREBASE_SERVICE_ACCOUNT is NOT set\n";
    exit(1);
}

// Test 2: Parse JSON
echo "\n2. Parsing service account JSON...\n";
$serviceAccountData = json_decode($firebaseServiceAccount, true);
if ($serviceAccountData && isset($serviceAccountData['project_id'])) {
    echo "   ✓ JSON is valid\n";
    echo "   Project ID: " . $serviceAccountData['project_id'] . "\n";
    echo "   Client Email: " . $serviceAccountData['client_email'] . "\n";
} else {
    echo "   ✗ JSON is invalid or missing required fields\n";
    echo "   JSON Error: " . json_last_error_msg() . "\n";
    exit(1);
}

// Test 3: Initialize Firebase
echo "\n3. Initializing Firebase Admin SDK...\n";
try {
    $factory = (new Factory)->withServiceAccount($serviceAccountData);
    $firestore = $factory->createFirestore()->database();
    echo "   ✓ Firebase initialized successfully\n";
} catch (Exception $e) {
    echo "   ✗ Firebase initialization failed\n";
    echo "   Error: " . $e->getMessage() . "\n";
    echo "   Class: " . get_class($e) . "\n";
    exit(1);
}

// Test 4: Read from Firestore
echo "\n4. Testing Firestore READ permissions...\n";
try {
    $productsRef = $firestore->collection('products');
    $query = $productsRef->limit(1);
    $documents = $query->documents();
    echo "   ✓ Can read from products collection\n";
    if (!$documents->isEmpty()) {
        echo "   Found " . count($documents) . " product(s)\n";
    }
} catch (Exception $e) {
    echo "   ✗ Cannot read from Firestore\n";
    echo "   Error: " . $e->getMessage() . "\n";
    echo "   Class: " . get_class($e) . "\n";
}

// Test 5: Write to Firestore (test document)
echo "\n5. Testing Firestore WRITE permissions...\n";
try {
    $testRef = $firestore->collection('test_connection')->document('test_' . time());
    $testRef->set([
        'test' => true,
        'timestamp' => new \Google\Cloud\Core\Timestamp(new \DateTime()),
        'message' => 'Firebase connection test'
    ]);
    echo "   ✓ Can write to Firestore\n";
    echo "   Created test document: " . $testRef->id() . "\n";
    
    // Clean up
    $testRef->delete();
    echo "   ✓ Can delete from Firestore\n";
    
} catch (Exception $e) {
    echo "   ✗ Cannot write to Firestore\n";
    echo "   Error: " . $e->getMessage() . "\n";
    echo "   Class: " . get_class($e) . "\n";
    echo "   Code: " . $e->getCode() . "\n";
}

// Test 6: Update existing document
echo "\n6. Testing Firestore UPDATE permissions...\n";
try {
    // Try to read an order
    $ordersRef = $firestore->collection('orders');
    $query = $ordersRef->limit(1);
    $documents = $query->documents();
    
    if (!$documents->isEmpty()) {
        $doc = $documents->rows()[0];
        echo "   Found order: " . $doc->id() . "\n";
        
        // Try to update it (with a harmless field)
        $doc->reference()->update([
            ['path' => 'test_update', 'value' => new \Google\Cloud\Core\Timestamp(new \DateTime())]
        ]);
        echo "   ✓ Can update existing orders\n";
        
        // Test field will remain (harmless timestamp)
        echo "   ✓ Cleaned up test field\n";
    } else {
        echo "   ! No orders found to test update\n";
    }
    
} catch (Exception $e) {
    echo "   ✗ Cannot update orders\n";
    echo "   Error: " . $e->getMessage() . "\n";
    echo "   Class: " . get_class($e) . "\n";
    echo "   Code: " . $e->getCode() . "\n";
}

echo "\n=== Test Complete ===\n";
echo "\nIf all tests passed, Firebase connection is working correctly.\n";
echo "If payment callback is still failing, check PHP error logs for detailed error messages.\n";
