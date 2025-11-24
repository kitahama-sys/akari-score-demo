import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, Flame, Loader2, Sparkles, TrendingUp, ArrowUp, ArrowDown, ChevronDown, ChevronUp } from "lucide-react";
import { useLocation } from "wouter";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ResponsiveContainer } from 'recharts';
import { useState } from "react";
import { parsePeriodString } from "@shared/periodUtils";

export default function Results() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [showAllItems, setShowAllItems] = useState(false);

  const categoriesQuery = trpc.evaluation.getCategories.useQuery();
  const itemsQuery = trpc.evaluation.getAllItems.useQuery();
  const latestEvaluationQuery = trpc.evaluation.getLatestEvaluation.useQuery(
    { userId: user?.id || 0 },
    { enabled: !!user }
  );

  const categories = categoriesQuery.data || [];
  const items = itemsQuery.data || [];
  const evaluation = latestEvaluationQuery.data;
  
  const evaluationPeriod = evaluation ? parsePeriodString(evaluation.evaluationPeriod) : null;

  if (categoriesQuery.isLoading || itemsQuery.isLoading || latestEvaluationQuery.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-blue-50">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  if (!evaluation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-blue-50">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>評価結果がありません</CardTitle>
            <CardDescription>まだ自己評価を行っていません</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setLocation("/dashboard")}>
              ダッシュボードに戻る
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const hasManagerEvaluation = evaluation.scores.some(score => score.managerScore !== null);

  // Calculate scores by category
  const categoryScores = categories.map(category => {
    const categoryItems = items.filter(item => item.categoryId === category.id);
    const categoryEvaluations = evaluation.scores.filter(score => 
      categoryItems.some(item => item.id === score.itemId)
    );
    
    const selfTotal = categoryEvaluations.reduce((sum, score) => sum + score.selfScore, 0);
    const managerTotal = categoryEvaluations.reduce((sum, score) => sum + (score.managerScore || 0), 0);
    const maxScore = categoryItems.length * 5;
    
    return {
      category: category.name,
      self: Math.round((selfTotal / maxScore) * 100),
      manager: managerTotal > 0 ? Math.round((managerTotal / maxScore) * 100) : null,
      fullMark: 100,
    };
  });

  // Calculate total scores
  const totalSelfScore = evaluation.scores.reduce((sum, score) => sum + score.selfScore, 0);
  const totalManagerScore = evaluation.scores.reduce((sum, score) => sum + (score.managerScore || 0), 0);
  const maxTotalScore = items.length * 5;
  const selfPercentage = Math.round((totalSelfScore / maxTotalScore) * 100);
  const managerPercentage = totalManagerScore > 0 ? Math.round((totalManagerScore / maxTotalScore) * 100) : null;

  // Calculate recognition alignment score (認識一致度スコア)
  let alignmentScore = 100;
  if (hasManagerEvaluation) {
    const differences = evaluation.scores
      .filter(score => score.managerScore !== null)
      .map(score => Math.abs(score.selfScore - (score.managerScore || 0)));
    const totalDifference = differences.reduce((sum, diff) => sum + diff, 0);
    const maxPossibleDifference = differences.length * 4; // Max difference is 4 (1 vs 5 or 5 vs 1)
    alignmentScore = Math.round(100 - (totalDifference / maxPossibleDifference) * 100);
  }

  // Calculate gap ranking (差分ランキング)
  const gapRanking = hasManagerEvaluation
    ? evaluation.scores
        .filter(score => score.managerScore !== null)
        .map(score => {
          const item = items.find(i => i.id === score.itemId);
          const gap = score.selfScore - (score.managerScore || 0);
          return {
            itemName: item?.name || "",
            selfScore: score.selfScore,
            managerScore: score.managerScore || 0,
            gap,
            absGap: Math.abs(gap),
            managerComment: score.managerComment,
          };
        })
        .sort((a, b) => b.absGap - a.absGap)
    : [];

  const topOverestimated = gapRanking.filter(item => item.gap > 0).slice(0, 5);
  const topUnderestimated = gapRanking.filter(item => item.gap < 0).slice(0, 5);

  // Helper function to get gap color
  const getGapColor = (gap: number) => {
    const absGap = Math.abs(gap);
    if (absGap >= 2) return "text-red-500";
    if (absGap >= 1) return "text-yellow-500";
    return "text-green-500";
  };

  // Helper function to get gap icon
  const getGapIcon = (gap: number) => {
    if (gap > 0) return <ArrowUp className="w-4 h-4" />;
    if (gap < 0) return <ArrowDown className="w-4 h-4" />;
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 py-4 sm:py-8 px-4">
      <div className="container max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={() => setLocation("/dashboard")}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            戻る
          </Button>
          <div className="flex items-center gap-3">
            <Flame className="w-10 h-10 text-orange-500 animate-glow" />
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-blue-500 bg-clip-text text-transparent">
                評価結果
              </h1>
              <p className="text-sm text-gray-600">{evaluationPeriod?.displayName || '評価結果'}</p>
            </div>
          </div>
          <div className="w-24"></div>
        </div>

        {/* Score Summary */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="border-orange-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100">
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-orange-500" />
                あなたの灯
              </CardTitle>
              <CardDescription>自己評価スコア</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-6xl font-bold mb-2">
                  <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                    {selfPercentage}
                  </span>
                  <span className="text-3xl text-gray-400">/100</span>
                </div>
                <p className="text-gray-600">
                  {totalSelfScore} / {maxTotalScore} ポイント
                </p>
              </div>
            </CardContent>
          </Card>

          {hasManagerEvaluation && managerPercentage !== null && (
            <>
              <Card className="border-blue-200 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-6 h-6 text-blue-500" />
                    上長評価
                  </CardTitle>
                  <CardDescription>上長からの評価スコア</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-6xl font-bold mb-2">
                      <span className="bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
                        {managerPercentage}
                      </span>
                      <span className="text-3xl text-gray-400">/100</span>
                    </div>
                    <p className="text-gray-600">
                      {totalManagerScore} / {maxTotalScore} ポイント
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-green-200 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-green-50 to-green-100">
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-green-500" />
                    認識一致度
                  </CardTitle>
                  <CardDescription>自己評価と上長評価の一致度</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-6xl font-bold mb-2">
                      <span className="bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent">
                        {alignmentScore}
                      </span>
                      <span className="text-3xl text-gray-400">%</span>
                    </div>
                    <p className="text-gray-600">
                      {alignmentScore >= 80 ? "高い一致度" : alignmentScore >= 60 ? "中程度の一致度" : "改善の余地あり"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Gap Ranking */}
        {hasManagerEvaluation && (topOverestimated.length > 0 || topUnderestimated.length > 0) && (
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {topOverestimated.length > 0 && (
              <Card className="border-yellow-200 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-yellow-50 to-yellow-100">
                  <CardTitle className="flex items-center gap-2 text-yellow-700">
                    <ArrowUp className="w-6 h-6" />
                    自己評価が高い項目 TOP5
                  </CardTitle>
                  <CardDescription>上長評価より高く評価している項目</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {topOverestimated.map((item, index) => (
                      <div key={index} className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-sm flex-1">{item.itemName}</h4>
                          <div className="flex items-center gap-2 ml-2">
                            <span className="text-orange-500 font-bold">{item.selfScore}</span>
                            <ArrowUp className="w-4 h-4 text-yellow-600" />
                            <span className="text-blue-500 font-bold">{item.managerScore}</span>
                            <span className="text-yellow-600 font-bold ml-2">(+{item.gap})</span>
                          </div>
                        </div>
                        {item.managerComment && (
                          <p className="text-xs text-gray-600 mt-2 pl-2 border-l-2 border-yellow-400">
                            💬 {item.managerComment}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {topUnderestimated.length > 0 && (
              <Card className="border-blue-200 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
                  <CardTitle className="flex items-center gap-2 text-blue-700">
                    <ArrowDown className="w-6 h-6" />
                    自己評価が低い項目 TOP5
                  </CardTitle>
                  <CardDescription>上長評価より低く評価している項目</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {topUnderestimated.map((item, index) => (
                      <div key={index} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-sm flex-1">{item.itemName}</h4>
                          <div className="flex items-center gap-2 ml-2">
                            <span className="text-orange-500 font-bold">{item.selfScore}</span>
                            <ArrowDown className="w-4 h-4 text-blue-600" />
                            <span className="text-blue-500 font-bold">{item.managerScore}</span>
                            <span className="text-blue-600 font-bold ml-2">({item.gap})</span>
                          </div>
                        </div>
                        {item.managerComment && (
                          <p className="text-xs text-gray-600 mt-2 pl-2 border-l-2 border-blue-400">
                            💬 {item.managerComment}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Radar Chart */}
        <Card className="mb-8 border-gray-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-blue-50">
            <CardTitle className="text-2xl flex items-center gap-2">
              <Flame className="w-6 h-6 text-orange-500" />
              成長の可視化
            </CardTitle>
            <CardDescription>
              カテゴリ別の評価を比較
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-8">
            <ResponsiveContainer width="100%" height={300} className="sm:h-[400px]">
              <RadarChart data={categoryScores}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis 
                  dataKey="category" 
                  tick={{ fill: '#6b7280', fontSize: 14 }}
                />
                <PolarRadiusAxis 
                  angle={90} 
                  domain={[0, 100]}
                  tick={{ fill: '#9ca3af', fontSize: 12 }}
                />
                <Radar
                  name="自己評価"
                  dataKey="self"
                  stroke="#FFB46E"
                  fill="#FFB46E"
                  fillOpacity={0.6}
                  strokeWidth={2}
                />
                {hasManagerEvaluation && (
                  <Radar
                    name="上長評価"
                    dataKey="manager"
                    stroke="#5CA7FF"
                    fill="#5CA7FF"
                    fillOpacity={0.6}
                    strokeWidth={2}
                  />
                )}
                <Legend 
                  wrapperStyle={{ paddingTop: '20px' }}
                  iconType="circle"
                />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Details */}
        <div className="space-y-6">
          {categories.map(category => {
            const categoryItems = items.filter(item => item.categoryId === category.id);
            const categoryEvaluations = evaluation.scores.filter(score => 
              categoryItems.some(item => item.id === score.itemId)
            );
            
            const selfTotal = categoryEvaluations.reduce((sum, score) => sum + score.selfScore, 0);
            const managerTotal = categoryEvaluations.reduce((sum, score) => sum + (score.managerScore || 0), 0);
            const maxScore = categoryItems.length * 5;
            const selfPercentage = Math.round((selfTotal / maxScore) * 100);
            const managerPercentage = managerTotal > 0 ? Math.round((managerTotal / maxScore) * 100) : null;

            return (
              <Card key={category.id} className="border-gray-200 shadow-md">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">{category.name}</CardTitle>
                      <CardDescription>{categoryItems.length}項目</CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-orange-500">
                        {selfPercentage}
                        <span className="text-lg text-gray-400">/100</span>
                      </div>
                      {managerPercentage !== null && (
                        <div className="text-sm text-blue-500">
                          上長評価: {managerPercentage}/100
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {categoryItems.map((item, index) => {
                      const itemEvaluation = evaluation.scores.find(score => score.itemId === item.id);
                      if (!itemEvaluation) return null;

                      const gap = itemEvaluation.managerScore !== null 
                        ? itemEvaluation.selfScore - itemEvaluation.managerScore 
                        : 0;

                      // Show only first 3 items by default, or all if showAllItems is true
                      if (!showAllItems && index >= 3) return null;

                      return (
                        <div key={item.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium">{item.name}</h4>
                              {itemEvaluation.selfComment && (
                                <p className="text-sm text-gray-600 mt-1">{itemEvaluation.selfComment}</p>
                              )}
                              {itemEvaluation.managerComment && (
                                <p className="text-sm text-blue-600 mt-1 pl-2 border-l-2 border-blue-400">
                                  💬 {itemEvaluation.managerComment}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-4 ml-4">
                              <div className="text-center">
                                <div className="text-2xl font-bold text-orange-500">
                                  {itemEvaluation.selfScore}
                                </div>
                                <div className="text-xs text-gray-500">自己</div>
                              </div>
                              {itemEvaluation.managerScore !== null && (
                                <>
                                  <div className={`flex items-center ${getGapColor(gap)}`}>
                                    {getGapIcon(gap)}
                                  </div>
                                  <div className="text-center">
                                    <div className="text-2xl font-bold text-blue-500">
                                      {itemEvaluation.managerScore}
                                    </div>
                                    <div className="text-xs text-gray-500">上長</div>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    {categoryItems.length > 3 && (
                      <Button
                        variant="ghost"
                        className="w-full"
                        onClick={() => setShowAllItems(!showAllItems)}
                      >
                        {showAllItems ? (
                          <>
                            <ChevronUp className="w-4 h-4 mr-2" />
                            閉じる
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-4 h-4 mr-2" />
                            すべて表示 ({categoryItems.length - 3}項目)
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Back Button */}
        <div className="flex justify-center mt-8 mb-12">
          <Button
            size="lg"
            onClick={() => setLocation("/dashboard")}
            className="bg-gradient-to-r from-orange-500 to-blue-500 hover:from-orange-600 hover:to-blue-600 text-white shadow-lg"
          >
            ダッシュボードに戻る
          </Button>
        </div>
      </div>
    </div>
  );
}
