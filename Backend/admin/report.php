<?php
session_start();
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST");
//Backend\api\admin\report.php
include("../config/database.php");
// john
// bos ya basha geb kol el statistics ely 3ayzha'
// 1. Total number of users
// 2. Total number of causes
// 3. Total number of donations
// 4. Total amount of donations
// 5. Total amount of raised amount
// we gebb kol el kalam dah we zabato kan2o report bass el tazbitat hatkon fih el jsx 3ady hen ajust hatgib data ely 3ayzha
?>
