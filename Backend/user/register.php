<?php
session_start();

// CORS headers
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");

try {
    include '../config/database.php'; // Adjust this path if needed

    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { 
        http_response_code(200);
        exit();
    }

    $input = json_decode(file_get_contents("php://input"), true);
    $name = $input['name'] ?? null;
    $email = $input['email'] ?? null;
    $password = $input['password'] ?? null;

    register($conn, $name, $email, $password);

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Server error", "error" => $e->getMessage()]);
}

// =================== REGISTER FUNCTION ===================
function register($conn, $name, $email, $password) {
    if (empty($name) || empty($email) || empty($password)) {
        http_response_code(422);
        echo json_encode(["success" => false, "message" => "Name, email, and password are required."]);
        return;
    }

    try {
        // Check if user already exists
        $check = $conn->prepare("SELECT id FROM users WHERE email = ?");
        $check->bind_param("s", $email);
        $check->execute();
        $check->store_result();
        if ($check->num_rows > 0) {
            echo json_encode(["success" => false, "message" => "Email already registered."]);
            return;
        }

        // Hash the password
        $passwordHash = password_hash($password, PASSWORD_DEFAULT);

        // Insert user
        $stmt = $conn->prepare("INSERT INTO users (name, email, password_hash, status) VALUES (?, ?, ?, 'active')");
        $stmt->bind_param("sss", $name, $email, $passwordHash);
        $stmt->execute();

        if ($stmt->affected_rows === 1) {
            echo json_encode(["success" => true, "message" => "Registration successful."]);
        } else {
            echo json_encode(["success" => false, "message" => "Failed to register."]);
        }

        $check->close();
        $stmt->close();
    } catch (Throwable $e) {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Server error", "error" => $e->getMessage()]);
    }
}