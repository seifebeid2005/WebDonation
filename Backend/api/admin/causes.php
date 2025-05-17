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

// GET - Retrieve all causes
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $query = "SELECT c.id, c.title, c.description, c.goal_amount, c.current_amount, 
                 c.image_url, c.status, c.created_at, COUNT(d.id) as donation_count
                 FROM causes c
                 LEFT JOIN donations d ON c.id = d.cause_id
                 GROUP BY c.id
                 ORDER BY c.id DESC";
        $result = $conn->query($query);
        
        $causes = [];
        while ($row = $result->fetch_assoc()) {
            $causes[] = [
                'id' => $row['id'],
                'title' => $row['title'],
                'description' => $row['description'],
                'goal_amount' => $row['goal_amount'],
                'current_amount' => $row['current_amount'],
                'image_url' => $row['image_url'],
                'status' => $row['status'],
                'created_at' => $row['created_at'],
                'donation_count' => $row['donation_count']
            ];
        }
        
        http_response_code(200);
        echo json_encode($causes);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['message' => 'Error fetching causes: ' . $e->getMessage()]);
    }
}

// POST - Create new cause
else if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        // Get the request data
        $data = json_decode(file_get_contents("php://input"));
        
        // Check if required fields are provided
        if (!isset($data->title) || !isset($data->description) || !isset($data->goal_amount)) {
            http_response_code(400);
            echo json_encode(['message' => 'Missing required fields']);
            exit();
        }
        
        // Sanitize inputs
        $title = htmlspecialchars(strip_tags($data->title));
        $description = htmlspecialchars(strip_tags($data->description));
        $goal_amount = htmlspecialchars(strip_tags($data->goal_amount));
        $current_amount = isset($data->current_amount) ? htmlspecialchars(strip_tags($data->current_amount)) : 0;
        $image_url = isset($data->image_url) ? htmlspecialchars(strip_tags($data->image_url)) : '';
        $status = isset($data->status) ? htmlspecialchars(strip_tags($data->status)) : 'active';
        
        // Create cause
        $query = "INSERT INTO causes (title, description, goal_amount, current_amount, image_url, status) 
                 VALUES (?, ?, ?, ?, ?, ?)";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("ssddss", $title, $description, $goal_amount, $current_amount, $image_url, $status);
        
        if ($stmt->execute()) {
            $cause_id = $stmt->insert_id;
            http_response_code(201);
            echo json_encode([
                'message' => 'Cause created successfully',
                'id' => $cause_id
            ]);
        } else {
            http_response_code(500);
            echo json_encode(['message' => 'Error creating cause']);
        }
        
        $stmt->close();
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['message' => 'Error creating cause: ' . $e->getMessage()]);
    }
}

// PUT - Update cause
else if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    try {
        // Get the request data
        $data = json_decode(file_get_contents("php://input"));
        
        // Check if required fields are provided
        if (!isset($data->id) || !isset($data->title) || !isset($data->description) || 
            !isset($data->goal_amount) || !isset($data->current_amount)) {
            http_response_code(400);
            echo json_encode(['message' => 'Missing required fields']);
            exit();
        }
        
        // Sanitize inputs
        $id = htmlspecialchars(strip_tags($data->id));
        $title = htmlspecialchars(strip_tags($data->title));
        $description = htmlspecialchars(strip_tags($data->description));
        $goal_amount = htmlspecialchars(strip_tags($data->goal_amount));
        $current_amount = htmlspecialchars(strip_tags($data->current_amount));
        $image_url = isset($data->image_url) ? htmlspecialchars(strip_tags($data->image_url)) : '';
        $status = isset($data->status) ? htmlspecialchars(strip_tags($data->status)) : 'active';
        
        // Update cause
        $query = "UPDATE causes SET title = ?, description = ?, goal_amount = ?, 
                 current_amount = ?, image_url = ?, status = ? WHERE id = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("ssddssi", $title, $description, $goal_amount, $current_amount, $image_url, $status, $id);
        
        if ($stmt->execute()) {
            http_response_code(200);
            echo json_encode(['message' => 'Cause updated successfully']);
        } else {
            http_response_code(500);
            echo json_encode(['message' => 'Error updating cause']);
        }
        
        $stmt->close();
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['message' => 'Error updating cause: ' . $e->getMessage()]);
    }
}

// DELETE - Delete cause
else if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    try {
        // Get the cause ID from the query string
        if (!isset($_GET['id'])) {
            http_response_code(400);
            echo json_encode(['message' => 'Cause ID is required']);
            exit();
        }
        
        $id = htmlspecialchars(strip_tags($_GET['id']));
        
        // Delete cause
        $query = "DELETE FROM causes WHERE id = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("i", $id);
        
        if ($stmt->execute()) {
            // Also delete related donations
            $query = "DELETE FROM donations WHERE cause_id = ?";
            $stmt = $conn->prepare($query);
            $stmt->bind_param("i", $id);
            $stmt->execute();
            
            http_response_code(200);
            echo json_encode(['message' => 'Cause deleted successfully']);
        } else {
            http_response_code(500);
            echo json_encode(['message' => 'Error deleting cause']);
        }
        
        $stmt->close();
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['message' => 'Error deleting cause: ' . $e->getMessage()]);
    }
}

// Method not allowed
else {
    http_response_code(405);
    echo json_encode(['message' => 'Method not allowed']);
}

$conn->close();
?> 