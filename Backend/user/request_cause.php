<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

session_start();
include('../Config/database.php');

try {
    $data = json_decode(file_get_contents("php://input"), true);
    $action = $data['action'] ?? ($_GET['action'] ?? '');

    switch ($action) {
        case 'getAll':
            getAllCauseRequests($conn);
            break;
        case 'getById':
            getCauseRequestById($conn, $data);
            break;
        case 'create':
            createCauseRequest($conn, $data);
            break;
            case 'getByUserId':
            getCauseRequestByUserId($conn);
            break;
        case 'update':
            updateCauseRequest($conn, $data);
            break;
        case 'delete':
            deleteCauseRequest($conn, $data);
            break;
        default:
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Invalid action"]);
            break;
    }
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Server error", "error" => $e->getMessage()]);
}

// 1. Get all cause requests for current user
function getAllCauseRequests($con) {
    try {
        if (empty($_SESSION['user_id'])) {
            http_response_code(401);
            echo json_encode(["success" => false, "message" => "Not authenticated"]);
            return;
        }
        $userId = intval($_SESSION['user_id']);
        $query = "SELECT * FROM cause_requests WHERE user_id = ?";
        $stmt = $con->prepare($query);
        $stmt->bind_param("i", $userId);
        $stmt->execute();
        $result = $stmt->get_result();
        $causes = [];
        if ($result) {
            while ($row = $result->fetch_assoc()) {
                $causes[] = $row;
            }
            echo json_encode([
                "success" => true,
                "causes" => $causes,
                "message" => "Cause requests retrieved successfully"
            ]);
        } else {
            http_response_code(500);
            echo json_encode(["success" => false, "message" => "Database error"]);
        }
        $stmt->close();
    } catch (Throwable $e) {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "message" => "Server error",
            "error" => $e->getMessage()
        ]);
    }
}

// 2. Get single cause request by id (only if user owns it)
function getCauseRequestById($con, $data) {
    try {
        if (empty($_SESSION['user_id'])) {
            http_response_code(401);
            echo json_encode(["success" => false, "message" => "Not authenticated"]);
            return;
        }
        if (empty($data['id'])) {
            http_response_code(422);
            echo json_encode(["success" => false, "message" => "Missing cause request id"]);
            return;
        }
        $userId = intval($_SESSION['user_id']);
        $causeId = intval($data['id']);
        $query = "SELECT * FROM cause_requests WHERE id = ? AND user_id = ?";
        $stmt = $con->prepare($query);
        $stmt->bind_param("ii", $causeId, $userId);
        $stmt->execute();
        $result = $stmt->get_result();
        if ($result && $row = $result->fetch_assoc()) {
            echo json_encode([
                "success" => true,
                "cause" => $row,
                "message" => "Cause request retrieved successfully"
            ]);
        } else {
            http_response_code(404);
            echo json_encode(["success" => false, "message" => "Cause request not found"]);
        }
        $stmt->close();
    } catch (Throwable $e) {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "message" => "Server error",
            "error" => $e->getMessage()
        ]);
    }
}

// 3. Create a new cause request
function createCauseRequest($con, $data) {
    try {
        if (empty($_SESSION['user_id'])) {
            http_response_code(401);
            echo json_encode(["success" => false, "message" => "Not authenticated"]);
            return;
        }
        if (empty($data['title']) || empty($data['description']) || empty($data['requested_amount'])) {
            http_response_code(422);
            echo json_encode(["success" => false, "message" => "Missing required fields"]);
            return;
        }
        $userId = intval($_SESSION['user_id']);
        $title = $data['title'];
        $description = $data['description'];
        $image_url = isset($data['image_url']) ? $data['image_url'] : null;
        $requested_amount = floatval($data['requested_amount']);
        $status = isset($data['status']) ? $data['status'] : 'pending';
        $now = date('Y-m-d H:i:s');

        $query = "INSERT INTO cause_requests (user_id, title, description, image_url, requested_amount, status, submitted_at)
                  VALUES (?, ?, ?, ?, ?, ?, ?)";
        $stmt = $con->prepare($query);
        $stmt->bind_param("isssdss", $userId, $title, $description, $image_url, $requested_amount, $status, $now);
        if ($stmt->execute()) {
            echo json_encode(["success" => true, "message" => "Cause request created successfully", "id" => $stmt->insert_id]);
        } else {
            http_response_code(500);
            echo json_encode(["success" => false, "message" => "Database error"]);
        }
        $stmt->close();
    } catch (Throwable $e) {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "message" => "Server error",
            "error" => $e->getMessage()
        ]);
    }
}

