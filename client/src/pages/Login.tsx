import { useState } from "react";
import { useLocation } from "wouter";
import { Flame, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { APP_LOGO } from "@/const";

export default function Login() {
  const [, setLocation] = useLocation();
  
  // デモ環境では自動的にダッシュボードにリダイレクト
  useEffect(() => {
    setLocation("/dashboard");
  }, [setLocation]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);

  const utils = trpc.useUtils();
  
  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: async (data) => {
      setIsAnimating(true);
      toast.success("ログインしました！");
      // Set user data in cache immediately
      utils.auth.me.setData(undefined, data.user as any);
      setTimeout(() => {
        setLocation("/dashboard");
      }, 1500);
    },
    onError: (error: any) => {
      toast.error(error.message || "ログインに失敗しました");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error("ユーザー名とパスワードを入力してください");
      return;
    }
    loginMutation.mutate({ username, password });
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-all duration-1500 ${
      isAnimating 
        ? "bg-gradient-to-br from-orange-100 via-yellow-50 to-blue-100" 
        : "bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900"
    }`}>
      {/* Particle Animation */}
      {isAnimating && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-orange-400 rounded-full animate-float-up"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                opacity: Math.random() * 0.7 + 0.3,
              }}
            />
          ))}
        </div>
      )}

      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-1/4 left-1/4 w-64 h-64 rounded-full mix-blend-multiply filter blur-xl transition-all duration-1000 ${
          isAnimating ? "bg-orange-300 opacity-50" : "bg-gray-600 opacity-20"
        } animate-float`}></div>
        <div className={`absolute top-1/3 right-1/4 w-64 h-64 rounded-full mix-blend-multiply filter blur-xl transition-all duration-1000 ${
          isAnimating ? "bg-blue-300 opacity-50" : "bg-gray-500 opacity-20"
        } animate-float-delayed`}></div>
        <div className={`absolute bottom-1/4 left-1/3 w-64 h-64 rounded-full mix-blend-multiply filter blur-xl transition-all duration-1000 ${
          isAnimating ? "bg-yellow-300 opacity-40" : "bg-gray-600 opacity-15"
        } animate-float`}></div>
      </div>

      <Card className={`w-full max-w-md relative z-10 shadow-2xl transition-all duration-1000 ${
        isAnimating ? "border-orange-300 bg-white" : "border-gray-700 bg-gray-800/90"
      }`}>
        <CardHeader className="text-center space-y-4">
          {/* Demo Environment Banner */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg shadow-md">
            <p className="text-sm font-semibold">🎯 これはデモ環境です</p>
            <p className="text-xs mt-1 opacity-90">デモ介護サービス専用システム</p>
          </div>
          <div className="flex justify-center">
            <div className="relative">
              <img 
                src={APP_LOGO} 
                alt="PLACE LIBRE" 
                className={`h-24 transition-all duration-1000 ${
                  isAnimating ? "drop-shadow-[0_0_15px_rgba(251,146,60,0.8)] scale-110" : "opacity-70"
                }`}
              />
              {isAnimating && (
                <Sparkles className="w-8 h-8 text-yellow-400 absolute -top-2 -right-2 animate-ping" />
              )}
            </div>
          </div>
          <div>
            <h1 className={`text-4xl font-bold transition-all duration-1000 ${
              isAnimating 
                ? "bg-gradient-to-r from-orange-500 to-blue-500 bg-clip-text text-transparent" 
                : "text-gray-300"
            }`}>
              <ruby>灯<rt>あかりび</rt></ruby>SCORE
            </h1>
            <CardDescription className={`text-lg mt-2 transition-all duration-1000 ${
              isAnimating ? "text-gray-600" : "text-gray-400"
            }`}>
              {isAnimating ? "あなたの成長を灯します✨" : "成長を灯すスコア"}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="username" className={`text-sm font-medium transition-colors duration-500 ${
                isAnimating ? "text-gray-700" : "text-gray-300"
              }`}>
                ユーザー名
              </label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="ユーザー名を入力"
                className={`transition-colors duration-500 ${
                  isAnimating 
                    ? "border-gray-300 focus:border-orange-400 focus:ring-orange-400 bg-white" 
                    : "border-gray-600 bg-gray-700/50 text-gray-200 placeholder:text-gray-500"
                }`}
                disabled={loginMutation.isPending}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className={`text-sm font-medium transition-colors duration-500 ${
                isAnimating ? "text-gray-700" : "text-gray-300"
              }`}>
                パスワード
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="パスワードを入力"
                className={`transition-colors duration-500 ${
                  isAnimating 
                    ? "border-gray-300 focus:border-orange-400 focus:ring-orange-400 bg-white" 
                    : "border-gray-600 bg-gray-700/50 text-gray-200 placeholder:text-gray-500"
                }`}
                disabled={loginMutation.isPending}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-500 to-blue-500 hover:from-orange-600 hover:to-blue-600 text-white font-semibold py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  ログイン中...
                </>
              ) : (
                <>
                  <Flame className="w-5 h-5 mr-2" />
                  ログイン
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 space-y-4">
            {/* Demo Login Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-xs font-semibold text-blue-800 mb-2">👤 デモログイン情報</p>
              <div className="space-y-1 text-xs text-blue-700">
                <p><span className="font-medium">ユーザー:</span> demo-user1 / demo-user2 / demo-user3</p>
                <p><span className="font-medium">管理者:</span> demo-admin</p>
                <p><span className="font-medium">パスワード:</span> DemoUser2024! / DemoAdmin2024!</p>
              </div>
            </div>
            
            <div className="text-center">
              <p className={`text-sm transition-colors duration-500 ${
                isAnimating ? "text-gray-500" : "text-gray-400"
              }`}>
                アカウントをお持ちでない場合は、管理者にお問い合わせください
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <style>{`
        @keyframes float-up {
          0% {
            transform: translateY(100vh) scale(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh) scale(1.5);
            opacity: 0;
          }
        }
        .animate-float-up {
          animation: float-up 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
