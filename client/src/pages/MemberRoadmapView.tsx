import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, Loader2, MapPin, User, Calendar, Target } from "lucide-react";
import { Redirect, useLocation, useParams } from "wouter";
import { useEffect, useState } from "react";

export default function MemberRoadmapView() {
  const { user, loading, isAuthenticated } = useAuth();
  
  // デモ環境ではデモユーザーを使用
  const demoUser = {
    id: 1,
    username: "demo-user1",
    name: "デモユーザー1",
    role: "manager" as const,
    loginMethod: "local" as const
  };
  
  const displayUser = user || demoUser;
  const [, setLocation] = useLocation();
  const params = useParams();
  const userId = params.userId ? parseInt(params.userId) : null;
  
  // Get period from query string
  const [searchParams] = useState(() => new URLSearchParams(window.location.search));
  const period = searchParams.get('period') || '';

  const userQuery = trpc.users.getAll.useQuery(undefined, {
    enabled: true,
  });

  const roadmapQuery = trpc.roadmap.getByPeriod.useQuery(
    { evaluationPeriod: period, userId: userId || undefined },
    { enabled: !!userId && !!period }
  );

  const targetUser = userQuery.data?.find(u => u.id === userId);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-blue-50">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  // if (!isAuthenticated || !user) {
  //   return <Redirect to="/login" />;
  // }

  // if (user.role !== 'admin' && user.role !== 'manager') {
  //   return <Redirect to="/dashboard" />;
  // }

  if (!userId) {
    return <Redirect to="/member-roadmaps" />;
  }

  const longTermGoals = roadmapQuery.data?.goals.filter(g => g.stepId === null) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => setLocation("/member-roadmaps")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              戻る
            </Button>
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-orange-500 to-blue-500 bg-clip-text text-transparent flex items-center gap-2">
                <User className="h-6 w-6 text-orange-500" />
                {targetUser?.name}さんのキャリアマップ
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-2">
                <Calendar className="h-3 w-3" />
                {period}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {roadmapQuery.isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
          </div>
        ) : roadmapQuery.data ? (
          <div className="space-y-8">
            {/* Steps - Top Row */}
            <div className="overflow-x-auto pb-4">
              <div className="flex gap-6 min-w-max">
                {roadmapQuery.data.steps.map((step, stepIndex) => {
                  const stepGoals = roadmapQuery.data.goals.filter(g => g.stepId === step.id);
                  const completedGoals = stepGoals.filter(g => g.isCompleted === 1).length;
                  const totalGoals = stepGoals.length;
                  const progress = totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0;
                  
                  return (
                    <div key={step.id} className="w-80 flex-shrink-0">
                      <Card className="h-full border-2 border-orange-200 shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300">
                        <div className="bg-gradient-to-r from-orange-500 via-orange-600 to-yellow-500 p-6 relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
                          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
                          <div className="relative z-10">
                            <div className="flex items-center justify-between mb-2">
                              <CardTitle className="text-2xl text-white flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center font-bold text-sm">
                                  {step.stepNumber}
                                </div>
                                STEP {step.stepNumber}
                              </CardTitle>
                            </div>
                            {step.deadline && (
                              <div className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1 w-fit mb-2">
                                <Calendar className="h-3 w-3 text-white" />
                                <span className="text-white font-medium text-xs">{step.deadline}</span>
                              </div>
                            )}
                            <CardDescription className="text-orange-100 text-sm">
                              定性目標とマイルストーン
                            </CardDescription>
                            {totalGoals > 0 && (
                              <div className="mt-3">
                                <div className="flex items-center justify-between text-white text-xs mb-1">
                                  <span>進捗状況</span>
                                  <span className="font-bold">{completedGoals} / {totalGoals}</span>
                                </div>
                                <div className="w-full bg-white/20 rounded-full h-1.5 overflow-hidden">
                                  <div
                                    className="bg-white h-full rounded-full transition-all duration-500"
                                    style={{ width: `${progress}%` }}
                                  ></div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        <CardContent className="pt-6 space-y-4">
                          <div className="bg-gradient-to-br from-orange-50 to-yellow-50 p-4 rounded-lg border border-orange-200">
                            <h3 className="font-semibold text-xs text-muted-foreground uppercase tracking-wide mb-2">定性目標</h3>
                            <p className="text-base font-medium text-foreground leading-relaxed">
                              {step.title}
                            </p>
                          </div>
                          
                          {stepGoals.length > 0 && (
                            <div className="space-y-2">
                              <h3 className="font-semibold text-xs text-muted-foreground uppercase tracking-wide">定量目標</h3>
                              {stepGoals.map((goal) => (
                                <div key={goal.id} className="flex items-start gap-2 p-2 bg-white rounded-lg border border-orange-100">
                                  <Checkbox
                                    checked={goal.isCompleted === 1}
                                    disabled
                                    className="mt-0.5"
                                  />
                                  <p className={`flex-1 text-sm ${goal.isCompleted === 1 ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                                    {goal.goalText}
                                  </p>
                                </div>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Long Term Vision - Bottom Row (Centered) */}
            <div className="flex justify-center">
              <div className="w-full max-w-4xl">
                <Card className="border-2 border-blue-200 shadow-2xl overflow-hidden hover:shadow-3xl transition-shadow duration-300">
                  <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full -ml-32 -mb-32"></div>
                    <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                    <div className="relative z-10 text-center">
                      <CardTitle className="text-3xl sm:text-4xl text-white mb-3 flex items-center justify-center gap-3">
                        <Target className="h-10 w-10" />
                        LONG TERM VISION
                      </CardTitle>
                      <CardDescription className="text-blue-100 text-lg">長期ビジョン</CardDescription>
                    </div>
                  </div>
                  <CardContent className="pt-8 pb-8">
                    <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-50 p-8 rounded-xl mb-6 border-2 border-blue-200 shadow-inner">
                      <p className="text-xl sm:text-2xl font-semibold text-foreground leading-relaxed text-center">
                        {roadmapQuery.data.longTermVision}
                      </p>
                    </div>
                    
                    {longTermGoals.length > 0 && (
                      <div className="space-y-3 max-w-2xl mx-auto">
                        <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wide text-center mb-4">定量目標</h3>
                        {longTermGoals.map((goal) => (
                          <div key={goal.id} className="flex items-start gap-3 p-4 bg-white rounded-lg border-2 border-blue-100 hover:shadow-md transition-shadow">
                            <Checkbox
                              checked={goal.isCompleted === 1}
                              disabled
                              className="mt-1"
                            />
                            <p className={`flex-1 text-base ${goal.isCompleted === 1 ? 'line-through text-muted-foreground' : 'text-foreground font-medium'}`}>
                              {goal.goalText}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <MapPin className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-lg mb-2">ロードマップが作成されていません</p>
            <p className="text-sm text-muted-foreground">
              {targetUser?.name}さんがロードマップを作成すると、ここに表示されます。
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
