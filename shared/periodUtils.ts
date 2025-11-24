/**
 * 評価期間ユーティリティ
 * 2025年度から半期単位で評価を管理
 * 6月末決算
 * 上期：7月～12月（7月スタート）
 * 下期：1月～6月（1月スタート）
 */

export type PeriodType = 'first' | 'second';

export interface EvaluationPeriod {
  year: number; // 年度（例：2025）
  type: PeriodType; // 'first' = 上期, 'second' = 下期
  displayName: string; // 表示名（例：「2025年度上期」）
  startMonth: number; // 開始月（上期=7, 下期=1）
  endMonth: number; // 終了月（上期=12, 下期=6）
}

/**
 * 現在の評価期間を取得
 */
export function getCurrentPeriod(): EvaluationPeriod {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // 0-indexed to 1-indexed

  // 2025年より前は2025年度上期として扱う
  if (currentYear < 2025) {
    return {
      year: 2025,
      type: 'first',
      displayName: '2025年度上期',
      startMonth: 7,
      endMonth: 12,
    };
  }

  // 7月～12月 = 上期
  if (currentMonth >= 7 && currentMonth <= 12) {
    return {
      year: currentYear,
      type: 'first',
      displayName: `${currentYear}年度上期`,
      startMonth: 7,
      endMonth: 12,
    };
  }
  // 1月～6月 = 下期（前年度）
  else {
    return {
      year: currentYear - 1,
      type: 'second',
      displayName: `${currentYear - 1}年度下期`,
      startMonth: 1,
      endMonth: 6,
    };
  }
}

/**
 * 評価期間文字列をパース
 * @param periodString 例: "2025-first", "2025-second"
 */
export function parsePeriodString(periodString: string): EvaluationPeriod | null {
  const parts = periodString.split('-');
  if (parts.length !== 2) return null;

  const year = parseInt(parts[0], 10);
  const type = parts[1] as PeriodType;

  if (isNaN(year) || (type !== 'first' && type !== 'second')) {
    return null;
  }

  return getPeriod(year, type);
}

/**
 * 指定された年度と期間タイプから評価期間を取得
 */
export function getPeriod(year: number, type: PeriodType): EvaluationPeriod {
  return {
    year,
    type,
    displayName: `${year}年度${type === 'first' ? '上期' : '下期'}`,
    startMonth: type === 'first' ? 7 : 1,
    endMonth: type === 'first' ? 12 : 6,
  };
}

/**
 * 評価期間を文字列に変換（データベース保存用）
 * @returns 例: "2025-first", "2025-second"
 */
export function periodToString(period: EvaluationPeriod): string {
  return `${period.year}-${period.type}`;
}

/**
 * 利用可能な評価期間のリストを取得（2025年度上期から現在まで）
 */
export function getAvailablePeriods(): EvaluationPeriod[] {
  const periods: EvaluationPeriod[] = [];
  const current = getCurrentPeriod();
  
  // 2025年度上期からスタート
  let year = 2025;
  let type: PeriodType = 'first';

  while (true) {
    const period = getPeriod(year, type);
    periods.push(period);

    // 現在の期間に到達したら終了
    if (period.year === current.year && period.type === current.type) {
      break;
    }

    // 次の期間へ
    if (type === 'first') {
      type = 'second';
    } else {
      type = 'first';
      year++;
    }

    // 安全装置：未来の期間は含めない
    if (year > current.year + 1) {
      break;
    }
  }

  return periods.reverse(); // 新しい順に並べる
}

/**
 * 評価期間の比較（ソート用）
 */
export function comparePeriods(a: EvaluationPeriod, b: EvaluationPeriod): number {
  if (a.year !== b.year) {
    return b.year - a.year; // 新しい年度が先
  }
  // 同じ年度の場合、下期が先
  return a.type === 'second' ? -1 : 1;
}
