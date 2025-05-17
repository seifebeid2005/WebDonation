<?php
session_start();
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");

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

// Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['message' => 'Method not allowed']);
    exit();
}

// Get the request data
$data = json_decode(file_get_contents("php://input"));

// Check if required fields are provided
if (!isset($data->reportType) || !isset($data->startDate) || !isset($data->endDate)) {
    http_response_code(400);
    echo json_encode(['message' => 'Missing required fields']);
    exit();
}

// Sanitize inputs
$reportType = htmlspecialchars(strip_tags($data->reportType));
$startDate = htmlspecialchars(strip_tags($data->startDate));
$endDate = htmlspecialchars(strip_tags($data->endDate));

// Add one day to end date to include the entire end date
$endDate = date('Y-m-d', strtotime($endDate . ' +1 day'));

try {
    $result = [];
    
    // Generate report based on type
    switch ($reportType) {
        case 'donations':
            // Donations report
            $query = "SELECT d.id, d.amount, d.date, u.name as userName, c.title as causeName 
                     FROM donations d
                     JOIN users u ON d.user_id = u.id
                     JOIN causes c ON d.cause_id = c.id
                     WHERE d.date BETWEEN ? AND ?
                     ORDER BY d.date DESC";
            $stmt = $conn->prepare($query);
            $stmt->bind_param("ss", $startDate, $endDate);
            $stmt->execute();
            $queryResult = $stmt->get_result();
            
            while ($row = $queryResult->fetch_assoc()) {
                $result[] = [
                    'id' => $row['id'],
                    'amount' => $row['amount'],
                    'date' => $row['date'],
                    'userName' => $row['userName'],
                    'causeName' => $row['causeName']
                ];
            }
            break;
            
        case 'users':
            // Users report
            $query = "SELECT u.id, u.name, u.email, u.created_at, 
                     COUNT(d.id) as donations_count, 
                     IFNULL(SUM(d.amount), 0) as total_amount
                     FROM users u
                     LEFT JOIN donations d ON u.id = d.user_id AND d.date BETWEEN ? AND ?
                     WHERE u.created_at BETWEEN ? AND ?
                     GROUP BY u.id
                     ORDER BY total_amount DESC";
            $stmt = $conn->prepare($query);
            $stmt->bind_param("ssss", $startDate, $endDate, $startDate, $endDate);
            $stmt->execute();
            $queryResult = $stmt->get_result();
            
            while ($row = $queryResult->fetch_assoc()) {
                $result[] = [
                    'id' => $row['id'],
                    'name' => $row['name'],
                    'email' => $row['email'],
                    'created_at' => $row['created_at'],
                    'donations_count' => $row['donations_count'],
                    'total_amount' => $row['total_amount']
                ];
            }
            break;
            
        case 'causes':
            // Causes report
            $query = "SELECT c.id, c.title, c.goal_amount, c.current_amount, c.status, 
                     COUNT(d.id) as donations_count
                     FROM causes c
                     LEFT JOIN donations d ON c.id = d.cause_id AND d.date BETWEEN ? AND ?
                     WHERE c.created_at <= ?
                     GROUP BY c.id
                     ORDER BY c.current_amount DESC";
            $stmt = $conn->prepare($query);
            $stmt->bind_param("sss", $startDate, $endDate, $endDate);
            $stmt->execute();
            $queryResult = $stmt->get_result();
            
            while ($row = $queryResult->fetch_assoc()) {
                $result[] = [
                    'id' => $row['id'],
                    'title' => $row['title'],
                    'goal_amount' => $row['goal_amount'],
                    'current_amount' => $row['current_amount'],
                    'status' => $row['status'],
                    'donations_count' => $row['donations_count']
                ];
            }
            break;
            
        default:
            http_response_code(400);
            echo json_encode(['message' => 'Invalid report type']);
            exit();
    }
    
    // Return the report data
    http_response_code(200);
    echo json_encode($result);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['message' => 'Error generating report: ' . $e->getMessage()]);
}

$conn->close();
?> 