// 4. Update a cause request (only if user owns it)
function updateCauseRequest($con, $data) {
    try {
        if (empty($_SESSION['user_id'])) {
            http_response_code(401);
            echo json_encode(["success" => false, "message" => "Not authenticated"]);
            return;
        }
        if (empty($data['id']) || empty($data['title']) || empty($data['description']) || empty($data['requested_amount'])) {
            http_response_code(422);
            echo json_encode(["success" => false, "message" => "Missing required fields"]);
            return;
        }
        $userId = intval($_SESSION['user_id']);
        $causeId = intval($data['id']);
        $title = $data['title'];
        $description = $data['description'];
        $image_url = isset($data['image_url']) ? $data['image_url'] : null;
        $requested_amount = floatval($data['requested_amount']);
        $status = isset($data['status']) ? $data['status'] : 'pending';

        // Only update the row if it belongs to the user
        $query = "UPDATE cause_requests SET title = ?, description = ?, image_url = ?, requested_amount = ?, status = ? WHERE id = ? AND user_id = ?";
        $stmt = $con->prepare($query);
        $stmt->bind_param("sssdssi", $title, $description, $image_url, $requested_amount, $status, $causeId, $userId);
        if ($stmt->execute()) {
            if ($stmt->affected_rows > 0) {
                echo json_encode(["success" => true, "message" => "Cause request updated successfully"]);
            } else {
                http_response_code(404);
                echo json_encode(["success" => false, "message" => "Cause request not found or no change"]);
            }
        } else {
            http_response_code(500);
            echo json_encode(["success" => false, "message" => "Database error"]);
        }
        $stmt->close();
    } catch (Throwable $e) {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "message" => "Server error",
            "error" => $e->getMessage()
        ]);
    }
}

// 5. Delete a cause request (only if user owns it)
function deleteCauseRequest($con, $data) {
    try {
        if (empty($_SESSION['user_id'])) {
            http_response_code(401);
            echo json_encode(["success" => false, "message" => "Not authenticated"]);
            return;
        }
        if (empty($data['id'])) {
            http_response_code(422);
            echo json_encode(["success" => false, "message" => "Missing cause request id"]);
            return;
        }
        $userId = intval($_SESSION['user_id']);
        $causeId = intval($data['id']);
        $query = "DELETE FROM cause_requests WHERE id = ? AND user_id = ?";
        $stmt = $con->prepare($query);
        $stmt->bind_param("ii", $causeId, $userId);
        if ($stmt->execute()) {
            if ($stmt->affected_rows > 0) {
                echo json_encode(["success" => true, "message" => "Cause request deleted successfully"]);
            } else {
                http_response_code(404);
                echo json_encode(["success" => false, "message" => "Cause request not found"]);
            }
        } else {
            http_response_code(500);
            echo json_encode(["success" => false, "message" => "Database error"]);
        }
        $stmt->close();
    } catch (Throwable $e) {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "message" => "Server error",
            "error" => $e->getMessage()
        ]);
    }
}

// 6. Get cause requests by user id
function getCauseRequestByUserId($con) {
    try {
        if (empty($_SESSION['user_id'])) {
            http_response_code(401);
            echo json_encode(["success" => false, "message" => "Not authenticated"]);
            return;
        }
        $userId = intval($_SESSION['user_id']);
        $query = "SELECT * FROM cause_requests WHERE user_id = ?";
        $stmt = $con->prepare($query);
        $stmt->bind_param("i", $userId);
        $stmt->execute();
        $result = $stmt->get_result();
        $causes = [];
        if ($result) {
            while ($row = $result->fetch_assoc()) {
                $causes[] = $row;
            }
            echo json_encode([
                "success" => true,
                "causes" => $causes,
                "message" => "Cause requests retrieved successfully"
            ]);
        } else {
            http_response_code(500);
            echo json_encode(["success" => false, "message" => "Database error"]);
        }
        $stmt->close();
    } catch (Throwable $e) {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "message" => "Server error",
            "error" => $e->getMessage()
        ]);
    }
}
?>