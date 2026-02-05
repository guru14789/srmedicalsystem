, CURLOPT_HTTPHEADER, [
        'Authorization: Bearer ' . $accessToken,
        'Content-Type: application/json'
    ]);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($httpCode === 200) {
        return json_decode($response, true);
    }
    
    error_log("Firestore query failed: HTTP $httpCode, Response: $response");
    return null;
}

// Helper function to update Firestore document
function updateFirestoreDocument($projectId, $accessToken, $documentPath, $fields) {
    $url = "https://firestore.googleapis.com/v1/projects/$projectId/databases/(default)/documents/$documentPath";
    
    $updateData = [
        'fields' => $fields
    ];
    
    // Build URL with multiple updateMask.fieldPaths parameters (one for each field)
    $fieldPaths = array_keys($fields);
    $updateMaskParams = [];
    foreach ($fieldPaths as $fieldPath) {
        $updateMaskParams[] = 'updateMask.fieldPaths=' . urlencode($fieldPath);
    }
    $urlWithMask = $url . '?' . implode('&', $updateMaskParams);
    
    $ch = curl_init($urlWithMask);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PATCH');
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($updateData));
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Authorization: Bearer ' . $accessToken,
        'Content-Type: application/json'
    ]);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($httpCode === 200) {
        return json_decode($response, true);
    }
    
    error_log("Firestore update failed: HTTP $httpCode, Response: $response");
    return null;
}

// Helper function to get Firestore document
function getFirestoreDocument($projectId, $accessToken, $documentPath) {
    $url = "https://firestore.googleapis.com/v1/projects/$projectId/databases/(default)/documents/$documentPath";
    
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Authorization: Bearer ' . $accessToken
    ]);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($httpCode === 200) {
        return json_decode($response, true);
    }
    
    return null;
}

