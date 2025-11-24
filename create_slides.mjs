import fs from 'fs';
import path from 'path';

const slidesDir = '/home/ubuntu/akari-score/管理者用マニュアルスライド';

const baseStyle = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  body {
    font-family: 'Noto Sans JP', sans-serif;
    background: linear-gradient(135deg, #FFF5F7 0%, #FFE8EE 100%);
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .slide-container {
    width: 1280px;
    min-height: 720px;
    background: linear-gradient(135deg, #FFF5F7 0%, #FFE8EE 100%);
    padding: 60px 100px;
    display: flex;
    flex-direction: column;
    gap: 30px;
  }
  .page-title {
    font-size: 42px;
    font-weight: 700;
    color: #D64B6A;
    text-align: center;
    letter-spacing: 0.02em;
    margin-bottom: 20px;
  }
  .content-box {
    background: white;
    border-radius: 16px;
    padding: 32px 40px;
    box-shadow: 0 4px 12px rgba(214, 75, 106, 0.1);
  }
  .section-title {
    font-size: 24px;
    font-weight: 700;
    color: #D64B6A;
    margin-bottom: 16px;
  }
  .text {
    font-size: 18px;
    font-weight: 400;
    color: #4A4A4A;
    line-height: 1.8;
    margin-bottom: 16px;
  }
  .step-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .step-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
  }
  .step-number {
    width: 32px;
    height: 32px;
    background: linear-gradient(135deg, #FFB4C8 0%, #D64B6A 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 16px;
    font-weight: 700;
    flex-shrink: 0;
  }
  .step-text {
    font-size: 18px;
    font-weight: 400;
    color: #4A4A4A;
    line-height: 1.8;
    padding-top: 4px;
  }
`;

const slides = [
  {
    id: 'admin_role',
    title: '管理者の役割',
    content: `
      <div class="content-box">
        <div class="section-title">管理者として大切にしたいこと</div>
        <div class="text">
          灯SCOREの管理者は、メンバーの成長を温かく見守り、サポートする役割を担っています。
        </div>
        <div class="step-list">
          <div class="step-item">
            <div class="step-number">1</div>
            <div class="step-text">
              <strong>評価期間の管理：</strong>半期ごとの評価期間を設定し、メンバーが自己評価を入力できる環境を整えます
            </div>
          </div>
          <div class="step-item">
            <div class="step-number">2</div>
            <div class="step-text">
              <strong>上長評価の入力：</strong>メンバーの自己評価を確認し、温かいフィードバックとともに評価を入力します
            </div>
          </div>
          <div class="step-item">
            <div class="step-number">3</div>
            <div class="step-text">
              <strong>キャリアマップの確認：</strong>メンバーのキャリアマップを確認し、成長をサポートします
            </div>
          </div>
          <div class="step-item">
            <div class="step-number">4</div>
            <div class="step-text">
              <strong>メンバー管理：</strong>新しいメンバーの追加や、アカウント情報の管理を行います
            </div>
          </div>
        </div>
      </div>
    `
  },
  {
    id: 'login',
    title: 'ログイン方法',
    content: `
      <div class="content-box">
        <div class="section-title">灯SCOREにログインする</div>
        <div class="step-list">
          <div class="step-item">
            <div class="step-number">1</div>
            <div class="step-text">
              ブラウザで灯SCOREのURLにアクセス<br>
              <span style="font-size: 16px; color: #8BC4E8;">https://akariscor-8ngfxyzb.manus.space</span>
            </div>
          </div>
          <div class="step-item">
            <div class="step-number">2</div>
            <div class="step-text">
              管理者用のIDとパスワードを入力
            </div>
          </div>
          <div class="step-item">
            <div class="step-number">3</div>
            <div class="step-text">
              「ログイン」ボタンをクリック
            </div>
          </div>
        </div>
        <div class="text" style="margin-top: 24px; padding: 16px; background: rgba(139, 196, 232, 0.1); border-radius: 8px;">
          💡 <strong>ポイント：</strong>IDとパスワードは、システム管理者から受け取ったものを使用してください。パスワードは定期的に変更することをおすすめします。
        </div>
      </div>
    `
  },
  {
    id: 'dashboard',
    title: 'ダッシュボードの見方',
    content: `
      <div class="content-box">
        <div class="section-title">ダッシュボードの主な機能</div>
        <div class="step-list">
          <div class="step-item">
            <div class="step-number">1</div>
            <div class="step-text">
              <strong>評価期間カード：</strong>現在の評価期間と、自己評価・上長評価の入力状況が表示されます
            </div>
          </div>
          <div class="step-item">
            <div class="step-number">2</div>
            <div class="step-text">
              <strong>メンバー管理カード：</strong>メンバーの追加や編集、パスワード変更ができます
            </div>
          </div>
          <div class="step-item">
            <div class="step-number">3</div>
            <div class="step-text">
              <strong>メンバーロードマップカード：</strong>メンバーのキャリアマップを確認できます
            </div>
          </div>
          <div class="step-item">
            <div class="step-number">4</div>
            <div class="step-text">
              <strong>最近の活動：</strong>メンバーの評価やロードマップ更新の履歴が表示されます
            </div>
          </div>
        </div>
        <div class="text" style="margin-top: 24px; padding: 16px; background: rgba(139, 196, 232, 0.1); border-radius: 8px;">
          💡 <strong>ポイント：</strong>ダッシュボードは、管理者の「ホーム画面」です。ここから全ての機能にアクセスできます。
        </div>
      </div>
    `
  },
  {
    id: 'evaluation_period',
    title: '評価期間の管理',
    content: `
      <div class="content-box">
        <div class="section-title">評価期間の3つの状態</div>
        <div class="step-list">
          <div class="step-item">
            <div class="step-number" style="background: linear-gradient(135deg, #FF6B6B 0%, #EE5A6F 100%);">●</div>
            <div class="step-text">
              <strong>予定（赤）：</strong>評価期間がまだ始まっていない状態。メンバーは自己評価を入力できません。
            </div>
          </div>
          <div class="step-item">
            <div class="step-number" style="background: linear-gradient(135deg, #FFD93D 0%, #FFC107 100%);">●</div>
            <div class="step-text">
              <strong>進行中（黄）：</strong>評価期間が進行中の状態。メンバーは自己評価を入力でき、管理者は上長評価を入力できます。
            </div>
          </div>
          <div class="step-item">
            <div class="step-number" style="background: linear-gradient(135deg, #6BCF7F 0%, #51B960 100%);">●</div>
            <div class="step-text">
              <strong>完了（緑）：</strong>評価期間が終了した状態。自己評価と上長評価の両方が完了しています。
            </div>
          </div>
        </div>
      </div>
    `
  },
  {
    id: 'evaluation_step1',
    title: '上長評価の入力（1/3）',
    content: `
      <div class="content-box">
        <div class="section-title">STEP 1: メンバーを選択</div>
        <div class="text">
          ダッシュボードから「上長評価」カードをクリックし、評価するメンバーを選択します。
        </div>
        <div class="step-list">
          <div class="step-item">
            <div class="step-number">1</div>
            <div class="step-text">
              ダッシュボードの「上長評価」カードをクリック
            </div>
          </div>
          <div class="step-item">
            <div class="step-number">2</div>
            <div class="step-text">
              評価するメンバーを一覧から選択
            </div>
          </div>
          <div class="step-item">
            <div class="step-number">3</div>
            <div class="step-text">
              評価期間を確認（上期または下期）
            </div>
          </div>
        </div>
      </div>
    `
  },
  {
    id: 'evaluation_step2',
    title: '上長評価の入力（2/3）',
    content: `
      <div class="content-box">
        <div class="section-title">STEP 2: 自己評価を確認</div>
        <div class="text">
          メンバーが入力した自己評価を確認します。各項目の点数とコメントを読み、メンバーの振り返りを理解しましょう。
        </div>
        <div class="step-list">
          <div class="step-item">
            <div class="step-number">1</div>
            <div class="step-text">
              基本スキル（25項目）の自己評価を確認
            </div>
          </div>
          <div class="step-item">
            <div class="step-number">2</div>
            <div class="step-text">
              マインド（10項目）の自己評価を確認
            </div>
          </div>
          <div class="step-item">
            <div class="step-number">3</div>
            <div class="step-text">
              テクニカルスキル（10項目）の自己評価を確認
            </div>
          </div>
        </div>
      </div>
    `
  },
  {
    id: 'evaluation_step3',
    title: '上長評価の入力（3/3）',
    content: `
      <div class="content-box">
        <div class="section-title">STEP 3: 上長評価を入力</div>
        <div class="text">
          メンバーの自己評価を確認しながら、上長評価を入力します。
        </div>
        <div class="step-list">
          <div class="step-item">
            <div class="step-number">1</div>
            <div class="step-text">
              各評価項目（45項目）に対して、S～D（5～1）で評価
            </div>
          </div>
          <div class="step-item">
            <div class="step-number">2</div>
            <div class="step-text">
              「基準を見る」ボタンで評価基準を確認
            </div>
          </div>
          <div class="step-item">
            <div class="step-number">3</div>
            <div class="step-text">
              温かいフィードバックメッセージを入力
            </div>
          </div>
          <div class="step-item">
            <div class="step-number">4</div>
            <div class="step-text">
              「評価を保存」ボタンをクリック
            </div>
          </div>
        </div>
      </div>
    `
  },
  {
    id: 'evaluation_items',
    title: '評価項目',
    content: `
      <div class="content-box">
        <div class="section-title">3つのカテゴリ、45項目で評価</div>
        <div class="text">
          灯SCOREでは、メンバーの成長を3つのカテゴリ、45項目で評価します。
        </div>
        <div class="step-list">
          <div class="step-item">
            <div class="step-number">1</div>
            <div class="step-text">
              <strong>基本スキル（25項目）：</strong>看護師として必要な基本的なスキルを評価
            </div>
          </div>
          <div class="step-item">
            <div class="step-number">2</div>
            <div class="step-text">
              <strong>マインド（10項目）：</strong>チームワークやコミュニケーション、成長意欲などを評価
            </div>
          </div>
          <div class="step-item">
            <div class="step-number">3</div>
            <div class="step-text">
              <strong>テクニカルスキル（10項目）：</strong>専門的な技術や知識を評価
            </div>
          </div>
        </div>
        <div class="text" style="margin-top: 24px; padding: 16px; background: rgba(139, 196, 232, 0.1); border-radius: 8px;">
          💡 <strong>ポイント：</strong>評価は、S（期待を120%超える）からD（指導中）の5段階で行います。
        </div>
      </div>
    `
  },
  {
    id: 'career_map',
    title: 'キャリアマップの確認',
    content: `
      <div class="content-box">
        <div class="section-title">メンバーのキャリアマップを確認する</div>
        <div class="text">
          メンバーが作成したキャリアマップを確認し、成長をサポートします。
        </div>
        <div class="step-list">
          <div class="step-item">
            <div class="step-number">1</div>
            <div class="step-text">
              ダッシュボードの「メンバーロードマップ」カードをクリック
            </div>
          </div>
          <div class="step-item">
            <div class="step-number">2</div>
            <div class="step-text">
              確認したいメンバーを選択
            </div>
          </div>
          <div class="step-item">
            <div class="step-number">3</div>
            <div class="step-text">
              長期ビジョンと3つのSTEPを確認
            </div>
          </div>
          <div class="step-item">
            <div class="step-number">4</div>
            <div class="step-text">
              定量目標の達成状況を確認
            </div>
          </div>
        </div>
      </div>
    `
  },
  {
    id: 'add_member',
    title: '新しいメンバーを追加',
    content: `
      <div class="content-box">
        <div class="section-title">メンバーを追加する手順</div>
        <div class="step-list">
          <div class="step-item">
            <div class="step-number">1</div>
            <div class="step-text">
              ダッシュボードの「メンバー管理」カードをクリック
            </div>
          </div>
          <div class="step-item">
            <div class="step-number">2</div>
            <div class="step-text">
              「新しいメンバーを追加」ボタンをクリック
            </div>
          </div>
          <div class="step-item">
            <div class="step-number">3</div>
            <div class="step-text">
              名前、ユーザー名、初期パスワード、権限を入力
            </div>
          </div>
          <div class="step-item">
            <div class="step-number">4</div>
            <div class="step-text">
              「保存」ボタンをクリック
            </div>
          </div>
        </div>
        <div class="text" style="margin-top: 24px; padding: 16px; background: rgba(139, 196, 232, 0.1); border-radius: 8px;">
          💡 <strong>ポイント：</strong>初期パスワードは、メンバーに伝えてください。メンバーは初回ログイン後、パスワードを変更できます。
        </div>
      </div>
    `
  },
  {
    id: 'add_period',
    title: '評価期間を追加',
    content: `
      <div class="content-box">
        <div class="section-title">新しい評価期間を作成する</div>
        <div class="text">
          半期ごとに新しい評価期間を作成します。
        </div>
        <div class="step-list">
          <div class="step-item">
            <div class="step-number">1</div>
            <div class="step-text">
              ダッシュボードの「評価期間」カードをクリック
            </div>
          </div>
          <div class="step-item">
            <div class="step-number">2</div>
            <div class="step-text">
              「新しい評価期間を追加」ボタンをクリック
            </div>
          </div>
          <div class="step-item">
            <div class="step-number">3</div>
            <div class="step-text">
              期間名（例：2025年度上期）、開始日、終了日を入力
            </div>
          </div>
          <div class="step-item">
            <div class="step-number">4</div>
            <div class="step-text">
              「保存」ボタンをクリック
            </div>
          </div>
        </div>
      </div>
    `
  },
  {
    id: 'faq1',
    title: 'よくある質問（1/2）',
    content: `
      <div class="content-box" style="margin-bottom: 20px;">
        <div class="section-title">Q1: メンバーが自己評価を提出したか確認する方法は？</div>
        <div class="text">
          ダッシュボードの「評価期間」カードに、各メンバーの自己評価の提出状況が表示されます。「未提出」「提出済み」のステータスで確認できます。
        </div>
      </div>
      <div class="content-box">
        <div class="section-title">Q2: 評価期間を途中で変更できますか？</div>
        <div class="text">
          はい、評価期間管理画面から、期間名や開始・終了日を変更できます。ただし、すでにメンバーが自己評価を入力している場合は、慎重に変更してください。
        </div>
      </div>
    `
  },
  {
    id: 'faq2',
    title: 'よくある質問（2/2）',
    content: `
      <div class="content-box" style="margin-bottom: 20px;">
        <div class="section-title">Q3: メンバーがパスワードを忘れた場合は？</div>
        <div class="text">
          メンバー管理画面から、該当するメンバーを選択し、「パスワードをリセット」ボタンをクリックしてください。新しいパスワードを設定し、メンバーに伝えてください。
        </div>
      </div>
      <div class="content-box">
        <div class="section-title">Q4: 評価項目を追加できますか？</div>
        <div class="text">
          現在のバージョンでは、評価項目の追加はできません。評価項目の変更が必要な場合は、システム管理者にご相談ください。
        </div>
      </div>
    `
  },
  {
    id: 'summary',
    title: 'まとめ',
    content: `
      <div class="content-box">
        <div class="section-title">灯SCOREでメンバーの成長を温かく見守る</div>
        <div class="text">
          灯SCOREは、メンバーの成長を「灯」として可視化し、温かいフィードバックを通じて成長をサポートするシステムです。
        </div>
        <div class="text">
          評価は数字だけでなく、温かい言葉で成長を支援することが大切です。メンバー一人ひとりの「灯」を大切に、成長を見守っていきましょう。
        </div>
        <div class="text" style="margin-top: 32px; text-align: center; font-size: 24px; font-weight: 700; color: #D64B6A;">
          ありがとうございました
        </div>
      </div>
    `
  }
];

slides.forEach(slide => {
  const html = `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${slide.title}</title>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&display=swap" rel="stylesheet">
  <style>${baseStyle}</style>
</head>
<body>
  <div class="slide-container">
    <div class="page-title">${slide.title}</div>
    ${slide.content}
  </div>
</body>
</html>`;

  fs.writeFileSync(path.join(slidesDir, `${slide.id}.html`), html);
  console.log(`Created ${slide.id}.html`);
});

console.log('All slides created successfully!');
