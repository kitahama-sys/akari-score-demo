import { drizzle } from "drizzle-orm/mysql2";
import { categories, evaluationItems } from "./drizzle/schema";
import * as fs from 'fs';

const db = drizzle(process.env.DATABASE_URL!);

async function seedData() {
  try {
    const data = JSON.parse(fs.readFileSync('./evaluation-data.json', 'utf-8'));
    
    console.log("Inserting categories...");
    for (const cat of data.categories) {
      await db.insert(categories).values({
        name: cat.name,
        displayOrder: cat.displayOrder,
      }).onDuplicateKeyUpdate({ set: { name: cat.name } });
    }
    
    console.log("Inserting evaluation items...");
    for (const item of data.items) {
      await db.insert(evaluationItems).values({
        code: item.code,
        categoryId: item.categoryId,
        name: item.name,
        description: item.description,
        level5Description: item.level5Description,
        level4Description: item.level4Description,
        level3Description: item.level3Description,
        level2Description: item.level2Description,
        level1Description: item.level1Description,
        displayOrder: item.displayOrder,
      }).onDuplicateKeyUpdate({ set: { name: item.name } });
    }
    
    console.log(`✅ Seeded ${data.categories.length} categories and ${data.items.length} evaluation items`);
  } catch (error) {
    console.error("Error seeding data:", error);
  }
}

seedData();
