<?php
// ---------------- CORS headers (must be FIRST before any output) ----------------
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, OPTIONS");

// ---------------- BOM Check (must be at the TOP, before any output) ----------------
$file = file_get_contents(__FILE__, false, null, 0, 3);
if ($file === "\xEF\xBB\xBF") {
    die(json_encode(["success" => false, "message" => "File contains BOM."]));
}

// ---------------- Session start ----------------
session_start();

// Handle preflight request for CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Check if user is logged in
if (
    isset(
        $_SESSION['user_id'],
        $_SESSION['user_name'],
        $_SESSION['user_email'],
        $_SESSION['user_password_hash'],
        $_SESSION['user_status'],
        $_SESSION['user_created_at'],
        $_SESSION['user_updated_at']
    )
) {
    echo json_encode([
        "success" => true,
        "user" => [
            "id" => $_SESSION['user_id'],
            "name" => $_SESSION['user_name'],
            "email" => $_SESSION['user_email'],
            "password_hash" => $_SESSION['user_password_hash'],
            "status" => $_SESSION['user_status'],
            "created_at" => $_SESSION['user_created_at'],
            "updated_at" => $_SESSION['user_updated_at']
        ]
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "User not logged in."
    ]);
}
?>