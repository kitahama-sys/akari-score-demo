import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";

// データベース接続
const connection = await mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'akari_score_demo'
});
const db = drizzle(connection);

console.log("🚀 デモユーザーとサンプルデータの作成を開始します...\n");

// パスワードハッシュを生成
const demoUserPassword = await bcrypt.hash("DemoUser2024!", 10);
const demoAdminPassword = await bcrypt.hash("DemoAdmin2024!", 10);

// 1. デモユーザー3名を作成
const demoUsers = [
  { username: "demo-user1", name: "田中 太郎", password: demoUserPassword, role: "user" },
  { username: "demo-user2", name: "佐藤 花子", password: demoUserPassword, role: "user" },
  { username: "demo-user3", name: "鈴木 一郎", password: demoUserPassword, role: "user" },
];

const userIds = [];

for (const user of demoUsers) {
  const result = await connection.execute(
    `INSERT INTO users (username, passwordHash, name, loginMethod, role, createdAt, updatedAt, lastSignedIn) 
     VALUES (?, ?, ?, 'password', ?, NOW(), NOW(), NOW())`,
    [user.username, user.password, user.name, user.role]
  );
  userIds.push(result[0].insertId);
  console.log(`✅ ${user.name} (${user.username}) を作成しました`);
}

// 2. デモ管理者を作成
const adminResult = await connection.execute(
  `INSERT INTO users (username, passwordHash, name, loginMethod, role, createdAt, updatedAt, lastSignedIn) 
   VALUES (?, ?, ?, 'password', ?, NOW(), NOW(), NOW())`,
  ["demo-admin", demoAdminPassword, "管理者 太郎", "admin"]
);
const adminId = adminResult[0].insertId;
console.log(`✅ 管理者 太郎 (demo-admin) を作成しました\n`);

// 3. 評価項目を取得
const [items] = await connection.execute("SELECT id, code FROM evaluationItems ORDER BY displayOrder");
console.log(`📋 評価項目数: ${items.length}\n`);

// 4. 各ユーザーに3期間分の評価データを作成
const periods = ["2024-second", "2025-first", "2025-second"];

// 各ユーザーの成長パターン（異なる特性を持たせる）
const userGrowthPatterns = [
  {
    // 田中 太郎: バランス型の成長
    "2024-second": { BS: 3.0, M: 3.2, T: 3.0 },
    "2025-first": { BS: 3.6, M: 3.8, T: 3.5 },
    "2025-second": { BS: 4.0, M: 4.2, T: 4.0 },
  },
  {
    // 佐藤 花子: マインド重視型
    "2024-second": { BS: 3.5, M: 4.0, T: 2.8 },
    "2025-first": { BS: 3.8, M: 4.5, T: 3.2 },
    "2025-second": { BS: 4.2, M: 4.8, T: 3.8 },
  },
  {
    // 鈴木 一郎: テクニカル重視型
    "2024-second": { BS: 3.2, M: 2.8, T: 3.8 },
    "2025-first": { BS: 3.5, M: 3.2, T: 4.2 },
    "2025-second": { BS: 3.8, M: 3.6, T: 4.6 },
  },
];

