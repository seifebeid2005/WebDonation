<?php
ob_start();
session_start();

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=utf-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

function sendJsonResponse($success, $message = '', $data = null) {
    $response = [
        'success' => $success,
        'message' => $message
    ];
    if ($data !== null) {
        $response['data'] = $data;
    }
    echo json_encode($response);
    exit;
}

function handleError($message) {
    sendJsonResponse(false, $message);
}

try {
    include("../config/database.php");

    // Fetch all cause requests
    function getAllCauseRequests($conn) {
        $sql = "SELECT * FROM `cause_requests` ORDER BY submitted_at DESC";
        $result = $conn->query($sql);
        if (!$result) {
            throw new Exception("Database query error: " . $conn->error);
        }
        $requests = [];
        while ($row = $result->fetch_assoc()) {
            $requests[] = $row;
        }
        return $requests;
    }

    // Update status (accept/decline)
    function updateCauseRequestStatus($conn, $id, $status) {
        $allowed = ['accepted', 'declined'];
        if (!in_array($status, $allowed)) {
            return false;
        }
        $sql = "UPDATE `cause_requests` SET status = ? WHERE id = ?";
        $stmt = $conn->prepare($sql);
        if (!$stmt) {
            throw new Exception("Database prepare error: " . $conn->error);
        }
        $stmt->bind_param("si", $status, $id);
        return $stmt->execute();
    }

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $input = file_get_contents("php://input");
        $data = json_decode($input, true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            handleError("Invalid JSON data received");
        }
        if (!isset($data['id'], $data['action'])) {
            handleError("Missing required fields");
        }
        $id = $data['id'];
        $action = $data['action'];
        if ($action === 'accept') {
            $status = 'accepted';
        } elseif ($action === 'decline') {
            $status = 'declined';
        } else {
            handleError("Invalid action");
        }
        if (updateCauseRequestStatus($conn, $id, $status)) {
            sendJsonResponse(true, "Request status updated to $status");
        } else {
            handleError("Failed to update request status");
        }
    } elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $requests = getAllCauseRequests($conn);
        sendJsonResponse(true, '', $requests);
    } else {
        handleError("Invalid request method");
    }
} catch (Exception $e) {
    handleError("Server error: " . $e->getMessage());
}

ob_end_flush();
?> 