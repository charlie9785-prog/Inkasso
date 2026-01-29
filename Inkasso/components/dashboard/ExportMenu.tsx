import React, { useState } from 'react';
import {
  Download,
  FileText,
  FileSpreadsheet,
  BarChart3,
  ChevronDown,
  Loader2,
} from 'lucide-react';
import { useExport } from '../../hooks/useExport';
import { CaseWithCustomer } from '../../hooks/useCases';
import { StatsOverview, PeriodComparison, TimelineDataPoint } from '../../types/dashboard';

interface ExportMenuProps {
  // For case list export
  cases?: CaseWithCustomer[];
  // For single case export
  caseData?: CaseWithCustomer;
  // For stats export
  stats?: StatsOverview;
  periodComparison?: PeriodComparison;
  timeline?: TimelineDataPoint[];
  // What to show
  showCaseList?: boolean;
  showCaseDetails?: boolean;
  showStats?: boolean;
}

const ExportMenu: React.FC<ExportMenuProps> = ({
  cases,
  caseData,
  stats,
  periodComparison,
  timeline,
  showCaseList = false,
  showCaseDetails = false,
  showStats = false,
}) => {
  const { isExporting, exportCasesCSV, exportCaseDetailsText, exportStatsReport } = useExport();
  const [isOpen, setIsOpen] = useState(false);

  const hasExportOptions = showCaseList || showCaseDetails || showStats;

  if (!hasExportOptions) return null;

  const handleExportCases = () => {
    if (cases) {
      exportCasesCSV(cases);
    }
    setIsOpen(false);
  };

  const handleExportCaseDetails = () => {
    if (caseData) {
      exportCaseDetailsText(caseData);
    }
    setIsOpen(false);
  };

  const handleExportStats = () => {
    if (stats && periodComparison && timeline) {
      exportStatsReport(stats, periodComparison, timeline);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isExporting}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-50"
      >
        {isExporting ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Download className="w-4 h-4" />
        )}
        <span className="text-sm">Exportera</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown Menu */}
          <div className="absolute right-0 mt-2 w-48 sm:w-56 glass-strong border border-white/10 rounded-xl overflow-hidden z-50">
            <div className="p-2 space-y-1">
              {showCaseList && cases && cases.length > 0 && (
                <button
                  onClick={handleExportCases}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                  <div>
                    <p className="font-medium">Exportera ärendelista</p>
                    <p className="text-xs text-gray-500">CSV-format ({cases.length} ärenden)</p>
                  </div>
                </button>
              )}

              {showCaseDetails && caseData && (
                <button
                  onClick={handleExportCaseDetails}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <FileText className="w-4 h-4 text-blue-400" />
                  <div>
                    <p className="font-medium">Exportera ärende</p>
                    <p className="text-xs text-gray-500">Textrapport</p>
                  </div>
                </button>
              )}

              {showStats && stats && periodComparison && timeline && (
                <button
                  onClick={handleExportStats}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <BarChart3 className="w-4 h-4 text-violet-400" />
                  <div>
                    <p className="font-medium">Exportera statistik</p>
                    <p className="text-xs text-gray-500">Fullständig rapport</p>
                  </div>
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ExportMenu;
