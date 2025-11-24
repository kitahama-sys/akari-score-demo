import * as fs from 'fs';
import * as path from 'path';

const csvPath = '/home/ubuntu/evaluation_simple/master_items_new.csv';
const csvContent = fs.readFileSync(csvPath, 'utf-8');
const lines = csvContent.split('\n').filter(line => line.trim());

const categories: any[] = [];
const items: any[] = [];

let categoryMap: { [key: string]: number } = {};
let categoryIdCounter = 1;

for (let i = 1; i < lines.length; i++) {
  const line = lines[i];
  const parts = line.split(',');
  
  if (parts.length < 9) continue;
  
  const itemCode = parts[0];
  const categoryName = parts[1];
  const itemName = parts[2];
  const itemDescription = parts[3];
  const level5 = parts[4];
  const level4 = parts[5];
  const level3 = parts[6];
  const level2 = parts[7];
  const level1 = parts[8];
  
  // カテゴリを追加
  if (!categoryMap[categoryName]) {
    const categoryId = categoryIdCounter++;
    categoryMap[categoryName] = categoryId;
    categories.push({
      id: categoryId,
      name: categoryName,
      displayOrder: categoryId
    });
  }
  
  const categoryId = categoryMap[categoryName];
  
  // 評価項目を追加
  items.push({
    code: itemCode,
    categoryId: categoryId,
    name: itemName,
    description: itemDescription,
    level5Description: level5,
    level4Description: level4,
    level3Description: level3,
    level2Description: level2,
    level1Description: level1,
    displayOrder: i
  });
}

const output = {
  categories,
  items
};

console.log(JSON.stringify(output, null, 2));
