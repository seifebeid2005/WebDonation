<?php
session_start();
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST");
//Backend\api\auth\check_session.php
include("../config/database.php");

if (isset($_SESSION['user_id'])) {
    $response = [
        'status' => 'success',
        'user_id' => $_SESSION['user_id'],
    ];
    if (isset($_SESSION['is_admin']) && $_SESSION['is_admin'] === true) {
        $response['role'] = 'admin';
    }
    echo json_encode($response);
} else {
    echo json_encode([
        'status' => 'error',
        'message' => null,
    ]);
}
?>
