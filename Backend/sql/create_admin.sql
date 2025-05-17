-- Insert a test admin user with password 'admin123'
INSERT INTO admins (name, email, username, password_hash, role, status)
VALUES ('Admin User', 'admin@webdonation.com', 'admin', '$2y$10$GkVdZNS9.Qw9tDFOvpQ9qeUTY.vBqLaNAUWgKkXbFIcgMrM1AoXKi', 'admin', 'active');

-- The password_hash above is for 'admin123' generated using PHP's password_hash() function
-- You can also use plain text password for testing by adding a 'password' column to the admins table
-- ALTER TABLE admins ADD COLUMN password VARCHAR(255) AFTER password_hash;
-- UPDATE admins SET password = 'admin123' WHERE username = 'admin'; 