import json
import re

# Parse the first file (detailed criteria)
with open('/home/ubuntu/upload/pasted_content_5.txt', 'r', encoding='utf-8') as f:
    lines1 = [line.strip() for line in f.readlines()]

# Parse the second file (markdown table format)
with open('/home/ubuntu/upload/pasted_content_6.txt', 'r', encoding='utf-8') as f:
    lines2 = [line.strip() for line in f.readlines()]

category_map = {
    '基本スキル': 'BS',
    'マインド': 'M',
    'テクニカルスキル': 'T'
}

grade_map = {
    'S': 5,
    'A': 4,
    'B': 3,
    'C': 2,
    'D': 1
}

# Parse file 1
criteria1 = []
current_category = None
current_item = None
current_grade = None

i = 0
while i < len(lines1):
    line = lines1[i]
    
    if not line or line in ['大項目', '中項目', '評価段階', '評価内容']:
        i += 1
        continue
    
    if line in category_map:
        current_category = line
        i += 1
        if i < len(lines1) and lines1[i] and lines1[i] not in ['S', 'A', 'B', 'C', 'D']:
            current_item = lines1[i]
            i += 1
        continue
    
    if line in grade_map:
        current_grade = line
        i += 1
        if i < len(lines1) and lines1[i]:
            description = lines1[i]
            if current_category and current_item and current_grade:
                criteria1.append({
                    'category': current_category,
                    'item': current_item,
                    'grade': current_grade,
                    'score': grade_map[current_grade],
                    'description': description
                })
        i += 1
        continue
    
    i += 1

# Parse file 2 (markdown table)
criteria2 = []
for line in lines2[2:]:  # Skip header rows
    if not line or line.startswith('|---'):
        continue
    
    parts = [p.strip() for p in line.split('|')]
    if len(parts) >= 5:
        cat = parts[1]
        item = parts[2]
        grade = parts[3]
        desc = parts[4]
        
        if cat in category_map and grade in grade_map:
            criteria2.append({
                'category': cat,
                'item': item,
                'grade': grade,
                'score': grade_map[grade],
                'description': desc
            })

# Combine criteria
all_criteria = criteria1 + criteria2

# Extract unique items
seen_items = {}
for criterion in all_criteria:
    cat_name = criterion['category']
    item_name = criterion['item']
    item_key = f"{cat_name}::{item_name}"
    
    if item_key not in seen_items:
        seen_items[item_key] = {
            'category': cat_name,
            'name': item_name
        }

# Create categories
categories = [
    {'code': 'BS', 'name': '基本スキル'},
    {'code': 'M', 'name': 'マインド'},
    {'code': 'T', 'name': 'テクニカルスキル'}
]

items_list = list(seen_items.values())

# Output
output = {
    'categories': categories,
    'items': items_list,
    'criteria': all_criteria
}

with open('evaluation_data_complete.json', 'w', encoding='utf-8') as f:
    json.dump(output, f, ensure_ascii=False, indent=2)

print(f"Total categories: {len(categories)}")
print(f"Total items: {len(items_list)}")
print(f"Total criteria: {len(all_criteria)}")
print("\nBreakdown:")
for cat in categories:
    count = len([item for item in items_list if item['category'] == cat['name']])
    print(f"  {cat['code']}: {cat['name']} - {count} items")

