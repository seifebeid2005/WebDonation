<?php
session_start();
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST");

include("../config/database.php");

// Prepare the statistics array
$report = [];

// Total number of users
$userQuery = $conn->query("SELECT COUNT(*) as total_users FROM users");
$userRow = $userQuery->fetch_assoc();
$report['total_users'] = (int)$userRow['total_users'];

// Total number of causes
$causeQuery = $conn->query("SELECT COUNT(*) as total_causes FROM causes");
$causeRow = $causeQuery->fetch_assoc();
$report['total_causes'] = (int)$causeRow['total_causes'];

// Total number of donations
$donationQuery = $conn->query("SELECT COUNT(*) as total_donations FROM donations");
$donationRow = $donationQuery->fetch_assoc();
$report['total_donations'] = (int)$donationRow['total_donations'];

// Total donated amount (confirmed donations only)
$amountQuery = $conn->query("SELECT SUM(amount) as total_donated FROM donations WHERE status = 'confirmed'");
$amountRow = $amountQuery->fetch_assoc();
$report['total_donated_amount'] = (float)($amountRow['total_donated'] ?? 0);

// Total raised amount (sum of all causes.raised_amount)
$raisedQuery = $conn->query("SELECT SUM(raised_amount) as total_raised FROM causes");
$raisedRow = $raisedQuery->fetch_assoc();
$report['total_raised_amount'] = (float)($raisedRow['total_raised'] ?? 0);

// Respond with the JSON report
echo json_encode([
    'success' => true,
    'data' => $report
]);
?>