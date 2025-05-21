<?php
// ---------------- CORS headers (must be FIRST before any output) ----------------
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");

// ---------------- Error reporting (enable for debugging) ----------------
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// ---------------- Session start ----------------
session_start();

try {
    include('../config/database.php');

    // Handle preflight request for CORS
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit();
    }

    // Process requests
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Read and parse JSON input
        $input = json_decode(file_get_contents("php://input"), true);
        
        // Determine operation type
        $operation = $input['operation'] ?? 'insert';
        
        switch ($operation) {
            case 'insert':
                insertDonation($conn, $input);
                break;
            case 'update':
                updateDonationStatus($conn, $input);
                break;
            case 'get':
                $merchent_order_id = $input['merchent_order_id'] ?? null;
                getDonationByMerchentOrderId($conn, $merchent_order_id);
                break;
            case 'update_cause_raised':
                $cause_id = $input['cause_id'] ?? null;
                $amount = $input['amount'] ?? null;
                updateCauseRaisedAmount($conn, $cause_id, $amount);
                break;
            default:
                http_response_code(400);
                echo json_encode(["success" => false, "message" => "Invalid operation. Use 'insert', 'update', 'get', or 'update_cause_raised'."]);
        }
    } else if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        // Handle direct GET requests for donation info
        $merchent_order_id = $_GET['merchant_order_id'] ?? null;
        if ($merchent_order_id) {
            getDonationByMerchentOrderId($conn, $merchent_order_id);
        } else {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Merchant order ID is required for GET requests."]);
        }
    } else {
        http_response_code(405);
        echo json_encode(["success" => false, "message" => "Method not allowed. Use POST or GET."]);
    }

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false, 
        "message" => "Server error: " . $e->getMessage(),
        "file" => $e->getFile(),
        "line" => $e->getLine()
    ]);
}

/**
 * Insert a new donation into the database
 * 
 * @param mysqli $conn Database connection
 * @param array $data Donation data from request
 */
function insertDonation($conn, $data) {
    try {
        // Extract donation data
        $amount = isset($data['amount']) ? floatval($data['amount']) : 0;
        $status = 'pending'; // Always start with pending for payment integration
        $merchent_order_id = $data['merchent_order_id'] ?? '';
        $user_id = isset($data['user_id']) ? intval($data['user_id']) : null;
        $email = $data['email'] ?? '';
        $cause_id = isset($data['cause_id']) ? intval($data['cause_id']) : null;
        
        // Validate required fields
        if (empty($user_id) || empty($cause_id) || empty($merchent_order_id) || $amount <= 0) {
            http_response_code(422);
            echo json_encode(["success" => false, "message" => "User ID, Cause ID, Amount and Merchant order ID are required."]);
            exit();
        }

        // Current timestamp for donation
        $donated_at = date('Y-m-d H:i:s');

        // Check if table exists
        $checkTable = $conn->query("SHOW TABLES LIKE 'donations'");
        if ($checkTable->num_rows == 0) {
            http_response_code(500);
            echo json_encode(["success" => false, "message" => "Table 'donations' does not exist!"]);
            exit();
        }
        
        // Create query with correct columns
        $query = "INSERT INTO donations (user_id, cause_id, amount, status, merchent_order_id, donated_at, email) VALUES (?, ?, ?, ?, ?, ?, ?)";
        
        // Insert donation into database
        $stmt = $conn->prepare($query);
        
        if ($stmt === false) {
            http_response_code(500);
            echo json_encode([
                "success" => false, 
                "message" => "Failed to prepare SQL statement", 
                "error" => $conn->error
            ]);
            exit();
        }
        
        $stmt->bind_param("iidssss", $user_id, $cause_id, $amount, $status, $merchent_order_id, $donated_at, $email);
        
        if ($stmt->execute()) {
            $donation_id = $conn->insert_id;
            echo json_encode([
                "success" => true,
                "message" => "Donation recorded successfully.",
                "donation" => [
                    "id" => $donation_id,
                    "user_id" => $user_id,
                    "cause_id" => $cause_id,
                    "amount" => $amount,
                    "status" => $status,
                    "merchent_order_id" => $merchent_order_id,
                    "donated_at" => $donated_at,
                    "email" => $email
                ]
            ]);
        } else {
            http_response_code(500);
            echo json_encode([
                "success" => false, 
                "message" => "Failed to execute SQL statement", 
                "error" => $stmt->error
            ]);
        }
        
        $stmt->close();
    } catch (Throwable $e) {
        http_response_code(500);
        echo json_encode([
            "success" => false, 
            "message" => "Server error while inserting donation.",
            "error" => $e->getMessage(),
            "file" => $e->getFile(),
            "line" => $e->getLine()
        ]);
    }
}

/**
 * Update the status of an existing donation
 * 
 * @param mysqli $conn Database connection
 * @param array $data Update data from request
 */
