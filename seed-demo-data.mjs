import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

// データベース接続
const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection);

// デモユーザーのIDを取得
const [users] = await connection.execute("SELECT id FROM users WHERE username = 'demo-user'");
const demoUserId = users[0].id;

console.log(`デモユーザーID: ${demoUserId}`);

// 評価項目を取得
const [items] = await connection.execute("SELECT id, code FROM evaluationItems ORDER BY displayOrder");
console.log(`評価項目数: ${items.length}`);

// 1. 自己評価と上長評価データを作成（2024年度下期、2025年度上期、2025年度下期）
const periods = ["2024-second", "2025-first", "2025-second"];
const evaluationData = {
  "2024-second": { BS: 3.2, M: 3.5, T: 3.0 }, // 成長前
  "2025-first": { BS: 3.8, M: 4.0, T: 3.5 },  // 成長中
  "2025-second": { BS: 4.2, M: 4.3, T: 4.0 }, // 成長後
};

for (const period of periods) {
  const scores = evaluationData[period];
  
  // 自己評価を作成
  const selfEvalResult = await connection.execute(
    `INSERT INTO evaluations (userId, evaluationType, evaluationPeriod, status, submittedAt, createdAt, updatedAt) 
     VALUES (?, 'self', ?, 'submitted', NOW(), NOW(), NOW())`,
    [demoUserId, period]
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
    
    const variation = (Math.random() - 0.5) * 1.5; // ±0.75のバラつき
    const score = Math.max(1, Math.min(5, Math.round(baseScore + variation)));
    
    await connection.execute(
      `INSERT INTO evaluationScores (evaluationId, itemId, score, createdAt, updatedAt) 
       VALUES (?, ?, ?, NOW(), NOW())`,
      [selfEvalId, item.id, score]
    );
  }
  
  console.log(`✅ ${period}の自己評価データを作成しました`);
  
  // 上長評価を作成
  const managerEvalResult = await connection.execute(
    `INSERT INTO evaluations (userId, evaluatorId, evaluationType, evaluationPeriod, status, submittedAt, createdAt, updatedAt) 
     VALUES (?, 1, 'manager', ?, 'completed', NOW(), NOW(), NOW())`,
    [demoUserId, period]
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
  const managerComment = period === "2025-second" 
    ? "素晴らしい成長が見られます！特に基本スキルとマインドの向上が顕著です。この調子で頑張ってください。"
    : period === "2025-first"
    ? "着実に成長していますね。特にマインド面での向上が素晴らしいです。テクニカルスキルも引き続き磨いていきましょう。"
    : "基本的なスキルは身についています。今後はマインドとテクニカルスキルの向上に注力しましょう。";
  
  // 最初の評価項目にコメントを追加
  await connection.execute(
    `UPDATE evaluationScores SET comment = ? WHERE evaluationId = ? AND itemId = ? LIMIT 1`,
    [managerComment, managerEvalId, items[0].id]
  );
  
  console.log(`✅ ${period}の上長評価データを作成しました`);
}

// 2. マイキャリアマップを作成
const roadmapResult = await connection.execute(
  `INSERT INTO roadmaps (userId, evaluationPeriod, longTermVision, createdAt, updatedAt) 
   VALUES (?, '2025-second', ?, NOW(), NOW())`,
  [
    demoUserId,
    "5年後には、チームリーダーとして後輩の育成に携わり、利用者さんとご家族に寄り添える介護のプロフェッショナルになりたいです。温かい支援を通じて、一人ひとりの「灯」を増やせる存在でありたいと思います。"
  ]
);

const roadmapId = roadmapResult[0].insertId;

// STEP1-3を作成
const steps = [
  {
    stepNumber: 1,
    title: "基本スキルの習得",
    deadline: "2025年12月",
    goals: [
      { goalText: "介護技術研修を3回以上受講する", isCompleted: true, displayOrder: 1 },
      { goalText: "利用者さんからの感謝の言葉を月5件以上いただく", isCompleted: true, displayOrder: 2 },
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
      { goalText: "他職種（看護師・リハビリ）との連携事例を月2件以上作る", isCompleted: false, displayOrder: 3 },
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
];

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
  
  console.log(`✅ STEP${step.stepNumber}を作成しました`);
}

// 3. 活動ログを作成
const activityLogs = [
  {
    activityType: "self_evaluation_submitted",
    description: "2024年度下期の自己評価を提出しました",
    evaluationPeriod: "2024-second",
    createdAt: "2025-01-15 10:00:00"
  },
  {
    activityType: "manager_evaluation_completed",
    description: "2024年度下期の上長評価が完了しました",
    evaluationPeriod: "2024-second",
    targetUserId: demoUserId,
    createdAt: "2025-01-20 15:30:00"
  },
  {
    activityType: "self_evaluation_submitted",
    description: "2025年度上期の自己評価を提出しました",
    evaluationPeriod: "2025-first",
    createdAt: "2025-07-10 09:00:00"
  },
  {
    activityType: "manager_evaluation_completed",
    description: "2025年度上期の上長評価が完了しました",
    evaluationPeriod: "2025-first",
    targetUserId: demoUserId,
    createdAt: "2025-07-15 14:00:00"
  },
  {
    activityType: "roadmap_updated",
    description: "マイキャリアマップを更新しました",
    evaluationPeriod: "2025-second",
    createdAt: "2025-08-01 11:00:00"
  },
  {
    activityType: "self_evaluation_submitted",
    description: "2025年度下期の自己評価を提出しました",
    evaluationPeriod: "2025-second",
    createdAt: "2025-11-18 10:30:00"
  },
  {
    activityType: "manager_evaluation_completed",
    description: "2025年度下期の上長評価が完了しました",
    evaluationPeriod: "2025-second",
    targetUserId: demoUserId,
    createdAt: "2025-11-19 16:00:00"
  },
];

for (const log of activityLogs) {
  await connection.execute(
    `INSERT INTO activityLogs (userId, activityType, description, evaluationPeriod, targetUserId, createdAt) 
     VALUES (?, ?, ?, ?, ?, ?)`,
    [demoUserId, log.activityType, log.description, log.evaluationPeriod, log.targetUserId || null, log.createdAt]
  );
}

console.log(`✅ 活動ログを${activityLogs.length}件作成しました`);

console.log("\n🎉 デモユーザー用のサンプルデータ作成が完了しました！");
console.log("\nログイン情報:");
console.log("ユーザー名: demo-user");
console.log("パスワード: AkariDemo2024!");

await connection.end();
