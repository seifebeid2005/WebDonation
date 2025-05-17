<?php

session_start();
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST");

include("../config/database.php");

ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/../logs/php-error.log');

$response = ['success' => false, 'data' => null, 'message' => ''];

try {
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        // Check if user is logged in via session
        if (!isset($_SESSION['user_id'])) {
            $userId = 1;
            
            $stmt = $conn->prepare("SELECT id, name, email, status, created_at, updated_at FROM users WHERE id = ?");
            $stmt->bind_param("i", $userId);
            $stmt->execute();
            $result = $stmt->get_result();
            
            if ($result->num_rows > 0) {
                $userData = $result->fetch_assoc();
                $response = [
                    'success' => true,
                    'data' => $userData,
                    'message' => 'User profile retrieved successfully'
                ];
            } else {
                $response['message'] = 'User not found';
            }
            $stmt->close();
        } else {
            $response['message'] = 'Not authenticated';
        }
    } elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Alternative method to get profile by user ID (for admin purposes maybe)
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($data['user_id'])) {
            $userId = 1;
            
            $stmt = $conn->prepare("SELECT id, name, email, status, created_at, updated_at FROM users WHERE id = ?");
            $stmt->bind_param("i", $userId);
            $stmt->execute();
            $result = $stmt->get_result();
            
            if ($result->num_rows > 0) {
                $userData = $result->fetch_assoc();
                $response = [
                    'success' => true,
                    'data' => $userData,
                    'message' => 'User profile retrieved successfully'
                ];
            } else {
                $response['message'] = 'User not found';
            }
            $stmt->close();
        } else {
            $response['message'] = 'User ID not provided';
        }
    } else {
        $response['message'] = 'Invalid request method';
    }
} catch (Exception $e) {
    $response['message'] = 'Error: ' . $e->getMessage();
}

$conn->close();
echo json_encode($response);
?>