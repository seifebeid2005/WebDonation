<?php
session_start();
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include_once "../../config/database.php";

// Check if user is logged in as admin
if (!isset($_SESSION['is_admin']) || $_SESSION['is_admin'] !== true) {
    http_response_code(401);
    echo json_encode(['message' => 'Unauthorized']);
    exit();
}

// GET - Retrieve all users
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $query = "SELECT id, name, email, created_at, status FROM users ORDER BY id DESC";
        $result = $conn->query($query);
        
        $users = [];
        while ($row = $result->fetch_assoc()) {
            $users[] = [
                'id' => $row['id'],
                'name' => $row['name'],
                'email' => $row['email'],
                'created_at' => $row['created_at'],
                'status' => $row['status'] ?? 'active'
            ];
        }
        
        http_response_code(200);
        echo json_encode($users);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['message' => 'Error fetching users: ' . $e->getMessage()]);
    }
}

// PUT - Update user
else if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    try {
        // Get the request data
        $data = json_decode(file_get_contents("php://input"));
        
        // Check if required fields are provided
        if (!isset($data->id) || !isset($data->name) || !isset($data->email) || !isset($data->status)) {
            http_response_code(400);
            echo json_encode(['message' => 'Missing required fields']);
            exit();
        }
        
        // Sanitize inputs
        $id = htmlspecialchars(strip_tags($data->id));
        $name = htmlspecialchars(strip_tags($data->name));
        $email = htmlspecialchars(strip_tags($data->email));
        $status = htmlspecialchars(strip_tags($data->status));
        
        // Update user
        $query = "UPDATE users SET name = ?, email = ?, status = ? WHERE id = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("sssi", $name, $email, $status, $id);
        
        if ($stmt->execute()) {
            http_response_code(200);
            echo json_encode(['message' => 'User updated successfully']);
        } else {
            http_response_code(500);
            echo json_encode(['message' => 'Error updating user']);
        }
        
        $stmt->close();
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['message' => 'Error updating user: ' . $e->getMessage()]);
    }
}

// DELETE - Delete user
else if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    try {
        // Get the user ID from the query string
        if (!isset($_GET['id'])) {
            http_response_code(400);
            echo json_encode(['message' => 'User ID is required']);
            exit();
        }
        
        $id = htmlspecialchars(strip_tags($_GET['id']));
        
        // Delete user
        $query = "DELETE FROM users WHERE id = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("i", $id);
        
        if ($stmt->execute()) {
            // Also delete related data (donations, etc.)
            $query = "DELETE FROM donations WHERE user_id = ?";
            $stmt = $conn->prepare($query);
            $stmt->bind_param("i", $id);
            $stmt->execute();
            
            http_response_code(200);
            echo json_encode(['message' => 'User deleted successfully']);
        } else {
            http_response_code(500);
            echo json_encode(['message' => 'Error deleting user']);
        }
        
        $stmt->close();
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['message' => 'Error deleting user: ' . $e->getMessage()]);
    }
}

// Method not allowed
else {
    http_response_code(405);
    echo json_encode(['message' => 'Method not allowed']);
}

$conn->close();
?> 