if (!empty($_POST['razorpay_payment_id']) && !empty($_POST['razorpay_order_id']) && !empty($_POST['razorpay_signature'])) {
    
    $razorpayOrderId = $_POST['razorpay_order_id'];
    $razorpayPaymentId = $_POST['razorpay_payment_id'];
    $razorpaySignature = $_POST['razorpay_signature'];
    
    error_log("Payment callback received: Razorpay Order=$razorpayOrderId, Payment=$razorpayPaymentId");
    
    $api = new Api($razorpayKeyId, $razorpayKeySecret);
    
    try {
        $attributes = [
            'razorpay_order_id'   => $razorpayOrderId,
            'razorpay_payment_id' => $razorpayPaymentId,
            'razorpay_signature'  => $razorpaySignature
        ];
        
        // Verify Razorpay signature
        $api->utility->verifyPaymentSignature($attributes);
        error_log("Razorpay signature verified successfully");
        
        if ($firebaseServiceAccount) {
            try {
                $serviceAccountData = json_decode($firebaseServiceAccount, true);
                if (!$serviceAccountData) {
                    throw new Exception('Invalid Firebase service account JSON');
                }
                
                $projectId = $serviceAccountData['project_id'];
                error_log("Firebase project ID: $projectId");
                
                // Get Firebase access token
                $accessToken = getFirebaseAccessToken($serviceAccountData);
                if (!$accessToken) {
                    throw new Exception('Failed to get Firebase access token');
                }
                error_log("Firebase access token obtained successfully");
                
                // Query payments collection for this razorpay_order_id
                $queryResult = queryFirestore($projectId, $accessToken, 'payments', 'razorpay_order_id', $razorpayOrderId);
                
                // Find the payment document in query results (iterate through results)
                $paymentDoc = null;
                if ($queryResult && is_array($queryResult)) {
                    foreach ($queryResult as $result) {
                        if (isset($result['document'])) {
                            $paymentDoc = $result['document'];
                            break;
                        }
                    }
                }
                
                if ($paymentDoc) {
                    $paymentDocPath = str_replace("projects/$projectId/databases/(default)/documents/", '', $paymentDoc['name']);
                    $paymentFields = $paymentDoc['fields'];
                    
                    // Get order_id from payment
                    $firestoreOrderId = $paymentFields['order_id']['stringValue'] ?? null;
                    
                    if (!$firestoreOrderId) {
                        error_log("Payment record missing order_id for Razorpay order: $razorpayOrderId");
                        $error = 'payment_missing_order_id';
                    } else {
                        error_log("Found payment record, Order ID: $firestoreOrderId");
                        
                        // Update payment record
                        $paymentUpdateFields = [
                            'razorpay_payment_id' => ['stringValue' => $razorpayPaymentId],
                            'razorpay_signature' => ['stringValue' => $razorpaySignature],
                            'status' => ['stringValue' => 'completed'],
                            'updated_at' => ['timestampValue' => gmdate('Y-m-d\TH:i:s\Z')]
                        ];
                        
                        $paymentUpdateResult = updateFirestoreDocument($projectId, $accessToken, $paymentDocPath, $paymentUpdateFields);
                        
                        if ($paymentUpdateResult) {
                            error_log("Payment record updated successfully");
                            
                            // Check if order exists
                            $orderDocPath = "orders/$firestoreOrderId";
                            $orderDoc = getFirestoreDocument($projectId, $accessToken, $orderDocPath);
                            
                            if (!$orderDoc) {
                                error_log("ERROR: Order document does not exist: $firestoreOrderId");
                                $error = 'order_not_found';
                            } else {
                                error_log("Order document exists, attempting update");
                                
                                // Update order record
                                $orderUpdateFields = [
                                    'status' => ['stringValue' => 'confirmed'],
                                    'payment_id' => ['stringValue' => $razorpayPaymentId],
                                    'payment_signature' => ['stringValue' => $razorpaySignature],
                                    'payment_status' => ['stringValue' => 'completed'],
                                    'updated_at' => ['timestampValue' => gmdate('Y-m-d\TH:i:s\Z')]
                                ];
                                
                                $orderUpdateResult = updateFirestoreDocument($projectId, $accessToken, $orderDocPath, $orderUpdateFields);
                                
                                if ($orderUpdateResult) {
                                    error_log("Order updated successfully!");
                                    error_log("Payment confirmed: Razorpay Order=$razorpayOrderId, Payment=$razorpayPaymentId, Firestore Order=$firestoreOrderId");
                                    $success = true;
                                    $paymentId = $razorpayPaymentId;
                                } else {
                                    error_log("Failed to update order document");
                                    $error = 'order_update_failed';
                                }
                            }
                        } else {
                            error_log("Failed to update payment document");
                            $error = 'payment_update_failed';
                        }
                    }
                } else {
                    error_log("No payment records found for Razorpay order: $razorpayOrderId");
                    $error = 'payment_record_not_found';
                }
                
            } catch (Exception $e) {
                error_log("Firebase error: " . $e->getMessage());
                error_log("Firebase error trace: " . $e->getTraceAsString());
                $error = 'firebase_error';
            }
        } else {
            error_log("Firebase service account not configured");
            $error = 'firebase_not_configured';
        }
        
    } catch(SignatureVerificationError $e) {
        error_log("Razorpay signature verification failed: " . $e->getMessage());
        $error = 'verification_failed';
    } catch (Exception $e) {
        error_log("Payment verification error: " . $e->getMessage());
        $error = 'unknown_error';
    }
} else {
    error_log("Missing payment data in callback");
    $error = 'missing_data';
}

if ($success && $firestoreOrderId) {
    error_log("Redirecting to success page: payment_id=$paymentId, order_id=$firestoreOrderId");
    header("Location: $frontendUrl/payment-success?payment_id=$paymentId&order_id=$firestoreOrderId");
} else {
    error_log("Redirecting to failed page: error=$error");
    header("Location: $frontendUrl/payment-failed?error=$error");
}
exit;
