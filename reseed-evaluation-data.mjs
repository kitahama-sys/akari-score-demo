import { drizzle } from 'drizzle-orm/mysql2';
import { categories, evaluationItems, evaluations, evaluationScores } from './drizzle/schema.ts';
import fs from 'fs';

const db = drizzle(process.env.DATABASE_URL);

// Read the final data
const data = JSON.parse(fs.readFileSync('evaluation_data_final.json', 'utf-8'));

async function reseedData() {
  console.log('🗑️  Deleting existing evaluation data...');
  
  // Delete in correct order (scores → evaluations → items → categories)
  await db.delete(evaluationScores);
  await db.delete(evaluations);
  await db.delete(evaluationItems);
  await db.delete(categories);
  
  console.log('✓ Existing data deleted');
  console.log('📝 Inserting new data...');
  
  for (const cat of data.categories) {
    // Insert category
    const [insertedCat] = await db.insert(categories).values({
      name: cat.name,
      displayOrder: cat.displayOrder,
    });
    
    const categoryId = insertedCat.insertId;
    console.log(`✓ Category: ${cat.name} (ID: ${categoryId})`);
    
    // Insert items
    for (let i = 0; i < cat.items.length; i++) {
      const item = cat.items[i];
      
      // Generate code based on category and order
      const categoryCode = cat.name === '基本スキル' ? 'BS' : cat.name === 'マインド' ? 'M' : 'T';
      const code = `${categoryCode}${String(i + 1).padStart(2, '0')}`;
      
      await db.insert(evaluationItems).values({
        code,
        categoryId,
        name: item.name,
        description: item.name, // Use name as description
        level5Description: item.S || '',
        level4Description: item.A || '',
        level3Description: item.B || '',
        level2Description: item.C || '',
        level1Description: item.D || '',
        displayOrder: i + 1,
      });
      
      console.log(`  ✓ Item ${i + 1}: ${item.name.substring(0, 40)}...`);
    }
  }
  
  console.log('✅ Data reseeded successfully!');
  console.log('\n📊 Summary:');
  console.log(`  - Categories: ${data.categories.length}`);
  console.log(`  - Total items: ${data.categories.reduce((sum, cat) => sum + cat.items.length, 0)}`);
  
  process.exit(0);
}

reseedData().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
