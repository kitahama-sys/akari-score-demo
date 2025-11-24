import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Lightbulb, TrendingUp, BarChart3, Users, LogOut, UserCog, Key, Heart, MapPin, Clock, CheckCircle2, FileEdit, Map } from "lucide-react";
import { Redirect, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { formatDistanceToNow } from "date-fns";
import { ja } from "date-fns/locale";

export default function Dashboard() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const [, setLocation] = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  // デモ環境では認証をバイパスしてデモユーザーを使用
  const demoUser = {
    id: 1,
    username: "demo-user1",
    name: "デモユーザー1",
    role: "user" as const,
    loginMethod: "local" as const
  };
  
  const displayUser = user || demoUser;
  
  // 本番環境のみログインチェック（デモ環境では常にアクセス可能）
  // if (!isAuthenticated || !user) {
  //   return <Redirect to="/login" />;
  // }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* ヘッダー */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src="/place-libre-logo.png"
                alt="PLACE LIBRE"
                className="h-10 w-auto object-contain"
              />
              <div>
                <h1 className="text-xl font-bold">
                  <ruby>灯<rt>あかりび</rt></ruby>SCORE
                </h1>
                <p className="text-xs text-muted-foreground">成長を灯すスコア</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium">{displayUser.name || "ユーザー"}</p>
                <p className="text-xs text-muted-foreground">
                  {displayUser.role === "admin" ? "管理者" : displayUser.role === "manager" ? "上長" : "一般"}
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={logout}>
                <LogOut className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">ログアウト</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* ウェルカムセクション */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-warm">
              <Lightbulb className="w-9 h-9 text-white" fill="currentColor" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">
                ようこそ、<span className="text-primary">{displayUser.name || "ユーザー"}</span>さん
              </h2>
              <p className="text-muted-foreground">今日も一緒に成長の灯を増やしましょう</p>
            </div>
          </div>
        </div>

        {/* アクションカード */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card 
            className="cursor-pointer hover:shadow-warm transition-all duration-300 border-2 hover:border-primary/50"
            onClick={() => setLocation("/self-evaluation")}
          >
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>自己評価</CardTitle>
              <CardDescription>あなたの成長を記録しましょう</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                30項目の評価を通じて、自分の強みと成長ポイントを見つけます。
              </p>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-warm transition-all duration-300 border-2 hover:border-secondary/50"
            onClick={() => setLocation("/results")}
          >
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mb-2">
                <BarChart3 className="w-6 h-6 text-secondary" />
              </div>
              <CardTitle>評価結果</CardTitle>
              <CardDescription>成長の軌跡を確認</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                自己評価と上長評価を比較して、成長の可視化を実感します。
              </p>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-warm transition-all duration-300 border-2 hover:border-orange-500/50"
            onClick={() => setLocation("/compare-evaluations")}
          >
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center mb-2">
                <TrendingUp className="w-6 h-6 text-orange-500" />
              </div>
              <CardTitle>期間比較</CardTitle>
              <CardDescription>複数期間の成長を可視化</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                複数の評価期間を並べて表示し、成長の推移を確認します。
              </p>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-warm transition-all duration-300 border-2 hover:border-primary/50"
            onClick={() => setLocation("/history")}
          >
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>評価履歴</CardTitle>
              <CardDescription>成長の軌跡を振り返る</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                過去の評価を確認して、成長の推移をグラフで確認します。
              </p>
            </CardContent>
          </Card>

          {(displayUser.role === "manager" || displayUser.role === "admin") ? (
            <Card 
              className="cursor-pointer hover:shadow-warm transition-all duration-300 border-2 hover:border-primary/50"
              onClick={() => setLocation("/manager-evaluation")}
            >
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>上長評価</CardTitle>
                <CardDescription>メンバーの成長を支援</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  チームメンバーの評価を通じて、成長をサポートします。
                </p>
              </CardContent>
            </Card>
          ) : null}

          {(displayUser.role === "manager" || displayUser.role === "admin") ? (
            <Card 
              className="cursor-pointer hover:shadow-warm transition-all duration-300 border-2 hover:border-secondary/50"
              onClick={() => setLocation("/users")}
            >
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mb-2">
                  <UserCog className="w-6 h-6 text-secondary" />
                </div>
                <CardTitle>ユーザー管理</CardTitle>
                <CardDescription>アカウントの作成と管理</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  新しいユーザーアカウントを作成し、管理します。
                </p>
              </CardContent>
            </Card>
          ) : null}

          <Card 
            className="cursor-pointer hover:shadow-warm transition-all duration-300 border-2 hover:border-pink-500/50 bg-gradient-to-br from-pink-50/50 to-rose-50/50"
            onClick={() => setLocation("/mvv")}
          >
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center mb-2">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <CardTitle>経営理念 MVV</CardTitle>
              <CardDescription>私たちの想いを知る</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                PLACE LIBREのミッション・ビジョン・バリューを確認します。
              </p>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-warm transition-all duration-300 border-2 hover:border-orange-500/50 bg-gradient-to-br from-orange-50/50 to-blue-50/50"
            onClick={() => setLocation("/roadmap")}
          >
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-blue-500 flex items-center justify-center mb-2">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <CardTitle>マイキャリアマップ</CardTitle>
              <CardDescription>半期のロードマップを描く</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                長期ビジョンとSTEPを設定して、成長の道筋を可視化します。
              </p>
            </CardContent>
          </Card>

          {(displayUser.role === 'admin' || displayUser.role === 'manager') ? (
            <Card 
              className="cursor-pointer hover:shadow-warm transition-all duration-300 border-2 hover:border-blue-500/50 bg-gradient-to-br from-blue-50/50 to-indigo-50/50"
              onClick={() => setLocation("/member-roadmaps")}
            >
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center mb-2">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <CardTitle>メンバーのキャリアマップ</CardTitle>
                <CardDescription>メンバーの成長を確認</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  メンバーのロードマップを閲覧して、成長をサポートします。
                </p>
              </CardContent>
            </Card>
          ) : null}

          <Card 
            className="cursor-pointer hover:shadow-warm transition-all duration-300 border-2 hover:border-primary/50"
            onClick={() => setLocation("/change-password")}
          >
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <Key className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>パスワード変更</CardTitle>
              <CardDescription>セキュリティ設定</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                パスワードを変更して、アカウントを安全に保ちます。
              </p>
            </CardContent>
          </Card>
        </div>

        {/* 最近の活動 */}
        <RecentActivities userId={displayUser.id} />
      </main>
    </div>
  );
}

