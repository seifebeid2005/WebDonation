<?php
// Disable PHP errors in output
ini_set('display_errors', 0);
error_reporting(0);

// Set content type to JSON
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Return a simple JSON response
echo json_encode([
    'success' => true,
    'message' => 'JSON test successful',
    'timestamp' => time(),
    'date' => date('Y-m-d H:i:s')
]);
?> 