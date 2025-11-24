import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, Plus, Trash2, Loader2, Save, MapPin, Target } from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { getCurrentPeriod, periodToString } from "@shared/periodUtils";
import { PeriodSelector } from "@/components/PeriodSelector";

type Goal = {
  id: string;
  stepId: number | null;
  goalText: string;
  isCompleted: number;
  displayOrder: number;
};

type Step = {
  id: string;
  stepNumber: number;
  title: string;
  deadline: string;
};

export default function Roadmap() {
  const { user } = useAuth();
  
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
  const [selectedPeriod, setSelectedPeriod] = useState(getCurrentPeriod());
  const [longTermVision, setLongTermVision] = useState("");
  const [steps, setSteps] = useState<Step[]>([
    { id: "step-1", stepNumber: 1, title: "", deadline: "" },
  ]);
  const [goals, setGoals] = useState<Goal[]>([]);

  const utils = trpc.useUtils();
  const roadmapQuery = trpc.roadmap.getByPeriod.useQuery(
    { evaluationPeriod: periodToString(selectedPeriod) },
    { enabled: true }
  );
  const saveMutation = trpc.roadmap.save.useMutation();

  // Load existing roadmap data
  useEffect(() => {
    if (roadmapQuery.data) {
      setLongTermVision(roadmapQuery.data.longTermVision);
      
      if (roadmapQuery.data.steps.length > 0) {
        setSteps(roadmapQuery.data.steps.map((step, index) => ({
          id: `step-${index + 1}`,
          stepNumber: step.stepNumber,
          title: step.title,
          deadline: step.deadline || "",
        })));
      }
      
      if (roadmapQuery.data.goals.length > 0) {
        setGoals(roadmapQuery.data.goals.map((goal, index) => ({
          id: `goal-${index + 1}`,
          stepId: goal.stepId,
          goalText: goal.goalText,
          isCompleted: goal.isCompleted,
          displayOrder: goal.displayOrder,
        })));
      }
    }
  }, [roadmapQuery.data]);

  const addStep = () => {
    const newStepNumber = steps.length + 1;
    setSteps([...steps, {
      id: `step-${Date.now()}`,
      stepNumber: newStepNumber,
      title: "",
      deadline: "",
    }]);
  };

  const removeStep = (stepId: string) => {
    const stepToRemove = steps.find(s => s.id === stepId);
    if (!stepToRemove) return;
    
    // Remove step
    const newSteps = steps.filter(s => s.id !== stepId).map((step, index) => ({
      ...step,
      stepNumber: index + 1,
    }));
    setSteps(newSteps);
    
    // Remove goals associated with this step
    setGoals(goals.filter(g => g.stepId !== stepToRemove.stepNumber));
  };

  const updateStep = (stepId: string, field: keyof Step, value: string) => {
    setSteps(steps.map(step =>
      step.id === stepId ? { ...step, [field]: value } : step
    ));
  };

  const addGoal = (stepId: number | null) => {
    const newGoal: Goal = {
      id: `goal-${Date.now()}`,
      stepId,
      goalText: "",
      isCompleted: 0,
      displayOrder: goals.filter(g => g.stepId === stepId).length,
    };
    setGoals([...goals, newGoal]);
  };

  const removeGoal = (goalId: string) => {
    setGoals(goals.filter(g => g.id !== goalId));
  };

  const updateGoal = (goalId: string, field: keyof Goal, value: any) => {
    setGoals(goals.map(goal =>
      goal.id === goalId ? { ...goal, [field]: value } : goal
    ));
  };

  const toggleGoalCompletion = (goalId: string) => {
    setGoals(goals.map(goal =>
      goal.id === goalId ? { ...goal, isCompleted: goal.isCompleted === 1 ? 0 : 1 } : goal
    ));
  };

  const handleSave = async () => {
    if (!longTermVision.trim()) {
      toast.error("長期ビジョンを入力してください");
      return;
    }

    if (steps.some(s => !s.title.trim())) {
      toast.error("全てのSTEPにタイトルを入力してください");
      return;
    }

    try {
      await saveMutation.mutateAsync({
        evaluationPeriod: periodToString(selectedPeriod),
        longTermVision,
        steps: steps.map(s => ({
          stepNumber: s.stepNumber,
          title: s.title,
          deadline: s.deadline || undefined,
        })),
        goals: goals.map((g, index) => ({
          stepId: g.stepId,
          goalText: g.goalText,
          isCompleted: g.isCompleted,
          displayOrder: index,
        })),
      });

      toast.success("ロードマップを保存しました");
      utils.roadmap.getByPeriod.invalidate();
    } catch (error) {
      toast.error("保存に失敗しました");
      console.error(error);
    }
  };

  if (roadmapQuery.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-blue-50">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  const longTermGoals = goals.filter(g => g.stepId === null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="sm" onClick={() => setLocation("/dashboard")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              戻る
            </Button>
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-orange-500 to-blue-500 bg-clip-text text-transparent flex items-center gap-2">
                <MapPin className="h-6 w-6 text-orange-500" />
                マイキャリアマップ
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground">半期分の個人ロードマップ</p>
            </div>
            <Button
              onClick={handleSave}
              disabled={saveMutation.isPending}
              className="bg-gradient-to-r from-orange-500 to-blue-500 hover:from-orange-600 hover:to-blue-600"
            >
              {saveMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  保存中...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  保存
                </>
              )}
            </Button>
          </div>
          <PeriodSelector
            selectedPeriod={selectedPeriod}
            onPeriodChange={setSelectedPeriod}
          />
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Steps - Top Row */}
          <div className="overflow-x-auto pb-4">
            <div className="flex gap-6 min-w-max">
              {steps.map((step, stepIndex) => {
                const stepGoals = goals.filter(g => g.stepId === step.stepNumber);
                
                return (
                  <div key={step.id} className="w-80 flex-shrink-0">
                    <Card className="h-full border-2 border-orange-200 shadow-lg hover:shadow-2xl transition-shadow duration-300">
                      <CardHeader className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-xl flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center font-bold text-sm">
                                {step.stepNumber}
                              </div>
                              STEP {step.stepNumber}
                            </CardTitle>
                            <CardDescription className="text-orange-100 text-sm">
                              定性目標とマイルストーン
                            </CardDescription>
                          </div>
                          {steps.length > 1 && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeStep(step.id)}
                              className="text-white hover:bg-white/20"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="pt-6 space-y-4">
                        <div>
                          <label className="text-xs font-semibold mb-2 block text-muted-foreground uppercase tracking-wide">定性目標</label>
                          <Input
                            placeholder="例：組織デザイン事業のビジネスモデルや方向性が定まっている状態"
                            value={step.title}
                            onChange={(e) => updateStep(step.id, "title", e.target.value)}
                            className="text-sm"
                          />
                        </div>
                        
                        <div>
                          <label className="text-xs font-semibold mb-2 block text-muted-foreground uppercase tracking-wide">期限</label>
                          <Input
                            placeholder="例：2025.11"
                            value={step.deadline}
                            onChange={(e) => updateStep(step.id, "deadline", e.target.value)}
                            className="text-sm"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-sm">定量目標</h3>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => addGoal(step.stepNumber)}
                            >
                              <Plus className="w-3 h-3 mr-1" />
                              追加
                            </Button>
                          </div>
                          {stepGoals.map((goal) => (
                            <div key={goal.id} className="flex items-start gap-2">
                              <Checkbox
                                checked={goal.isCompleted === 1}
                                onCheckedChange={() => toggleGoalCompletion(goal.id)}
                                className="mt-1"
                              />
                              <Input
                                placeholder="例：プロダクト開発におけるパートナーが決まっている状態"
                                value={goal.goalText}
                                onChange={(e) => updateGoal(goal.id, "goalText", e.target.value)}
                                className="flex-1 text-sm"
                              />
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => removeGoal(goal.id)}
                              >
                                <Trash2 className="w-3 h-3 text-destructive" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                );
              })}

              {/* Add Step Button */}
              <div className="w-80 flex-shrink-0">
                <Button
                  onClick={addStep}
                  variant="outline"
                  className="w-full h-full min-h-[400px] border-2 border-dashed border-orange-300 hover:border-orange-500 hover:bg-orange-50 flex flex-col items-center justify-center gap-4"
                >
                  <Plus className="w-8 h-8" />
                  <span className="text-lg font-semibold">STEPを追加</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Long Term Vision - Bottom Row (Centered) */}
          <div className="flex justify-center">
            <div className="w-full max-w-4xl">
              <Card className="border-2 border-blue-200 shadow-2xl hover:shadow-3xl transition-shadow duration-300">
                <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-8">
                  <div className="text-center">
                    <CardTitle className="text-3xl sm:text-4xl flex items-center justify-center gap-3 mb-2">
                      <Target className="h-10 w-10" />
                      LONG TERM VISION
                    </CardTitle>
                    <CardDescription className="text-blue-100 text-lg">長期ビジョン</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="pt-8 pb-8">
                  <Textarea
                    placeholder="例：2028年度に3億円の売上をたてられる状態"
                    value={longTermVision}
                    onChange={(e) => setLongTermVision(e.target.value)}
                    className="min-h-[120px] text-lg mb-6 text-center font-medium"
                  />
                  
                  <div className="space-y-3 max-w-2xl mx-auto">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wide">定量目標</h3>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => addGoal(null)}
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        追加
                      </Button>
                    </div>
                    {longTermGoals.map((goal) => (
                      <div key={goal.id} className="flex items-start gap-3 p-3 bg-white rounded-lg border-2 border-blue-100">
                        <Checkbox
                          checked={goal.isCompleted === 1}
                          onCheckedChange={() => toggleGoalCompletion(goal.id)}
                          className="mt-1"
                        />
                        <Input
                          placeholder="例：AI×SaaSプロダクトで1.5億円の売上"
                          value={goal.goalText}
                          onChange={(e) => updateGoal(goal.id, "goalText", e.target.value)}
                          className="flex-1 text-base"
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeGoal(goal.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