for (let userIndex = 0; userIndex < userIds.length; userIndex++) {
  const userId = userIds[userIndex];
  const userName = demoUsers[userIndex].name;
  const growthPattern = userGrowthPatterns[userIndex];
  
  console.log(`📊 ${userName}の評価データを作成中...`);
  
  for (const period of periods) {
    const scores = growthPattern[period];
    
    // 自己評価を作成
    const selfEvalResult = await connection.execute(
      `INSERT INTO evaluations (userId, evaluationType, evaluationPeriod, status, submittedAt, createdAt, updatedAt) 
       VALUES (?, 'self', ?, 'submitted', NOW(), NOW(), NOW())`,
      [userId, period]
    );
    
    const selfEvalId = selfEvalResult[0].insertId;
    
    // 各評価項目のスコアを保存
    for (const item of items) {
      let baseScore;
      if (item.code.startsWith('BS')) {
        baseScore = scores.BS;
      } else if (item.code.startsWith('M')) {
        baseScore = scores.M;
      } else if (item.code.startsWith('T')) {
        baseScore = scores.T;
      }
      
      const variation = (Math.random() - 0.5) * 1.2; // ±0.6のバラつき
      const score = Math.max(1, Math.min(5, Math.round(baseScore + variation)));
      
      await connection.execute(
        `INSERT INTO evaluationScores (evaluationId, itemId, score, createdAt, updatedAt) 
         VALUES (?, ?, ?, NOW(), NOW())`,
        [selfEvalId, item.id, score]
      );
    }
    
    // 上長評価を作成
    const managerEvalResult = await connection.execute(
      `INSERT INTO evaluations (userId, evaluatorId, evaluationType, evaluationPeriod, status, submittedAt, createdAt, updatedAt) 
       VALUES (?, ?, 'manager', ?, 'completed', NOW(), NOW(), NOW())`,
      [userId, adminId, period]
    );
    
    const managerEvalId = managerEvalResult[0].insertId;
    
    // 上長評価のスコア（自己評価より少し厳しめ）
    const [selfScores] = await connection.execute(
      `SELECT itemId, score FROM evaluationScores WHERE evaluationId = ?`,
      [selfEvalId]
    );
    
    for (const selfScore of selfScores) {
      const diff = Math.floor(Math.random() * 3) - 1; // -1, 0, +1のいずれか
      const managerScore = Math.max(1, Math.min(5, selfScore.score + diff));
      
      await connection.execute(
        `INSERT INTO evaluationScores (evaluationId, itemId, score, createdAt, updatedAt) 
         VALUES (?, ?, ?, NOW(), NOW())`,
        [managerEvalId, selfScore.itemId, managerScore]
      );
    }
    
    // 上長コメントを追加
    const managerComments = {
      "2024-second": [
        "基本的なスキルは身についています。今後はさらなる成長を期待しています。",
        "利用者様への思いやりが素晴らしいです。技術面も引き続き磨いていきましょう。",
        "技術力が高く頼りになります。チームワークも意識していきましょう。"
      ],
      "2025-first": [
        "着実に成長していますね。バランスの良い成長が見られます。",
        "マインド面での向上が素晴らしいです。この調子で頑張ってください。",
        "技術面での成長が顕著です。リーダーシップも発揮していきましょう。"
      ],
      "2025-second": [
        "素晴らしい成長が見られます！全体的にバランスよく向上しています。",
        "チームの中心として活躍していますね。今後も期待しています。",
        "高い専門性を持つようになりました。後輩の指導もお願いします。"
      ]
    };
    
    const comment = managerComments[period][userIndex];
    await connection.execute(
      `UPDATE evaluationScores SET comment = ? WHERE evaluationId = ? AND itemId = ? LIMIT 1`,
      [comment, managerEvalId, items[0].id]
    );
    
    console.log(`  ✅ ${period}の評価データを作成しました`);
  }
  
  // 5. 各ユーザーのマイキャリアマップを作成
  const visions = [
    "5年後には、チームリーダーとして後輩の育成に携わり、利用者様とご家族に寄り添える介護のプロフェッショナルになりたいです。",
    "利用者様一人ひとりの想いに寄り添い、心温まるケアを提供できる介護福祉士として成長したいです。地域に信頼される存在になることが目標です。",
    "介護技術のスペシャリストとして、チームの技術向上をリードできる存在になりたいです。最新の介護技術を学び続け、質の高いケアを提供します。"
  ];
  
  const roadmapResult = await connection.execute(
    `INSERT INTO roadmaps (userId, evaluationPeriod, longTermVision, createdAt, updatedAt) 
     VALUES (?, '2025-second', ?, NOW(), NOW())`,
    [userId, visions[userIndex]]
  );
  
  const roadmapId = roadmapResult[0].insertId;
  
  // STEP1-3を作成
  const stepTemplates = [
    [
      {
        stepNumber: 1,
        title: "基本スキルの習得",
        deadline: "2025年12月",
        goals: [
          { goalText: "介護技術研修を3回以上受講する", isCompleted: true, displayOrder: 1 },
          { goalText: "利用者様からの感謝の言葉を月5件以上いただく", isCompleted: true, displayOrder: 2 },
          { goalText: "事故・ヒヤリハット報告を0件にする", isCompleted: false, displayOrder: 3 },
        ]
      },
      {
        stepNumber: 2,
        title: "チームワークの向上",
        deadline: "2026年12月",
        goals: [
          { goalText: "月1回以上、チームミーティングで改善提案を行う", isCompleted: false, displayOrder: 1 },
          { goalText: "新人スタッフのメンター役を担当する", isCompleted: false, displayOrder: 2 },
          { goalText: "他職種との連携事例を月2件以上作る", isCompleted: false, displayOrder: 3 },
        ]
      },
      {
        stepNumber: 3,
        title: "リーダーシップの発揮",
        deadline: "2028年12月",
        goals: [
          { goalText: "リーダーシップ研修を受講する", isCompleted: false, displayOrder: 1 },
          { goalText: "チームの業務改善プロジェクトをリードする", isCompleted: false, displayOrder: 2 },
          { goalText: "後輩育成計画を作成し、実行する", isCompleted: false, displayOrder: 3 },
        ]
      }
    ],
    [
      {
        stepNumber: 1,
        title: "利用者様との信頼関係構築",
        deadline: "2025年12月",
        goals: [
          { goalText: "利用者様の個別ニーズを理解し、記録する", isCompleted: true, displayOrder: 1 },
          { goalText: "ご家族との面談を月3回以上実施する", isCompleted: true, displayOrder: 2 },
          { goalText: "利用者様満足度調査で高評価を得る", isCompleted: false, displayOrder: 3 },
        ]
      },
      {
        stepNumber: 2,
        title: "コミュニケーション力の向上",
        deadline: "2026年12月",
        goals: [
          { goalText: "傾聴スキル研修を受講する", isCompleted: false, displayOrder: 1 },
          { goalText: "多職種カンファレンスで積極的に発言する", isCompleted: false, displayOrder: 2 },
          { goalText: "利用者様の声を活かした改善提案を行う", isCompleted: false, displayOrder: 3 },
        ]
      },
      {
        stepNumber: 3,
        title: "介護福祉士としての専門性確立",
        deadline: "2028年12月",
        goals: [
          { goalText: "認知症ケア専門士の資格を取得する", isCompleted: false, displayOrder: 1 },
          { goalText: "地域の介護セミナーで講師を務める", isCompleted: false, displayOrder: 2 },
          { goalText: "ケアプランの作成に携わる", isCompleted: false, displayOrder: 3 },
        ]
      }
    ],
    [
      {
        stepNumber: 1,
        title: "介護技術の基礎固め",
        deadline: "2025年12月",
        goals: [
          { goalText: "移乗・移動介助の技術を完璧にマスターする", isCompleted: true, displayOrder: 1 },
          { goalText: "福祉用具の使い方を習得する", isCompleted: true, displayOrder: 2 },
          { goalText: "緊急時対応マニュアルを理解し実践する", isCompleted: true, displayOrder: 3 },
        ]
      },
      {
        stepNumber: 2,
        title: "専門技術の習得",
        deadline: "2026年12月",
        goals: [
          { goalText: "認知症ケア技術研修を受講する", isCompleted: false, displayOrder: 1 },
          { goalText: "医療的ケアの基礎を学ぶ", isCompleted: false, displayOrder: 2 },
          { goalText: "リハビリテーション技術を習得する", isCompleted: false, displayOrder: 3 },
        ]
      },
      {
        stepNumber: 3,
        title: "技術指導者としての成長",
        deadline: "2028年12月",
        goals: [
          { goalText: "介護技術指導者研修を修了する", isCompleted: false, displayOrder: 1 },
          { goalText: "新人スタッフへの技術指導を担当する", isCompleted: false, displayOrder: 2 },
          { goalText: "施設内研修の講師を務める", isCompleted: false, displayOrder: 3 },
        ]
      }
    ]
  ];
  
  const steps = stepTemplates[userIndex];
  
  for (const step of steps) {
    const stepResult = await connection.execute(
      `INSERT INTO roadmapSteps (roadmapId, stepNumber, title, deadline, createdAt, updatedAt) 
       VALUES (?, ?, ?, ?, NOW(), NOW())`,
      [roadmapId, step.stepNumber, step.title, step.deadline]
    );
    
    const stepId = stepResult[0].insertId;
    
    for (const goal of step.goals) {
      await connection.execute(
        `INSERT INTO roadmapGoals (roadmapId, stepId, goalText, isCompleted, displayOrder, createdAt, updatedAt) 
         VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
        [roadmapId, stepId, goal.goalText, goal.isCompleted ? 1 : 0, goal.displayOrder]
      );
    }
  }
  
  console.log(`  ✅ マイキャリアマップを作成しました\n`);
}

console.log("\n🎉 デモユーザーとサンプルデータの作成が完了しました！\n");
console.log("=".repeat(60));
console.log("ログイン情報:");
console.log("=".repeat(60));
console.log("\n【デモユーザー】");
console.log("  ユーザー名: demo-user1 / パスワード: DemoUser2024!");
console.log("  ユーザー名: demo-user2 / パスワード: DemoUser2024!");
console.log("  ユーザー名: demo-user3 / パスワード: DemoUser2024!");
console.log("\n【デモ管理者】");
console.log("  ユーザー名: demo-admin / パスワード: DemoAdmin2024!");
console.log("\n" + "=".repeat(60));

await connection.end();
