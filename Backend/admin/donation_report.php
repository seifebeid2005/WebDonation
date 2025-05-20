<?php
session_start();
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET");

include("../config/database.php");

// Utility function for JSON response
function json_response($data, $status = 200) {
    http_response_code($status);
    echo json_encode($data);
    exit;
}

// Require admin authentication
if (!isset($_SESSION['admin_id'])) {
    json_response([
        "success" => false,
        "message" => "Unauthorized. Please log in as admin."
    ], 401);
}

$method = $_SERVER['REQUEST_METHOD'];

// GET: Fetch all donation records with user and cause names
if ($method === 'GET') {
    $query = "
        SELECT 
            d.id,
            u.username AS user_name,
            c.title AS cause_name,
            d.amount,
            d.currency,
            d.created_at,
            d.status
        FROM donations d
        LEFT JOIN users u ON d.user_id = u.id
        LEFT JOIN causes c ON d.cause_id = c.id
        ORDER BY d.created_at DESC
    ";

    $result = $conn->query($query);

    if (!$result) {
        json_response([
            "success" => false,
            "message" => "Database error: " . $conn->error
        ], 500);
    }

    $report = [];
    while ($row = $result->fetch_assoc()) {
        $report[] = $row;
    }

    json_response([
        "success" => true,
        "data" => $report
    ]);
}

json_response([
    "success" => false,
    "message" => "Invalid request method."
], 405);