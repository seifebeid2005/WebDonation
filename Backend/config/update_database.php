<?php
require_once 'database.php';

// Read and execute the SQL file
$sql = file_get_contents(__DIR__ . '/update_causes_table.sql');

if ($conn->multi_query($sql)) {
    do {
        // Store first result set
        if ($result = $conn->store_result()) {
            $result->free();
        }
    } while ($conn->more_results() && $conn->next_result());
    
    echo json_encode([
        "success" => true,
        "message" => "Database updated successfully"
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Error updating database: " . $conn->error
    ]);
}

$conn->close();
?> 