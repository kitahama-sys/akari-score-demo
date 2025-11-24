import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import fs from 'fs';

// Read evaluation data for demo (with masked items)
const evaluationData = JSON.parse(
  fs.readFileSync('./evaluation_data_demo.json', 'utf-8')
);

// Create database connection
const connection = await mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'akari_score_demo'
});
const db = drizzle(connection);

console.log('🚀 デモ用評価項目データの投入を開始します...\n');

try {
  // 1. Insert categories
  console.log('📁 カテゴリを登録中...');
  const categoryMap = {};
  
  for (const cat of evaluationData.categories) {
    await connection.execute(
      'INSERT INTO categories (name, displayOrder) VALUES (?, ?) ON DUPLICATE KEY UPDATE displayOrder = VALUES(displayOrder)',
      [cat.name, cat.displayOrder]
    );
    
    const [rows] = await connection.execute(
      'SELECT id FROM categories WHERE name = ?',
      [cat.name]
    );
    
    categoryMap[cat.name] = rows[0].id;
    console.log(`  ✅ ${cat.name} (ID: ${rows[0].id})`);
  }
  
  console.log(`\n📋 ${evaluationData.categories.length}個のカテゴリを登録しました\n`);

  // 2. Insert evaluation items
  console.log('📝 評価項目を登録中...');
  let itemOrder = 1;
  
  for (const cat of evaluationData.categories) {
    const categoryId = categoryMap[cat.name];
    const categoryCode = cat.name === '基本スキル' ? 'BS' : cat.name === 'マインド' ? 'M' : 'T';
    
    for (const item of cat.items) {
      const itemCode = `${categoryCode}${String(itemOrder).padStart(2, '0')}`;
      
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
          item.name,
          item.S,
          item.A,
          item.B,
          item.C,
          item.D,
          itemOrder
        ]
      );
      
      const displayName = item.name.includes('非公開') ? '【非公開項目】' : item.name;
      console.log(`  ✅ ${itemCode}: ${displayName}`);
      itemOrder++;
    }
  }
  
  console.log(`\n🎉 デモ用評価項目データの投入が完了しました！`);
  console.log(`   合計 ${itemOrder - 1} 項目を登録しました`);
  console.log(`   - 公開項目: 4項目`);
  console.log(`   - 非公開項目: ${itemOrder - 5}項目\n`);
  
} catch (error) {
  console.error('❌ エラーが発生しました:', error);
  throw error;
} finally {
  await connection.end();
}