// 最近の活動コンポーネント
function RecentActivities({ userId }: { userId: number }) {
  const { data: activities, isLoading } = trpc.activityLogs.getRecent.useQuery();

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'self_evaluation_submitted':
        return <FileEdit className="w-5 h-5 text-primary" />;
      case 'manager_evaluation_completed':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'roadmap_updated':
        return <Map className="w-5 h-5 text-orange-500" />;
      case 'evaluation_period_started':
      case 'evaluation_period_ended':
        return <Clock className="w-5 h-5 text-blue-500" />;
      default:
        return <Clock className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'self_evaluation_submitted':
        return 'border-l-primary';
      case 'manager_evaluation_completed':
        return 'border-l-green-500';
      case 'roadmap_updated':
        return 'border-l-orange-500';
      case 'evaluation_period_started':
      case 'evaluation_period_ended':
        return 'border-l-blue-500';
      default:
        return 'border-l-muted';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>最近の活動</CardTitle>
        <CardDescription>あなたの評価とキャリアマップの履歴</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : !activities || activities.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            まだ活動がありません。<br />
            上のカードから評価やキャリアマップを始めましょう。
          </p>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className={`flex items-start gap-4 p-4 rounded-lg border-l-4 ${getActivityColor(activity.activityType)} bg-card hover:bg-accent/5 transition-colors`}
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  {getActivityIcon(activity.activityType)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{activity.description}</p>
                  {activity.evaluationPeriod && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {activity.evaluationPeriod}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDistanceToNow(new Date(activity.createdAt), {
                      addSuffix: true,
                      locale: ja,
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
