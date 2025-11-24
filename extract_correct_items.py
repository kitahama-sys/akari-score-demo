import json

# The correct 25 basic skill items from the original list
correct_basic_skills = [
    "社会人としての基本マナーを理解し、適切にふるまっている",
    "社内外問わず、相手に安心感を与える丁寧なコミュニケーションができる",
    "清潔感を保ち、共有スペースやツールの整理整頓を心がけている",
    "感情に流されず、柔軟にストレスや変化に対応できる",
    "組織全体やチームの視点を持ち、前向きに改善や提案を行っている",
    "チームや業務の質を高めるために、工夫や学びを積極的に取り入れている",
    "目的に沿って手段を自分で選び、成果と品質を担保している",
    "固定手順にこだわらず、状況に合わせて方法を見直し・改善ができている",
    "自分の強みや個性を活かして、利用者・家族・顧客への価値につなげている",
    "無理に演じず、誠実な態度で良好な関係をつくっている",
    "重要タスクを段取りよくやり切り、余った時間を学習・準備・支援に活用している",
    "不要な残業を避け、終了報告と次アクションを明確に共有している",
    "期限・約束を守り、難しい場合は早めに共有し代替案を出している",
    "役割への期待を理解し、主体的に\"先回りして\"動いている",
    "手順よりも目的と安全を優先して判断できている",
    "次の人が動きやすいように、情報・準備・片付けを先回りで整えている",
    "異常・遅延・事故リスクを察知したら、すぐに報連相している",
    "進捗と課題をタイムリーに共有している",
    "記録や証跡を適切に残し、引き継ぎと再現性を担保している",
    "かかった時間ではなく、成果や価値を示せている",
    "アウトプットを数値や事実で可視化し、分かりやすく説明できている",
    "目的と事実に基づき、違和感やリスクを率直に指摘・提案できている",
    "相手を尊重し、建設的な代替案を添えて発言している",
    "勤務と私生活の境界を適切に設計し、休養・家族予定を計画的に確保している",
    "体調管理と業務調整を自律的に行い、安定したパフォーマンスを維持している"
]

# Load the parsed data
with open('evaluation_data_final.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Filter items to keep only the correct 25 basic skills
filtered_items = []
for item in data['items']:
    if item['category'] == '基本スキル':
        if item['name'] in correct_basic_skills:
            filtered_items.append(item)
    else:
        # Keep all マインド and テクニカルスキル items
        filtered_items.append(item)

# Filter criteria to match the filtered items
item_names = set(item['name'] for item in filtered_items)
filtered_criteria = [
    c for c in data['criteria']
    if c['item'] in item_names
]

# Create final output
final_data = {
    'categories': data['categories'],
    'items': filtered_items,
    'criteria': filtered_criteria
}

with open('evaluation_data_correct.json', 'w', encoding='utf-8') as f:
    json.dump(final_data, f, ensure_ascii=False, indent=2)

print(f"Total categories: {len(final_data['categories'])}")
print(f"Total items: {len(final_data['items'])}")
print(f"Total criteria: {len(final_data['criteria'])}")
print("\nBreakdown:")
for cat in final_data['categories']:
    count = len([item for item in final_data['items'] if item['category'] == cat['name']])
    print(f"  {cat['code']}: {cat['name']} - {count} items")

