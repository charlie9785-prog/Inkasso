import { useCallback, useState } from 'react';
import { CaseWithCustomer } from './useCases';
import { StatsOverview, PeriodComparison, TimelineDataPoint } from '../types/dashboard';

interface UseExportReturn {
  isExporting: boolean;
  exportCasesCSV: (cases: CaseWithCustomer[], filename?: string) => void;
  exportCaseDetailsText: (caseData: CaseWithCustomer) => void;
  exportStatsReport: (
    stats: StatsOverview,
    periodComparison: PeriodComparison,
    timeline: TimelineDataPoint[]
  ) => void;
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('sv-SE', {
    style: 'currency',
    currency: 'SEK',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('sv-SE');
};

const statusLabels: Record<string, string> = {
  new: 'Ny',
  pending: 'Väntande',
  in_collection: 'Aktiv inkasso',
  paused: 'Pausad',
  paid: 'Betald',
  handed_off: 'Överlämnad',
  cancelled: 'Avbruten',
};

export const useExport = (): UseExportReturn => {
  const [isExporting, setIsExporting] = useState(false);

  const downloadFile = useCallback((content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, []);

  const exportCasesCSV = useCallback((cases: CaseWithCustomer[], filename = 'arenden') => {
    setIsExporting(true);

    try {
      // CSV Header
      const headers = [
        'Fakturanummer',
        'Gäldenär',
        'Org.nummer',
        'E-post',
        'Telefon',
        'Originalbelopp',
        'Kvarvarande',
        'Status',
        'Förfallodatum',
        'Dagar försenad',
        'Fakturadatum',
      ];

      // CSV Rows
      const rows = cases.map((c) => [
        c.fortnox_invoice_number || c.id.slice(0, 8),
        c.customer_name || '',
        c.customer_org_number || '',
        c.customer_email || '',
        c.customer_phone || '',
        c.original_amount_sek || 0,
        c.remaining_amount_sek || 0,
        statusLabels[c.status] || c.status,
        formatDate(c.due_date),
        c.days_overdue,
        formatDate(c.invoice_date),
      ]);

      // Build CSV content with BOM for Excel compatibility
      const BOM = '\uFEFF';
      const csvContent = BOM + [
        headers.join(';'),
        ...rows.map((row) =>
          row.map((cell) => {
            const cellStr = String(cell);
            // Escape cells containing semicolons or quotes
            if (cellStr.includes(';') || cellStr.includes('"') || cellStr.includes('\n')) {
              return `"${cellStr.replace(/"/g, '""')}"`;
            }
            return cellStr;
          }).join(';')
        ),
      ].join('\n');

      const date = new Date().toISOString().split('T')[0];
      downloadFile(csvContent, `${filename}_${date}.csv`, 'text/csv;charset=utf-8');
    } finally {
      setIsExporting(false);
    }
  }, [downloadFile]);

  const exportCaseDetailsText = useCallback((caseData: CaseWithCustomer) => {
    setIsExporting(true);

    try {
      const paidAmount = (caseData.original_amount_sek || 0) - (caseData.remaining_amount_sek || 0);

      const lines = [
        '=' .repeat(60),
        'ÄRENDERAPPORT',
        '=' .repeat(60),
        '',
        `Exporterad: ${new Date().toLocaleString('sv-SE')}`,
        '',
        '-'.repeat(60),
        'FAKTURAINFORMATION',
        '-'.repeat(60),
        `Fakturanummer: ${caseData.fortnox_invoice_number || caseData.id.slice(0, 8)}`,
        `OCR-nummer: ${caseData.ocr_number || '-'}`,
        `Status: ${statusLabels[caseData.status] || caseData.status}`,
        `Fakturadatum: ${formatDate(caseData.invoice_date)}`,
        `Förfallodatum: ${formatDate(caseData.due_date)}`,
        `Dagar försenad: ${caseData.days_overdue}`,
        '',
        '-'.repeat(60),
        'BELOPP',
        '-'.repeat(60),
        `Originalbelopp: ${formatCurrency(caseData.original_amount_sek || 0)}`,
        `Betalt: ${formatCurrency(paidAmount)}`,
        `Kvarvarande: ${formatCurrency(caseData.remaining_amount_sek || 0)}`,
        '',
        '-'.repeat(60),
        'GÄLDENÄRSINFORMATION',
        '-'.repeat(60),
        `Namn: ${caseData.customer_name || '-'}`,
        `Org.nummer: ${caseData.customer_org_number || '-'}`,
        `E-post: ${caseData.customer_email || '-'}`,
        `Telefon: ${caseData.customer_phone || '-'}`,
      ];

      if (caseData.customer?.address_line1) {
        lines.push(`Adress: ${caseData.customer.address_line1}`);
        if (caseData.customer.postal_code || caseData.customer.city) {
          lines.push(`         ${caseData.customer.postal_code || ''} ${caseData.customer.city || ''}`);
        }
      }

      if (caseData.internal_notes) {
        lines.push('', '-'.repeat(60), 'INTERNA ANTECKNINGAR', '-'.repeat(60));
        lines.push(caseData.internal_notes);
      }

      if (caseData.pause_reason) {
        lines.push('', '-'.repeat(60), 'PAUSANLEDNING', '-'.repeat(60));
        lines.push(caseData.pause_reason);
      }

      if (caseData.payments && caseData.payments.length > 0) {
        lines.push('', '-'.repeat(60), 'BETALNINGSHISTORIK', '-'.repeat(60));
        caseData.payments.forEach((payment) => {
          lines.push(`${formatDate(payment.payment_date)} - ${formatCurrency(payment.amount_sek)} (${payment.source || 'Okänd källa'})`);
        });
      }

      if (caseData.activities && caseData.activities.length > 0) {
        lines.push('', '-'.repeat(60), 'AKTIVITETSLOGG', '-'.repeat(60));
        caseData.activities.forEach((activity) => {
          const date = new Date(activity.created_at).toLocaleString('sv-SE');
          lines.push(`${date} - ${activity.subject || activity.channel}`);
          if (activity.ai_summary) {
            lines.push(`  ${activity.ai_summary}`);
          }
        });
      }

      lines.push('', '=' .repeat(60), 'Slut på rapport', '=' .repeat(60));

      const content = lines.join('\n');
      const invoiceNum = caseData.fortnox_invoice_number || caseData.id.slice(0, 8);
      downloadFile(content, `arende_${invoiceNum}.txt`, 'text/plain;charset=utf-8');
    } finally {
      setIsExporting(false);
    }
  }, [downloadFile]);

  const exportStatsReport = useCallback((
    stats: StatsOverview,
    periodComparison: PeriodComparison,
    timeline: TimelineDataPoint[]
  ) => {
    setIsExporting(true);

    try {
      const lines = [
        '=' .repeat(60),
        'STATISTIKRAPPORT',
        '=' .repeat(60),
        '',
        `Exporterad: ${new Date().toLocaleString('sv-SE')}`,
        '',
        '-'.repeat(60),
        'ÖVERSIKT',
        '-'.repeat(60),
        `Totalt antal ärenden: ${stats.totalCases}`,
        `Aktiva ärenden: ${stats.activeCases}`,
        `Avslutade ärenden: ${stats.closedCases}`,
        `Totalt belopp: ${formatCurrency(stats.totalAmount)}`,
        `Återvunnet belopp: ${formatCurrency(stats.collectedAmount)}`,
        `Väntande belopp: ${formatCurrency(stats.pendingAmount)}`,
        `Success rate: ${stats.successRate.toFixed(1)}%`,
        '',
        '-'.repeat(60),
        'JÄMFÖRELSE MED FÖREGÅENDE MÅNAD',
        '-'.repeat(60),
        `Återvunnet denna månad: ${formatCurrency(periodComparison.collectedAmount)}`,
        `Återvunnet förra månaden: ${formatCurrency(periodComparison.collectedAmountPrev)}`,
        `Förändring: ${periodComparison.collectedChange > 0 ? '+' : ''}${periodComparison.collectedChange.toFixed(1)}%`,
        '',
        `Avslutade ärenden denna månad: ${periodComparison.casesResolved}`,
        `Avslutade ärenden förra månaden: ${periodComparison.casesResolvedPrev}`,
        `Förändring: ${periodComparison.casesResolvedChange > 0 ? '+' : ''}${periodComparison.casesResolvedChange.toFixed(1)}%`,
        '',
        `Nya ärenden denna månad: ${periodComparison.newCases}`,
        `Nya ärenden förra månaden: ${periodComparison.newCasesPrev}`,
        `Förändring: ${periodComparison.newCasesChange > 0 ? '+' : ''}${periodComparison.newCasesChange.toFixed(1)}%`,
        '',
        `Genomsnittlig handläggningstid: ${periodComparison.avgDaysToCollect.toFixed(0)} dagar`,
        `Genomsnittlig handläggningstid (förra): ${periodComparison.avgDaysToCollectPrev.toFixed(0)} dagar`,
      ];

      if (timeline.length > 0) {
        lines.push('', '-'.repeat(60), 'ÅTERVUNNET BELOPP PER MÅNAD', '-'.repeat(60));
        timeline.forEach((point) => {
          const date = new Date(point.date);
          const monthName = date.toLocaleDateString('sv-SE', { month: 'long', year: 'numeric' });
          lines.push(`${monthName}: ${formatCurrency(point.amount)} (${point.count} betalningar)`);
        });
      }

      lines.push('', '=' .repeat(60), 'Slut på rapport', '=' .repeat(60));

      const content = lines.join('\n');
      const date = new Date().toISOString().split('T')[0];
      downloadFile(content, `statistik_${date}.txt`, 'text/plain;charset=utf-8');
    } finally {
      setIsExporting(false);
    }
  }, [downloadFile]);

  return {
    isExporting,
    exportCasesCSV,
    exportCaseDetailsText,
    exportStatsReport,
  };
};

export default useExport;
