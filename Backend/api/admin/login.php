<?php
session_start();
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include_once "../../config/database.php";

// Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['message' => 'Method not allowed']);
    exit();
}

// Get the request data
$data = json_decode(file_get_contents("php://input"));

// Check if username and password are provided
if (!isset($data->username) || !isset($data->password)) {
    http_response_code(400);
    echo json_encode(['message' => 'Username and password are required']);
    exit();
}

// Sanitize inputs
$username = htmlspecialchars(strip_tags($data->username));
$password = $data->password;

// Query to check if admin exists
$query = "SELECT id, username, password FROM admins WHERE username = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $admin = $result->fetch_assoc();
    
    // Verify password (using password_verify for hashed passwords)
    if (password_verify($password, $admin['password'])) {
        // Password is correct, create session
        $_SESSION['admin_id'] = $admin['id'];
        $_SESSION['admin_username'] = $admin['username'];
        $_SESSION['is_admin'] = true;
        
        // Return success response
        http_response_code(200);
        echo json_encode([
            'message' => 'Login successful',
            'admin' => [
                'id' => $admin['id'],
                'username' => $admin['username']
            ]
        ]);
    } else {
        // Password is incorrect
        http_response_code(401);
        echo json_encode(['message' => 'Invalid credentials']);
    }
} else {
    // Admin not found
    http_response_code(401);
    echo json_encode(['message' => 'Invalid credentials']);
}

$stmt->close();
$conn->close();
?> 