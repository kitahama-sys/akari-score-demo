import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getCurrentPeriod, getPeriod, periodToString, type EvaluationPeriod } from "@shared/periodUtils";
import { Calendar, CheckCircle2, Circle, Clock } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

interface PeriodSelectorProps {
  selectedPeriod: EvaluationPeriod;
  onPeriodChange: (period: EvaluationPeriod) => void;
  showStatus?: boolean;
}

// ステータスアイコンを表示するコンポーネント
function StatusIcon({ status }: { status: 'draft' | 'submitted' | 'completed' }) {
  if (status === 'completed') {
    return <CheckCircle2 className="w-4 h-4 text-green-500" />;
  } else if (status === 'submitted') {
    return <Clock className="w-4 h-4 text-orange-500" />;
  } else {
    return <Circle className="w-4 h-4 text-gray-300" />;
  }
}

// 期間アイテムコンポーネント
function PeriodItem({
  period,
  periodString,
  isCurrent,
  showStatus,
  userId,
}: {
  period: EvaluationPeriod;
  periodString: string;
  isCurrent: boolean;
  showStatus: boolean;
  userId?: number;
}) {
  const { data: statusData } = trpc.evaluation.getEvaluationStatus.useQuery(
    { userId: userId!, evaluationPeriod: periodString },
    { enabled: showStatus && !!userId }
  );

  return (
    <SelectItem value={periodString}>
      <div className="flex items-center gap-2">
        {showStatus && statusData && (
          <StatusIcon status={statusData.selfStatus as 'draft' | 'submitted' | 'completed'} />
        )}
        <span>{period.displayName}</span>
        {isCurrent && (
          <span className="text-xs text-orange-500 font-semibold">（現在）</span>
        )}
      </div>
    </SelectItem>
  );
}

export function PeriodSelector({ selectedPeriod, onPeriodChange, showStatus = false }: PeriodSelectorProps) {
  const currentPeriod = getCurrentPeriod();
  const { user } = useAuth();
  
  // 2025年度から現在までの期間リストを生成
  const periods: EvaluationPeriod[] = [];
  const currentYear = new Date().getFullYear();
  
  for (let year = 2025; year <= currentYear; year++) {
    periods.push(getPeriod(year, 'first'));
    periods.push(getPeriod(year, 'second'));
  }
  
  // 現在の期間より未来の期間を除外
  const availablePeriods = periods.filter(period => {
    const periodValue = period.year * 10 + (period.type === 'first' ? 1 : 2);
    const currentValue = currentPeriod.year * 10 + (currentPeriod.type === 'first' ? 1 : 2);
    return periodValue <= currentValue;
  }).reverse(); // 新しい順に並べ替え

  const handlePeriodChange = (value: string) => {
    const [year, type] = value.split('-');
    const period = getPeriod(parseInt(year), type as 'first' | 'second');
    onPeriodChange(period);
  };

  return (
    <Select
      value={periodToString(selectedPeriod)}
      onValueChange={handlePeriodChange}
    >
      <SelectTrigger className="w-[200px] border-orange-200 focus:ring-orange-500">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-orange-500" />
          <SelectValue />
        </div>
      </SelectTrigger>
      <SelectContent>
        {availablePeriods.map((period) => {
          const periodString = periodToString(period);
          const isCurrent = periodString === periodToString(currentPeriod);
          
          return (
            <PeriodItem
              key={periodString}
              period={period}
              periodString={periodString}
              isCurrent={isCurrent}
              showStatus={showStatus}
              userId={user?.id}
            />
          );
        })}
      </SelectContent>
    </Select>
  );
}
