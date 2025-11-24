import json

# Read all three data files
with open('/home/ubuntu/upload/pasted_content_5.txt', 'r', encoding='utf-8') as f:
    tech_mind_data = [line.strip() for line in f.readlines()]

with open('/home/ubuntu/upload/pasted_content_7.txt', 'r', encoding='utf-8') as f:
    basic_skills_data = [line.strip() for line in f.readlines()]

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

def parse_data(lines):
    """Parse evaluation data from lines"""
    criteria = []
    current_category = None
    current_item = None
    current_grade = None
    
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
    
    return criteria

# Parse both files
basic_criteria = parse_data(basic_skills_data)
tech_mind_criteria = parse_data(tech_mind_data)

# Combine all criteria
all_criteria = basic_criteria + tech_mind_criteria

# Extract unique items (preserving order)
seen_items = {}
items_order = []

for criterion in all_criteria:
    cat_name = criterion['category']
    item_name = criterion['item']
    item_key = f"{cat_name}::{item_name}"
    
    if item_key not in seen_items:
        seen_items[item_key] = {
            'category': cat_name,
            'name': item_name
        }
        items_order.append(item_key)

items_list = [seen_items[key] for key in items_order]

# Create categories
categories = [
    {'code': 'BS', 'name': '基本スキル'},
    {'code': 'M', 'name': 'マインド'},
    {'code': 'T', 'name': 'テクニカルスキル'}
]

# Output
output = {
    'categories': categories,
    'items': items_list,
    'criteria': all_criteria
}

with open('evaluation_data_final.json', 'w', encoding='utf-8') as f:
    json.dump(output, f, ensure_ascii=False, indent=2)

print(f"Total categories: {len(categories)}")
print(f"Total items: {len(items_list)}")
print(f"Total criteria: {len(all_criteria)}")
print("\nBreakdown:")
for cat in categories:
    count = len([item for item in items_list if item['category'] == cat['name']])
    print(f"  {cat['code']}: {cat['name']} - {count} items")

