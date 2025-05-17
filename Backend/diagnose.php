<?php
// Set content type to plain text for easier reading
header("Content-Type: text/plain");

echo "=== PHP Diagnostic Tool ===\n\n";

// Check PHP version
echo "PHP Version: " . phpversion() . "\n";

// Check JSON support
echo "JSON Support: " . (function_exists('json_encode') ? "Available" : "Not Available") . "\n";
echo "JSON Extension: " . (extension_loaded('json') ? "Loaded" : "Not Loaded") . "\n";

// Check session support
echo "Session Support: " . (function_exists('session_start') ? "Available" : "Not Available") . "\n";
echo "Session Status: " . (session_status() === PHP_SESSION_ACTIVE ? "Active" : "Not Active") . "\n";

// Check headers
echo "\n=== Headers ===\n";
foreach (headers_list() as $header) {
    echo $header . "\n";
}

// Check output buffering
echo "\nOutput Buffering: " . (ob_get_level() > 0 ? "Enabled (Level: " . ob_get_level() . ")" : "Disabled") . "\n";

// Check for BOM in this file
$this_file = file_get_contents(__FILE__);
$has_bom = (substr($this_file, 0, 3) === "\xEF\xBB\xBF");
echo "BOM in this file: " . ($has_bom ? "Present" : "Not Present") . "\n";

// Check for common issues
echo "\n=== Common Issues ===\n";

// Check for whitespace before <?php
$has_whitespace = (trim($this_file) !== $this_file);
echo "Whitespace before opening PHP tag: " . ($has_whitespace ? "Present" : "Not Present") . "\n";

// Check database connection
echo "\n=== Database Connection ===\n";
try {
    $host = "localhost";
    $user = "root";
    $password = "root";
    $database = "webdonation";
    
    $conn = new mysqli($host, $user, $password, $database);
    
    if ($conn->connect_error) {
        echo "Database Connection: Failed - " . $conn->connect_error . "\n";
    } else {
        echo "Database Connection: Successful\n";
        
        // Check if admins table exists
        $result = $conn->query("SHOW TABLES LIKE 'admins'");
        echo "Admins Table Exists: " . ($result->num_rows > 0 ? "Yes" : "No") . "\n";
        
        if ($result->num_rows > 0) {
            // Check admin records
            $result = $conn->query("SELECT COUNT(*) as count FROM admins");
            $row = $result->fetch_assoc();
            echo "Admin Records Count: " . $row['count'] . "\n";
        }
    }
} catch (Exception $e) {
    echo "Database Error: " . $e->getMessage() . "\n";
}

// Check file permissions
echo "\n=== File Permissions ===\n";
$files = [
    __FILE__,
    __DIR__ . "/admin/login.php",
    __DIR__ . "/config/database.php",
    __DIR__ . "/json_test.php"
];

foreach ($files as $file) {
    if (file_exists($file)) {
        echo basename($file) . ": " . substr(sprintf('%o', fileperms($file)), -4) . "\n";
    } else {
        echo basename($file) . ": File not found\n";
    }
}

echo "\n=== End of Diagnostic ===\n";
?> 