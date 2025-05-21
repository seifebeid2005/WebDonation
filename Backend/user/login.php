<?php
// ---------------- CORS headers (must be FIRST before any output) ----------------
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");

// ---------------- Error reporting (disable in production) ----------------
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// ---------------- BOM Check (must be at the TOP, before any output) ----------------
$file = file_get_contents(__FILE__, false, null, 0, 3);
if ($file === "\xEF\xBB\xBF") {
    die(json_encode(["success" => false, "message" => "File contains BOM."]));
}

// ---------------- Session start ----------------
session_start();

try {
    include ('../config/database.php'); // Adjust this path if needed

    // Handle preflight request for CORS
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit();
    }

    // Read and parse JSON input
    $input = json_decode(file_get_contents("php://input"), true);
    $email = $input['email'] ?? null;
    $password = $input['password'] ?? null;

    login($conn, $email, $password);

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Server error", "error" => $e->getMessage()]);
}

// =================== LOGIN FUNCTION ===================
function login($conn, $email, $password) {
    if (empty($email) || empty($password)) {
        http_response_code(422);
        echo json_encode(["success" => false, "message" => "Email and password are required."]);
        return;
    }

    try {
        // Fetch user by email
        $stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($user = $result->fetch_assoc()) {
            // Verify password (password_hash required in DB)
            if (!password_verify($password, $user['password_hash'])) {
                echo json_encode(["success" => false, "message" => "Invalid email or password."]);
                return;
            }

            // Check user status
            if ($user['status'] !== "active") {
                echo json_encode(["success" => false, "message" => "Account is not active."]);
                return;
            }

            // Set session variables
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['user_email'] = $user['email'];
            $_SESSION['user_name'] = $user['name'];
            $_SESSION['user_status'] = $user['status'];
            $_SESSION['user_created_at'] = $user['created_at'];
            $_SESSION['user_updated_at'] = $user['updated_at'];

            echo json_encode([
                "success" => true,
                "message" => "Login successful.",
                "user" => [
                    "id" => $user['id'],
                    "name" => $user['name'],
                    "email" => $user['email'],
                    "status" => $user['status']
                ]
            ]);
        } else {
            echo json_encode(["success" => false, "message" => "Invalid email or password."]);
        }

        $stmt->close();
    } catch (Throwable $e) {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Server error", "error" => $e->getMessage()]);
    }
}
?>