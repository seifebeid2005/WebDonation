<?php
session_start();
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST");
//Backend\api\admin\dashboard_stats.php
include("../config/database.php");
// reem
// 1. Total number of users
// 2. Total number of causes
// 3. Total number of donations
// 4. Total amount of donations
// 5. Total amount of raised amount
// 3ayzin funtion wa7dha terg3 kol dah
?>
