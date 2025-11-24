import json

# Read the data file
with open('/home/ubuntu/upload/pasted_content_5.txt', 'r', encoding='utf-8') as f:
    lines = [line.strip() for line in f.readlines()]

# Parse data
categories = []
items = []
criteria = []

current_category = None
current_item = None
current_grade = None

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

i = 0
while i < len(lines):
    line = lines[i]
    
    # Skip empty lines and headers
    if not line or line in ['大項目', '中項目', '評価段階', '評価内容']:
        i += 1
        continue
    
    # Check if this is a category line
    if line in category_map:
        current_category = line
        i += 1
        # Next line should be the item name
        if i < len(lines) and lines[i] and lines[i] not in ['S', 'A', 'B', 'C', 'D']:
            current_item = lines[i]
            i += 1
        continue
    
    # Check if this is a grade line
    if line in grade_map:
        current_grade = line
        i += 1
        # Next line should be the description
        if i < len(lines) and lines[i]:
            description = lines[i]
            
            # Store criterion
            if current_category and current_item and current_grade:
                criteria.append({
                    'category': current_category,
                    'item': current_item,
                    'grade': current_grade,
                    'score': grade_map[current_grade],
                    'description': description
                })
        i += 1
        continue
    
    i += 1

# Extract unique categories and items
seen_categories = {}
seen_items = {}

for criterion in criteria:
    cat_name = criterion['category']
    item_name = criterion['item']
    
    if cat_name not in seen_categories:
        cat_code = category_map[cat_name]
        seen_categories[cat_name] = {
            'code': cat_code,
            'name': cat_name
        }
    
    item_key = f"{cat_name}::{item_name}"
    if item_key not in seen_items:
        seen_items[item_key] = {
            'category': cat_name,
            'name': item_name
        }

# Convert to lists
categories_list = list(seen_categories.values())
items_list = list(seen_items.values())

# Output JSON
output = {
    'categories': categories_list,
    'items': items_list,
    'criteria': criteria
}

with open('evaluation_data.json', 'w', encoding='utf-8') as f:
    json.dump(output, f, ensure_ascii=False, indent=2)

print(f"Parsed {len(categories_list)} categories")
print(f"Parsed {len(items_list)} items")
print(f"Parsed {len(criteria)} criteria")
print("\nCategories:")
for cat in categories_list:
    count = len([item for item in items_list if item['category'] == cat['name']])
    print(f"  {cat['code']}: {cat['name']} ({count} items)")

