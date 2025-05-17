-- Add username column to admins table
ALTER TABLE admins ADD COLUMN username VARCHAR(50) UNIQUE AFTER email;

-- Update existing records if any
UPDATE admins SET username = SUBSTRING_INDEX(email, '@', 1) WHERE username IS NULL;

-- Add plain text password column for easier testing
ALTER TABLE admins ADD COLUMN password VARCHAR(255) AFTER password_hash; 