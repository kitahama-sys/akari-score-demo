# 📤 GitHubにプッシュする方法（超わかりやすい版）

## 「プッシュ」って何？

**プッシュ = ファイルをGitHubにアップロードすること**

パソコンにあるファイルを、GitHubのサーバーに送る作業です。

---

## 🎯 2つの方法から選べます

### 方法1: ブラウザでアップロード（簡単！）⭐おすすめ
コマンドを使わない方法

### 方法2: コマンドでプッシュ（本格的）
ターミナル/コマンドプロンプトを使う方法

---

## 🌟 方法1: ブラウザでアップロード（超簡単）

### ステップ1: ファイルを準備

1. **akari-score-demo.tar.gz** をダウンロード（既にダウンロード済み）
2. ファイルを解凍
   - **Windows:** 右クリック→「すべて展開」
   - **Mac:** ダブルクリック

### ステップ2: GitHubのページを開く

1. ブラウザで https://github.com/kitahama-sys/akari-score-demo を開く
2. 「Add file」ボタンをクリック
3. 「Upload files」を選択

### ステップ3: ファイルをドラッグ＆ドロップ

1. 解凍したフォルダの中身を**全部選択**
2. GitHubのページにドラッグ＆ドロップ

**注意:** フォルダごとではなく、フォルダの**中身**をドラッグしてください

### ステップ4: アップロード完了

1. 下にスクロール
2. 「Commit changes」ボタンをクリック
3. 完了！

---

## 💻 方法2: コマンドでプッシュ

### 事前準備: Personal Access Token（パスワードみたいなもの）を作る

#### ステップA: トークン作成ページを開く

1. ブラウザで https://github.com/settings/tokens/new を開く
2. メール認証が求められたら、メールを確認して認証

#### ステップB: トークンの設定

| 項目 | 入力内容 |
|------|---------|
| Note（メモ） | `akari-score-demo-deploy` |
| Expiration（有効期限） | `No expiration`（無期限） |
| Select scopes（権限） | ✅ **repo** にチェック |

#### ステップC: トークンを生成

1. 一番下の「Generate token」ボタンをクリック
2. **重要:** 表示された文字列（`ghp_xxxxx...`）をコピー
3. メモ帳などに保存（二度と表示されません！）

**例:**
```
ghp_1234567890abcdefghijklmnopqrstuvwxyzABCD
```

---

### 実際のプッシュ作業

#### ステップ1: ターミナル/コマンドプロンプトを開く

**Windows:**
1. スタートメニューで「cmd」と検索
2. 「コマンドプロンプト」を開く

**Mac:**
1. Spotlight（⌘+Space）で「terminal」と検索
2. 「ターミナル」を開く

#### ステップ2: フォルダに移動

解凍したフォルダに移動します。

**Windows:**
```bash
cd C:\Users\あなたの名前\Downloads\akari-score-demo
```

**Mac:**
```bash
cd ~/Downloads/akari-score-demo
```

**確認方法:**
```bash
ls
```
と入力してEnterを押すと、ファイル一覧が表示されます。

#### ステップ3: Gitの初期設定（初回のみ）

```bash
git config user.email "your-email@example.com"
git config user.name "Your Name"
```

**例:**
```bash
git config user.email "tanaka@example.com"
git config user.name "Tanaka Taro"
```

#### ステップ4: ファイルを準備

```bash
git init
git branch -M main
git add .
git commit -m "Initial commit"
```

**説明:**
- `git init` = Gitを使えるようにする
- `git branch -M main` = メインブランチを作る
- `git add .` = すべてのファイルを登録
- `git commit -m "..."` = 変更を記録

#### ステップ5: GitHubに接続

```bash
git remote add origin https://github.com/kitahama-sys/akari-score-demo.git
```

#### ステップ6: プッシュ（アップロード）

**重要:** `YOUR_TOKEN` を、先ほど作成したトークンに置き換えてください！

```bash
git push https://YOUR_TOKEN@github.com/kitahama-sys/akari-score-demo.git main
```

**実際の例:**
```bash
git push https://ghp_1234567890abcdefghijklmnopqrstuvwxyzABCD@github.com/kitahama-sys/akari-score-demo.git main
```

#### ステップ7: 完了確認

1. ブラウザで https://github.com/kitahama-sys/akari-score-demo を開く
2. ファイルが表示されていればOK！

---

## 🆘 よくあるエラーと解決方法

### エラー1: "git: command not found"

**原因:** Gitがインストールされていない

**解決策:**
- **Windows:** https://git-scm.com/download/win からダウンロード
- **Mac:** `xcode-select --install` を実行

### エラー2: "Authentication failed"

**原因:** トークンが間違っている

**解決策:**
- トークンをもう一度確認
- 新しいトークンを作成

### エラー3: "Permission denied"

**原因:** リポジトリへのアクセス権限がない

**解決策:**
- GitHubにログインしているか確認
- リポジトリのオーナーが自分か確認

---

## ✅ プッシュ成功の確認方法

1. https://github.com/kitahama-sys/akari-score-demo を開く
2. 以下のファイルが表示されていればOK:
   - ✅ README_DEMO.md
   - ✅ package.json
   - ✅ client/ フォルダ
   - ✅ server/ フォルダ
   - ✅ その他たくさんのファイル

---

## 🎯 次のステップ

プッシュが完了したら、次は **Vercelにデプロイ** です！

**DEPLOY_CHEATSHEET.md** のステップ3に進んでください。

---

## 💡 どっちの方法がおすすめ？

| 方法 | おすすめ度 | メリット | デメリット |
|------|----------|---------|-----------|
| ブラウザでアップロード | ⭐⭐⭐⭐⭐ | 超簡単、コマンド不要 | ファイル数が多いと時間がかかる |
| コマンドでプッシュ | ⭐⭐⭐ | 本格的、速い | コマンドに慣れる必要がある |

**初めての方は「ブラウザでアップロード」がおすすめです！**

---

## 📞 困ったら

このガイドで分からないことがあれば、具体的にどこで詰まったか教えてください！

---

**作成日:** 2024年11月24日
