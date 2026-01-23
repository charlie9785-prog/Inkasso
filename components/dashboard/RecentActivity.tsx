import React from 'react';
import {
  Mail,
  Phone,
  MessageSquare,
  CheckCircle,
  XCircle,
  Clock,
  ArrowUpRight,
} from 'lucide-react';
import { CommunicationLog } from '../../types/supabase';

interface RecentActivityProps {
  communications: CommunicationLog[];
  isLoading?: boolean;
  onViewCase?: (invoiceId: string) => void;
}

const channelConfig: Record<string, { icon: typeof Mail; color: string; label: string }> = {
  email: { icon: Mail, color: 'blue', label: 'E-post' },
  sms: { icon: MessageSquare, color: 'emerald', label: 'SMS' },
  phone: { icon: Phone, color: 'violet', label: 'Telefon' },
};

const statusConfig: Record<string, { icon: typeof CheckCircle; color: string }> = {
  delivered: { icon: CheckCircle, color: 'emerald' },
  sent: { icon: CheckCircle, color: 'blue' },
  opened: { icon: CheckCircle, color: 'emerald' },
  completed: { icon: CheckCircle, color: 'emerald' },
  failed: { icon: XCircle, color: 'rose' },
  pending: { icon: Clock, color: 'amber' },
};

const colorClasses: Record<string, { bg: string; border: string; text: string }> = {
  violet: { bg: 'bg-violet-500/20', border: 'border-violet-500/30', text: 'text-violet-400' },
  blue: { bg: 'bg-blue-500/20', border: 'border-blue-500/30', text: 'text-blue-400' },
  emerald: { bg: 'bg-emerald-500/20', border: 'border-emerald-500/30', text: 'text-emerald-400' },
  amber: { bg: 'bg-amber-500/20', border: 'border-amber-500/30', text: 'text-amber-400' },
  rose: { bg: 'bg-rose-500/20', border: 'border-rose-500/30', text: 'text-rose-400' },
  gray: { bg: 'bg-gray-500/20', border: 'border-gray-500/30', text: 'text-gray-400' },
};

const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just nu';
  if (diffMins < 60) return `${diffMins} min sedan`;
  if (diffHours < 24) return `${diffHours} tim sedan`;
  if (diffDays < 7) return `${diffDays} dagar sedan`;

  return date.toLocaleDateString('sv-SE', { day: 'numeric', month: 'short' });
};

const RecentActivity: React.FC<RecentActivityProps> = ({
  communications,
  isLoading,
  onViewCase,
}) => {
  if (isLoading) {
    return (
      <div className="glass border border-white/10 rounded-xl p-6">
        <h3 className="text-lg font-display font-semibold text-white mb-4">
          Senaste aktivitet
        </h3>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-start gap-4 animate-pulse">
              <div className="w-10 h-10 rounded-xl bg-white/5" />
              <div className="flex-1">
                <div className="w-3/4 h-4 bg-white/5 rounded mb-2" />
                <div className="w-1/2 h-3 bg-white/5 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (communications.length === 0) {
    return (
      <div className="glass border border-white/10 rounded-xl p-6">
        <h3 className="text-lg font-display font-semibold text-white mb-4">
          Senaste aktivitet
        </h3>
        <div className="flex flex-col items-center justify-center py-8 text-gray-500">
          <Clock className="w-12 h-12 mb-3 opacity-50" />
          <p>Ingen aktivitet ännu</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass border border-white/10 rounded-xl p-6">
      <h3 className="text-lg font-display font-semibold text-white mb-4">
        Senaste aktivitet
      </h3>
      <div className="space-y-4">
        {communications.slice(0, 8).map((comm, index) => {
          const channel = channelConfig[comm.channel] || channelConfig.email;
          const status = statusConfig[comm.status] || statusConfig.pending;
          const channelColors = colorClasses[channel.color];
          const statusColors = colorClasses[status.color];
          const ChannelIcon = channel.icon;
          const StatusIcon = status.icon;

          return (
            <div
              key={comm.id}
              className="flex items-start gap-3 group"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div
                className={`w-10 h-10 rounded-xl ${channelColors.bg} ${channelColors.border} border flex items-center justify-center flex-shrink-0`}
              >
                <ChannelIcon className={`w-5 h-5 ${channelColors.text}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-white truncate">
                    {comm.subject || channel.label}
                  </span>
                  <StatusIcon className={`w-3.5 h-3.5 ${statusColors.text} flex-shrink-0`} />
                </div>
                {comm.ai_summary && (
                  <p className="text-xs text-gray-400 line-clamp-2 mb-1">
                    {comm.ai_summary}
                  </p>
                )}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">
                    {formatTimeAgo(comm.created_at)}
                  </span>
                  {onViewCase && comm.invoice_id && (
                    <button
                      onClick={() => onViewCase(comm.invoice_id!)}
                      className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      Visa ärende
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentActivity;
