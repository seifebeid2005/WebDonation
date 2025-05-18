<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] !== 'POST' && $_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(200);
    exit();
}

session_start();
include("../config/database.php");

try {
    $data = json_decode(file_get_contents("php://input"), true);
    $action = $data['action'] ?? ($_GET['action'] ?? '');

    switch ($action) {
        case 'getUserData':
            getUserData($conn);
            break;
        case 'changePassword':
            changePassword($conn, $data);
            break;
        default:
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Invalid action"]);
            break;
    }
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Server error", "error" => $e->getMessage()]);
}

// 1. Get User Data (from session user_id)
function getUserData($con) {
    try {
        if (empty($_SESSION['user_id'])) {
            http_response_code(401);
            echo json_encode(["success" => false, "message" => "Not authenticated"]);
            return;
        }
        $userId = intval($_SESSION['user_id']);
        $query = "SELECT id, name, email, status, created_at, updated_at FROM users WHERE id = ?";
        $stmt = $con->prepare($query);
        $stmt->bind_param("i", $userId);
        $stmt->execute();
        $result = $stmt->get_result();
        if ($result && $row = $result->fetch_assoc()) {
            echo json_encode(["success" => true, "user" => $row, "message" => "User data retrieved successfully"]);
        } else {
            http_response_code(404);
            echo json_encode(["success" => false, "message" => "User not found"]);
        }
        $stmt->close();
    } catch (Throwable $e) {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Server error", "error" => $e->getMessage()]);
    }
}

// 2. Change Password (from session user_id)
function changePassword($con, $data) {
    try {
        if (empty($_SESSION['user_id'])) {
            http_response_code(401);
            echo json_encode(["success" => false, "message" => "Not authenticated"]);
            return;
        }
        if (empty($data['old_password']) || empty($data['new_password'])) {
            http_response_code(422);
            echo json_encode(["success" => false, "message" => "Missing required fields"]);
            return;
        }
        $userId = intval($_SESSION['user_id']);
        // Get current hashed password
        $stmt = $con->prepare("SELECT password_hash FROM users WHERE id = ?");
        $stmt->bind_param("i", $userId);
        $stmt->execute();
        $stmt->bind_result($currentHash);
        if ($stmt->fetch()) {
            $stmt->close();
            if (!password_verify($data['old_password'], $currentHash)) {
                http_response_code(403);
                echo json_encode(["success" => false, "message" => "Incorrect current password"]);
                return;
            }
            // Update to new password
            $newHash = password_hash($data['new_password'], PASSWORD_DEFAULT);
            $stmt2 = $con->prepare("UPDATE users SET password_hash = ?, updated_at = NOW() WHERE id = ?");
            $stmt2->bind_param("si", $newHash, $userId);
            if ($stmt2->execute()) {
                echo json_encode(["success" => true, "message" => "Password updated successfully"]);
            } else {
                http_response_code(500);
                echo json_encode(["success" => false, "message" => "Error updating password"]);
            }
            $stmt2->close();
        } else {
            $stmt->close();
            http_response_code(404);
            echo json_encode(["success" => false, "message" => "User not found"]);
        }
    } catch (Throwable $e) {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Server error", "error" => $e->getMessage()]);
    }
}
?>