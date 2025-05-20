<?php
session_start();
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST");
//Backend\api\user\donations.php
include("../config/database.php");
?>
<?php
header("Content-Type: application/json");
$data = json_decode(file_get_contents("php://input"), true);
$action = $data["action"] ?? "";

$conn = new mysqli("localhost", "root", "", "donation_db");

if ($action === "donate") {
    $user_id = $data["user_id"];
    $cause_id = $data["cause_id"];
    $amount = $data["amount"];
    $merchent_order_id = $data["merchent_order_id"];
    $status = "pending";

    $stmt = $conn->prepare("INSERT INTO donations (user_id, cause_id, amount, status, merchent_order_id) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("iiiss", $user_id, $cause_id, $amount, $status, $merchent_order_id);
    $stmt->execute();

    echo json_encode(["success" => true, "message" => "Donation saved"]);
}

elseif ($action === "update") {
    $donation_id = $data["donation_id"];
    $status = $data["status"];

    $stmt = $conn->prepare("UPDATE donations SET status = ? WHERE id = ?");
    $stmt->bind_param("si", $status, $donation_id);
    $stmt->execute();

    if (!empty($data["message"])) {
        $user_id = $data["user_id"];
        $message = $data["message"];

        $stmt = $conn->prepare("INSERT INTO notifications (user_id, message) VALUES (?, ?)");
        $stmt->bind_param("is", $user_id, $message);
        $stmt->execute();
    }

    echo json_encode(["success" => true, "message" => "Donation updated"]);
}
?>