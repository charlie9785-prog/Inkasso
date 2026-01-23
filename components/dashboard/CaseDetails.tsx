import React, { useState } from 'react';
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
  CreditCard,
  Clock,
  CheckCircle,
  AlertCircle,
  Gavel,
  FileText,
  MessageSquare,
  Pause,
  MapPin,
  Building,
  Banknote,
  ArrowDownRight,
  ArrowUpRight,
  ChevronDown,
  ChevronUp,
  XCircle,
} from 'lucide-react';
import { CaseWithCustomer } from '../../hooks/useCases';
import { CommunicationLog, Payment } from '../../types/supabase';

interface CaseDetailsProps {
  caseData: CaseWithCustomer | null;
  isLoading?: boolean;
  onBack: () => void;
}

const statusConfig: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  new: { label: 'Ny', color: 'blue', icon: Clock },
  pending: { label: 'Ny', color: 'blue', icon: Clock },
  in_collection: { label: 'Aktiv inkasso', color: 'amber', icon: AlertCircle },
  paused: { label: 'Pausad', color: 'gray', icon: Pause },
  paid: { label: 'Betald', color: 'emerald', icon: CheckCircle },
  handed_off: { label: 'Överlämnad', color: 'rose', icon: Gavel },
  cancelled: { label: 'Avbruten', color: 'gray', icon: CheckCircle },
};

const channelConfig: Record<string, { icon: typeof Mail; label: string; color: string }> = {
  email: { icon: Mail, label: 'E-post', color: 'blue' },
  sms: { icon: MessageSquare, label: 'SMS', color: 'emerald' },
  phone: { icon: Phone, label: 'Telefon', color: 'violet' },
  letter: { icon: FileText, label: 'Brev', color: 'amber' },
};

const commStatusConfig: Record<string, { icon: typeof CheckCircle; label: string; color: string }> = {
  delivered: { icon: CheckCircle, label: 'Levererad', color: 'emerald' },
  sent: { icon: CheckCircle, label: 'Skickad', color: 'blue' },
  opened: { icon: CheckCircle, label: 'Öppnad', color: 'emerald' },
  completed: { icon: CheckCircle, label: 'Klar', color: 'emerald' },
  failed: { icon: XCircle, label: 'Misslyckad', color: 'rose' },
  pending: { icon: Clock, label: 'Väntande', color: 'amber' },
};

const colorClasses: Record<string, { bg: string; text: string; border: string }> = {
  blue: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30' },
  amber: { bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/30' },
  emerald: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/30' },
  gray: { bg: 'bg-gray-500/20', text: 'text-gray-400', border: 'border-gray-500/30' },
  rose: { bg: 'bg-rose-500/20', text: 'text-rose-400', border: 'border-rose-500/30' },
  violet: { bg: 'bg-violet-500/20', text: 'text-violet-400', border: 'border-violet-500/30' },
  cyan: { bg: 'bg-cyan-500/20', text: 'text-cyan-400', border: 'border-cyan-500/30' },
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
    month: 'long',
    year: 'numeric',
  });
};

