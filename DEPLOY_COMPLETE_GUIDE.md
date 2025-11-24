# 🚀 akari-score-demo 完全デプロイガイド

## 永久デプロイを自分で完了する手順

このガイドに従って、デモシステムを永久的にインターネット上に公開します。

**所要時間:** 約30分

---

## 📋 必要なもの

- ✅ GitHubアカウント（既に作成済み: kitahama-sys）
- ✅ GitHubリポジトリ（既に作成済み: akari-score-demo）
- ⚠️ ソースコードファイル（このガイドでダウンロード）

---

## ステップ1: ソースコードをダウンロード

### 1-1. アーカイブファイルをダウンロード

サンドボックス環境から以下のファイルをダウンロードしてください:

```
/home/ubuntu/akari-score-demo.tar.gz (5.1MB)
```

### 1-2. ファイルを解凍

**Windows:**
1. ダウンロードした`akari-score-demo.tar.gz`を右クリック
2. 「すべて展開」を選択
3. 解凍先を選択して「展開」

**Mac:**
1. ダウンロードした`akari-score-demo.tar.gz`をダブルクリック
2. 自動的に解凍されます

---

## ステップ2: GitHubにコードをアップロード

### 2-1. Personal Access Token（PAT）を作成

1. https://github.com/settings/tokens/new にアクセス
2. メール認証を完了（「Verify via email」をクリック）
3. Token設定:
   - **Note:** `akari-score-demo-deploy`
   - **Expiration:** `No expiration`（または`90 days`）
   - **Select scopes:** `repo`（すべてにチェック）
4. 「Generate token」をクリック
5. **重要:** 表示されたトークンをコピーして保存（二度と表示されません）

### 2-2. Gitコマンドでプッシュ

**Windows（Git Bash）/ Mac（ターミナル）:**

```bash
# 解凍したフォルダに移動
cd /path/to/akari-score-demo

# Gitリポジトリを初期化（既に初期化済みの場合はスキップ）
git init
git branch -M main

# ユーザー情報を設定
git config user.email "your-email@example.com"
git config user.name "Your Name"

# すべてのファイルをステージング
git add .

# コミット
git commit -m "Initial commit: Akari Score Demo System"

# リモートリポジトリを追加
git remote add origin https://github.com/kitahama-sys/akari-score-demo.git

# プッシュ（YOUR_TOKENを先ほど作成したトークンに置き換え）
git push https://YOUR_TOKEN@github.com/kitahama-sys/akari-score-demo.git main
```

**例:**
```bash
git push https://ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx@github.com/kitahama-sys/akari-score-demo.git main
```

### 2-3. プッシュ成功を確認

1. https://github.com/kitahama-sys/akari-score-demo にアクセス
2. ファイル一覧が表示されていることを確認

---

## ステップ3: Vercelにデプロイ

### 3-1. Vercelアカウント作成

1. https://vercel.com にアクセス
2. 「Sign Up」をクリック
3. 「Continue with GitHub」を選択
4. GitHubアカウントでログイン
5. Vercelの権限リクエストを承認

### 3-2. プロジェクトをインポート

1. Vercelダッシュボードで「Add New...」→「Project」をクリック
2. 「Import Git Repository」セクションで `akari-score-demo` を検索
3. 「Import」ボタンをクリック

### 3-3. プロジェクト設定

#### Configure Project画面で以下を設定:

**Framework Preset:**
- `Vite` を選択

**Root Directory:**
- `./`（デフォルトのまま）

**Build and Output Settings:**
- **Build Command:** `pnpm vercel-build`
- **Output Directory:** `dist/public`
- **Install Command:** `pnpm install`

**Environment Variables:**

「Add」ボタンをクリックして以下を追加:

| Name | Value |
|------|-------|
| NODE_ENV | production |

### 3-4. デプロイ実行

1. 「Deploy」ボタンをクリック
2. ビルドプロセスが開始されます（2〜3分）
3. デプロイ完了後、URLが表示されます

**例:** `https://akari-score-demo.vercel.app`

---

## ⚠️ 重要: データベース設定

Vercelはサーバーレス環境のため、現在のMySQLデータベースは動作しません。

### 解決策: PlanetScale（無料・推奨）

#### 4-1. PlanetScaleアカウント作成

1. https://planetscale.com にアクセス
2. 「Sign up」をクリック
3. GitHubアカウントでサインアップ

#### 4-2. データベース作成

