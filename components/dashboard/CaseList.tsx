import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  ChevronRight,
  Clock,
  CheckCircle,
  AlertCircle,
  Gavel,
  Loader2,
  Pause,
  X,
  ArrowUpDown,
  Calendar,
  Banknote,
} from 'lucide-react';
import { CaseWithCustomer } from '../../hooks/useCases';

interface CaseListProps {
  cases: CaseWithCustomer[];
  isLoading?: boolean;
  onSelectCase: (caseId: string) => void;
  selectedCaseId?: string;
}

const statusConfig: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  new: { label: 'Ny', color: 'blue', icon: Clock },
  pending: { label: 'Väntande', color: 'blue', icon: Clock },
  active: { label: 'Aktiv', color: 'amber', icon: AlertCircle },
  in_collection: { label: 'Under bevakning', color: 'violet', icon: AlertCircle },
  paused: { label: 'Pausad', color: 'gray', icon: Pause },
  paid: { label: 'Betald', color: 'emerald', icon: CheckCircle },
  closed: { label: 'Avslutad', color: 'gray', icon: CheckCircle },
  legal: { label: 'Rättslig', color: 'rose', icon: Gavel },
  handed_off: { label: 'Överlämnad', color: 'rose', icon: Gavel },
  cancelled: { label: 'Avbruten', color: 'gray', icon: X },
};

