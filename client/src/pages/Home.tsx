import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Loader2, Lightbulb, TrendingUp, Heart, Users } from "lucide-react";
import { APP_LOGO, APP_TITLE } from "@/const";
import { Redirect } from "wouter";

export default function Home() {
  const { user, loading, error, isAuthenticated } = useAuth();

  // ログイン済みの場合はダッシュボードにリダイレクト
  if (isAuthenticated && user) {
    return <Redirect to="/dashboard" />;
  }

  // 未認証の場合はログインページにリダイレクト
  if (!loading && !isAuthenticated) {
    return <Redirect to="/login" />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-background">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* ヘッダー */}
      <header className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/place-libre-logo.png"
              alt="PLACE LIBRE"
              className="h-12 w-auto object-contain"
            />
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                <ruby>灯<rt>あかりび</rt></ruby>SCORE
              </h1>
              <p className="text-sm text-muted-foreground">Akarabi SCORE</p>
            </div>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-12 animate-float">
            <div className="inline-block mb-6">
              <img
                src="/place-libre-logo.png"
                alt="PLACE LIBRE"
                className="h-24 w-auto object-contain"
              />
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
              成長を<span className="text-primary">灯す</span>スコア
            </h2>
            <p className="text-xl text-muted-foreground mb-2">
              灯す、ゆとり。
            </p>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              点数をつけるのではなく、あなたの成長を温かく見守り、<br className="hidden sm:inline" />
              未来への灯を一緒に増やしていくプラットフォームです。
            </p>
          </div>

          {/* 特徴カード */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-card rounded-2xl p-6 shadow-warm border border-border hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">成長の可視化</h3>
              <p className="text-muted-foreground text-sm">
                あなたの成長を美しいグラフで可視化。灯が増える喜びを実感できます。
              </p>
            </div>

            <div className="bg-card rounded-2xl p-6 shadow-warm border border-border hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">温かい評価</h3>
              <p className="text-muted-foreground text-sm">
                数字だけでなく、心のこもったフィードバックで互いに支え合います。
              </p>
            </div>

            <div className="bg-card rounded-2xl p-6 shadow-warm border border-border hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">チームで成長</h3>
              <p className="text-muted-foreground text-sm">
                自己評価と上長評価を通じて、チーム全体で成長を促します。
              </p>
            </div>
          </div>

          {/* ログインボタン */}
          <div className="text-center">
            <Button
              size="lg"
              className="w-full sm:w-auto px-8 py-6 text-lg rounded-full shadow-warm hover:shadow-xl transition-all duration-300 animate-light-up"
              onClick={() => window.location.href = "/login"}
            >
              <Lightbulb className="w-5 h-5 mr-2" fill="currentColor" />
              ログイン
            </Button>
            {error && (
              <p className="mt-4 text-sm text-destructive">
                ログインに失敗しました。もう一度お試しください。
              </p>
            )}
          </div>
        </div>
      </main>

      {/* フッター */}
      <footer className="py-6 px-4 sm:px-6 lg:px-8 border-t border-border">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>© 2025 <ruby>灯<rt>あかりび</rt></ruby>SCORE - 成長を灯すスコア. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