function updateDonationStatus($conn, $data) {
    try {
        // Extract update data
        $merchent_order_id = $data['merchent_order_id'] ?? null;
        $status = $data['status'] ?? null;
        
        // Validate required fields
        if (empty($merchent_order_id) || empty($status)) {
            http_response_code(422);
            echo json_encode(["success" => false, "message" => "Merchant order ID and status are required."]);
            exit();
        }

        // Update donation status
        $stmt = $conn->prepare("UPDATE donations SET status = ? WHERE merchent_order_id = ?");
        
        if ($stmt === false) {
            http_response_code(500);
            echo json_encode([
                "success" => false, 
                "message" => "Failed to prepare update statement", 
                "error" => $conn->error
            ]);
            exit();
        }
        
        $stmt->bind_param("ss", $status, $merchent_order_id);
        
        if ($stmt->execute()) {
            // Fetch the updated donation
            $getStmt = $conn->prepare("SELECT * FROM donations WHERE merchent_order_id = ?");
            if ($getStmt === false) {
                http_response_code(500);
                echo json_encode([
                    "success" => false, 
                    "message" => "Failed to prepare select statement", 
                    "error" => $conn->error
                ]);
                exit();
            }
            
            $getStmt->bind_param("s", $merchent_order_id);
            $getStmt->execute();
            $result = $getStmt->get_result();
            $donation = $result->fetch_assoc();
            $getStmt->close();

            // If status is confirmed, update the cause's raised_amount
            if ($status == "confirmed" && $donation && $donation['cause_id'] && $donation['amount']) {
                updateCauseRaisedAmount($conn, $donation['cause_id'], $donation['amount']);
            }
            
            echo json_encode([
                "success" => true,
                "message" => "Donation status updated successfully.",
                "donation" => $donation
            ]);
        } else {
            echo json_encode([
                "success" => false, 
                "message" => "No donation found with merchant order ID: " . $merchent_order_id
            ]);
        }
        $stmt->close();
    } catch (Throwable $e) {
        http_response_code(500);
        echo json_encode([
            "success" => false, 
            "message" => "Server error while updating donation.",
            "error" => $e->getMessage(),
            "file" => $e->getFile(),
            "line" => $e->getLine()
        ]);
    }
}


function getDonationByMerchentOrderId($conn, $merchent_order_id) {
    try {
        if (empty($merchent_order_id)) {
            http_response_code(422);
            echo json_encode(["success" => false, "message" => "Merchant order ID is required."]);
            exit();
        }

        $stmt = $conn->prepare("SELECT * FROM donations WHERE merchent_order_id = ?");
        if ($stmt === false) {
            http_response_code(500);
            echo json_encode([
                "success" => false,
                "message" => "Failed to prepare select statement",
                "error" => $conn->error
            ]);
            exit();
        }

        $stmt->bind_param("s", $merchent_order_id);
        $stmt->execute();
        $result = $stmt->get_result();
        $donation = $result->fetch_assoc();
        $stmt->close();

        if ($donation) {
            echo json_encode([
                "success" => true,
                "donation" => $donation
            ]);
        } else {
            echo json_encode([
                "success" => false,
                "message" => "No donation found with merchant order ID: " . $merchent_order_id
            ]);
        }
    } catch (Throwable $e) {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "message" => "Server error while retrieving donation.",
            "error" => $e->getMessage(),
            "file" => $e->getFile(),
            "line" => $e->getLine()
        ]);
    }
}


function updateCauseRaisedAmount($conn, $cause_id, $amount) {
    try {
        if (empty($cause_id) || empty($amount) || $amount <= 0) {
            echo json_encode([
                "success" => false,
                "message" => "Invalid cause_id or amount."
            ]);
            exit; // <-- ADD THIS
        }
        $stmt = $conn->prepare("UPDATE causes SET raised_amount = raised_amount + ? WHERE id = ?");
        if ($stmt === false) {
            echo json_encode([
                "success" => false,
                "message" => "Failed to prepare SQL statement.",
                "error" => $conn->error
            ]);
            exit; // <-- ADD THIS
        }
        $stmt->bind_param("di", $amount, $cause_id);
        if ($stmt->execute()) {
            echo json_encode([
                "success" => true,
                "message" => "Cause raised amount updated."
            ]);
            exit; // <-- ADD THIS
        } else {
            echo json_encode([
                "success" => false,
                "message" => "Failed to update cause raised amount.",
                "error" => $stmt->error
            ]);
            exit; // <-- ADD THIS
        }
        $stmt->close();
    } catch (Throwable $e) {
        echo json_encode([
            "success" => false,
            "message" => "Server error while updating cause raised amount.",
            "error" => $e->getMessage(),
            "file" => $e->getFile(),
            "line" => $e->getLine()
        ]);
        exit; // <-- ADD THIS
    }
}
?>