import React, { useState, useEffect } from 'react';
import { Receipt } from 'lucide-react';
import DashboardLayout from './DashboardLayout';
import StatsOverview from './StatsOverview';
import CaseList from './CaseList';
import CaseDetails from './CaseDetails';
import Charts from './Charts';
import MiniCharts from './MiniCharts';
import ExportMenu from './ExportMenu';
import TimelineView from './TimelineView';
import AgeAnalysis from './AgeAnalysis';
import Integrations from './Integrations';
import { useCases } from '../../hooks/useCases';
import { useStats } from '../../hooks/useStats';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import { DashboardView } from '../../types/dashboard';

// Format currency helper
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('sv-SE', {
    style: 'currency',
    currency: 'SEK',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const Dashboard: React.FC = () => {
  const [currentView, setCurrentView] = useState<DashboardView>('overview');
  const [billingFees, setBillingFees] = useState<number>(0);
  const [billingLoading, setBillingLoading] = useState(true);

  const { tenant } = useAuth();
  const {
    cases,
    selectedCase,
    recentCommunications,
    isLoading: casesLoading,
    isLoadingMore,
    hasMore,
    totalCount,
    selectCase,
    loadMore
  } = useCases();
  const { stats, timeline, periodComparison, isLoading: statsLoading } = useStats();

  // Fetch billing summary from RPC
  useEffect(() => {
    const fetchBillingSummary = async () => {
      if (!tenant?.id) return;

      try {
        const { data, error } = await supabase.rpc('get_billing_summary', {
          p_tenant_id: tenant.id
        });

        if (error) {
          console.error('Error fetching billing summary:', error);
          return;
        }

        if (data && typeof data.current_month_fees === 'number') {
          setBillingFees(data.current_month_fees);
        }
      } catch (err) {
        console.error('Error fetching billing summary:', err);
      } finally {
        setBillingLoading(false);
      }
    };

    fetchBillingSummary();
  }, [tenant?.id]);

  // Handle case selection
  const handleSelectCase = (caseId: string) => {
    selectCase(caseId);
  };

  const handleBackFromDetails = () => {
    selectCase(null);
  };

  // Render content based on current view
  const renderContent = () => {
    switch (currentView) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Export Menu */}
            <div className="flex justify-end">
              <ExportMenu
                stats={stats}
                periodComparison={periodComparison}
                timeline={timeline.collectedOverTime}
                showStats
              />
            </div>

            <StatsOverview stats={stats} periodComparison={periodComparison} isLoading={statsLoading} />

            {/* Zylora Fee Card */}
            {!billingLoading && (
              <div className="glass border border-amber-500/20 rounded-xl p-6 bg-amber-500/5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
                    <Receipt className="w-6 h-6 text-amber-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-display font-semibold text-white mb-1">
                      Zylora-avgift
                    </h3>
                    <p className="text-2xl font-bold text-white mb-1">
                      {formatCurrency(billingFees)}
                    </p>
                    <p className="text-sm text-gray-400">
                      Denna månad (faktureras 1:a nästa månad)
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Charts */}
            <Charts
              collectedOverTime={timeline.collectedOverTime}
              statusDistribution={timeline.statusDistribution}
              isLoading={statsLoading}
            />

            <div className="glass border border-white/10 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-display font-semibold text-white">
                  Senaste ärenden
                </h3>
                <button
                  onClick={() => setCurrentView('cases')}
                  className="text-sm text-violet-400 hover:text-violet-300 transition-colors"
                >
                  Visa alla →
                </button>
              </div>
              <CaseList
                cases={cases.slice(0, 5)}
                isLoading={casesLoading}
                onSelectCase={(id) => {
                  handleSelectCase(id);
                  setCurrentView('cases');
                }}
              />
            </div>
          </div>
        );

      case 'cases':
        if (selectedCase) {
          return (
            <div className="space-y-6">
              <div className="flex justify-end">
                <ExportMenu
                  caseData={selectedCase}
                  showCaseDetails
                />
              </div>
              <CaseDetails
                caseData={selectedCase}
                isLoading={casesLoading}
                onBack={handleBackFromDetails}
              />
            </div>
          );
        }
        return (
          <div className="space-y-6">
            <div className="flex justify-end">
              <ExportMenu
                cases={cases}
                showCaseList={cases.length > 0}
              />
            </div>
            <CaseList
              cases={cases}
              isLoading={casesLoading}
              isLoadingMore={isLoadingMore}
              hasMore={hasMore}
              totalCount={totalCount}
              onSelectCase={handleSelectCase}
              onLoadMore={loadMore}
              selectedCaseId={selectedCase?.id}
            />
          </div>
        );

      case 'stats':
        return (
          <div className="space-y-6">
            <div className="flex justify-end">
              <ExportMenu
                stats={stats}
                periodComparison={periodComparison}
                timeline={timeline.collectedOverTime}
                showStats
              />
            </div>
            <StatsOverview stats={stats} periodComparison={periodComparison} isLoading={statsLoading} />
            <Charts
              collectedOverTime={timeline.collectedOverTime}
              statusDistribution={timeline.statusDistribution}
              isLoading={statsLoading}
            />
          </div>
        );

      case 'analysis':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Age Analysis */}
              <AgeAnalysis
                cases={cases}
                isLoading={casesLoading}
              />

              {/* Timeline View */}
              <TimelineView
                cases={cases}
                communications={recentCommunications}
                isLoading={casesLoading}
                onSelectCase={(caseId) => {
                  handleSelectCase(caseId);
                  setCurrentView('cases');
                }}
              />
            </div>
          </div>
        );

      case 'integrations':
        return <Integrations />;

      default:
        return null;
    }
  };

  return (
    <DashboardLayout
      currentView={currentView}
      onViewChange={setCurrentView}
      onSelectCase={handleSelectCase}
    >
      {renderContent()}
    </DashboardLayout>
  );
};

export default Dashboard;
