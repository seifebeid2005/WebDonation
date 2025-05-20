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
            default:
                http_response_code(400);
                echo json_encode(["success" => false, "message" => "Invalid operation. Use 'insert', 'update', or 'get'."]);
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
        // email
        $email = $data['email'] ?? '';
        
        // Validate required fields
        if (empty($merchent_order_id) || $amount <= 0) {
            http_response_code(422);
            echo json_encode(["success" => false, "message" => "Amount and merchant order ID are required."]);
            exit();
        }

        // Current timestamp for donation
        $donated_at = date('Y-m-d H:i:s');

        // Check if table exists
        $checkTable = $conn->query("SHOW TABLES LIKE 'random_donations'");
        if ($checkTable->num_rows == 0) {
            http_response_code(500);
            echo json_encode(["success" => false, "message" => "Table 'random_donations' does not exist!"]);
            exit();
        }
        
        // Create query with correct columns
        $query = "INSERT INTO random_donations (amount, status, merchent_order_id, donated_at, email) VALUES (?, ?, ?, ?, ?)";
        
        // Insert donation into database
        $stmt = $conn->prepare($query);
        
        // Debug: Check if prepare statement worked
        if ($stmt === false) {
            http_response_code(500);
            echo json_encode([
                "success" => false, 
                "message" => "Failed to prepare SQL statement", 
                "error" => $conn->error
            ]);
            exit();
        }
        
        $stmt->bind_param("dssss", $amount, $status, $merchent_order_id, $donated_at, $email);
        
        if ($stmt->execute()) {
            $donation_id = $conn->insert_id;
            echo json_encode([
                "success" => true,
                "message" => "Donation recorded successfully.",
                "donation" => [
                    "id" => $donation_id,
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
        $stmt = $conn->prepare("UPDATE random_donations SET status = ? WHERE merchent_order_id = ?");
        
        // Debug: Check if prepare statement worked
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
                $getStmt = $conn->prepare("SELECT * FROM random_donations WHERE merchent_order_id = ?");
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

/**
 * Get donation by merchant order ID
 * 
 * @param mysqli $conn Database connection
 * @param string $merchent_order_id Merchant order ID
 */
function getDonationByMerchentOrderId($conn, $merchent_order_id) {
    try {
        if (empty($merchent_order_id)) {
            http_response_code(422);
            echo json_encode(["success" => false, "message" => "Merchant order ID is required."]);
            exit();
        }

        $stmt = $conn->prepare("SELECT * FROM random_donations WHERE merchent_order_id = ?");
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
?>