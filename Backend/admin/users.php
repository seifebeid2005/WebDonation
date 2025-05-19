<?php
session_start();
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST");
//Backend\api\admin\users.php
include("../config/database.php");
// abdullah 
// hagib el user data we a3mel fiha el funtions CRUD 
// 1. Get all users
// 2. Get user by id
// 3. Create user
// 4. Update user
// 5. Delete user

if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Connection failed: " . $conn->connect_error]);
    exit();
} else {
    echo json_encode(["success" => true, "message" => "Connection successful!!"]);
    exit();
}

?>
