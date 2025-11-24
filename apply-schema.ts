import { drizzle } from "drizzle-orm/mysql2";
import { categories, evaluationItems, evaluations, evaluationScores } from "./drizzle/schema";

const db = drizzle(process.env.DATABASE_URL!);

async function applySchema() {
  try {
    // Create categories table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        displayOrder INT NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      )
    `);
    
    // Create evaluationItems table
    await db.execute(`
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
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      )
    `);
    
    // Create evaluations table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS evaluations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId INT NOT NULL,
        evaluatorId INT,
        evaluationType ENUM('self', 'manager') NOT NULL,
        evaluationPeriod VARCHAR(50) NOT NULL,
        status ENUM('draft', 'submitted', 'completed') DEFAULT 'draft' NOT NULL,
        submittedAt TIMESTAMP,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL
      )
    `);
    
    // Create evaluationScores table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS evaluationScores (
        id INT AUTO_INCREMENT PRIMARY KEY,
        evaluationId INT NOT NULL,
        itemId INT NOT NULL,
        score INT NOT NULL,
        comment TEXT,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL
      )
    `);
    
    console.log("✅ Schema applied successfully");
  } catch (error) {
    console.error("Error applying schema:", error);
  }
}

applySchema();
