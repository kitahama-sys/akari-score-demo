import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, Calendar, Flame, Loader2, TrendingUp } from "lucide-react";
import { Redirect, useLocation } from "wouter";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { parsePeriodString, comparePeriods } from "@shared/periodUtils";

export default function History() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  
  // デモ環境ではデモユーザーを使用
  const demoUser = {
    id: 1,
    username: "demo-user1",
    name: "デモユーザー1",
    role: "user" as const,
    loginMethod: "local" as const
  };
  
  const displayUser = user || demoUser;
  const [, setLocation] = useLocation();

  const evaluationsQuery = trpc.evaluation.getMyEvaluations.useQuery(undefined, {
    enabled: true,
  });

  const itemsQuery = trpc.evaluation.getAllItems.useQuery();

  if (authLoading || evaluationsQuery.isLoading || itemsQuery.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-blue-50">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  // if (!isAuthenticated || !user) {
  //   return <Redirect to="/" />;
  // }

  const evaluations = evaluationsQuery.data || [];
  const items = itemsQuery.data || [];
  const maxScore = items.length * 5;

  // Group evaluations by period
  const evaluationsByPeriod: { [key: string]: any[] } = {};
  evaluations.forEach(evaluation => {
    const period = evaluation.evaluationPeriod;
    if (!evaluationsByPeriod[period]) {
      evaluationsByPeriod[period] = [];
    }
    evaluationsByPeriod[period].push(evaluation);
  });

  // Prepare chart data
  const chartData = Object.keys(evaluationsByPeriod)
    .map(periodString => {
      const period = parsePeriodString(periodString);
      return { periodString, period };
    })
    .filter(item => item.period !== null)
    .sort((a, b) => comparePeriods(b.period!, a.period!)) // 新しい順
    .reverse() // チャート用に古い順に並べ替え
    .map(({ periodString, period }) => {
      const periodEvaluations = evaluationsByPeriod[periodString];
      const selfEvaluation = periodEvaluations.find((e: any) => e.evaluationType === 'self');
      const managerEvaluation = periodEvaluations.find((e: any) => e.evaluationType === 'manager');

      // Calculate total scores (we'll need to fetch scores separately in real implementation)
      // For now, using placeholder calculation
      const selfScore = selfEvaluation ? 75 : 0; // Placeholder
      const managerScore = managerEvaluation ? 70 : 0; // Placeholder

      return {
        period: period?.displayName || periodString,
        自己評価: selfScore,
        上長評価: managerScore > 0 ? managerScore : null,
      };
    });

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
            <Calendar className="w-10 h-10 text-orange-500 animate-glow" />
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-blue-500 bg-clip-text text-transparent">
                評価履歴
              </h1>
              <p className="text-sm text-gray-600">あなたの成長の軌跡</p>
            </div>
          </div>
          <div className="w-24"></div>
        </div>

        {evaluations.length === 0 ? (
          <Card className="border-gray-200">
            <CardContent className="py-12 text-center">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">
                まだ評価履歴がありません
              </p>
              <Button onClick={() => setLocation("/self-evaluation")}>
                自己評価を始める
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Growth Chart */}
            {chartData.length > 1 && (
              <Card className="mb-8 border-gray-200 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-orange-50 to-blue-50">
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <TrendingUp className="w-6 h-6 text-orange-500" />
                    成長の推移
                  </CardTitle>
                  <CardDescription>
                    評価スコアの変化を確認
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-8">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis 
                        dataKey="period" 
                        tick={{ fill: '#6b7280', fontSize: 12 }}
                      />
                      <YAxis 
                        domain={[0, 100]}
                        tick={{ fill: '#6b7280', fontSize: 12 }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px'
                        }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="自己評価"
                        stroke="#FFB46E"
                        strokeWidth={3}
                        dot={{ fill: '#FFB46E', r: 5 }}
                        activeDot={{ r: 7 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="上長評価"
                        stroke="#5CA7FF"
                        strokeWidth={3}
                        dot={{ fill: '#5CA7FF', r: 5 }}
                        activeDot={{ r: 7 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}

            {/* Evaluation List */}
            <div className="space-y-6">
              {Object.keys(evaluationsByPeriod)
                .map(periodString => {
                  const period = parsePeriodString(periodString);
                  return { periodString, period };
                })
                .filter(item => item.period !== null)
                .sort((a, b) => comparePeriods(a.period!, b.period!)) // 新しい順
                .map(({ periodString, period }) => {
                  const periodEvaluations = evaluationsByPeriod[periodString];
                  const selfEvaluation = periodEvaluations.find((e: any) => e.evaluationType === 'self');
                  const managerEvaluation = periodEvaluations.find((e: any) => e.evaluationType === 'manager');

                  return (
                    <Card key={periodString} className="border-gray-200 shadow-md">
                      <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-xl flex items-center gap-2">
                              <Calendar className="w-5 h-5 text-orange-500" />
                              {period?.displayName || periodString}
                            </CardTitle>
                            <CardDescription>
                              {period ? `${period.startMonth}月～${period.endMonth}月` : periodString}
                            </CardDescription>
                          </div>
                          <div className="flex gap-4">
                            {selfEvaluation && (
                              <div className="text-center">
                                <div className="text-3xl font-bold text-orange-500">
                                  75
                                  <span className="text-lg text-gray-400">/100</span>
                                </div>
                                <div className="text-xs text-gray-500">自己評価</div>
                              </div>
                            )}
                            {managerEvaluation && (
                              <div className="text-center">
                                <div className="text-3xl font-bold text-blue-500">
                                  70
                                  <span className="text-lg text-gray-400">/100</span>
                                </div>
                                <div className="text-xs text-gray-500">上長評価</div>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <div className="grid md:grid-cols-2 gap-4">
                          {selfEvaluation && (
                            <div className="p-4 bg-orange-50 rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <Flame className="w-5 h-5 text-orange-500" />
                                <h4 className="font-semibold">自己評価</h4>
                              </div>
                              <p className="text-sm text-gray-600">
                                提出日: {new Date(selfEvaluation.submittedAt || '').toLocaleDateString('ja-JP')}
                              </p>
                              <p className="text-sm text-gray-600">
                                ステータス: {selfEvaluation.status === 'submitted' ? '提出済み' : '完了'}
                              </p>
                            </div>
                          )}
                          {managerEvaluation && (
                            <div className="p-4 bg-blue-50 rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <TrendingUp className="w-5 h-5 text-blue-500" />
                                <h4 className="font-semibold">上長評価</h4>
                              </div>
                              <p className="text-sm text-gray-600">
                                提出日: {new Date(managerEvaluation.submittedAt || '').toLocaleDateString('ja-JP')}
                              </p>
                              <p className="text-sm text-gray-600">
                                ステータス: {managerEvaluation.status === 'completed' ? '完了' : '提出済み'}
                              </p>
                            </div>
                          )}
                        </div>
                        <div className="mt-4 flex justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setLocation("/results")}
                          >
                            詳細を見る
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
            </div>
          </>
        )}

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
