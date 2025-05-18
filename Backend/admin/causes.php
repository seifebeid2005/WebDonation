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
header("Content-Type: application/json; charset=utf-8");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST");

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

    // Add Cause
    function addCause($conn, $data) {
        $sql = "INSERT INTO causes (title, description, short_description, image_url, goal_amount, raised_amount, currency, category, start_date, end_date, is_featured, is_active, status, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())";
        $stmt = $conn->prepare($sql);
        if (!$stmt) {
            throw new Exception("Database prepare error: " . $conn->error);
        }
        $title = $data['title'];
        $description = $data['description'] ?? null;
        $short_description = $data['short_description'] ?? null;
        $image_url = $data['image_url'] ?? null;
        $goal_amount = $data['goal_amount'];
        $raised_amount = $data['raised_amount'] ?? 0.00;
        $currency = $data['currency'] ?? 'USD';
        $category = $data['category'] ?? null;
        $start_date = $data['start_date'] ?? null;
        $end_date = $data['end_date'] ?? null;
        $is_featured = $data['is_featured'] ?? 0;
        $is_active = $data['is_active'] ?? 1;
        $status = $data['status'] ?? 'pending';
        $stmt->bind_param("ssssddssssiis",
            $title, $description, $short_description, $image_url, $goal_amount, $raised_amount, $currency, $category, $start_date, $end_date, $is_featured, $is_active, $status
        );
        return $stmt->execute();
    }

    // Edit Cause
    function editCause($conn, $id, $data) {
        $sql = "UPDATE causes SET title=?, description=?, short_description=?, image_url=?, goal_amount=?, raised_amount=?, currency=?, category=?, start_date=?, end_date=?, is_featured=?, is_active=?, status=?, updated_at=NOW() WHERE id=?";
        $stmt = $conn->prepare($sql);
        if (!$stmt) {
            throw new Exception("Database prepare error: " . $conn->error);
        }
        $title = $data['title'];
        $description = $data['description'] ?? null;
        $short_description = $data['short_description'] ?? null;
        $image_url = $data['image_url'] ?? null;
        $goal_amount = $data['goal_amount'];
        $raised_amount = $data['raised_amount'] ?? 0.00;
        $currency = $data['currency'] ?? 'USD';
        $category = $data['category'] ?? null;
        $start_date = $data['start_date'] ?? null;
        $end_date = $data['end_date'] ?? null;
        $is_featured = $data['is_featured'] ?? 0;
        $is_active = $data['is_active'] ?? 1;
        $status = $data['status'] ?? 'pending';
        $stmt->bind_param("ssssddssssiiis",
            $title, $description, $short_description, $image_url, $goal_amount, $raised_amount, $currency, $category, $start_date, $end_date, $is_featured, $is_active, $status, $id
        );
        return $stmt->execute();
    }

    // Delete Cause
    function deleteCause($conn, $id) {
        // First check if the cause exists
        $check_sql = "SELECT id FROM causes WHERE id = ?";
        $check_stmt = $conn->prepare($check_sql);
        if (!$check_stmt) {
            throw new Exception("Database prepare error: " . $conn->error);
        }
        $check_stmt->bind_param("i", $id);
        $check_stmt->execute();
        $result = $check_stmt->get_result();
        
        if ($result->num_rows === 0) {
            return false; // Cause doesn't exist
        }
        
        // If cause exists, delete it
        $sql = "DELETE FROM causes WHERE id = ?";
        $stmt = $conn->prepare($sql);
        if (!$stmt) {
            throw new Exception("Database prepare error: " . $conn->error);
        }
        $stmt->bind_param("i", $id);
        return $stmt->execute();
    }

    // Accept Cause
    function acceptCause($conn, $id) {
        $sql = "UPDATE causes SET status = 'accepted' WHERE id = ?";
        $stmt = $conn->prepare($sql);
        if (!$stmt) {
            throw new Exception("Database prepare error: " . $conn->error);
        }
        $stmt->bind_param("i", $id);
        return $stmt->execute();
    }

    // View Causes
    function getCauses($conn) {
        $sql = "SELECT * FROM causes ORDER BY created_at DESC";
        $result = $conn->query($sql);
        if (!$result) {
            throw new Exception("Database query error: " . $conn->error);
        }
        $causes = [];
        while ($row = $result->fetch_assoc()) {
            $causes[] = $row;
        }
        return $causes;
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
                if (!isset($data['title'], $data['goal_amount'])) {
                    handleError("Missing required fields");
                }
                if (addCause($conn, $data)) {
                    sendJsonResponse(true, "Cause added successfully");
                } else {
                    handleError("Failed to add cause");
                }
                break;

            case 'edit':
                if (!isset($data['id'], $data['title'], $data['goal_amount'])) {
                    handleError("Missing required fields");
                }
                if (editCause($conn, $data['id'], $data)) {
                    sendJsonResponse(true, "Cause updated successfully");
                } else {
                    handleError("Failed to update cause");
                }
                break;

            case 'delete':
                if (!isset($data['id'])) {
                    handleError("Missing cause ID");
                }
                if (deleteCause($conn, $data['id'])) {
                    sendJsonResponse(true, "Cause deleted successfully");
                } else {
                    handleError("Failed to delete cause or cause not found");
                }
                break;

            case 'accept':
                if (!isset($data['id'])) {
                    handleError("Missing cause ID");
                }
                if (acceptCause($conn, $data['id'])) {
                    sendJsonResponse(true, "Cause accepted successfully");
                } else {
                    handleError("Failed to accept cause");
                }
                break;

            default:
                handleError("Invalid action specified");
        }
    } elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $causes = getCauses($conn);
        sendJsonResponse(true, '', $causes);
    } else {
        handleError("Invalid request method");
    }
} catch (Exception $e) {
    handleError("Server error: " . $e->getMessage());
}

// Clean the output buffer and send
ob_end_flush();
?>
