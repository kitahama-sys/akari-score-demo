import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Heart, Lightbulb, Sparkles, Target } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";

export default function MVV() {
  const { user, loading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [visibleSections, setVisibleSections] = useState<string[]>([]);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      setLocation("/");
    }
  }, [loading, isAuthenticated, setLocation]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.target.id) {
            setVisibleSections((prev) => 
              prev.includes(entry.target.id) ? prev : [...prev, entry.target.id]
            );
          }
        });
      },
      { threshold: 0.1 }
    );

    const sections = document.querySelectorAll("[data-animate]");
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  const valueItems = [
    "笑顔と挨拶を大切にする",
    "利用者様の声に真摧に耳を傾ける",
    "チームで情報を共有し、連携する",
    "常に学び、専門性を高める",
    "安全を最優先に考え、行動する",
    "家族の想いに寄り添う",
    "地域との関係を大切にする",
    "誠実さと責任感を持って業務にあたる",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-orange-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => setLocation("/dashboard")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            戻る
          </Button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-orange-500 to-blue-500 bg-clip-text text-transparent">
              経営理念 MVV
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">Mission · Vision · Value</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-5xl">
        {/* Hero Section */}
        <div
          id="hero"
          data-animate
          className={`text-center mb-16 transition-all duration-1000 ${
            visibleSections.includes("hero") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-100 to-blue-100 px-6 py-3 rounded-full mb-6">
            <Sparkles className="h-5 w-5 text-orange-500" />
            <span className="font-semibold text-lg">デモ介護サービス</span>
            <Sparkles className="h-5 w-5 text-blue-500" />
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            私たちの想い、大切にしている価値観、目指す未来をご紹介します
          </p>
        </div>

        {/* Vision Section */}
        <div
          id="vision"
          data-animate
          className={`mb-12 transition-all duration-1000 delay-200 ${
            visibleSections.includes("vision") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <Card className="border-2 border-blue-200 shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
              <div className="flex items-center gap-3 mb-2">
                <Target className="h-8 w-8" />
                <h2 className="text-3xl font-bold">VISION</h2>
              </div>
              <p className="text-blue-100">目指す未来像</p>
            </div>
            <CardContent className="p-8">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent break-words">
                地域に根ざした、心温まる介護を
              </h3>
              <p className="text-lg leading-relaxed mb-8 text-center text-muted-foreground">
                利用者様一人ひとりの個性と尊厳を大切にし、
                その方らしい生活を支えることを第一に考えます。
              </p>
              <p className="text-base leading-relaxed text-center text-muted-foreground">
                私たちは、地域社会とともに歩み、
                誰もが安心して暮らせる社会の実現を目指します。
              </p>

              <div className="grid md:grid-cols-3 gap-6 mt-8">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg">
                  <h4 className="text-xl font-bold mb-4 text-blue-900 flex items-center gap-2">
                    <span className="text-3xl">👥</span>
                    利用者様中心
                  </h4>
                  <ul className="space-y-2 text-sm text-blue-800">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>一人ひとりの想いに寄り添う</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>その方らしさを尊重する</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>自立支援を第一に考える</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>安全・安心な環境を提供する</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg">
                  <h4 className="text-xl font-bold mb-4 text-green-900 flex items-center gap-2">
                    <span className="text-3xl">🤝</span>
                    チームワーク
                  </h4>
                  <ul className="space-y-2 text-sm text-green-800">
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">•</span>
                      <span>情報共有を徹底する</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">•</span>
                      <span>互いに支え合う</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">•</span>
                      <span>専門性を高め合う</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">•</span>
                      <span>連携を大切にする</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-lg">
                  <h4 className="text-xl font-bold mb-4 text-orange-900 flex items-center gap-2">
                    <span className="text-3xl">🏡</span>
                    地域貢献
                  </h4>
                  <ul className="space-y-2 text-sm text-orange-800">
                    <li className="flex items-start gap-2">
                      <span className="text-orange-500 mt-1">•</span>
                      <span>地域との絆を深める</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-500 mt-1">•</span>
                      <span>社会資源として機能する</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-500 mt-1">•</span>
                      <span>地域課題の解決に取り組む</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-500 mt-1">•</span>
                      <span>開かれた施設運営を行う</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mission Section */}
        <div
          id="mission"
          data-animate
          className={`mb-12 transition-all duration-1000 delay-400 ${
            visibleSections.includes("mission") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <Card className="border-2 border-orange-200 shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500 to-yellow-500 p-6 text-white">
              <div className="flex items-center gap-3 mb-2">
                <Lightbulb className="h-8 w-8" />
                <h2 className="text-3xl font-bold">MISSION</h2>
              </div>
              <p className="text-orange-100">私たちの使命</p>
            </div>
            <CardContent className="p-8">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4 bg-gradient-to-r from-orange-600 to-yellow-500 bg-clip-text text-transparent">
                笑顔をつなぐ、未来をつくる。
              </h3>
              <p className="text-xl text-center text-muted-foreground mb-8">
                〜すべての人に寄り添う介護を〜
              </p>
              <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
                <p>
                  私たちは、利用者様とそのご家族、<br />
                  そして地域の皆様に笑顔を届けることを使命とします。
                </p>
                <p>
                  専門的なケアと温かい心で、<br />
                  一人ひとりの生活の質を高め、<br />
                  その方らしい人生を支えていきます。
                </p>
                <p>
                  また、働くスタッフ一人ひとりが<br />
                  やりがいを持って成長できる環境を整え、<br />
                  介護の未来を共に創造していきます。
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Value Section */}
        <div
          id="value"
          data-animate
          className={`mb-12 transition-all duration-1000 delay-600 ${
            visibleSections.includes("value") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <Card className="border-2 border-pink-200 shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-6 text-white">
              <div className="flex items-center gap-3 mb-2">
                <Heart className="h-8 w-8" />
                <h2 className="text-3xl font-bold">VALUE</h2>
              </div>
              <p className="text-pink-100">大切にする価値観</p>
            </div>
            <CardContent className="p-8">
              <h3 className="text-2xl sm:text-3xl font-bold text-center mb-8 bg-gradient-to-r from-pink-600 to-rose-500 bg-clip-text text-transparent">
                思いやりの心
              </h3>
              <p className="text-lg text-center text-muted-foreground mb-6">
                プロフェッショナルとしての誇り
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                {valueItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 bg-gradient-to-br from-pink-50 to-rose-50 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-pink-500 to-rose-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
