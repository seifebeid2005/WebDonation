<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

session_start();

try {
    include('../config/database.php');

    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit();
    }

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $input = json_decode(file_get_contents("php://input"), true);
        $operation = $input['operation'] ?? 'insert';
        switch ($operation) {
            case 'insert':
                insertRandomDonation($conn, $input);
                break;
            case 'update':
                updateRandomDonationStatus($conn, $input);
                break;
            case 'get':
                $merchent_order_id = $input['merchent_order_id'] ?? null;
                getRandomDonationByMerchentOrderId($conn, $merchent_order_id);
                break;
            default:
                http_response_code(400);
                echo json_encode(["success" => false, "message" => "Invalid operation. Use 'insert', 'update', or 'get'."]);
                exit();
        }
    } else if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $merchent_order_id = $_GET['merchant_order_id'] ?? null;
        if ($merchent_order_id) {
            getRandomDonationByMerchentOrderId($conn, $merchent_order_id);
        } else {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Merchant order ID is required for GET requests."]);
            exit();
        }
    } else {
        http_response_code(405);
        echo json_encode(["success" => false, "message" => "Method not allowed. Use POST or GET."]);
        exit();
    }

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Server error: " . $e->getMessage(),
        "file" => $e->getFile(),
        "line" => $e->getLine()
    ]);
    exit();
}

function insertRandomDonation($conn, $data) {
    try {
        $amount = isset($data['amount']) ? floatval($data['amount']) : 0;
        $status = 'pending';
        $merchent_order_id = $data['merchent_order_id'] ?? '';
        $email = $data['email'] ?? '';
        if (empty($merchent_order_id) || $amount <= 0) {
            http_response_code(422);
            echo json_encode([
                "success" => false,
                "message" => "Amount and Merchant order ID are required."
            ]);
            exit();
        }
        $donated_at = date('Y-m-d H:i:s');
        $checkTable = $conn->query("SHOW TABLES LIKE 'random_donations'");
        if ($checkTable->num_rows == 0) {
            http_response_code(500);
            echo json_encode(["success" => false, "message" => "Table 'random_donations' does not exist!"]);
            exit();
        }
        $query = "INSERT INTO random_donations (donated_at, amount, status, merchent_order_id, email) VALUES (?, ?, ?, ?, ?)";
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
        $stmt->bind_param("sdsss", $donated_at, $amount, $status, $merchent_order_id, $email);

        if ($stmt->execute()) {
            $donation_id = $conn->insert_id;
            echo json_encode([
                "success" => true,
                "message" => "Random donation recorded successfully.",
                "donation" => [
                    "id" => $donation_id,
                    "amount" => $amount,
                    "status" => $status,
                    "merchent_order_id" => $merchent_order_id,
                    "donated_at" => $donated_at,
                    "email" => $email
                ]
            ]);
            exit();
        } else {
            http_response_code(500);
            echo json_encode([
                "success" => false,
                "message" => "Failed to execute SQL statement",
                "error" => $stmt->error
            ]);
            exit();
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
        exit();
    }
}

function updateRandomDonationStatus($conn, $data) {
    try {
        $merchent_order_id = $data['merchent_order_id'] ?? null;
        $status = $data['status'] ?? null;
        if (empty($merchent_order_id) || empty($status)) {
            http_response_code(422);
            echo json_encode(["success" => false, "message" => "Merchant order ID and status are required."]);
            exit();
        }
        $stmt = $conn->prepare("UPDATE random_donations SET status = ? WHERE merchent_order_id = ?");
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
                "message" => "Random donation status updated successfully.",
                "donation" => $donation
            ]);
            exit();
        } else {
            echo json_encode([
                "success" => false,
                "message" => "No donation found with merchant order ID: " . $merchent_order_id
            ]);
            exit();
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
        exit();
    }
}

function getRandomDonationByMerchentOrderId($conn, $merchent_order_id) {
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
            exit();
        } else {
            echo json_encode([
                "success" => false,
                "message" => "No random donation found with merchant order ID: " . $merchent_order_id
            ]);
            exit();
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
        exit();
    }
}
?>