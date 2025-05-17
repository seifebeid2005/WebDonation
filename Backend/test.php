<?php
// Disable error display for production
// ini_set('display_errors', 0);
// error_reporting(0);

// Enable error display for debugging
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Set content type to JSON
header("Content-Type: application/json");

// Test database connection
$host = "localhost";
$user = "root";
$password = "root";
$database = "webdonation";

try {
    // Create connection
    $conn = new mysqli($host, $user, $password, $database);
    
    // Check connection
    if ($conn->connect_error) {
        throw new Exception("Connection failed: " . $conn->connect_error);
    }
    
    // Check if admins table exists
    $result = $conn->query("SHOW TABLES LIKE 'admins'");
    $tableExists = $result->num_rows > 0;
    
    // Return success response
    echo json_encode([
        'success' => true,
        'message' => 'Connection successful',
        'database_info' => [
            'host' => $host,
            'user' => $user,
            'database' => $database,
            'connected' => true,
            'admins_table_exists' => $tableExists
        ]
    ]);
    
} catch (Exception $e) {
    // Return error response
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?> 