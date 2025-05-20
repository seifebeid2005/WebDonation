<?php
session_start();
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST");

// Include database connection
include("../config/database.php");

// Optional: Check if admin is logged in
if (!isset($_SESSION['admin_id'])) {
    echo json_encode(["error" => "Unauthorized"]);
    exit;
}

// Define a function to get dashboard stats
function getDashboardStats($conn) {
    $stats = [];

    // 1. Total users
    $result = $conn->query("SELECT COUNT(*) AS total_users FROM users");
    $row = $result->fetch_assoc();
    $stats['total_users'] = (int)$row['total_users'];

    // 2. Total causes
    $result = $conn->query("SELECT COUNT(*) AS total_causes FROM causes");
    $row = $result->fetch_assoc();
    $stats['total_causes'] = (int)$row['total_causes'];

    // 3. Total donations
    $result = $conn->query("SELECT COUNT(*) AS total_donations FROM donations");
    $row = $result->fetch_assoc();
    $stats['total_donations'] = (int)$row['total_donations'];

    // 4. Total donation amount
    $result = $conn->query("SELECT SUM(amount) AS total_donation_amount FROM donations");
    $row = $result->fetch_assoc();
    $stats['total_donation_amount'] = (float)$row['total_donation_amount'];

    // 5. Total raised amount (from causes table)
    $result = $conn->query("SELECT SUM(raised_amount) AS total_raised_amount FROM causes");
    $row = $result->fetch_assoc();
    $stats['total_raised_amount'] = (float)$row['total_raised_amount'];

    return $stats;
}

// Get stats and return JSON
$stats = getDashboardStats($conn);
echo json_encode($stats);

// Close connection
$conn->close();
?>
