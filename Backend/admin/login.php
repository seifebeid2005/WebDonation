<?php
session_start();
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");

include("../config/database.php");

$data = json_decode(file_get_contents("php://input"), true);
$username = trim($data['username'] ?? '');
$password = $data['password'] ?? '';

if (empty($username) || empty($password)) {
    echo json_encode(["success" => false, "message" => "Username and password required."]);
    exit;
}

$stmt = $conn->prepare("SELECT id, name, email, password, role, status FROM admins WHERE name = ? OR email = ? LIMIT 1");
$stmt->bind_param("ss", $username, $username);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows === 0) {
    echo json_encode(["success" => false, "message" => "Invalid username/email or password."]);
    $stmt->close();
    exit;
}

$stmt->bind_result($id, $db_name, $db_email, $db_password, $role, $status);
$stmt->fetch();

// ⚠️ Plain text password check
if ($password !== $db_password) {
    echo json_encode(["success" => false, "message" => "Invalid username/email or password."]);
    $stmt->close();
    exit;
}

if ($status !== 'active') {
    echo json_encode(["success" => false, "message" => "Account is not active."]);
    $stmt->close();
    exit;
}

$_SESSION['admin_id'] = $id;
$_SESSION['admin_username'] = $db_name;
$_SESSION['admin_role'] = $role;

$stmt->close();

echo json_encode([
    "success" => true,
    "message" => "Login successful.",
    "admin" => [
        "id" => $id,
        "name" => $db_name,
        "email" => $db_email,
        "role" => $role,
        "status" => $status
    ]
]);
?>
