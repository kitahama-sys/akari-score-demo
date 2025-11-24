-- Add username and passwordHash columns to users table
ALTER TABLE users 
  MODIFY COLUMN openId VARCHAR(64) NULL,
  ADD COLUMN username VARCHAR(100) UNIQUE AFTER openId,
  ADD COLUMN passwordHash VARCHAR(255) AFTER username;

-- Update role enum to include 'manager'
ALTER TABLE users 
  MODIFY COLUMN role ENUM('user', 'admin', 'manager') NOT NULL DEFAULT 'user';
