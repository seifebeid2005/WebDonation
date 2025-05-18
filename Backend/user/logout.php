<?php
// ---------------- CORS headers (must be FIRST before any output) ----------------
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");

// ---------------- Handle preflight request for CORS ----------------
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// ---------------- Session start and destroy ----------------
session_start();
session_unset();
session_destroy();

// ---------------- Respond with logout success ----------------
echo json_encode([
    "success" => true,
    "message" => "Logout successful."
]);