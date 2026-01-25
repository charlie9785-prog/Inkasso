import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';
import { TenantDashboard } from '../types/supabase';
import { PeriodComparison } from '../types/dashboard';

export interface StatsOverview {
  totalCases: number;
  activeCases: number;
  closedCases: number;
  totalAmount: number;
  collectedAmount: number;
  pendingAmount: number;
  successRate: number;
}

export interface TimelineDataPoint {
  date: string;
  amount: number;
  count: number;
}

export interface StatusDistribution {
  status: string;
  count: number;
  percentage: number;
}

export interface StatsTimeline {
  collectedOverTime: TimelineDataPoint[];
  statusDistribution: StatusDistribution[];
}

interface UseStatsReturn {
  stats: StatsOverview;
  timeline: StatsTimeline;
  periodComparison: PeriodComparison;
  dashboardData: TenantDashboard | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useStats = (): UseStatsReturn => {
  const { tenant } = useAuth();
  const [dashboardData, setDashboardData] = useState<TenantDashboard | null>(null);
  const [stats, setStats] = useState<StatsOverview>({
    totalCases: 0,
    activeCases: 0,
    closedCases: 0,
    totalAmount: 0,
    collectedAmount: 0,
    pendingAmount: 0,
    successRate: 0,
  });
  const [timeline, setTimeline] = useState<StatsTimeline>({
    collectedOverTime: [],
    statusDistribution: [],
  });
  const [periodComparison, setPeriodComparison] = useState<PeriodComparison>({
    collectedAmount: 0,
    collectedAmountPrev: 0,
    collectedChange: 0,
    casesResolved: 0,
    casesResolvedPrev: 0,
    casesResolvedChange: 0,
    newCases: 0,
    newCasesPrev: 0,
    newCasesChange: 0,
    avgDaysToCollect: 0,
    avgDaysToCollectPrev: 0,
    avgDaysChange: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    if (!tenant?.id) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Fetch dashboard data from view
      const { data: dashData, error: dashError } = await supabase
        .from('v_tenant_dashboard')
        .select('*')
        .eq('tenant_id', tenant.id)
        .single();

      if (dashError && dashError.code !== 'PGRST116') {
        // PGRST116 = no rows returned, which is ok for new tenants
        console.warn('Dashboard data error:', dashError.message);
      }

      if (dashData) {
        setDashboardData(dashData);
      }

      // Fetch all invoices for accurate stats calculation
      const { data: allInvoicesForStats, error: statsInvoicesError } = await supabase
        .from('invoices')
        .select('id, status, original_amount_sek, remaining_amount_sek')
        .eq('tenant_id', tenant.id);

      if (statsInvoicesError) {
        console.warn('Stats invoices error:', statsInvoicesError.message);
      }

      // Calculate accurate stats from invoices
      let totalCases = 0;
      let activeCases = 0;
      let closedCases = 0;
      let totalAmount = 0;
      let collectedAmount = 0;
      let pendingAmount = 0;

      if (allInvoicesForStats) {
        allInvoicesForStats.forEach((inv) => {
          totalCases++;
          totalAmount += inv.original_amount_sek || 0;

          if (inv.status === 'paid' || inv.status === 'closed') {
            closedCases++;
            collectedAmount += inv.original_amount_sek || 0;
          } else if (inv.status === 'active' || inv.status === 'pending') {
            activeCases++;
            pendingAmount += inv.remaining_amount_sek || 0;
          }
        });
      }

      // Success rate = closed cases / total cases
      const successRate = totalCases > 0 ? (closedCases / totalCases) * 100 : 0;

      setStats({
        totalCases,
        activeCases,
        closedCases,
        totalAmount,
        collectedAmount,
        pendingAmount,
        successRate,
      });

      // Fetch payments for timeline data and period comparison
      const now = new Date();
      const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const twoMonthsAgoStart = new Date(now.getFullYear(), now.getMonth() - 2, 1);

      const { data: payments, error: paymentsError } = await supabase
        .from('payments')
        .select('amount_sek, payment_date')
        .eq('tenant_id', tenant.id)
        .gte('payment_date', new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString())
        .order('payment_date', { ascending: true });

      if (paymentsError) {
        console.warn('Payments data error:', paymentsError.message);
      }

      // Calculate period comparison
      let thisMonthCollected = 0;
      let lastMonthCollected = 0;

      if (payments) {
        payments.forEach((payment) => {
          const paymentDate = new Date(payment.payment_date);
          if (paymentDate >= thisMonthStart) {
            thisMonthCollected += payment.amount_sek || 0;
          } else if (paymentDate >= lastMonthStart && paymentDate < thisMonthStart) {
            lastMonthCollected += payment.amount_sek || 0;
          }
        });
      }

      // Fetch invoices for period comparison (cases resolved and new cases)
      const { data: allInvoices, error: allInvoicesError } = await supabase
        .from('invoices')
        .select('id, status, created_at, updated_at, due_date')
        .eq('tenant_id', tenant.id);

      if (allInvoicesError) {
        console.warn('All invoices data error:', allInvoicesError.message);
      }

      let thisMonthResolved = 0;
      let lastMonthResolved = 0;
      let thisMonthNew = 0;
      let lastMonthNew = 0;
      let totalDaysToCollect = 0;
      let countResolved = 0;
      let totalDaysToCollectPrev = 0;
      let countResolvedPrev = 0;

      if (allInvoices) {
        allInvoices.forEach((inv) => {
          const createdAt = new Date(inv.created_at);
          const updatedAt = new Date(inv.updated_at);
          const dueDate = new Date(inv.due_date);

          // New cases this/last month
          if (createdAt >= thisMonthStart) {
            thisMonthNew++;
          } else if (createdAt >= lastMonthStart && createdAt < thisMonthStart) {
            lastMonthNew++;
          }

          // Resolved (paid/closed) cases this/last month
          if (inv.status === 'paid' || inv.status === 'closed') {
            if (updatedAt >= thisMonthStart) {
              thisMonthResolved++;
              const daysToCollect = Math.max(0, Math.floor((updatedAt.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)));
              totalDaysToCollect += daysToCollect;
              countResolved++;
            } else if (updatedAt >= lastMonthStart && updatedAt < thisMonthStart) {
              lastMonthResolved++;
              const daysToCollect = Math.max(0, Math.floor((updatedAt.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)));
              totalDaysToCollectPrev += daysToCollect;
              countResolvedPrev++;
            }
          }
        });
      }

      const collectedChange = lastMonthCollected > 0
        ? ((thisMonthCollected - lastMonthCollected) / lastMonthCollected) * 100
        : thisMonthCollected > 0 ? 100 : 0;

      const casesResolvedChange = lastMonthResolved > 0
        ? ((thisMonthResolved - lastMonthResolved) / lastMonthResolved) * 100
        : thisMonthResolved > 0 ? 100 : 0;

      const newCasesChange = lastMonthNew > 0
        ? ((thisMonthNew - lastMonthNew) / lastMonthNew) * 100
        : thisMonthNew > 0 ? 100 : 0;

      const avgDaysToCollect = countResolved > 0 ? totalDaysToCollect / countResolved : 0;
      const avgDaysToCollectPrev = countResolvedPrev > 0 ? totalDaysToCollectPrev / countResolvedPrev : 0;
      const avgDaysChange = avgDaysToCollectPrev > 0
        ? ((avgDaysToCollect - avgDaysToCollectPrev) / avgDaysToCollectPrev) * 100
        : 0;

      setPeriodComparison({
        collectedAmount: thisMonthCollected,
        collectedAmountPrev: lastMonthCollected,
        collectedChange,
        casesResolved: thisMonthResolved,
        casesResolvedPrev: lastMonthResolved,
        casesResolvedChange,
        newCases: thisMonthNew,
        newCasesPrev: lastMonthNew,
        newCasesChange,
        avgDaysToCollect,
        avgDaysToCollectPrev,
        avgDaysChange,
      });

      // Group payments by month
      const monthlyData: Record<string, { amount: number; count: number }> = {};

      if (payments) {
        payments.forEach((payment) => {
          const date = new Date(payment.payment_date);
          const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-01`;

          if (!monthlyData[monthKey]) {
            monthlyData[monthKey] = { amount: 0, count: 0 };
          }
          monthlyData[monthKey].amount += payment.amount_sek || 0;
          monthlyData[monthKey].count += 1;
        });
      }

      const collectedOverTime: TimelineDataPoint[] = Object.entries(monthlyData)
        .map(([date, data]) => ({
          date,
          amount: data.amount,
          count: data.count,
        }))
        .sort((a, b) => a.date.localeCompare(b.date));

      // Fetch invoices for status distribution
      const { data: invoices, error: invoicesError } = await supabase
        .from('invoices')
        .select('status')
        .eq('tenant_id', tenant.id);

      if (invoicesError) {
        console.warn('Invoices data error:', invoicesError.message);
      }

      // Calculate status distribution
      const statusCounts: Record<string, number> = {};
      let totalInvoices = 0;

      if (invoices) {
        invoices.forEach((invoice) => {
          const status = invoice.status || 'unknown';
          statusCounts[status] = (statusCounts[status] || 0) + 1;
          totalInvoices++;
        });
      }

      const statusDistribution: StatusDistribution[] = Object.entries(statusCounts)
        .map(([status, count]) => ({
          status,
          count,
          percentage: totalInvoices > 0 ? (count / totalInvoices) * 100 : 0,
        }));

      setTimeline({
        collectedOverTime,
        statusDistribution,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Kunde inte hämta statistik';
      setError(message);
      console.error('Error fetching stats:', err);
    } finally {
      setIsLoading(false);
    }
  }, [tenant?.id]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    timeline,
    periodComparison,
    dashboardData,
    isLoading,
    error,
    refetch: fetchStats,
  };
};

export default useStats;
