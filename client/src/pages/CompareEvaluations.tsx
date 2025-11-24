import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, Flame, Loader2, TrendingUp } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend, CartesianGrid } from "recharts";
import { getCurrentPeriod, getPeriod, periodToString } from "@shared/periodUtils";

export default function CompareEvaluations() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  const categoriesQuery = trpc.evaluation.getCategories.useQuery();
  const itemsQuery = trpc.evaluation.getAllItems.useQuery();
  const evaluationsQuery = trpc.evaluation.getUserEvaluations.useQuery(
    { userId: user?.id || 0 },
    { enabled: !!user }
  );
  
  // 各評価の詳細データ（スコアを含む）を取得
  const evaluationDetailsQueries = trpc.useQueries((t) =>
    (evaluationsQuery.data || [])
      .filter(e => e.evaluationType === 'manager' && e.status === 'completed')
      .map(evaluation => 
        t.evaluation.getEvaluationDetails({ evaluationId: evaluation.id })
      )
  );

  const categories = categoriesQuery.data || [];
  const items = itemsQuery.data || [];
  const evaluations = evaluationsQuery.data || [];
  
  // 評価詳細データを平坦化
  const evaluationDetails = evaluationDetailsQueries
    .filter(q => q.data)
    .map(q => q.data!)
    .filter(detail => detail && detail.evaluationPeriod && detail.scores);

  // 期間ごとのスコアを集計
  const periodScores: Record<string, { period: string; totalScore: number; count: number }> = {};
  
  evaluationDetails.forEach(detail => {
    const period = detail.evaluationPeriod;
    if (!periodScores[period]) {
      periodScores[period] = {
        period,
        totalScore: 0,
        count: 0,
      };
    }
    
    detail.scores.forEach(score => {
      periodScores[period].totalScore += score.score;
      periodScores[period].count += 1;
    });
  });

  // グラフデータを生成
  const chartData = Object.values(periodScores)
    .map(ps => ({
      period: ps.period,
      score: ps.count > 0 ? Math.round((ps.totalScore / ps.count) * 100) / 100 : 0,
    }))
    .sort((a, b) => a.period.localeCompare(b.period));

  // カテゴリ別・期間別のスコアを集計
  const categoryPeriodScores: Record<string, { categoryId: number; period: string; totalScore: number; count: number }> = {};
  
  evaluationDetails.forEach(detail => {
    const period = detail.evaluationPeriod;
    
    detail.scores.forEach(score => {
      const item = items.find(i => i.id === score.itemId);
      if (!item) return;
      
      const key = `${item.categoryId}-${period}`;
      if (!categoryPeriodScores[key]) {
        categoryPeriodScores[key] = {
          categoryId: item.categoryId,
          period,
          totalScore: 0,
          count: 0,
        };
      }
      categoryPeriodScores[key].totalScore += score.score;
      categoryPeriodScores[key].count += 1;
    });
  });

  if (categoriesQuery.isLoading || itemsQuery.isLoading || evaluationsQuery.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-blue-50">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 py-8">
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
            <TrendingUp className="w-10 h-10 text-orange-500 animate-glow" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-blue-500 bg-clip-text text-transparent">
              評価期間の比較
            </h1>
          </div>
          <div className="w-24"></div>
        </div>

        {/* スコア推移グラフ */}
        <Card className="mb-8 border-orange-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-blue-50">
            <CardTitle className="flex items-center gap-2">
              <Flame className="w-6 h-6 text-orange-500" />
              スコア推移
            </CardTitle>
            <CardDescription>
              期間ごとの平均スコアの変化
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="period" 
                    stroke="#888"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    stroke="#888"
                    tick={{ fontSize: 12 }}
                    domain={[0, 5]}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      padding: '8px'
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#f97316" 
                    strokeWidth={3}
                    dot={{ fill: '#f97316', r: 6 }}
                    activeDot={{ r: 8 }}
                    name="平均スコア"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-12 text-gray-500">
                評価データがありません
              </div>
            )}
          </CardContent>
        </Card>

        {/* カテゴリ別比較 */}
        <div className="grid md:grid-cols-3 gap-6">
          {categories.map(category => {
            const categoryItems = items.filter(item => item.categoryId === category.id);
            
            // このカテゴリの期間別スコアを取得
            const categoryScores = chartData.map(data => {
              const key = `${category.id}-${data.period}`;
              const scoreData = categoryPeriodScores[key];
              return {
                period: data.period,
                score: scoreData && scoreData.count > 0 
                  ? Math.round((scoreData.totalScore / scoreData.count) * 100) / 100 
                  : 0,
              };
            });
            
            return (
              <Card key={category.id} className="border-gray-200 shadow-md">
                <CardHeader className="bg-gradient-to-r from-orange-50 to-blue-50">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Flame className="w-5 h-5 text-orange-500" />
                    {category.name}
                  </CardTitle>
                  <CardDescription>
                    {categoryItems.length}項目
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    {categoryScores.map(data => (
                      <div key={data.period} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{data.period}</span>
                        <span className="text-lg font-bold text-orange-500">
                          {data.score.toFixed(1)}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