const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleString('sv-SE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const CaseDetails: React.FC<CaseDetailsProps> = ({ caseData, isLoading, onBack }) => {
  const [expandedComms, setExpandedComms] = useState<Set<string>>(new Set());

  const toggleCommExpand = (id: string) => {
    setExpandedComms((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Tillbaka till ärenden</span>
        </button>
        <div className="glass border border-white/10 rounded-xl p-6 animate-pulse">
          <div className="w-48 h-8 bg-white/5 rounded mb-4" />
          <div className="w-32 h-6 bg-white/5 rounded" />
        </div>
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="space-y-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Tillbaka till ärenden</span>
        </button>
        <div className="glass border border-white/10 rounded-xl p-8 text-center">
          <AlertCircle className="w-12 h-12 text-gray-500 mx-auto mb-3" />
          <p className="text-gray-400">Ärendet kunde inte hittas</p>
        </div>
      </div>
    );
  }

  const status = statusConfig[caseData.status] || statusConfig.pending;
  const statusColors = colorClasses[status.color];
  const StatusIcon = status.icon;

  const paidAmount = (caseData.original_amount_sek || 0) - (caseData.remaining_amount_sek || 0);
  const progress = caseData.original_amount_sek > 0
    ? (paidAmount / caseData.original_amount_sek) * 100
    : 0;

  // Sort activities by date descending
  const sortedActivities = [...(caseData.activities || [])].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Tillbaka till ärenden</span>
      </button>

      {/* Header */}
      <div className="glass border border-white/10 rounded-xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-xl font-display font-bold text-white">
                {caseData.fortnox_invoice_number || caseData.id.slice(0, 8)}
              </h2>
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm ${statusColors.bg} ${statusColors.text}`}
              >
                <StatusIcon className="w-4 h-4" />
                {status.label}
              </span>
            </div>
            <p className="text-gray-400">{caseData.customer_name}</p>
            {caseData.customer_org_number && (
              <p className="text-sm text-gray-500">Org.nr: {caseData.customer_org_number}</p>
            )}
          </div>
          <div className="text-right">
            <p className="text-2xl font-display font-bold text-white">
              {formatCurrency(caseData.remaining_amount_sek || 0)}
            </p>
            <p className="text-sm text-gray-500">Kvarvarande belopp</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-400">Betalningsförlopp</span>
            <span className="text-white">{progress.toFixed(0)}%</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-violet-500 to-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>Betalt: {formatCurrency(paidAmount)}</span>
            <span>Original: {formatCurrency(caseData.original_amount_sek || 0)}</span>
          </div>
        </div>
      </div>

      {/* Three Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer Info */}
        <div className="glass border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-display font-semibold text-white mb-4">
            Gäldenärsinformation
          </h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-violet-500/20 border border-violet-500/30 flex items-center justify-center">
                <User className="w-5 h-5 text-violet-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Namn</p>
                <p className="text-sm text-white">{caseData.customer_name}</p>
              </div>
            </div>

            {caseData.customer_org_number && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gray-500/20 border border-gray-500/30 flex items-center justify-center">
                  <Building className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Organisationsnummer</p>
                  <p className="text-sm text-white">{caseData.customer_org_number}</p>
                </div>
              </div>
            )}

            {caseData.customer_email && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">E-post</p>
                  <p className="text-sm text-white break-all">{caseData.customer_email}</p>
                </div>
              </div>
            )}

            {caseData.customer_phone && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Telefon</p>
                  <p className="text-sm text-white">{caseData.customer_phone}</p>
                </div>
              </div>
            )}

            {caseData.customer?.address_line1 && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Adress</p>
                  <p className="text-sm text-white">
                    {caseData.customer.address_line1}
                    {caseData.customer.postal_code && `, ${caseData.customer.postal_code}`}
                    {caseData.customer.city && ` ${caseData.customer.city}`}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Invoice Details */}
        <div className="glass border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-display font-semibold text-white mb-4">
            Fakturadetaljer
          </h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-violet-500/20 border border-violet-500/30 flex items-center justify-center">
                <FileText className="w-5 h-5 text-violet-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Fakturanummer</p>
                <p className="text-sm text-white">{caseData.fortnox_invoice_number || '-'}</p>
              </div>
            </div>

            {caseData.ocr_number && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gray-500/20 border border-gray-500/30 flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">OCR-nummer</p>
                  <p className="text-sm text-white font-mono">{caseData.ocr_number}</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Fakturadatum</p>
                <p className="text-sm text-white">{formatDate(caseData.invoice_date)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-rose-500/20 border border-rose-500/30 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-rose-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Förfallodatum</p>
                <p className="text-sm text-white">{formatDate(caseData.due_date)}</p>
                {caseData.days_overdue > 0 && (
                  <p className="text-xs text-rose-400">{caseData.days_overdue} dagar försenad</p>
                )}
              </div>
            </div>

            {caseData.collection_started_at && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Inkasso startad</p>
                  <p className="text-sm text-white">{formatDate(caseData.collection_started_at)}</p>
                </div>
              </div>
            )}

            {caseData.paid_at && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Betald</p>
                  <p className="text-sm text-white">{formatDate(caseData.paid_at)}</p>
                </div>
              </div>
            )}

            {caseData.handed_off_at && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-rose-500/20 border border-rose-500/30 flex items-center justify-center">
                  <Gavel className="w-5 h-5 text-rose-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Överlämnad</p>
                  <p className="text-sm text-white">{formatDate(caseData.handed_off_at)}</p>
                </div>
              </div>
            )}
          </div>

          {/* Internal Notes */}
          {caseData.internal_notes && (
            <div className="mt-6 pt-4 border-t border-white/10">
              <p className="text-xs text-gray-500 mb-2">Interna anteckningar</p>
              <p className="text-sm text-gray-300 bg-white/5 rounded-lg p-3 whitespace-pre-wrap">
                {caseData.internal_notes}
              </p>
            </div>
          )}

          {/* Pause Reason */}
          {caseData.pause_reason && (
            <div className="mt-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <p className="text-xs text-amber-400 mb-1">Pausad: Anledning</p>
              <p className="text-sm text-amber-200">{caseData.pause_reason}</p>
            </div>
          )}
        </div>

        {/* Payments Summary */}
        <div className="glass border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-display font-semibold text-white mb-4">
            Betalningar
          </h3>

          {caseData.payments && caseData.payments.length > 0 ? (
            <div className="space-y-3">
              {caseData.payments.map((payment: Payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                      <ArrowDownRight className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-sm text-white">{formatDate(payment.payment_date)}</p>
                      <p className="text-xs text-gray-500">{payment.source || 'Banköverföring'}</p>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-emerald-400">
                    +{formatCurrency(payment.amount_sek)}
                  </p>
                </div>
              ))}

              <div className="pt-3 border-t border-white/10">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">Totalt betalt</span>
                  <span className="text-sm font-semibold text-emerald-400">
                    {formatCurrency(paidAmount)}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-gray-500">
              <Banknote className="w-10 h-10 mb-2 opacity-50" />
              <p className="text-sm">Inga betalningar registrerade</p>
            </div>
          )}
        </div>
      </div>

      {/* Communication History - Detailed */}
      <div className="glass border border-white/10 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
              <Mail className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-display font-semibold text-white">
                Kommunikationshistorik
              </h3>
              <p className="text-sm text-gray-500">
                {sortedActivities.length} meddelanden skickade för detta ärende
              </p>
            </div>
          </div>
        </div>

        {sortedActivities.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Ingen kommunikation registrerad ännu</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedActivities.map((activity: CommunicationLog) => {
              const channelCfg = channelConfig[activity.channel] || channelConfig.email;
              const statusCfg = commStatusConfig[activity.status] || commStatusConfig.pending;
              const channelColors = colorClasses[channelCfg.color];
              const statusColors = colorClasses[statusCfg.color];
              const ChannelIcon = channelCfg.icon;
              const StatusIcon = statusCfg.icon;
              const isExpanded = expandedComms.has(activity.id);
              const isInbound = activity.direction === 'inbound';

              return (
                <div
                  key={activity.id}
                  className="rounded-lg bg-white/5 border border-white/10 overflow-hidden"
                >
                  {/* Header - Always visible */}
                  <button
                    onClick={() => toggleCommExpand(activity.id)}
                    className="w-full p-4 text-left hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-lg ${channelColors.bg} border ${channelColors.border} flex items-center justify-center flex-shrink-0`}>
                        <ChannelIcon className={`w-5 h-5 ${channelColors.text}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="text-sm font-medium text-white">
                            {activity.subject || channelCfg.label}
                          </span>
                          {isInbound ? (
                            <span className="inline-flex items-center gap-1 text-xs text-cyan-400">
                              <ArrowDownRight className="w-3 h-3" />
                              Inkommande
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs text-violet-400">
                              <ArrowUpRight className="w-3 h-3" />
                              Utgående
                            </span>
                          )}
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${statusColors.bg} ${statusColors.text}`}>
                            <StatusIcon className="w-3 h-3" />
                            {statusCfg.label}
                          </span>
                        </div>
                        {activity.ai_summary && (
                          <p className="text-sm text-gray-400 line-clamp-2">{activity.ai_summary}</p>
                        )}
                        <p className="text-xs text-gray-500 mt-2">
                          {formatDateTime(activity.created_at)}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-gray-500" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-500" />
                        )}
                      </div>
                    </div>
                  </button>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="px-4 pb-4 border-t border-white/10">
                      <div className="mt-4 space-y-4">
                        {/* AI Summary */}
                        {activity.ai_summary && (
                          <div>
                            <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" />
                              AI-sammanfattning
                            </p>
                            <div className="p-3 rounded-lg bg-violet-500/10 border border-violet-500/20">
                              <p className="text-sm text-gray-300">{activity.ai_summary}</p>
                            </div>
                          </div>
                        )}

                        {/* Full Content */}
                        {activity.content && (
                          <div>
                            <p className="text-xs text-gray-500 mb-2">Fullständigt innehåll</p>
                            <div className="p-3 rounded-lg bg-white/5 border border-white/10 max-h-60 overflow-y-auto">
                              <p className="text-sm text-gray-300 whitespace-pre-wrap">{activity.content}</p>
                            </div>
                          </div>
                        )}

                        {/* Metadata */}
                        <div className="flex flex-wrap gap-4 text-xs text-gray-500 pt-2 border-t border-white/10">
                          <span className="flex items-center gap-1">
                            <ChannelIcon className="w-3 h-3" />
                            Kanal: {channelCfg.label}
                          </span>
                          <span>
                            Riktning: {isInbound ? 'Inkommande' : 'Utgående'}
                          </span>
                          <span>
                            Status: {statusCfg.label}
                          </span>
                          <span>
                            Tid: {formatDateTime(activity.created_at)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CaseDetails;
