import React from 'react';
import { TrendingUp, TrendingDown, FileText, CheckCircle, Clock, DollarSign, Target, ArrowRight } from 'lucide-react';
import { StatsOverview as StatsOverviewType, PeriodComparison } from '../../types/dashboard';

interface StatsOverviewProps {
  stats: StatsOverviewType;
  periodComparison?: PeriodComparison;
  isLoading?: boolean;
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

const StatsOverview: React.FC<StatsOverviewProps> = ({ stats, periodComparison, isLoading }) => {
  const statCards = [
    {
      label: 'Totalt antal ärenden',
      value: stats.totalCases,
      icon: FileText,
      color: 'violet',
      format: 'number',
    },
    {
      label: 'Aktiva ärenden',
      value: stats.activeCases,
      icon: Clock,
      color: 'blue',
      format: 'number',
    },
    {
      label: 'Avslutade ärenden',
      value: stats.closedCases,
      icon: CheckCircle,
      color: 'emerald',
      format: 'number',
    },
    {
      label: 'Totalt belopp',
      value: stats.totalAmount,
      icon: DollarSign,
      color: 'cyan',
      format: 'currency',
    },
    {
      label: 'Återvunnet belopp',
      value: stats.collectedAmount,
      icon: TrendingUp,
      color: 'emerald',
      format: 'currency',
    },
    {
      label: 'Success rate',
      value: stats.successRate,
      icon: Target,
      color: 'violet',
      format: 'percent',
    },
  ];

  const colorConfig: Record<string, { bg: string; border: string; text: string; iconBg: string }> = {
    violet: {
      bg: 'bg-violet-500/10',
      border: 'border-violet-500/20',
      text: 'text-violet-400',
      iconBg: 'bg-violet-500/20',
    },
    blue: {
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
      text: 'text-blue-400',
      iconBg: 'bg-blue-500/20',
    },
    emerald: {
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      text: 'text-emerald-400',
      iconBg: 'bg-emerald-500/20',
    },
    cyan: {
      bg: 'bg-cyan-500/10',
      border: 'border-cyan-500/20',
      text: 'text-cyan-400',
      iconBg: 'bg-cyan-500/20',
    },
  };

  const formatValue = (value: number, format: string): string => {
    switch (format) {
      case 'currency':
        return formatCurrency(value);
      case 'percent':
        return `${value.toFixed(1)}%`;
      default:
        return value.toLocaleString('sv-SE');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Period comparison skeleton */}
        <div className="glass border border-white/10 rounded-xl p-6 animate-pulse">
          <div className="w-48 h-6 bg-white/5 rounded mb-4" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="p-4 rounded-lg bg-white/5">
                <div className="w-20 h-4 bg-white/5 rounded mb-2" />
                <div className="w-24 h-8 bg-white/5 rounded" />
              </div>
            ))}
          </div>
        </div>
        {/* Stats cards skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="glass border border-white/10 rounded-xl p-6 animate-pulse"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-white/5" />
                <div className="w-20 h-4 bg-white/5 rounded" />
              </div>
              <div className="w-24 h-8 bg-white/5 rounded mb-2" />
              <div className="w-32 h-4 bg-white/5 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const ComparisonIndicator = ({ change, invertColors = false }: { change: number; invertColors?: boolean }) => {
    const isPositive = change > 0;
    const isNegative = change < 0;

    // For some metrics like "days to collect", negative is good
    const goodDirection = invertColors ? isNegative : isPositive;
    const badDirection = invertColors ? isPositive : isNegative;

    if (change === 0) {
      return (
        <span className="text-xs text-gray-500 flex items-center gap-1">
          <ArrowRight className="w-3 h-3" />
          0%
        </span>
      );
    }

    return (
      <span className={`text-xs flex items-center gap-1 ${goodDirection ? 'text-emerald-400' : badDirection ? 'text-rose-400' : 'text-gray-400'}`}>
        {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
        {isPositive ? '+' : ''}{change.toFixed(1)}%
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Period Comparison Card */}
      {periodComparison && (
        <div className="glass border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-display font-semibold text-white">
              Denna månad vs förra
            </h3>
            <span className="text-xs text-gray-500">
              Jämförelse med föregående period
            </span>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Collected Amount */}
            <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-400">Återvunnet</span>
                <ComparisonIndicator change={periodComparison.collectedChange} />
              </div>
              <p className="text-xl font-bold text-white">
                {formatCompactCurrency(periodComparison.collectedAmount)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Förra: {formatCompactCurrency(periodComparison.collectedAmountPrev)}
              </p>
            </div>

            {/* Cases Resolved */}
            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-400">Avslutade</span>
                <ComparisonIndicator change={periodComparison.casesResolvedChange} />
              </div>
              <p className="text-xl font-bold text-white">
                {periodComparison.casesResolved}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Förra: {periodComparison.casesResolvedPrev}
              </p>
            </div>

            {/* New Cases */}
            <div className="p-4 rounded-lg bg-violet-500/10 border border-violet-500/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-400">Nya ärenden</span>
                <ComparisonIndicator change={periodComparison.newCasesChange} />
              </div>
              <p className="text-xl font-bold text-white">
                {periodComparison.newCases}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Förra: {periodComparison.newCasesPrev}
              </p>
            </div>

            {/* Average Days to Collect */}
            <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-400">Snitt handläggningstid</span>
                <ComparisonIndicator change={periodComparison.avgDaysChange} invertColors />
              </div>
              <p className="text-xl font-bold text-white">
                {periodComparison.avgDaysToCollect.toFixed(0)} dagar
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Förra: {periodComparison.avgDaysToCollectPrev.toFixed(0)} dagar
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          const colors = colorConfig[card.color];

          return (
            <div
              key={card.label}
              className={`group glass border border-white/10 rounded-xl p-6 hover:border-${card.color}-500/30 transition-all duration-300 hover:-translate-y-1`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl ${colors.iconBg} ${colors.border} border flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-6 h-6 ${colors.text}`} />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-display font-bold text-white">
                  {formatValue(card.value, card.format)}
                </p>
                <p className="text-sm text-gray-400">{card.label}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StatsOverview;
