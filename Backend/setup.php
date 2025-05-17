<?php
// Enable error display for debugging
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Database connection parameters
$host = "localhost";
$user = "root";
$password = "root";

try {
    // Create connection without database selection
    $conn = new mysqli($host, $user, $password);
    
    // Check connection
    if ($conn->connect_error) {
        throw new Exception("Connection failed: " . $conn->connect_error);
    }
    
    echo "Connected to MySQL server successfully.<br>";
    
    // Create database if it doesn't exist
    $sql = "CREATE DATABASE IF NOT EXISTS webdonation";
    if ($conn->query($sql) === TRUE) {
        echo "Database 'webdonation' created or already exists.<br>";
    } else {
        throw new Exception("Error creating database: " . $conn->error);
    }
    
    // Select the database
    $conn->select_db("webdonation");
    
    // Read SQL file content
    $sqlFile = file_get_contents(__DIR__ . "/sql/Donations.sql");
    
    // Execute SQL commands
    if ($conn->multi_query($sqlFile)) {
        echo "Tables created successfully.<br>";
        
        // Clear results to allow further queries
        do {
            if ($result = $conn->store_result()) {
                $result->free();
            }
        } while ($conn->more_results() && $conn->next_result());
    } else {
        throw new Exception("Error creating tables: " . $conn->error);
    }
    
    // Create admin user
    $adminName = "Admin User";
    $adminEmail = "admin@webdonation.com";
    $adminUsername = "admin";
    $adminPasswordHash = password_hash("admin123", PASSWORD_DEFAULT);
    $adminPassword = "admin123"; // Plain text for testing
    
    // Check if admins table has username column
    $result = $conn->query("SHOW COLUMNS FROM admins LIKE 'username'");
    if ($result->num_rows == 0) {
        // Add username column
        $conn->query("ALTER TABLE admins ADD COLUMN username VARCHAR(50) UNIQUE AFTER email");
        echo "Added username column to admins table.<br>";
    }
    
    // Check if admins table has password column
    $result = $conn->query("SHOW COLUMNS FROM admins LIKE 'password'");
    if ($result->num_rows == 0) {
        // Add password column
        $conn->query("ALTER TABLE admins ADD COLUMN password VARCHAR(255) AFTER password_hash");
        echo "Added password column to admins table.<br>";
    }
    
    // Check if admin user exists
    $stmt = $conn->prepare("SELECT id FROM admins WHERE username = ?");
    $stmt->bind_param("s", $adminUsername);
    $stmt->execute();
    $stmt->store_result();
    
    if ($stmt->num_rows == 0) {
        // Insert admin user
        $stmt = $conn->prepare("INSERT INTO admins (name, email, username, password_hash, password, role, status) VALUES (?, ?, ?, ?, ?, 'admin', 'active')");
        $stmt->bind_param("sssss", $adminName, $adminEmail, $adminUsername, $adminPasswordHash, $adminPassword);
        
        if ($stmt->execute()) {
            echo "Admin user created successfully.<br>";
        } else {
            throw new Exception("Error creating admin user: " . $stmt->error);
        }
    } else {
        echo "Admin user already exists.<br>";
    }
    
    echo "<br>Setup completed successfully!";
    
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage();
}
?> 