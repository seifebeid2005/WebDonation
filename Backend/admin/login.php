<?php
session_start();
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST");

include("../config/database.php");

// Only proceed if method is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["error" => "Only POST requests are allowed"]);
    exit;
}

// Read the JSON input
$input = json_decode(file_get_contents("php://input"), true);

// Check if username and password are set
if (!isset($input['username']) || !isset($input['password'])) {
    echo json_encode(["error" => "Username and password are required"]);
    exit;
}

$username = $input['username'];
$password = $input['password'];

// Prepare and execute query securely using prepared statements
$stmt = $conn->prepare("SELECT id, username, password FROM admin WHERE username = ?");
$stmt->bind_param("s", $username); //string
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 1) {
    $user = $result->fetch_assoc();

    // Verify password (use password_hash when storing in DB)
    if (password_verify($password, $user['password'])) {
        $_SESSION['admin_id'] = $user['id'];
        $_SESSION['admin_username'] = $user['username'];

        echo json_encode(["success" => true, "message" => "Login successful", "username" => $user['username']]);
    } else {
        echo json_encode(["success" => false, "message" => "Invalid credentials"]);
    }
} else {
    echo json_encode(["success" => false, "message" => "User not found"]);
}

$stmt->close();
$conn->close();
?>
