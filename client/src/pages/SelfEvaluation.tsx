import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { EvaluationCriteriaDialog } from "@/components/EvaluationCriteriaDialog";
import { trpc } from "@/lib/trpc";
import { Flame, Loader2, ArrowLeft, Info } from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { getCurrentPeriod, periodToString, type EvaluationPeriod } from "@shared/periodUtils";
import { PeriodSelector } from "@/components/PeriodSelector";

export default function SelfEvaluation() {
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
  const [selectedPeriod, setSelectedPeriod] = useState<EvaluationPeriod>(getCurrentPeriod());
  const [scores, setScores] = useState<{ [key: number]: number }>({});
  const [comments, setComments] = useState<{ [key: number]: string }>({});
  const [animatedItems, setAnimatedItems] = useState<Set<number>>(new Set());
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  const utils = trpc.useUtils();
  const categoriesQuery = trpc.evaluation.getCategories.useQuery();
  const itemsQuery = trpc.evaluation.getAllItems.useQuery();
  const submitMutation = trpc.evaluation.submitSelfEvaluation.useMutation();
  
  // Load existing evaluation for selected period
  const existingEvaluationQuery = trpc.evaluation.getMyEvaluationByPeriod.useQuery(
    {
      evaluationPeriod: periodToString(selectedPeriod),
      evaluationType: 'self',
    },
    {
      enabled: true,
    }
  );

  const categories = categoriesQuery.data || [];
  const items = itemsQuery.data || [];

  // Check if the period is locked
  const isLocked = existingEvaluationQuery.data?.isLocked === 1;

  // Load existing evaluation data when period changes
  useEffect(() => {
    const loadEvaluationData = async () => {
      if (!items.length) return;
      
      // Reset scores and comments
      const initialScores: { [key: number]: number } = {};
      const initialComments: { [key: number]: string } = {};
      
      items.forEach(item => {
        initialScores[item.id] = 3; // Default score
      });
      
      // Load existing evaluation if available
      if (existingEvaluationQuery.data) {
        const evaluationId = existingEvaluationQuery.data.id;
        const evaluationDetails = await utils.evaluation.getEvaluationDetails.fetch({ evaluationId });
        
        if (evaluationDetails?.scores) {
          evaluationDetails.scores.forEach((score: any) => {
            initialScores[score.itemId] = score.score;
            if (score.comment) {
              initialComments[score.itemId] = score.comment;
            }
          });
        }
      }
      
      setScores(initialScores);
      setComments(initialComments);
    };
    
    loadEvaluationData();
  }, [items, selectedPeriod, existingEvaluationQuery.data]);

  const handleScoreChange = (itemId: number, value: number[]) => {
    setScores(prev => ({ ...prev, [itemId]: value[0] }));
    
    // Animate the item
    setAnimatedItems(prev => new Set(prev).add(itemId));
    setTimeout(() => {
      setAnimatedItems(prev => {
        const next = new Set(prev);
        next.delete(itemId);
        return next;
      });
    }, 600);
  };

  const handleSubmit = async () => {
    if (!user) return;

    const evaluationPeriod = periodToString(selectedPeriod); // e.g., "2025-first"
    const scoresArray = Object.entries(scores).map(([itemId, score]) => ({
      itemId: parseInt(itemId),
      score,
      comment: comments[parseInt(itemId)] || undefined,
    }));

    try {
      await submitMutation.mutateAsync({
        evaluationPeriod,
        scores: scoresArray,
      });
      
      toast.success("評価を保存しました！", {
        description: "あなたの灯が記録されました✨",
      });
      
      setTimeout(() => {
        setLocation("/dashboard");
      }, 1500);
    } catch (error) {
      toast.error("保存に失敗しました", {
        description: "もう一度お試しください",
      });
    }
  };

  const getScoreLabel = (score: number) => {
    switch (score) {
      case 5: return "S";
      case 4: return "A";
      case 3: return "B";
      case 2: return "C";
      case 1: return "D";
      default: return "";
    }
  };

  const getScoreColor = (score: number) => {
    switch (score) {
      case 5: return "text-orange-500";
      case 4: return "text-blue-500";
      case 3: return "text-gray-600";
      case 2: return "text-yellow-600";
      case 1: return "text-red-500";
      default: return "text-gray-600";
    }
  };



  if (categoriesQuery.isLoading || itemsQuery.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-blue-50">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 py-8">
      <div className="container max-w-4xl">
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
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-3">
              <Flame className="w-10 h-10 text-orange-500 animate-glow" />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-blue-500 bg-clip-text text-transparent">
                自己評価
              </h1>
            </div>
            <PeriodSelector
              selectedPeriod={selectedPeriod}
              onPeriodChange={setSelectedPeriod}
              showStatus={true}
            />
          </div>
          <div className="w-24"></div>
        </div>



        {/* Evaluation Items by Category */}
        {categories.map(category => {
          const categoryItems = items.filter(item => item.categoryId === category.id);
          
          return (
            <Card key={category.id} className="mb-6 border-gray-200 shadow-md">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-blue-50">
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Flame className="w-6 h-6 text-orange-500" />
                  {category.name}
                </CardTitle>
                <CardDescription>
                  {categoryItems.length}項目
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                {categoryItems.map(item => {
                  const score = scores[item.id] || 3;
                  const isAnimated = animatedItems.has(item.id);
                  
                  return (
                    <div 
                      key={item.id} 
                      className={`p-4 rounded-lg border transition-all duration-300 ${
                        isAnimated 
                          ? 'border-orange-300 bg-orange-50 shadow-lg scale-105' 
                          : 'border-gray-200 bg-white'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3 gap-2">
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg mb-1">{item.name}</h4>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedItem(item)}
                            className="border-blue-300 text-blue-600 hover:bg-blue-50 w-full sm:w-auto mb-2 sm:mb-0"
                          >
                            <Info className="w-4 h-4 mr-1" />
                            <span className="text-xs sm:text-sm">基準を見る</span>
                          </Button>
                        </div>
                        <div className={`text-right ml-4 transition-all duration-300 ${isAnimated ? 'scale-125' : ''}`}>
                          <div className={`text-3xl font-bold ${getScoreColor(score)}`}>
                            {score}
                          </div>
                          <div className="text-xs text-gray-500">{getScoreLabel(score)}</div>
                        </div>
                      </div>

                      <Slider
                        value={[score]}
                        onValueChange={(value) => handleScoreChange(item.id, value)}
                        min={1}
                        max={5}
                        step={1}
                        className="mb-3"
                        disabled={isLocked}
                      />

                      <Textarea
                        placeholder="コメント（任意）"
                        value={comments[item.id] || ""}
                        onChange={(e) => setComments(prev => ({ ...prev, [item.id]: e.target.value }))}
                        className="mt-2 text-sm"
                        rows={2}
                        disabled={isLocked}
                      />
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          );
        })}

        {/* Submit Button */}
        <div className="flex gap-4 justify-center mt-8 mb-12">
          <Button
            variant="outline"
            size="lg"
            onClick={() => setLocation("/dashboard")}
            disabled={submitMutation.isPending}
          >
            キャンセル
          </Button>
          <Button
            size="lg"
            onClick={handleSubmit}
            disabled={submitMutation.isPending || isLocked}
            className="bg-gradient-to-r from-orange-500 to-blue-500 hover:from-orange-600 hover:to-blue-600 text-white shadow-lg"
          >
            {submitMutation.isPending ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                保存中...
              </>
            ) : (
              <>
                <Flame className="w-5 h-5 mr-2" />
                評価を保存
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Evaluation Criteria Dialog */}
      {selectedItem && (
        <EvaluationCriteriaDialog
          open={!!selectedItem}
          onOpenChange={(open) => !open && setSelectedItem(null)}
          itemName={selectedItem.name}
          criteria={{
            level5Description: selectedItem.level5Description,
            level4Description: selectedItem.level4Description,
            level3Description: selectedItem.level3Description,
            level2Description: selectedItem.level2Description,
            level1Description: selectedItem.level1Description,
          }}
        />
      )}
    </div>
  );
}
