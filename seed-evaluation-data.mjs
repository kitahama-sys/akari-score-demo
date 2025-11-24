import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import fs from 'fs';

// Read evaluation data
const evaluationData = JSON.parse(
  fs.readFileSync('./evaluation_data_correct.json', 'utf-8')
);

// Create database connection
const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection);

console.log('Starting data seeding...\n');

try {
  // 1. Insert categories
  console.log('Inserting categories...');
  const categoryMap = {};
  
  for (const cat of evaluationData.categories) {
    const displayOrder = cat.code === 'BS' ? 1 : cat.code === 'M' ? 2 : 3;
    
    await connection.execute(
      'INSERT INTO categories (name, displayOrder) VALUES (?, ?) ON DUPLICATE KEY UPDATE displayOrder = VALUES(displayOrder)',
      [cat.name, displayOrder]
    );
    
    const [rows] = await connection.execute(
      'SELECT id FROM categories WHERE name = ?',
      [cat.name]
    );
    
    categoryMap[cat.name] = rows[0].id;
    console.log(`  - ${cat.name} (ID: ${rows[0].id})`);
  }
  
  console.log(`\nInserted ${evaluationData.categories.length} categories\n`);

  // 2. Insert evaluation items with criteria
  console.log('Inserting evaluation items...');
  let itemOrder = 1;
  
  for (const item of evaluationData.items) {
    const categoryId = categoryMap[item.category];
    
    // Find criteria for this item
    const itemCriteria = evaluationData.criteria.filter(
      c => c.item === item.name && c.category === item.category
    );
    
    if (itemCriteria.length !== 5) {
      console.warn(`  Warning: ${item.name} has ${itemCriteria.length} criteria (expected 5)`);
      continue;
    }
    
    // Sort criteria by score (5 to 1)
    itemCriteria.sort((a, b) => b.score - a.score);
    
    // Generate code
    const categoryCode = evaluationData.categories.find(c => c.name === item.category).code;
    const itemCode = `${categoryCode}${String(itemOrder).padStart(2, '0')}`;
    
    // Insert item
    await connection.execute(
      `INSERT INTO evaluationItems 
       (code, categoryId, name, description, level5Description, level4Description, level3Description, level2Description, level1Description, displayOrder) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE 
       name = VALUES(name),
       description = VALUES(description),
       level5Description = VALUES(level5Description),
       level4Description = VALUES(level4Description),
       level3Description = VALUES(level3Description),
       level2Description = VALUES(level2Description),
       level1Description = VALUES(level1Description),
       displayOrder = VALUES(displayOrder)`,
      [
        itemCode,
        categoryId,
        item.name,
        item.name, // Use item name as description
        itemCriteria[0].description, // S
        itemCriteria[1].description, // A
        itemCriteria[2].description, // B
        itemCriteria[3].description, // C
        itemCriteria[4].description, // D
        itemOrder
      ]
    );
    
    console.log(`  - ${itemCode}: ${item.name}`);
    itemOrder++;
  }
  
  console.log(`\nInserted ${evaluationData.items.length} evaluation items\n`);
  console.log('Data seeding completed successfully!');
  
} catch (error) {
  console.error('Error seeding data:', error);
  throw error;
} finally {
  await connection.end();
}
