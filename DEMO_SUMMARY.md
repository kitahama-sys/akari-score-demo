# 🎯 akari-score-demo システムサマリー

## 構築完了

バージョンID: 88f50af3をベースに、デモ専用システム「akari-score-demo」の構築が完了しました。

---

## 📊 構築結果

### ✅ 完了した作業

#### 1. MVVページのカスタマイズ
- [x] 企業名を「デモ介護サービス」に変更
- [x] VISION: 地域に根ざした、心温まる介護を
- [x] MISSION: 笑顔をつなぐ、未来をつくる。
- [x] VALUE: 思いやりの心（8つの行動指針）
- [x] 3つの柱（利用者様中心・チームワーク・地域貢献）

#### 2. 評価項目のマスキング
- [x] 合計40項目を登録
- [x] 4項目のみ公開（挨拶・身だしなみ、報告・連絡・相談、チームワーク、介護技術）
- [x] 36項目をマスキング処理（【非公開項目】として表示）

#### 3. デモユーザーとサンプルデータ
- [x] デモユーザー3名作成（demo-user1, demo-user2, demo-user3）
- [x] デモ管理者1名作成（demo-admin）
- [x] 各ユーザーに3期間分の評価データ作成
  - 2024年度下期 (2024-second)
  - 2025年度上期 (2025-first)
  - 2025年度下期 (2025-second)
- [x] 各ユーザーに個別のキャリアマップ作成

#### 4. ログイン画面のカスタマイズ
- [x] デモ環境バナーを追加
- [x] デモログイン情報ボックスを追加
- [x] わかりやすいUI設計

#### 5. データベースセットアップ
- [x] MySQL データベース作成（akari_score_demo）
- [x] 9つのテーブル作成
- [x] 評価項目データ投入
- [x] デモユーザーデータ投入

#### 6. ドキュメント作成
- [x] README_DEMO.md（概要）
- [x] QUICK_START.md（クイックスタート）
- [x] DEMO_SETUP_REPORT.md（詳細レポート）

---

## 📈 データ統計

| 項目 | 数量 |
|-----|------|
| ユーザー数 | 4名（一般3名 + 管理者1名） |
| 評価項目数 | 40項目 |
| 公開項目 | 4項目 |
| 非公開項目 | 36項目 |
| 評価期間 | 3期間 |
| 評価データ | 9セット（3ユーザー × 3期間） |
| キャリアマップ | 3個（各ユーザー1個） |

---

## 🔐 アクセス情報

### ログイン情報

**デモユーザー:**
- demo-user1 / DemoUser2024! (田中 太郎 - バランス型)
- demo-user2 / DemoUser2024! (佐藤 花子 - マインド重視型)
- demo-user3 / DemoUser2024! (鈴木 一郎 - テクニカル重視型)

**デモ管理者:**
- demo-admin / DemoAdmin2024! (管理者 太郎)

### データベース接続情報
- Database: akari_score_demo
- Host: localhost
- User: root
- Password: password
- Port: 3306

---

## 🚀 起動方法

```bash
# 1. MySQLを起動
sudo service mysql start

# 2. プロジェクトディレクトリに移動
cd /home/ubuntu/akari-score-demo

# 3. 開発サーバーを起動
pnpm dev

# 4. ブラウザでアクセス
# http://localhost:3000
```

---

## 📁 ファイル構成

```
/home/ubuntu/akari-score-demo/
├── README_DEMO.md                   # デモシステム概要
├── QUICK_START.md                   # クイックスタートガイド
├── DEMO_SETUP_REPORT.md             # 詳細セットアップレポート
├── DEMO_SUMMARY.md                  # このファイル
├── client/                          # フロントエンド
│   └── src/
│       └── pages/
│           ├── Login.tsx            # カスタマイズ済みログイン画面
│           └── MVV.tsx              # カスタマイズ済みMVVページ
├── server/                          # バックエンド
├── drizzle/                         # データベーススキーマ
├── mvv_content.md                   # デモ介護サービスMVVコンテンツ
├── evaluation_data_demo.json        # デモ用評価項目データ
├── seed-evaluation-data-demo.mjs    # 評価項目投入スクリプト
├── seed-demo-users.mjs              # デモユーザー作成スクリプト
├── create-demo-schema.sql           # データベーススキーマSQL
└── .env                             # 環境変数設定
```

---

## 🎨 カスタマイズポイント

### MVVページ（client/src/pages/MVV.tsx）
- Line 96: 企業名「デモ介護サービス」
- Line 122-131: VISION「地域に根ざした、心温まる介護を」
- Line 231-251: MISSION「笑顔をつなぐ、未来をつくる。」
- Line 272-276: VALUE「思いやりの心」
- Line 55-63: 8つの行動指針

### ログイン画面（client/src/pages/Login.tsx）
- Line 85-88: デモ環境バナー
- Line 184-191: デモログイン情報ボックス

### 評価項目データ（evaluation_data_demo.json）
- 公開項目: BS01, BS02, M16, T26
- 非公開項目: その他36項目

---

## 🔄 メンテナンス

### データの再投入

**評価項目のみ:**
```bash
node seed-evaluation-data-demo.mjs
```

**ユーザーとサンプルデータ:**
```bash
node seed-demo-users.mjs
```

**完全リセット:**
```bash
mysql -u root -ppassword akari_score_demo < create-demo-schema.sql
node seed-evaluation-data-demo.mjs
node seed-demo-users.mjs
```

---

## ⚠️ 注意事項

1. **デモ専用システム**
   - 本番環境での使用は想定していません
   - 機密情報を入力しないでください

2. **パスワード**
   - デモ用の簡易パスワードを使用
   - セキュリティレベルは本番環境より低く設定

3. **データ永続性**
   - サンドボックス環境では再起動時にデータが失われる可能性
   - 必要に応じて再セットアップしてください

4. **OAuth設定**
   - OAUTH_SERVER_URLが未設定
   - パスワード認証のみ使用可能

---

## 📞 次のステップ

1. **動作確認**
   - ログイン画面の表示確認
   - デモユーザーでログイン
   - 各機能の動作テスト

2. **デモシナリオの実行**
   - 一般ユーザー体験
   - 管理者体験
   - 成長の軌跡確認

3. **カスタマイズ**
   - 必要に応じてMVVコンテンツを調整
   - 評価項目の追加・変更
   - UIのさらなるカスタマイズ

---

## 🎉 構築完了

デモ専用システム「akari-score-demo」の構築が正常に完了しました。

**プロジェクトディレクトリ:** `/home/ubuntu/akari-score-demo`

**次のアクション:**
1. [QUICK_START.md](QUICK_START.md) を参照してサーバーを起動
2. ブラウザで http://localhost:3000 にアクセス
3. デモユーザーでログインして機能を確認

---

**作成日:** 2024年11月24日  
**バージョン:** 1.0.0 (デモ版)  
**ベースバージョン:** 88f50af3