1. 「Create a database」をクリック
2. Database name: `akari-score-demo`
3. Region: `Tokyo, Japan`（または最寄りのリージョン）
4. 「Create database」をクリック

#### 4-3. 接続文字列を取得

1. 作成したデータベースをクリック
2. 「Connect」タブを選択
3. 「Create password」をクリック
4. **Connection string**をコピー

**例:**
```
mysql://xxxxxxxxxx:************@xxxxxx.ap-northeast-1.psdb.cloud/akari-score-demo?sslaccept=strict
```

#### 4-4. Vercelに環境変数を追加

1. Vercelダッシュボードでプロジェクトを選択
2. 「Settings」→「Environment Variables」
3. `DATABASE_URL`を編集して、PlanetScaleの接続文字列に変更
4. 「Save」をクリック
5. 「Redeploy」をクリックして再デプロイ

#### 4-5. データベースマイグレーション

**ローカル環境で実行:**

```bash
cd /path/to/akari-score-demo

# 環境変数を設定
export DATABASE_URL="mysql://xxxxxxxxxx:************@xxxxxx.ap-northeast-1.psdb.cloud/akari-score-demo?sslaccept=strict"

# スキーマを作成
mysql -h xxxxxx.ap-northeast-1.psdb.cloud -u xxxxxxxxxx -p akari-score-demo < create-demo-schema.sql

# デモデータを投入
node seed-evaluation-data-demo.mjs
node seed-demo-users.mjs
```

---

## ✅ デプロイ完了確認

### 動作確認チェックリスト

1. Vercelの公開URLにアクセス
2. ログイン画面が表示されることを確認
3. デモ環境バナーが表示されることを確認
4. demo-user1 / DemoUser2024! でログイン
5. ダッシュボードが表示されることを確認
6. MVVページで「デモ介護サービス」が表示されることを確認
7. 評価項目が4項目のみ表示されることを確認

---

## 🎯 簡易版デプロイ（データベースなし）

データベース設定が複雑な場合、フロントエンドのみデプロイできます。

### 手順

1. `server/_core/index.ts`をコメントアウト
2. Vercelで「Static Site」として設定
3. デプロイ

**制限事項:**
- ログイン機能は動作しません
- 静的なページのみ表示されます

---

## 🔧 トラブルシューティング

### エラー: "pnpm not found"

**解決策:**
1. Vercelプロジェクト設定→「General」
2. 「Build & Development Settings」
3. 「Package Manager」を`pnpm`に変更

### エラー: "vercel-build script not found"

**解決策:**
`package.json`を確認:
```json
{
  "scripts": {
    "vercel-build": "vite build"
  }
}
```

### エラー: "Database connection failed"

**解決策:**
1. PlanetScaleの接続文字列が正しいか確認
2. Vercelの環境変数`DATABASE_URL`を確認
3. PlanetScaleのデータベースが起動しているか確認

### デプロイ後にログインできない

**原因:** データベースが初期化されていない

**解決策:**
1. PlanetScaleでデータベースマイグレーションを実行
2. デモユーザーを再作成

---

## 📊 デプロイ後の管理

### URLの確認

Vercelダッシュボードで以下を確認できます:
- 公開URL
- デプロイ履歴
- ビルドログ
- アクセス統計

### カスタムドメイン設定（オプション）

1. Vercelプロジェクト→「Settings」→「Domains」
2. 「Add」をクリック
3. 独自ドメインを入力
4. DNSレコードを設定

---

## 🔗 関連リンク

- **GitHubリポジトリ:** https://github.com/kitahama-sys/akari-score-demo
- **Vercel:** https://vercel.com
- **PlanetScale:** https://planetscale.com
- **Git公式ドキュメント:** https://git-scm.com/doc

---

## 📞 サポートドキュメント

- [README_DEMO.md](README_DEMO.md) - システム概要
- [QUICK_START.md](QUICK_START.md) - ローカル起動手順
- [DEMO_SETUP_REPORT.md](DEMO_SETUP_REPORT.md) - 詳細な構築情報
- [VERCEL_DEPLOY_GUIDE.md](VERCEL_DEPLOY_GUIDE.md) - Vercel詳細ガイド

---

## 🎉 完了！

これで、デモシステムが永久的にインターネット上に公開されました。

**公開URL例:** https://akari-score-demo.vercel.app

このURLは、Vercelアカウントが有効な限り、永久に利用できます。

---

**作成日:** 2024年11月24日  
**バージョン:** 1.0.0  
**最終更新:** 2024年11月24日
