import React, { useMemo } from 'react';
import { Clock, TrendingUp, AlertTriangle, Loader2 } from 'lucide-react';
import { CaseWithCustomer } from '../../hooks/useCases';

interface AgeAnalysisProps {
  cases: CaseWithCustomer[];
  isLoading?: boolean;
  onSelectBucket?: (minDays: number, maxDays: number | null) => void;
}

interface AgeBucket {
  label: string;
  minDays: number;
  maxDays: number | null;
  color: string;
  count: number;
  amount: number;
  percentage: number;
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('sv-SE', {
    style: 'currency',
    currency: 'SEK',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatCompactCurrency = (amount: number): string => {
  if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(1)} mkr`;
  }
  if (amount >= 1000) {
    return `${(amount / 1000).toFixed(0)} tkr`;
  }
  return formatCurrency(amount);
};

const AgeAnalysis: React.FC<AgeAnalysisProps> = ({ cases, isLoading, onSelectBucket }) => {
  // Calculate age buckets
  const { buckets, totalAmount, totalCount } = useMemo(() => {
    const bucketDefs = [
      { label: '0-30 dagar', minDays: 0, maxDays: 30, color: 'emerald' },
      { label: '31-60 dagar', minDays: 31, maxDays: 60, color: 'blue' },
      { label: '61-90 dagar', minDays: 61, maxDays: 90, color: 'amber' },
      { label: '91-180 dagar', minDays: 91, maxDays: 180, color: 'orange' },
      { label: '180+ dagar', minDays: 181, maxDays: null, color: 'rose' },
    ];

    // Only count active cases (not paid or cancelled)
    const activeCases = cases.filter((c) =>
      !['paid', 'cancelled'].includes(c.status)
    );

    let total = 0;
    let count = 0;

    const calculated = bucketDefs.map((def) => {
      const inBucket = activeCases.filter((c) => {
        if (def.maxDays === null) {
          return c.days_overdue >= def.minDays;
        }
        return c.days_overdue >= def.minDays && c.days_overdue <= def.maxDays;
      });

      const bucketAmount = inBucket.reduce((sum, c) => sum + (c.remaining_amount_sek || 0), 0);
      total += bucketAmount;
      count += inBucket.length;

      return {
        ...def,
        count: inBucket.length,
        amount: bucketAmount,
        percentage: 0, // Will calculate after
      };
    });

    // Calculate percentages
    calculated.forEach((bucket) => {
      bucket.percentage = total > 0 ? (bucket.amount / total) * 100 : 0;
    });

    return { buckets: calculated, totalAmount: total, totalCount: count };
  }, [cases]);

  const colorClasses: Record<string, { bg: string; text: string; border: string; barBg: string }> = {
    emerald: {
      bg: 'bg-emerald-500/20',
      text: 'text-emerald-400',
      border: 'border-emerald-500/30',
      barBg: 'bg-emerald-500',
    },
    blue: {
      bg: 'bg-blue-500/20',
      text: 'text-blue-400',
      border: 'border-blue-500/30',
      barBg: 'bg-blue-500',
    },
    amber: {
      bg: 'bg-amber-500/20',
      text: 'text-amber-400',
      border: 'border-amber-500/30',
      barBg: 'bg-amber-500',
    },
    orange: {
      bg: 'bg-orange-500/20',
      text: 'text-orange-400',
      border: 'border-orange-500/30',
      barBg: 'bg-orange-500',
    },
    rose: {
      bg: 'bg-rose-500/20',
      text: 'text-rose-400',
      border: 'border-rose-500/30',
      barBg: 'bg-rose-500',
    },
  };

  if (isLoading) {
    return (
      <div className="glass border border-white/10 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
            <Clock className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h3 className="text-lg font-display font-semibold text-white">Åldersanalys</h3>
            <p className="text-sm text-gray-500">Skulder per ålderskategori</p>
          </div>
        </div>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="glass border border-white/10 rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
            <Clock className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h3 className="text-lg font-display font-semibold text-white">Åldersanalys</h3>
            <p className="text-sm text-gray-500">Skulder per ålderskategori</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold text-white">{formatCompactCurrency(totalAmount)}</p>
          <p className="text-xs text-gray-500">{totalCount} ärenden</p>
        </div>
      </div>

      {/* Summary Bar */}
      <div className="h-4 rounded-full bg-white/10 overflow-hidden flex mb-6">
        {buckets.map((bucket) => {
          const colors = colorClasses[bucket.color];
          if (bucket.percentage === 0) return null;
          return (
            <div
              key={bucket.label}
              className={`${colors.barBg} transition-all`}
              style={{ width: `${bucket.percentage}%` }}
              title={`${bucket.label}: ${formatCurrency(bucket.amount)}`}
            />
          );
        })}
      </div>

      {/* Bucket List */}
      <div className="space-y-3">
        {buckets.map((bucket) => {
          const colors = colorClasses[bucket.color];
          const hasData = bucket.count > 0;

          return (
            <button
              key={bucket.label}
              onClick={() => onSelectBucket && onSelectBucket(bucket.minDays, bucket.maxDays)}
              disabled={!hasData || !onSelectBucket}
              className={`w-full p-4 rounded-lg border transition-all ${
                hasData
                  ? `${colors.bg} ${colors.border} hover:border-white/30 cursor-pointer`
                  : 'bg-white/5 border-white/10 opacity-50 cursor-default'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${colors.barBg}`} />
                  <span className="text-sm font-medium text-white">{bucket.label}</span>
                </div>
                <span className={`text-sm font-semibold ${hasData ? colors.text : 'text-gray-500'}`}>
                  {bucket.count} ärenden
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${colors.barBg} rounded-full transition-all`}
                      style={{ width: `${bucket.percentage}%` }}
                    />
                  </div>
                </div>
                <span className="ml-4 text-sm font-semibold text-white min-w-[80px] text-right">
                  {formatCompactCurrency(bucket.amount)}
                </span>
              </div>
              <div className="mt-1 text-xs text-gray-500 text-right">
                {bucket.percentage.toFixed(1)}% av totalt
              </div>
            </button>
          );
        })}
      </div>

      {/* Warning for old debts */}
      {buckets.find((b) => b.minDays >= 91 && b.count > 0) && (
        <div className="mt-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-amber-200">
              {buckets.filter((b) => b.minDays >= 91).reduce((sum, b) => sum + b.count, 0)} ärenden är mer än 90 dagar gamla
            </p>
            <p className="text-xs text-amber-300/70 mt-1">
              Äldre skulder kan vara svårare att driva in
            </p>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-white/10">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <TrendingUp className="w-4 h-4" />
          <span>Baserat på antal dagar sedan förfallodatum</span>
        </div>
      </div>
    </div>
  );
};

export default AgeAnalysis;
