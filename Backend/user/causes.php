<?php
session_start();

// CORS headers for any request
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

// Handle preflight OPTIONS request for CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include("../config/database.php");

// Only respond to GET requests
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $sql = "SELECT id, title, description, short_description, image_url, goal_amount, raised_amount, currency, category, start_date, end_date, is_featured, is_active, status, created_by, created_at, updated_at FROM causes";
        $result = $conn->query($sql);

        $causes = [];
        while ($row = $result->fetch_assoc()) {
            $causes[] = $row;
        }

        echo json_encode([
            "success" => true,
            "data" => $causes
        ]);
    } catch (Throwable $e) {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "message" => "Server error",
            "error" => $e->getMessage()
        ]);
    }
    exit();
}

// If not GET, show method not allowed
http_response_code(405);
echo json_encode([
    "success" => false,
    "message" => "Method not allowed"
]);
exit();
?>