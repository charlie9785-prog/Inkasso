import React from 'react';
import {
  AlertTriangle,
  Clock,
  ChevronRight,
  Pause,
  Gavel,
} from 'lucide-react';
import { CaseWithCustomer } from '../../hooks/useCases';

interface AttentionNeededProps {
  cases: CaseWithCustomer[];
  isLoading?: boolean;
  onSelectCase: (caseId: string) => void;
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('sv-SE', {
    style: 'currency',
    currency: 'SEK',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const AttentionNeeded: React.FC<AttentionNeededProps> = ({
  cases,
  isLoading,
  onSelectCase,
}) => {
  // Filter cases that need attention
  const attentionCases = cases
    .filter((c) => {
      // Cases that need attention:
      // 1. Very overdue (> 30 days) and still in collection
      // 2. Paused cases (might need to be resumed)
      // 3. New cases that haven't started collection
      const isVeryOverdue = c.days_overdue > 30 && c.status === 'in_collection';
      const isPaused = c.status === 'paused';
      const isNew = c.status === 'pending' || c.status === 'new';
      const isHandedOff = c.status === 'handed_off';
      return isVeryOverdue || isPaused || isNew || isHandedOff;
    })
    .sort((a, b) => {
      // Sort by priority: paused first, then very overdue, then new
      const priorityOrder = { paused: 0, handed_off: 1, in_collection: 2, pending: 3, new: 3 };
      const aPriority = priorityOrder[a.status as keyof typeof priorityOrder] ?? 4;
      const bPriority = priorityOrder[b.status as keyof typeof priorityOrder] ?? 4;
      if (aPriority !== bPriority) return aPriority - bPriority;
      return b.days_overdue - a.days_overdue;
    })
    .slice(0, 5);

  const getAttentionInfo = (caseItem: CaseWithCustomer) => {
    if (caseItem.status === 'paused') {
      return {
        icon: Pause,
        color: 'amber',
        message: 'Pausad - behöver återupptas',
      };
    }
    if (caseItem.status === 'handed_off') {
      return {
        icon: Gavel,
        color: 'rose',
        message: 'Överlämnad till Kronofogden',
      };
    }
    if (caseItem.status === 'pending' || caseItem.status === 'new') {
      return {
        icon: Clock,
        color: 'blue',
        message: 'Ny - inkasso ej startad',
      };
    }
    if (caseItem.days_overdue > 60) {
      return {
        icon: AlertTriangle,
        color: 'rose',
        message: `${caseItem.days_overdue} dagar försenad`,
      };
    }
    return {
      icon: AlertTriangle,
      color: 'amber',
      message: `${caseItem.days_overdue} dagar försenad`,
    };
  };

  const colorClasses: Record<string, { bg: string; border: string; text: string }> = {
    amber: { bg: 'bg-amber-500/20', border: 'border-amber-500/30', text: 'text-amber-400' },
    rose: { bg: 'bg-rose-500/20', border: 'border-rose-500/30', text: 'text-rose-400' },
    blue: { bg: 'bg-blue-500/20', border: 'border-blue-500/30', text: 'text-blue-400' },
  };

  if (isLoading) {
    return (
      <div className="glass border border-white/10 rounded-xl p-6">
        <h3 className="text-lg font-display font-semibold text-white mb-4">
          Kräver uppmärksamhet
        </h3>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse p-3 rounded-lg bg-white/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10" />
                <div className="flex-1">
                  <div className="w-24 h-4 bg-white/10 rounded mb-1" />
                  <div className="w-32 h-3 bg-white/10 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (attentionCases.length === 0) {
    return (
      <div className="glass border border-white/10 rounded-xl p-6">
        <h3 className="text-lg font-display font-semibold text-white mb-4">
          Kräver uppmärksamhet
        </h3>
        <div className="flex flex-col items-center justify-center py-6 text-gray-500">
          <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center mb-3">
            <Clock className="w-6 h-6 text-emerald-400" />
          </div>
          <p className="text-sm">Inga ärenden kräver åtgärd</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass border border-white/10 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-display font-semibold text-white">
          Kräver uppmärksamhet
        </h3>
        <span className="text-xs px-2 py-1 rounded-full bg-amber-500/20 text-amber-400">
          {attentionCases.length} ärenden
        </span>
      </div>
      <div className="space-y-2">
        {attentionCases.map((caseItem) => {
          const attention = getAttentionInfo(caseItem);
          const colors = colorClasses[attention.color];
          const Icon = attention.icon;

          return (
            <button
              key={caseItem.id}
              onClick={() => onSelectCase(caseItem.id)}
              className="w-full p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/10 transition-all group text-left"
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg ${colors.bg} ${colors.border} border flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-4 h-4 ${colors.text}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium text-white truncate">
                      {caseItem.fortnox_invoice_number || caseItem.id.slice(0, 8)}
                    </span>
                    <span className="text-sm font-semibold text-white">
                      {formatCurrency(caseItem.remaining_amount_sek || 0)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2 mt-0.5">
                    <span className="text-xs text-gray-400 truncate">
                      {caseItem.customer_name}
                    </span>
                    <span className={`text-xs ${colors.text}`}>
                      {attention.message}
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-gray-400 transition-colors flex-shrink-0" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default AttentionNeeded;
