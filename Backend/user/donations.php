<?php
session_start();
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST");

include("../config/database.php");

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    echo json_encode([
        'success' => false,
        'message' => 'User not authenticated.'
    ]);
    exit;
}

$user_id = $_SESSION['user_id'];

// Get donations for this user
$sql = "
    SELECT d.id, d.amount, d.status, d.donated_at, d.cause_id, c.title AS cause_title, c.image_url AS cause_image
    FROM donations d
    JOIN causes c ON d.cause_id = c.id
    WHERE d.user_id = ?
    ORDER BY d.donated_at DESC
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $user_id);
$stmt->execute();

$result = $stmt->get_result();
$donations = [];
while ($row = $result->fetch_assoc()) {
    $donations[] = $row;
}

echo json_encode([
    'success' => true,
    'data' => $donations
]);
?>