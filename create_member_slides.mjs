import fs from 'fs';
import path from 'path';

const projectDir = '/home/ubuntu/akari-score/メンバー用マニュアルスライド';

const slides = {
  'title.html': `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>灯SCORE メンバー用マニュアル</title>
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&family=Poppins:wght@400;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Noto Sans JP', 'Poppins', sans-serif; margin: 0; padding: 0; }
    .slide-container { width: 1280px; min-height: 720px; background: linear-gradient(135deg, #FFB46E 0%, #FF9500 100%); display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 60px; box-sizing: border-box; }
    .title { font-size: 64px; font-weight: 700; color: #FFFFFF; text-align: center; margin-bottom: 20px; }
    .subtitle { font-size: 32px; font-weight: 400; color: #FFFFFF; text-align: center; margin-bottom: 40px; }
    .description { font-size: 20px; color: #FFFFFF; text-align: center; max-width: 800px; }
  </style>
</head>
<body>
  <div class="slide-container">
    <div class="title">灯SCORE メンバー用マニュアル</div>
    <div class="subtitle">成長を灯す、温かい評価システム</div>
    <div class="description">このマニュアルでは、灯SCOREの使い方を分かりやすく説明します</div>
    <div class="description" style="margin-top: 40px; font-size: 18px;">2025年11月</div>
  </div>
</body>
</html>`,

  'what_is_akari.html': `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>灯SCOREとは</title>
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Noto Sans JP', sans-serif; margin: 0; padding: 0; }
    .slide-container { width: 1280px; min-height: 720px; background: #FFFFFF; padding: 60px; box-sizing: border-box; }
    .title { font-size: 48px; font-weight: 700; color: #FF9500; margin-bottom: 40px; }
    .card { background: #F4F6F8; border-left: 4px solid #FFB46E; padding: 30px; margin-bottom: 30px; border-radius: 8px; }
    .card-title { font-size: 24px; font-weight: 700; color: #333333; margin-bottom: 15px; }
    .card-content { font-size: 18px; color: #666666; line-height: 1.8; }
  </style>
</head>
<body>
  <div class="slide-container">
    <div class="title">灯SCOREとは</div>
    <div class="card">
      <div class="card-title">📋 成長を可視化する評価システム</div>
      <div class="card-content">メンバーの成長を「灯」として可視化し、自己評価と上長評価を通じて、一人ひとりの強みと成長の機会を明確にします。</div>
    </div>
    <div class="card">
      <div class="card-title">💬 温かいフィードバックを届ける</div>
      <div class="card-content">評価だけでなく、上長からの温かいフィードバックメッセージを通じて、メンバーの成長を応援し、モチベーションを高めます。</div>
    </div>
    <div class="card">
      <div class="card-title">🗺 キャリアマップで未来を描く</div>
      <div class="card-content">半期ごとのロードマップ機能で、メンバーが自分のキャリアを計画し、長期的な成長目標を設定できるようサポートします。</div>
    </div>
  </div>
</body>
</html>`,

  'login.html': `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ログイン方法</title>
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Noto Sans JP', sans-serif; margin: 0; padding: 0; }
    .slide-container { width: 1280px; min-height: 720px; background: #FFFFFF; padding: 60px; box-sizing: border-box; }
    .title { font-size: 48px; font-weight: 700; color: #FF9500; margin-bottom: 40px; }
    .step { background: #F4F6F8; padding: 20px 30px; margin-bottom: 20px; border-radius: 8px; font-size: 20px; color: #333333; display: flex; align-items: center; }
    .step-number { background: #FFB46E; color: #FFFFFF; width: 40px; height: 40px; border-radius: 50%; display: flex; justify-content: center; align-items: center; margin-right: 20px; font-weight: 700; }
    .point { background: #FFF3E0; border-left: 4px solid #FF9500; padding: 20px; margin-top: 30px; border-radius: 8px; }
    .point-title { font-size: 20px; font-weight: 700; color: #FF9500; margin-bottom: 10px; }
    .point-content { font-size: 16px; color: #666666; line-height: 1.8; }
  </style>
</head>
<body>
  <div class="slide-container">
    <div class="title">ログイン方法</div>
    <div class="step"><div class="step-number">1</div>灯SCOREのウェブサイトにアクセス</div>
    <div class="step"><div class="step-number">2</div>ユーザー名を入力</div>
    <div class="step"><div class="step-number">3</div>パスワードを入力</div>
    <div class="step"><div class="step-number">4</div>「ログイン」ボタンをクリック</div>
    <div class="point">
      <div class="point-title">💡 ポイント</div>
      <div class="point-content">
        • ユーザー名とパスワードは、管理者または上長から発行されます<br>
        • パスワードを忘れた場合は、管理者または上長に連絡してください
      </div>
    </div>
  </div>
</body>
</html>`,

  'dashboard.html': `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ダッシュボードの見方</title>
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Noto Sans JP', sans-serif; margin: 0; padding: 0; }
    .slide-container { width: 1280px; min-height: 720px; background: #FFFFFF; padding: 60px; box-sizing: border-box; }
    .title { font-size: 48px; font-weight: 700; color: #FF9500; margin-bottom: 40px; }
    .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
    .card { background: #F4F6F8; padding: 25px; border-radius: 8px; border-left: 4px solid #5CA7FF; }
    .card-title { font-size: 20px; font-weight: 700; color: #333333; margin-bottom: 10px; }
    .card-content { font-size: 16px; color: #666666; line-height: 1.6; }
  </style>
</head>
<body>
  <div class="slide-container">
    <div class="title">ダッシュボードの見方</div>
    <div class="grid">
      <div class="card">
        <div class="card-title">📝 自己評価を入力</div>
        <div class="card-content">自己評価を入力する画面に移動</div>
      </div>
      <div class="card">
        <div class="card-title">📊 評価結果を見る</div>
        <div class="card-content">自己評価と上長評価の結果を確認</div>
      </div>
      <div class="card">
        <div class="card-title">📈 成長を振り返る</div>
        <div class="card-content">過去の評価履歴を時系列で確認</div>
      </div>
      <div class="card">
        <div class="card-title">🗺 マイキャリアマップ</div>
        <div class="card-content">半期分の目標とロードマップを作成・確認</div>
      </div>
      <div class="card">
        <div class="card-title">🔒 パスワード変更</div>
        <div class="card-content">パスワードを変更</div>
      </div>
      <div class="card">
        <div class="card-title">🏢 MVVを見る</div>
        <div class="card-content">会社の経営理念を確認</div>
      </div>
    </div>
  </div>
</body>
</html>`,

  'self_evaluation_step1.html': `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>自己評価の入力（1/3）</title>
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Noto Sans JP', sans-serif; margin: 0; padding: 0; }
    .slide-container { width: 1280px; min-height: 720px; background: #FFFFFF; padding: 60px; box-sizing: border-box; }
    .title { font-size: 48px; font-weight: 700; color: #FF9500; margin-bottom: 40px; }
    .section-title { font-size: 28px; font-weight: 700; color: #333333; margin-bottom: 20px; }
    .step { background: #F4F6F8; padding: 15px 25px; margin-bottom: 15px; border-radius: 8px; font-size: 18px; color: #333333; }
    .point { background: #FFF3E0; border-left: 4px solid #FF9500; padding: 20px; margin-top: 30px; border-radius: 8px; }
    .point-title { font-size: 20px; font-weight: 700; color: #FF9500; margin-bottom: 10px; }
    .point-content { font-size: 16px; color: #666666; line-height: 1.8; }
  </style>
</head>
<body>
  <div class="slide-container">
    <div class="title">自己評価の入力（1/3）</div>
    <div class="section-title">ステップ1：評価期間を選択</div>
    <div class="step">1. ダッシュボードから「自己評価を入力」をクリック</div>
    <div class="step">2. 画面上部の評価期間ドロップダウンから、評価したい期間を選択</div>
    <div class="step">3. 選択した期間の評価項目が表示されます</div>
    <div class="point">
      <div class="point-title">💡 ポイント</div>
      <div class="point-content">
        • 評価期間は半期ごと（上期：7月～12月、下期：1月～6月）に分かれています<br>
        • 過去の期間を選択すると、その期間の評価を確認・編集できます
      </div>
    </div>
  </div>
</body>
</html>`,

  'self_evaluation_step2.html': `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>自己評価の入力（2/3）</title>
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Noto Sans JP', sans-serif; margin: 0; padding: 0; }
    .slide-container { width: 1280px; min-height: 720px; background: #FFFFFF; padding: 60px; box-sizing: border-box; }
    .title { font-size: 48px; font-weight: 700; color: #FF9500; margin-bottom: 40px; }
    .section-title { font-size: 28px; font-weight: 700; color: #333333; margin-bottom: 20px; }
    .step { background: #F4F6F8; padding: 15px 25px; margin-bottom: 15px; border-radius: 8px; font-size: 18px; color: #333333; }
    .point { background: #FFF3E0; border-left: 4px solid #FF9500; padding: 20px; margin-top: 30px; border-radius: 8px; }
    .point-title { font-size: 20px; font-weight: 700; color: #FF9500; margin-bottom: 10px; }
    .point-content { font-size: 16px; color: #666666; line-height: 1.8; }
  </style>
</head>
<body>
  <div class="slide-container">
    <div class="title">自己評価の入力（2/3）</div>
    <div class="section-title">ステップ2：各項目を評価</div>
    <div class="step">1. 基本スキル（25項目）、マインド（10項目）、テクニカルスキル（10項目）の3つのカテゴリから評価</div>
    <div class="step">2. 各項目を1〜5点で評価</div>
    <div class="step">3. 「基準を見る」ボタンをクリックすると、評価基準の詳細が表示されます</div>
    <div class="point">
      <div class="point-title">💡 ポイント</div>
      <div class="point-content">
        • 評価基準（S〜D）を参考に、自分の成長を振り返りながら評価してください<br>
        • 正直に、自分の現在の状態を評価することが大切です
      </div>
    </div>
  </div>
</body>
</html>`,

  'self_evaluation_step3.html': `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>自己評価の入力（3/3）</title>
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Noto Sans JP', sans-serif; margin: 0; padding: 0; }
    .slide-container { width: 1280px; min-height: 720px; background: #FFFFFF; padding: 60px; box-sizing: border-box; }
    .title { font-size: 48px; font-weight: 700; color: #FF9500; margin-bottom: 40px; }
    .section-title { font-size: 28px; font-weight: 700; color: #333333; margin-bottom: 20px; }
    .step { background: #F4F6F8; padding: 15px 25px; margin-bottom: 15px; border-radius: 8px; font-size: 18px; color: #333333; }
    .point { background: #FFF3E0; border-left: 4px solid #FF9500; padding: 20px; margin-top: 30px; border-radius: 8px; }
    .point-title { font-size: 20px; font-weight: 700; color: #FF9500; margin-bottom: 10px; }
    .point-content { font-size: 16px; color: #666666; line-height: 1.8; }
  </style>
</head>
<body>
  <div class="slide-container">
    <div class="title">自己評価の入力（3/3）</div>
    <div class="section-title">ステップ3：保存</div>
    <div class="step">1. すべての項目を評価したら、画面下部の「保存」ボタンをクリック</div>
    <div class="step">2. 保存が完了すると、ダッシュボードに戻ります</div>
    <div class="point">
      <div class="point-title">💡 ポイント</div>
      <div class="point-content">
        • 保存後も、上長評価が完了するまでは何度でも編集できます<br>
        • 自己評価を提出すると、上長に通知が届きます
      </div>
    </div>
  </div>
</body>
</html>`,

  'evaluation_items.html': `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>評価項目</title>
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Noto Sans JP', sans-serif; margin: 0; padding: 0; }
    .slide-container { width: 1280px; min-height: 720px; background: #FFFFFF; padding: 60px; box-sizing: border-box; }
    .title { font-size: 48px; font-weight: 700; color: #FF9500; margin-bottom: 40px; }
    .subtitle { font-size: 24px; color: #666666; margin-bottom: 40px; }
    .item { background: #F4F6F8; padding: 20px 30px; margin-bottom: 15px; border-radius: 8px; border-left: 4px solid #5CA7FF; }
    .item-number { font-size: 20px; font-weight: 700; color: #5CA7FF; margin-right: 10px; }
    .item-title { font-size: 20px; font-weight: 700; color: #333333; display: inline; }
    .item-content { font-size: 16px; color: #666666; margin-top: 10px; line-height: 1.6; }
  </style>
</head>
<body>
  <div class="slide-container">
    <div class="title">評価項目</div>
    <div class="subtitle">6つの評価項目で成長を評価します</div>
    <div class="item">
      <span class="item-number">1.</span><span class="item-title">専門知識・技術</span>
      <div class="item-content">看護師としての専門的な知識や技術</div>
    </div>
    <div class="item">
      <span class="item-number">2.</span><span class="item-title">コミュニケーション</span>
      <div class="item-content">患者様やチームとの円滑なコミュニケーション</div>
    </div>
    <div class="item">
      <span class="item-number">3.</span><span class="item-title">チームワーク</span>
      <div class="item-content">チームの一員として協力し、助け合う姿勢</div>
    </div>
    <div class="item">
      <span class="item-number">4.</span><span class="item-title">問題解決力</span>
      <div class="item-content">困難な状況でも冷静に対処し、解決策を見つける力</div>
    </div>
    <div class="item">
      <span class="item-number">5.</span><span class="item-title">リーダーシップ</span>
      <div class="item-content">周囲を引っ張り、チームをまとめる力</div>
    </div>
    <div class="item">
      <span class="item-number">6.</span><span class="item-title">成長意欲</span>
      <div class="item-content">学び続ける姿勢と、自己成長への意欲</div>
    </div>
  </div>
</body>
</html>`,

  'manager_evaluation.html': `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>上長評価の確認</title>
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Noto Sans JP', sans-serif; margin: 0; padding: 0; }
    .slide-container { width: 1280px; min-height: 720px; background: #FFFFFF; padding: 60px; box-sizing: border-box; }
    .title { font-size: 48px; font-weight: 700; color: #FF9500; margin-bottom: 40px; }
    .content { font-size: 20px; color: #333333; line-height: 1.8; margin-bottom: 30px; }
    .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-top: 30px; }
    .card { background: #F4F6F8; padding: 20px; border-radius: 8px; border-left: 4px solid #FFB46E; }
    .card-title { font-size: 20px; font-weight: 700; color: #333333; margin-bottom: 10px; }
    .card-content { font-size: 16px; color: #666666; line-height: 1.6; }
  </style>
</head>
<body>
  <div class="slide-container">
    <div class="title">上長評価の確認</div>
    <div class="content">
      上長評価が完了すると、ダッシュボードに通知が表示されます。<br>
      「評価結果を見る」をクリックして、評価結果を確認しましょう。
    </div>
    <div class="grid">
      <div class="card">
        <div class="card-title">📊 レーダーチャート</div>
        <div class="card-content">自己評価と上長評価の比較</div>
      </div>
      <div class="card">
        <div class="card-title">💬 上長からのフィードバック</div>
        <div class="card-content">温かいメッセージ</div>
      </div>
      <div class="card">
        <div class="card-title">📈 差分ランキング</div>
        <div class="card-content">自己評価と上長評価の差が大きい項目TOP5</div>
      </div>
      <div class="card">
        <div class="card-title">🎯 認識一致度スコア</div>
        <div class="card-content">自己評価と上長評価の一致度</div>
      </div>
    </div>
  </div>
</body>
</html>`,

  'career_map_step1.html': `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>キャリアマップの作成（1/2）</title>
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Noto Sans JP', sans-serif; margin: 0; padding: 0; }
    .slide-container { width: 1280px; min-height: 720px; background: #FFFFFF; padding: 60px; box-sizing: border-box; }
    .title { font-size: 48px; font-weight: 700; color: #FF9500; margin-bottom: 40px; }
    .section-title { font-size: 28px; font-weight: 700; color: #333333; margin-bottom: 20px; }
    .step { background: #F4F6F8; padding: 15px 25px; margin-bottom: 15px; border-radius: 8px; font-size: 18px; color: #333333; }
    .point { background: #FFF3E0; border-left: 4px solid #FF9500; padding: 20px; margin-top: 30px; border-radius: 8px; }
    .point-title { font-size: 20px; font-weight: 700; color: #FF9500; margin-bottom: 10px; }
    .point-content { font-size: 16px; color: #666666; line-height: 1.8; }
  </style>
</head>
<body>
  <div class="slide-container">
    <div class="title">キャリアマップの作成（1/2）</div>
    <div class="section-title">ステップ1：長期ビジョンを入力</div>
    <div class="step">1. ダッシュボードから「マイキャリアマップ」をクリック</div>
    <div class="step">2. 「編集」ボタンをクリック</div>
    <div class="step">3. 長期ビジョン（3年後、5年後の目標）を入力</div>
    <div class="point">
      <div class="point-title">💡 ポイント</div>
      <div class="point-content">
        • 長期ビジョンは、あなたが将来なりたい姿や達成したい目標です<br>
        • 具体的に、自分の言葉で書いてみましょう
      </div>
    </div>
  </div>
</body>
</html>`,

  'career_map_step2.html': `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>キャリアマップの作成（2/2）</title>
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Noto Sans JP', sans-serif; margin: 0; padding: 0; }
    .slide-container { width: 1280px; min-height: 720px; background: #FFFFFF; padding: 60px; box-sizing: border-box; }
    .title { font-size: 48px; font-weight: 700; color: #FF9500; margin-bottom: 40px; }
    .section-title { font-size: 28px; font-weight: 700; color: #333333; margin-bottom: 20px; }
    .step { background: #F4F6F8; padding: 15px 25px; margin-bottom: 15px; border-radius: 8px; font-size: 18px; color: #333333; }
    .point { background: #FFF3E0; border-left: 4px solid #FF9500; padding: 20px; margin-top: 30px; border-radius: 8px; }
    .point-title { font-size: 20px; font-weight: 700; color: #FF9500; margin-bottom: 10px; }
    .point-content { font-size: 16px; color: #666666; line-height: 1.8; }
  </style>
</head>
<body>
  <div class="slide-container">
    <div class="title">キャリアマップの作成（2/2）</div>
    <div class="section-title">ステップ2：STEPを追加</div>
    <div class="step">1. STEP1〜3に、半期ごとの目標を入力</div>
    <div class="step">2. 各STEPに定量目標（具体的な数値目標）を追加</div>
    <div class="step">3. 「保存」ボタンをクリック</div>
    <div class="point">
      <div class="point-title">💡 ポイント</div>
      <div class="point-content">
        • STEPは、長期ビジョンに向かうための階段です<br>
        • 定量目標は、達成したらチェックマークをつけましょう
      </div>
    </div>
  </div>
</body>
</html>`,

  'growth_graph.html': `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>成長グラフの確認</title>
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Noto Sans JP', sans-serif; margin: 0; padding: 0; }
    .slide-container { width: 1280px; min-height: 720px; background: #FFFFFF; padding: 60px; box-sizing: border-box; }
    .title { font-size: 48px; font-weight: 700; color: #FF9500; margin-bottom: 40px; }
    .content { font-size: 20px; color: #333333; line-height: 1.8; margin-bottom: 30px; }
    .card { background: #F4F6F8; padding: 25px; margin-bottom: 20px; border-radius: 8px; border-left: 4px solid #5CA7FF; }
    .card-title { font-size: 22px; font-weight: 700; color: #333333; margin-bottom: 10px; }
    .card-content { font-size: 18px; color: #666666; line-height: 1.6; }
    .point { background: #FFF3E0; border-left: 4px solid #FF9500; padding: 20px; margin-top: 30px; border-radius: 8px; }
    .point-title { font-size: 20px; font-weight: 700; color: #FF9500; margin-bottom: 10px; }
    .point-content { font-size: 16px; color: #666666; line-height: 1.8; }
  </style>
</head>
<body>
  <div class="slide-container">
    <div class="title">成長グラフの確認</div>
    <div class="content">「成長を振り返る」画面では、過去の評価履歴を時系列で確認できます</div>
    <div class="card">
      <div class="card-title">📈 成長推移グラフ</div>
      <div class="card-content">カテゴリ別のスコア推移を折れ線グラフで表示</div>
    </div>
    <div class="card">
      <div class="card-title">📊 評価履歴一覧</div>
      <div class="card-content">各評価期間の詳細を確認</div>
    </div>
    <div class="point">
      <div class="point-title">💡 ポイント</div>
      <div class="point-content">
        • グラフを見て、自分の成長を実感しましょう<br>
        • 上長からのフィードバックも確認できます
      </div>
    </div>
  </div>
</body>
</html>`,

  'faq.html': `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>よくある質問</title>
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Noto Sans JP', sans-serif; margin: 0; padding: 0; }
    .slide-container { width: 1280px; min-height: 720px; background: #FFFFFF; padding: 60px; box-sizing: border-box; }
    .title { font-size: 48px; font-weight: 700; color: #FF9500; margin-bottom: 40px; }
    .faq { background: #F4F6F8; padding: 25px; margin-bottom: 20px; border-radius: 8px; }
    .question { font-size: 20px; font-weight: 700; color: #5CA7FF; margin-bottom: 10px; }
    .answer { font-size: 18px; color: #333333; line-height: 1.8; }
  </style>
</head>
<body>
  <div class="slide-container">
    <div class="title">よくある質問</div>
    <div class="faq">
      <div class="question">Q1: 自己評価を間違えて保存してしまいました。修正できますか？</div>
      <div class="answer">A: 上長評価が完了するまでは、何度でも編集できます。ダッシュボードから「自己評価を入力」をクリックして、再度編集してください。</div>
    </div>
    <div class="faq">
      <div class="question">Q2: パスワードを忘れてしまいました。</div>
      <div class="answer">A: 管理者または上長に連絡して、パスワードをリセットしてもらってください。</div>
    </div>
    <div class="faq">
      <div class="question">Q3: 評価結果がまだ表示されません。</div>
      <div class="answer">A: 上長評価が完了するまで、評価結果は表示されません。上長に確認してみましょう。</div>
    </div>
  </div>
</body>
</html>`,

  'summary.html': `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>まとめ</title>
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Noto Sans JP', sans-serif; margin: 0; padding: 0; }
    .slide-container { width: 1280px; min-height: 720px; background: linear-gradient(135deg, #5CA7FF 0%, #4A90E2 100%); display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 60px; box-sizing: border-box; }
    .title { font-size: 56px; font-weight: 700; color: #FFFFFF; text-align: center; margin-bottom: 30px; }
    .content { font-size: 22px; color: #FFFFFF; text-align: center; line-height: 2.0; max-width: 900px; margin-bottom: 40px; }
    .closing { font-size: 32px; font-weight: 700; color: #FFFFFF; text-align: center; margin-top: 40px; }
  </style>
</head>
<body>
  <div class="slide-container">
    <div class="title">灯SCOREで自分の成長を確認しよう</div>
    <div class="content">
      灯SCOREは、あなたの成長を「灯」として可視化し、温かいフィードバックを通じて成長をサポートするシステムです。<br><br>
      自己評価を通じて自分を振り返り、上長からのフィードバックを受け取り、キャリアマップで未来を描きながら、一歩ずつ成長していきましょう。
    </div>
    <div class="closing">ありがとうございました</div>
  </div>
</body>
</html>`
};

// 全スライドを作成
for (const [filename, content] of Object.entries(slides)) {
  const filePath = path.join(projectDir, filename);
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`Created: ${filename}`);
}

// slide_state.jsonを更新
const slideStateFile = path.join(projectDir, 'slide_state.json');
const slideState = JSON.parse(fs.readFileSync(slideStateFile, 'utf-8'));

// すべてのスライドをeditedにマーク
slideState.slides.forEach(slide => {
  slide.status = 'edited';
});

fs.writeFileSync(slideStateFile, JSON.stringify(slideState, null, 2), 'utf-8');
console.log('Updated slide_state.json');
console.log('All slides created successfully!');
