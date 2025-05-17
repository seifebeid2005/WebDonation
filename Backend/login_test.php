<?php
// Set content type to JSON
header("Content-Type: application/json");

// Return a simple JSON response
echo json_encode([
    'success' => true,
    'message' => 'This is a test login response',
    'timestamp' => time(),
    'date' => date('Y-m-d H:i:s')
]);
?> 