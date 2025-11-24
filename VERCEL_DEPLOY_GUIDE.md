# 🚀 Vercelデプロイガイド

## akari-score-demo を永久デプロイする手順

このガイドに従って、デモシステムをVercelに永久デプロイします。

---

## 📋 前提条件

- ✅ GitHubアカウント（既に作成済み）
- ✅ GitHubリポジトリ: https://github.com/kitahama-sys/akari-score-demo
- ⚠️ **重要:** リポジトリにコードをプッシュする必要があります

---

## ステップ1: GitHubにコードをプッシュ

### 方法A: ブラウザでアップロード（簡単）

1. https://github.com/kitahama-sys/akari-score-demo にアクセス
2. 「Add file」→「Upload files」をクリック
3. `/home/ubuntu/akari-score-demo`フォルダ内の全ファイルをドラッグ＆ドロップ
4. 「Commit changes」をクリック

### 方法B: コマンドライン（推奨）

```bash
cd /home/ubuntu/akari-score-demo

# Personal Access Tokenを使ってプッシュ
# Token作成: https://github.com/settings/tokens/new
# 必要な権限: repo (Full control of private repositories)

git push https://YOUR_TOKEN@github.com/kitahama-sys/akari-score-demo.git main
```

---

## ステップ2: Vercelにサインアップ

1. https://vercel.com にアクセス
2. 「Sign Up」をクリック
3. 「Continue with GitHub」を選択
4. GitHubアカウントでログイン
5. Vercelの権限リクエストを承認

---

## ステップ3: プロジェクトをインポート

1. Vercelダッシュボードで「Add New...」→「Project」をクリック
2. 「Import Git Repository」セクションで `akari-score-demo` を検索
3. 「Import」ボタンをクリック

---

## ステップ4: プロジェクト設定

### 基本設定

| 項目 | 値 |
|-----|-----|
| Project Name | akari-score-demo |
| Framework Preset | Vite |
| Root Directory | ./ (デフォルト) |
| Build Command | `pnpm vercel-build` |
| Output Directory | dist/public |
| Install Command | `pnpm install` |

### 環境変数

「Environment Variables」セクションで以下を追加:

| Name | Value |
|------|-------|
| NODE_ENV | production |
| DATABASE_URL | file:./data/akari_score_demo.db |

---

## ステップ5: デプロイ

1. 「Deploy」ボタンをクリック
2. ビルドプロセスが開始されます（2〜3分）
3. デプロイ完了後、URLが表示されます

**例:** https://akari-score-demo.vercel.app

---

## ⚠️ 注意事項

### データベースについて

Vercelはサーバーレス環境のため、SQLiteファイルベースのデータベースは永続化されません。

**解決策（2つの選択肢）:**

#### オプション1: PlanetScale（無料・推奨）

1. https://planetscale.com にアクセス
2. GitHubでサインアップ
3. 新しいデータベースを作成
4. 接続文字列を取得
5. Vercelの環境変数`DATABASE_URL`を更新

#### オプション2: Neon（無料）

1. https://neon.tech にアクセス
2. GitHubでサインアップ
3. PostgreSQLデータベースを作成
4. 接続文字列を取得
5. Vercelの環境変数`DATABASE_URL`を更新

---

## 🔧 トラブルシューティング

### ビルドエラー: "pnpm not found"

**解決策:**
1. Vercelプロジェクト設定に移動
2. 「General」→「Build & Development Settings」
3. 「Package Manager」を「pnpm」に変更

### ビルドエラー: "vercel-build script not found"

**解決策:**
`package.json`に以下が含まれているか確認:
```json
{
  "scripts": {
    "vercel-build": "vite build"
  }
}
```

### デプロイ後にログインできない

**原因:** データベースが初期化されていない

**解決策:**
1. 外部データベース（PlanetScale/Neon）を使用
2. データベースマイグレーションを実行
3. デモユーザーを再作成

---

## 📊 デプロイ後の確認

### 動作確認チェックリスト

- [ ] ログイン画面が表示される
- [ ] デモ環境バナーが表示される
- [ ] demo-user1でログインできる
- [ ] ダッシュボードが表示される
- [ ] MVVページが表示される
- [ ] 評価項目が4項目のみ表示される

---

## 🎯 簡易版デプロイ（データベースなし）

データベース設定が複雑な場合、まずはフロントエンドのみデプロイして動作確認できます。

### 手順

1. `server/_core/index.ts`を一時的に無効化
2. フロントエンドのみビルド
3. Vercelにデプロイ
4. 静的サイトとして公開

---

## 🔗 関連リンク

- **GitHubリポジトリ:** https://github.com/kitahama-sys/akari-score-demo
- **Vercel公式ドキュメント:** https://vercel.com/docs
- **PlanetScale:** https://planetscale.com
- **Neon:** https://neon.tech

---

## 📞 サポート

デプロイに関する質問や問題がある場合は、以下のドキュメントを参照してください:

- [README_DEMO.md](README_DEMO.md) - システム概要
- [QUICK_START.md](QUICK_START.md) - ローカル起動手順
- [DEMO_SETUP_REPORT.md](DEMO_SETUP_REPORT.md) - 詳細な構築情報

---

**作成日:** 2024年11月24日  
**バージョン:** 1.0.0