const colorClasses: Record<string, { bg: string; text: string; border: string }> = {
  blue: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30' },
  amber: { bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/30' },
  emerald: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/30' },
  gray: { bg: 'bg-gray-500/20', text: 'text-gray-400', border: 'border-gray-500/30' },
  rose: { bg: 'bg-rose-500/20', text: 'text-rose-400', border: 'border-rose-500/30' },
  violet: { bg: 'bg-violet-500/20', text: 'text-violet-400', border: 'border-violet-500/30' },
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('sv-SE', {
    style: 'currency',
    currency: 'SEK',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('sv-SE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

type SortField = 'due_date' | 'amount' | 'days_overdue' | 'customer_name';
type SortDirection = 'asc' | 'desc';

interface CaseFilters {
  status?: string;
  search?: string;
  minAmount?: number;
  maxAmount?: number;
  minDaysOverdue?: number;
  maxDaysOverdue?: number;
  dateFrom?: string;
  dateTo?: string;
}

const CaseList: React.FC<CaseListProps> = ({
  cases,
  isLoading,
  onSelectCase,
  selectedCaseId,
}) => {
  const [filters, setFilters] = useState<CaseFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  const [sortField, setSortField] = useState<SortField>('due_date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.status) count++;
    if (filters.minAmount || filters.maxAmount) count++;
    if (filters.minDaysOverdue || filters.maxDaysOverdue) count++;
    if (filters.dateFrom || filters.dateTo) count++;
    return count;
  }, [filters]);

  // Filter and sort cases
  const filteredCases = useMemo(() => {
    let result = cases.filter((c) => {
      // Status filter
      if (filters.status && c.status !== filters.status) return false;

      // Search filter
      if (filters.search) {
        const search = filters.search.toLowerCase();
        const matchesInvoice = c.fortnox_invoice_number?.toLowerCase().includes(search);
        const matchesCustomer = c.customer_name?.toLowerCase().includes(search);
        const matchesOrgNumber = c.customer_org_number?.toLowerCase().includes(search);
        if (!matchesInvoice && !matchesCustomer && !matchesOrgNumber) return false;
      }

      // Amount filter
      const amount = c.remaining_amount_sek || 0;
      if (filters.minAmount && amount < filters.minAmount) return false;
      if (filters.maxAmount && amount > filters.maxAmount) return false;

      // Days overdue filter
      if (filters.minDaysOverdue && c.days_overdue < filters.minDaysOverdue) return false;
      if (filters.maxDaysOverdue && c.days_overdue > filters.maxDaysOverdue) return false;

      // Date filter
      if (filters.dateFrom) {
        const dueDate = new Date(c.due_date);
        const fromDate = new Date(filters.dateFrom);
        if (dueDate < fromDate) return false;
      }
      if (filters.dateTo) {
        const dueDate = new Date(c.due_date);
        const toDate = new Date(filters.dateTo);
        if (dueDate > toDate) return false;
      }

      return true;
    });

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'due_date':
          comparison = new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
          break;
        case 'amount':
          comparison = (a.remaining_amount_sek || 0) - (b.remaining_amount_sek || 0);
          break;
        case 'days_overdue':
          comparison = a.days_overdue - b.days_overdue;
          break;
        case 'customer_name':
          comparison = (a.customer_name || '').localeCompare(b.customer_name || '');
          break;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [cases, filters, sortField, sortDirection]);

  const clearFilters = () => {
    setFilters({});
  };

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  if (isLoading) {
    return (
      <div className="glass border border-white/10 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <h3 className="text-lg font-display font-semibold text-white">Ärenden</h3>
        </div>
        <div className="p-8 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="glass border border-white/10 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Sök fakturanummer, gäldenär eller org.nummer..."
              value={filters.search || ''}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full h-10 pl-10 pr-4 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-violet-500/50 transition-colors"
            />
            {filters.search && (
              <button
                onClick={() => setFilters({ ...filters, search: '' })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 h-10 rounded-lg border transition-colors ${
              showFilters || activeFilterCount > 0
                ? 'bg-violet-500/20 border-violet-500/30 text-violet-400'
                : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
            }`}
          >
            <Filter className="w-4 h-4" />
            <span className="text-sm">Filter</span>
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-violet-500 text-white text-xs flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Filter Options */}
        {showFilters && (
          <div className="mt-4 space-y-4">
            {/* Status Filter */}
            <div>
              <label className="text-xs text-gray-500 mb-2 block">Status</label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilters({ ...filters, status: undefined })}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    !filters.status
                      ? 'bg-violet-500/20 border border-violet-500/30 text-violet-400'
                      : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white'
                  }`}
                >
                  Alla
                </button>
                {Object.entries(statusConfig).map(([status, config]) => (
                  <button
                    key={status}
                    onClick={() => setFilters({ ...filters, status })}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                      filters.status === status
                        ? `${colorClasses[config.color].bg} border ${colorClasses[config.color].border} ${colorClasses[config.color].text}`
                        : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white'
                    }`}
                  >
                    {config.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Amount and Days Overdue Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Amount Range */}
              <div>
                <label className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                  <Banknote className="w-3 h-3" />
                  Belopp (SEK)
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minAmount || ''}
                    onChange={(e) => setFilters({ ...filters, minAmount: e.target.value ? Number(e.target.value) : undefined })}
                    className="w-full h-9 px-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-violet-500/50"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxAmount || ''}
                    onChange={(e) => setFilters({ ...filters, maxAmount: e.target.value ? Number(e.target.value) : undefined })}
                    className="w-full h-9 px-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-violet-500/50"
                  />
                </div>
              </div>

              {/* Days Overdue Range */}
              <div>
                <label className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Dagar försenad
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minDaysOverdue || ''}
                    onChange={(e) => setFilters({ ...filters, minDaysOverdue: e.target.value ? Number(e.target.value) : undefined })}
                    className="w-full h-9 px-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-violet-500/50"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxDaysOverdue || ''}
                    onChange={(e) => setFilters({ ...filters, maxDaysOverdue: e.target.value ? Number(e.target.value) : undefined })}
                    className="w-full h-9 px-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-violet-500/50"
                  />
                </div>
              </div>

              {/* Date From */}
              <div>
                <label className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Förfallodatum från
                </label>
                <input
                  type="date"
                  value={filters.dateFrom || ''}
                  onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value || undefined })}
                  className="w-full h-9 px-3 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500/50"
                />
              </div>

              {/* Date To */}
              <div>
                <label className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Förfallodatum till
                </label>
                <input
                  type="date"
                  value={filters.dateTo || ''}
                  onChange={(e) => setFilters({ ...filters, dateTo: e.target.value || undefined })}
                  className="w-full h-9 px-3 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500/50"
                />
              </div>
            </div>

            {/* Clear Filters */}
            {activeFilterCount > 0 && (
              <button
                onClick={clearFilters}
                className="text-sm text-violet-400 hover:text-violet-300 transition-colors"
              >
                Rensa alla filter
              </button>
            )}
          </div>
        )}

        {/* Sort & Results Count */}
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Visar <span className="text-white font-medium">{filteredCases.length}</span> av{' '}
            <span className="text-white font-medium">{cases.length}</span> ärenden
          </p>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Sortera:</span>
            <div className="flex gap-1">
              {[
                { field: 'due_date' as SortField, label: 'Datum' },
                { field: 'amount' as SortField, label: 'Belopp' },
                { field: 'days_overdue' as SortField, label: 'Försenad' },
                { field: 'customer_name' as SortField, label: 'Namn' },
              ].map((option) => (
                <button
                  key={option.field}
                  onClick={() => toggleSort(option.field)}
                  className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${
                    sortField === option.field
                      ? 'bg-violet-500/20 text-violet-400'
                      : 'text-gray-500 hover:text-white'
                  }`}
                >
                  {option.label}
                  {sortField === option.field && (
                    <ArrowUpDown className={`w-3 h-3 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Case List */}
      <div className="divide-y divide-white/5 max-h-[600px] overflow-y-auto">
        {filteredCases.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Inga ärenden hittades</p>
            {activeFilterCount > 0 && (
              <button
                onClick={clearFilters}
                className="mt-2 text-sm text-violet-400 hover:text-violet-300"
              >
                Rensa filter
              </button>
            )}
          </div>
        ) : (
          filteredCases.map((caseItem) => {
            const status = statusConfig[caseItem.status] || statusConfig.new;
            const colors = colorClasses[status.color];
            const StatusIcon = status.icon;
            const isSelected = selectedCaseId === caseItem.id;
            const paidAmount = (caseItem.original_amount_sek || 0) - (caseItem.remaining_amount_sek || 0);

            return (
              <button
                key={caseItem.id}
                onClick={() => onSelectCase(caseItem.id)}
                className={`w-full p-4 text-left hover:bg-white/5 transition-colors ${
                  isSelected ? 'bg-violet-500/10' : ''
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-sm font-medium text-white">
                        {caseItem.fortnox_invoice_number || caseItem.id.slice(0, 8)}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${colors.bg} ${colors.text}`}
                      >
                        <StatusIcon className="w-3 h-3" />
                        {status.label}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 truncate">{caseItem.customer_name}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Förfallen: {formatDate(caseItem.due_date)}
                      {caseItem.days_overdue > 0 && (
                        <span className="text-rose-400 ml-2">
                          ({caseItem.days_overdue} dagar)
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-white">
                      {formatCurrency(caseItem.remaining_amount_sek || 0)}
                    </p>
                    {paidAmount > 0 && (
                      <p className="text-xs text-emerald-400">
                        Betalt: {formatCurrency(paidAmount)}
                      </p>
                    )}
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};

export default CaseList;
