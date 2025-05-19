<?php
session_start();
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST");

// ---------------- Handle preflight request for CORS ----------------
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// ---------------- Include database connection ----------------
include("../config/database.php");

try {
    // ---------------- Read and parse JSON input ----------------
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $input = json_decode(file_get_contents("php://input"), true);
        $message = $input['message'] ?? null;

        // ---------------- Validate input ----------------
        if (empty($message)) {
            http_response_code(422);
            echo json_encode(["success" => false, "message" => "Message is required."]);
            exit();
        }

        // ---------------- Get user ID (0 if not logged in) ----------------
        $user_id = $_SESSION['user_id'];

        // ---------------- Insert message into notifications table ----------------
        $stmt = $conn->prepare("INSERT INTO notifications (user_id, message) VALUES (?, ?)");
        $stmt->bind_param("is", $user_id, $message);

        if ($stmt->execute()) {
            echo json_encode(["success" => true, "message" => "Message saved successfully."]);
        } else {
            http_response_code(500);
            echo json_encode(["success" => false, "message" => "Database error."]);
        }

        $stmt->close();
        $conn->close();
    } else {
        // For non-POST requests (e.g., GET), just confirm session
        echo json_encode(["success" => true, "message" => "Session active."]);
    }

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Server error",
        "error" => $e->getMessage()
    ]);
}
