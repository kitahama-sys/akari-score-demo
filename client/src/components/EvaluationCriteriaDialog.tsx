import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface EvaluationCriteriaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemName: string;
  criteria: {
    level5Description: string;
    level4Description: string;
    level3Description: string;
    level2Description: string;
    level1Description: string;
  };
}

export function EvaluationCriteriaDialog({
  open,
  onOpenChange,
  itemName,
  criteria,
}: EvaluationCriteriaDialogProps) {
  const levels = [
    { score: 5, label: "S", description: criteria.level5Description, color: "bg-orange-500 text-white" },
    { score: 4, label: "A", description: criteria.level4Description, color: "bg-blue-500 text-white" },
    { score: 3, label: "B", description: criteria.level3Description, color: "bg-gray-500 text-white" },
    { score: 2, label: "C", description: criteria.level2Description, color: "bg-yellow-500 text-white" },
    { score: 1, label: "D", description: criteria.level1Description, color: "bg-red-500 text-white" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{itemName}</DialogTitle>
          <DialogDescription>
            評価基準の詳細説明
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          {levels.map((level) => (
            <div key={level.score} className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge className={level.color}>
                  {level.label}（{level.score}点）
                </Badge>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                {level.description}
              </p>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
