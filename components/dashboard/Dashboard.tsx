import React, { useState } from 'react';
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
import { DashboardView } from '../../types/dashboard';

const Dashboard: React.FC = () => {
  const [currentView, setCurrentView] = useState<DashboardView>('overview');
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);

  const { cases, selectedCase, recentCommunications, isLoading: casesLoading, selectCase } = useCases();
  const { stats, timeline, periodComparison, isLoading: statsLoading } = useStats();

  // Handle case selection
  const handleSelectCase = (caseId: string) => {
    setSelectedCaseId(caseId);
    selectCase(caseId);
  };

  const handleBackFromDetails = () => {
    setSelectedCaseId(null);
    selectCase(null);
  };

  // Render content based on current view
  const renderContent = () => {
    switch (currentView) {
      case 'overview':
        return (
          <div className="space-y-6">
            <StatsOverview stats={stats} periodComparison={periodComparison} isLoading={statsLoading} />

            {/* Mini Charts */}
            <MiniCharts
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
        if (selectedCaseId) {
          return (
            <div className="space-y-6">
              <div className="flex justify-end">
                <ExportMenu
                  caseData={selectedCase || undefined}
                  showCaseDetails={!!selectedCase}
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
              onSelectCase={handleSelectCase}
              selectedCaseId={selectedCaseId || undefined}
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
