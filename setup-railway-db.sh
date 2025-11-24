#!/bin/bash

# Railway MySQL接続情報
MYSQL_HOST="shortline.proxy.rlwy.net"
MYSQL_PORT="18303"
MYSQL_USER="root"
MYSQL_PASSWORD="FYoWIxVuBlRqjsgSyHanbEeVQicbJCIG"
MYSQL_DATABASE="railway"

echo "🚀 Railway MySQLデータベースセットアップを開始します..."

# SQLファイルを実行
echo "📊 テーブルを作成中..."
mysql -h $MYSQL_HOST -P $MYSQL_PORT -u $MYSQL_USER -p$MYSQL_PASSWORD $MYSQL_DATABASE < create-demo-schema.sql

echo "✅ テーブル作成完了！"

# シードデータを投入
echo "📦 デモデータを投入中..."
DATABASE_URL="mysql://$MYSQL_USER:$MYSQL_PASSWORD@$MYSQL_HOST:$MYSQL_PORT/$MYSQL_DATABASE" node seed-evaluation-data-demo.mjs
DATABASE_URL="mysql://$MYSQL_USER:$MYSQL_PASSWORD@$MYSQL_HOST:$MYSQL_PORT/$MYSQL_DATABASE" node seed-demo-users.mjs

echo "🎉 データベースセットアップ完了！"
