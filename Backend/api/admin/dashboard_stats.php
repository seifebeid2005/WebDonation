<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

session_start();
header("Access-Control-Allow-Origin: http://localhost:8888");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, OPTIONS");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include_once "../../config/database.php";

// Use the existing $conn from database.php
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['message' => 'Database connection failed']);
    exit();
}

// Check if user is logged in as admin
if (!isset($_SESSION['is_admin']) || $_SESSION['is_admin'] !== true) {
    http_response_code(401);
    echo json_encode(['message' => 'Unauthorized']);
    exit();
}

// Initialize the response array
$response = [
    'totalDonations' => 0,
    'totalAmount' => 0,
    'activeCauses' => 0,
    'registeredUsers' => 0,
    'recentDonations' => []
];

try {
    // Get total donations count
    $query = "SELECT COUNT(*) as total FROM donations";
    $result = $conn->query($query);
    if (!$result) {
        throw new Exception("Error in donations count query: " . $conn->error);
    }
    $row = $result->fetch_assoc();
    $response['totalDonations'] = (int)$row['total'];

    // Get total donations amount
    $query = "SELECT SUM(amount) as total FROM donations";
    $result = $conn->query($query);
    if (!$result) {
        throw new Exception("Error in donations amount query: " . $conn->error);
    }
    $row = $result->fetch_assoc();
    $response['totalAmount'] = (float)$row['total'] ?? 0;

    // Get active causes count
    $query = "SELECT COUNT(*) as total FROM causes WHERE status = 'active'";
    $result = $conn->query($query);
    if (!$result) {
        throw new Exception("Error in active causes query: " . $conn->error);
    }
    $row = $result->fetch_assoc();
    $response['activeCauses'] = (int)$row['total'];

    // Get registered users count
    $query = "SELECT COUNT(*) as total FROM users";
    $result = $conn->query($query);
    if (!$result) {
        throw new Exception("Error in users count query: " . $conn->error);
    }
    $row = $result->fetch_assoc();
    $response['registeredUsers'] = (int)$row['total'];

    // Get recent donations (last 5)
    $query = "SELECT d.id, d.amount, d.date, u.name as userName, c.title as causeName 
              FROM donations d
              JOIN users u ON d.user_id = u.id
              JOIN causes c ON d.cause_id = c.id
              ORDER BY d.date DESC
              LIMIT 5";
    $result = $conn->query($query);
    if (!$result) {
        throw new Exception("Error in recent donations query: " . $conn->error);
    }
    while ($row = $result->fetch_assoc()) {
        $response['recentDonations'][] = [
            'id' => $row['id'],
            'amount' => $row['amount'],
            'date' => $row['date'],
            'userName' => $row['userName'],
            'causeName' => $row['causeName']
        ];
    }

    // Return the response
    http_response_code(200);
    echo json_encode($response);
} catch (Exception $e) {
    error_log("Dashboard stats error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['message' => 'Error fetching dashboard stats: ' . $e->getMessage()]);
}

$conn->close();
?> 