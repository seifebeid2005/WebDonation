<?php
// Remove any whitespace or BOM before session_start
ob_start();
session_start();

// Set error handling
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Set headers
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=utf-8");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Function to send JSON response
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

// Function to handle errors
function handleError($message) {
    sendJsonResponse(false, $message);
}

try {
    include("../config/database.php");

    // Add Donation Request
    function addDonationRequest($conn, $data) {
        $sql = "INSERT INTO donation_requests (user_id, cause_id, amount, currency, payment_method, status, notes, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())";
        $stmt = $conn->prepare($sql);
        if (!$stmt) {
            throw new Exception("Database prepare error: " . $conn->error);
        }
        
        $user_id = $data['user_id'];
        $cause_id = $data['cause_id'];
        $amount = $data['amount'];
        $currency = $data['currency'] ?? 'USD';
        $payment_method = $data['payment_method'] ?? null;
        $status = $data['status'] ?? 'pending';
        $notes = $data['notes'] ?? null;

        $stmt->bind_param("iidssss",
            $user_id, $cause_id, $amount, $currency, $payment_method, $status, $notes
        );
        return $stmt->execute();
    }

    // Edit Donation Request
    function editDonationRequest($conn, $id, $data) {
        $sql = "UPDATE donation_requests SET 
                amount = ?, 
                currency = ?, 
                payment_method = ?, 
                status = ?, 
                notes = ?, 
                updated_at = NOW() 
                WHERE id = ?";
        $stmt = $conn->prepare($sql);
        if (!$stmt) {
            throw new Exception("Database prepare error: " . $conn->error);
        }

        $amount = $data['amount'];
        $currency = $data['currency'] ?? 'USD';
        $payment_method = $data['payment_method'] ?? null;
        $status = $data['status'] ?? 'pending';
        $notes = $data['notes'] ?? null;

        $stmt->bind_param("dssssi",
            $amount, $currency, $payment_method, $status, $notes, $id
        );
        return $stmt->execute();
    }

    // Delete Donation Request
    function deleteDonationRequest($conn, $id) {
        // First check if the donation request exists
        $check_sql = "SELECT id FROM donation_requests WHERE id = ?";
        $check_stmt = $conn->prepare($check_sql);
        if (!$check_stmt) {
            throw new Exception("Database prepare error: " . $conn->error);
        }
        $check_stmt->bind_param("i", $id);
        $check_stmt->execute();
        $result = $check_stmt->get_result();
        
        if ($result->num_rows === 0) {
            return false; // Donation request doesn't exist
        }
        
        // If donation request exists, delete it
        $sql = "DELETE FROM donation_requests WHERE id = ?";
        $stmt = $conn->prepare($sql);
        if (!$stmt) {
            throw new Exception("Database prepare error: " . $conn->error);
        }
        $stmt->bind_param("i", $id);
        return $stmt->execute();
    }

    // Update Donation Request Status
    function updateDonationStatus($conn, $id, $status) {
        $allowed_statuses = ['pending', 'approved', 'rejected', 'completed', 'cancelled'];
        if (!in_array($status, $allowed_statuses)) {
            return false;
        }

        $sql = "UPDATE donation_requests SET status = ?, updated_at = NOW() WHERE id = ?";
        $stmt = $conn->prepare($sql);
        if (!$stmt) {
            throw new Exception("Database prepare error: " . $conn->error);
        }
        $stmt->bind_param("si", $status, $id);
        return $stmt->execute();
    }

    // Get Donation Requests
    function getDonationRequests($conn, $filters = []) {
        $sql = "SELECT dr.*, u.username, c.title as cause_title 
                FROM donation_requests dr 
                LEFT JOIN users u ON dr.user_id = u.id 
                LEFT JOIN causes c ON dr.cause_id = c.id 
                WHERE 1=1";
        
        $params = [];
        $types = "";

        if (!empty($filters['status'])) {
            $sql .= " AND dr.status = ?";
            $params[] = $filters['status'];
            $types .= "s";
        }

        if (!empty($filters['user_id'])) {
            $sql .= " AND dr.user_id = ?";
            $params[] = $filters['user_id'];
            $types .= "i";
        }

        if (!empty($filters['cause_id'])) {
            $sql .= " AND dr.cause_id = ?";
            $params[] = $filters['cause_id'];
            $types .= "i";
        }

        $sql .= " ORDER BY dr.created_at DESC";
        
        $stmt = $conn->prepare($sql);
        if (!$stmt) {
            throw new Exception("Database prepare error: " . $conn->error);
        }

        if (!empty($params)) {
            $stmt->bind_param($types, ...$params);
        }

        $stmt->execute();
        $result = $stmt->get_result();
        
        $donation_requests = [];
        while ($row = $result->fetch_assoc()) {
            $donation_requests[] = $row;
        }
        return $donation_requests;
    }

    // Handle Requests
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $input = file_get_contents("php://input");
        $data = json_decode($input, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            handleError("Invalid JSON data received");
        }

        if (!isset($data['action'])) {
            handleError("No action specified");
        }

        switch ($data['action']) {
            case 'add':
                if (!isset($data['user_id'], $data['cause_id'], $data['amount'])) {
                    handleError("Missing required fields");
                }
                if (addDonationRequest($conn, $data)) {
                    sendJsonResponse(true, "Donation request added successfully");
                } else {
                    handleError("Failed to add donation request");
                }
                break;

            case 'edit':
                if (!isset($data['id'], $data['amount'])) {
                    handleError("Missing required fields");
                }
                if (editDonationRequest($conn, $data['id'], $data)) {
                    sendJsonResponse(true, "Donation request updated successfully");
                } else {
                    handleError("Failed to update donation request");
                }
                break;

            case 'delete':
                if (!isset($data['id'])) {
                    handleError("Missing donation request ID");
                }
                if (deleteDonationRequest($conn, $data['id'])) {
                    sendJsonResponse(true, "Donation request deleted successfully");
                } else {
                    handleError("Failed to delete donation request or request not found");
                }
                break;

            case 'update_status':
                if (!isset($data['id'], $data['status'])) {
                    handleError("Missing required fields");
                }
                if (updateDonationStatus($conn, $data['id'], $data['status'])) {
                    sendJsonResponse(true, "Donation request status updated successfully");
                } else {
                    handleError("Failed to update donation request status");
                }
                break;

            default:
                handleError("Invalid action specified");
        }
    } elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $filters = [];
        if (isset($_GET['status'])) $filters['status'] = $_GET['status'];
        if (isset($_GET['user_id'])) $filters['user_id'] = $_GET['user_id'];
        if (isset($_GET['cause_id'])) $filters['cause_id'] = $_GET['cause_id'];

        $donation_requests = getDonationRequests($conn, $filters);
        sendJsonResponse(true, '', $donation_requests);
    } else {
        handleError("Invalid request method");
    }
} catch (Exception $e) {
    handleError("Server error: " . $e->getMessage());
}

// Clean the output buffer and send
ob_end_flush();
?> 