-- Create all tables for akari-score-demo

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  openId VARCHAR(64) UNIQUE,
  username VARCHAR(100) UNIQUE,
  passwordHash VARCHAR(255),
  name TEXT,
  loginMethod VARCHAR(64),
  role ENUM('user', 'admin', 'manager') NOT NULL DEFAULT 'user',
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  lastSignedIn TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  displayOrder INT NOT NULL,
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Evaluation Items table
CREATE TABLE IF NOT EXISTS evaluationItems (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(20) NOT NULL UNIQUE,
  categoryId INT NOT NULL,
  name VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  level5Description TEXT NOT NULL,
  level4Description TEXT NOT NULL,
  level3Description TEXT NOT NULL,
  level2Description TEXT NOT NULL,
  level1Description TEXT NOT NULL,
  displayOrder INT NOT NULL,
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Evaluations table
CREATE TABLE IF NOT EXISTS evaluations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  evaluatorId INT,
  evaluationType ENUM('self', 'manager') NOT NULL,
  evaluationPeriod VARCHAR(50) NOT NULL,
  status ENUM('draft', 'submitted', 'completed') NOT NULL DEFAULT 'draft',
  isLocked INT NOT NULL DEFAULT 0,
  submittedAt TIMESTAMP,
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Evaluation Scores table
CREATE TABLE IF NOT EXISTS evaluationScores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  evaluationId INT NOT NULL,
  itemId INT NOT NULL,
  score INT NOT NULL,
  comment TEXT,
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Roadmaps table
CREATE TABLE IF NOT EXISTS roadmaps (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  evaluationPeriod VARCHAR(50) NOT NULL,
  longTermVision TEXT NOT NULL,
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Roadmap Steps table
CREATE TABLE IF NOT EXISTS roadmapSteps (
  id INT AUTO_INCREMENT PRIMARY KEY,
  roadmapId INT NOT NULL,
  stepNumber INT NOT NULL,
  title VARCHAR(200) NOT NULL,
  deadline VARCHAR(20),
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Roadmap Goals table
CREATE TABLE IF NOT EXISTS roadmapGoals (
  id INT AUTO_INCREMENT PRIMARY KEY,
  roadmapId INT NOT NULL,
  stepId INT,
  goalText TEXT NOT NULL,
  isCompleted INT NOT NULL DEFAULT 0,
  displayOrder INT NOT NULL,
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Activity Logs table
CREATE TABLE IF NOT EXISTS activityLogs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  activityType ENUM('self_evaluation_submitted', 'manager_evaluation_completed', 'roadmap_updated', 'evaluation_period_started', 'evaluation_period_ended') NOT NULL,
  description TEXT NOT NULL,
  evaluationPeriod VARCHAR(20),
  targetUserId INT,
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
