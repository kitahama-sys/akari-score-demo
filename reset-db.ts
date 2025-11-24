import { drizzle } from "drizzle-orm/mysql2";

const db = drizzle(process.env.DATABASE_URL!);

async function resetDatabase() {
  try {
    // Drop old tables
    await db.execute(`DROP TABLE IF EXISTS evaluation_items`);
    await db.execute(`DROP TABLE IF EXISTS evaluations`);
    await db.execute(`DROP TABLE IF EXISTS evaluationScores`);
    await db.execute(`DROP TABLE IF EXISTS evaluationItems`);
    
    console.log("Old tables dropped successfully");
  } catch (error) {
    console.error("Error dropping tables:", error);
  }
}

resetDatabase();
