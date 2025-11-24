# ⚡ デプロイ チートシート

## 最速でデプロイする手順（コピペ用）

---

## 1️⃣ Personal Access Token作成

1. https://github.com/settings/tokens/new
2. Note: `akari-score-demo-deploy`
3. Expiration: `No expiration`
4. Scopes: ✅ `repo`
5. 「Generate token」→ トークンをコピー

---

## 2️⃣ Gitコマンド（コピペ）

```bash
cd /path/to/akari-score-demo

git init
git branch -M main
git config user.email "your-email@example.com"
git config user.name "Your Name"
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/kitahama-sys/akari-score-demo.git

# YOUR_TOKENを置き換えてから実行
git push https://YOUR_TOKEN@github.com/kitahama-sys/akari-score-demo.git main
```

---

## 3️⃣ Vercelデプロイ

1. https://vercel.com → Sign Up with GitHub
2. 「Add New...」→「Project」
3. `akari-score-demo` → 「Import」
4. 設定:
   - Framework: `Vite`
   - Build Command: `pnpm vercel-build`
   - Output Directory: `dist/public`
   - Install Command: `pnpm install`
5. Environment Variables:
   - `NODE_ENV` = `production`
6. 「Deploy」

---

## 4️⃣ PlanetScale（データベース）

1. https://planetscale.com → Sign up with GitHub
2. 「Create a database」
   - Name: `akari-score-demo`
   - Region: `Tokyo, Japan`
3. 「Connect」→「Create password」→ 接続文字列をコピー
4. Vercel → Settings → Environment Variables
   - `DATABASE_URL` = `<PlanetScaleの接続文字列>`
5. 「Redeploy」

---

## 5️⃣ データベースマイグレーション

```bash
export DATABASE_URL="<PlanetScaleの接続文字列>"

mysql -h <host> -u <user> -p akari-score-demo < create-demo-schema.sql
node seed-evaluation-data-demo.mjs
node seed-demo-users.mjs
```

---

## ✅ 完了！

公開URL: `https://akari-score-demo.vercel.app`

---

## 🔐 ログイン情報

| ユーザー名 | パスワード |
|-----------|-----------|
| demo-user1 | DemoUser2024! |
| demo-user2 | DemoUser2024! |
| demo-user3 | DemoUser2024! |
| demo-admin | DemoAdmin2024! |

---

## 🆘 トラブルシューティング

| エラー | 解決策 |
|--------|--------|
| pnpm not found | Vercel Settings → Package Manager → `pnpm` |
| vercel-build not found | `package.json`に`"vercel-build": "vite build"`を追加 |
| Database connection failed | PlanetScaleの接続文字列を確認 |
| ログインできない | データベースマイグレーションを実行 |

---

**詳細:** [DEPLOY_COMPLETE_GUIDE.md](DEPLOY_COMPLETE_GUIDE.md)
