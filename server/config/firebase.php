<?php
require_once __DIR__ . '/../vendor/autoload.php';

use Kreait\Firebase\Factory;

function getFirestore() {
    $serviceAccount = getenv('FIREBASE_SERVICE_ACCOUNT');
    
    if (!$serviceAccount) {
        throw new Exception('FIREBASE_SERVICE_ACCOUNT environment variable not set');
    }
    
    $factory = (new Factory)
        ->withServiceAccount(json_decode($serviceAccount, true));
    
    return $factory->createFirestore()->database();
}
