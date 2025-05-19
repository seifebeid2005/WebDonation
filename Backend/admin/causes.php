<?php
ob_start();
session_start();

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=utf-8");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST");

function sendJsonResponse($success, $message = '', $data = null) {
    $response = ['success' => $success, 'message' => $message];
    if ($data !== null) $response['data'] = $data;
    echo json_encode($response);
    exit;
}

function handleError($message) {
    sendJsonResponse(false, $message);
}

try {
    include("../config/database.php");

    function handleImageUpload() {
        if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
            return null;
        }

        $uploadDir = '../uploads/';
        if (!is_dir($uploadDir)) mkdir($uploadDir, 0755, true);

        $filename = uniqid() . '_' . basename($_FILES['image']['name']);
        $uploadPath = $uploadDir . $filename;

        if (move_uploaded_file($_FILES['image']['tmp_name'], $uploadPath)) {
            return 'uploads/' . $filename;
        } else {
            throw new Exception("Image upload failed.");
        }
    }

    function addCause($conn, $data) {
        $image_url = handleImageUpload();

        $sql = "INSERT INTO causes (title, description, short_description, image_url, goal_amount, raised_amount, currency, category, start_date, end_date, is_featured, is_active, status, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())";

        $stmt = $conn->prepare($sql);
        if (!$stmt) throw new Exception("Database prepare error: " . $conn->error);

        $title = $data['title'];
        $description = $data['description'] ?? null;
        $short_description = $data['short_description'] ?? null;
        $goal_amount = $data['goal_amount'];
        $raised_amount = $data['raised_amount'] ?? 0.00;
        $currency = $data['currency'] ?? 'USD';
        $category = $data['category'] ?? null;
        $start_date = $data['start_date'] ?? null;
        $end_date = $data['end_date'] ?? null;
        $is_featured = $data['is_featured'] ?? 0;
        $is_active = $data['is_active'] ?? 1;
        $status = in_array($data['status'] ?? '', ['pending', 'active', 'closed']) ? $data['status'] : 'pending';

        $stmt->bind_param("ssssddssssiis",
            $title, $description, $short_description, $image_url, $goal_amount, $raised_amount,
            $currency, $category, $start_date, $end_date, $is_featured, $is_active, $status
        );

        return $stmt->execute();
    }

    function editCause($conn, $id, $data) {
        $image_url = handleImageUpload() ?? $data['image_url'];

        $sql = "UPDATE causes SET title=?, description=?, short_description=?, image_url=?, goal_amount=?, raised_amount=?, currency=?, category=?, start_date=?, end_date=?, is_featured=?, is_active=?, status=?, updated_at=NOW() WHERE id=?";

        $stmt = $conn->prepare($sql);
        if (!$stmt) throw new Exception("Database prepare error: " . $conn->error);

        $title = $data['title'];
        $description = $data['description'] ?? null;
        $short_description = $data['short_description'] ?? null;
        $goal_amount = $data['goal_amount'];
        $raised_amount = $data['raised_amount'] ?? 0.00;
        $currency = $data['currency'] ?? 'USD';
        $category = $data['category'] ?? null;
        $start_date = $data['start_date'] ?? null;
        $end_date = $data['end_date'] ?? null;
        $is_featured = $data['is_featured'] ?? 0;
        $is_active = $data['is_active'] ?? 1;
        $status = in_array($data['status'] ?? '', ['pending', 'active', 'closed']) ? $data['status'] : 'pending';

        $stmt->bind_param("ssssddssssiisi",
            $title, $description, $short_description, $image_url, $goal_amount, $raised_amount,
            $currency, $category, $start_date, $end_date, $is_featured, $is_active, $status, $id
        );

        return $stmt->execute();
    }

    function deleteCause($conn, $id) {
        $sql = "DELETE FROM causes WHERE id = ?";
        $stmt = $conn->prepare($sql);
        if (!$stmt) throw new Exception("Database prepare error: " . $conn->error);
        $stmt->bind_param("i", $id);
        return $stmt->execute();
    }

    function acceptCause($conn, $id) {
        $sql = "UPDATE causes SET status = 'accepted' WHERE id = ?";
        $stmt = $conn->prepare($sql);
        if (!$stmt) throw new Exception("Database prepare error: " . $conn->error);
        $stmt->bind_param("i", $id);
        return $stmt->execute();
    }

    function getCauses($conn) {
        $sql = "SELECT * FROM causes ORDER BY created_at DESC";
        $result = $conn->query($sql);
        if (!$result) throw new Exception("Database query error: " . $conn->error);

        $causes = [];
        while ($row = $result->fetch_assoc()) {
            $causes[] = $row;
        }
        return $causes;
    }

    // Routing
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $data = $_POST;
        $action = $data['action'] ?? null;

        if (!$action) handleError("No action specified");

        switch ($action) {
            case 'add':
                if (!isset($data['title'], $data['goal_amount'])) handleError("Missing required fields");
                if (addCause($conn, $data)) sendJsonResponse(true, "Cause added successfully");
                else handleError("Failed to add cause");
                break;

            case 'edit':
                if (!isset($data['id'], $data['title'], $data['goal_amount'])) handleError("Missing required fields");
                if (editCause($conn, $data['id'], $data)) sendJsonResponse(true, "Cause updated successfully");
                else handleError("Failed to update cause");
                break;

            case 'delete':
                if (!isset($data['id'])) handleError("Missing cause ID");
                if (deleteCause($conn, $data['id'])) sendJsonResponse(true, "Cause deleted successfully");
                else handleError("Failed to delete cause");
                break;

            case 'accept':
                if (!isset($data['id'])) handleError("Missing cause ID");
                if (acceptCause($conn, $data['id'])) sendJsonResponse(true, "Cause accepted successfully");
                else handleError("Failed to accept cause");
                break;

            default:
                handleError("Invalid action");
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

ob_end_flush();
?>
