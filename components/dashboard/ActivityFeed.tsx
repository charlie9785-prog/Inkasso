import React from 'react';
import {
  FileText,
  Mail,
  Phone,
  CreditCard,
  AlertCircle,
  CheckCircle,
  MessageSquare,
  Gavel,
} from 'lucide-react';
import { Activity, ActivityType } from '../../types/dashboard';

interface ActivityFeedProps {
  activities: Activity[];
  isLoading?: boolean;
  maxItems?: number;
}

const activityConfig: Record<
  ActivityType,
  { icon: typeof FileText; color: string; label: string }
> = {
  case_created: {
    icon: FileText,
    color: 'violet',
    label: 'Ärende skapat',
  },
  reminder_sent: {
    icon: Mail,
    color: 'blue',
    label: 'Påminnelse skickad',
  },
  payment_received: {
    icon: CreditCard,
    color: 'emerald',
    label: 'Betalning mottagen',
  },
  phone_call: {
    icon: Phone,
    color: 'cyan',
    label: 'Telefonsamtal',
  },
  email_sent: {
    icon: Mail,
    color: 'blue',
    label: 'E-post skickat',
  },
  status_changed: {
    icon: AlertCircle,
    color: 'amber',
    label: 'Status ändrad',
  },
  note_added: {
    icon: MessageSquare,
    color: 'gray',
    label: 'Notering tillagd',
  },
  legal_action: {
    icon: Gavel,
    color: 'rose',
    label: 'Rättslig åtgärd',
  },
};

const colorClasses: Record<string, { bg: string; border: string; text: string }> = {
  violet: {
    bg: 'bg-violet-500/20',
    border: 'border-violet-500/30',
    text: 'text-violet-400',
  },
  blue: {
    bg: 'bg-blue-500/20',
    border: 'border-blue-500/30',
    text: 'text-blue-400',
  },
  emerald: {
    bg: 'bg-emerald-500/20',
    border: 'border-emerald-500/30',
    text: 'text-emerald-400',
  },
  cyan: {
    bg: 'bg-cyan-500/20',
    border: 'border-cyan-500/30',
    text: 'text-cyan-400',
  },
  amber: {
    bg: 'bg-amber-500/20',
    border: 'border-amber-500/30',
    text: 'text-amber-400',
  },
  rose: {
    bg: 'bg-rose-500/20',
    border: 'border-rose-500/30',
    text: 'text-rose-400',
  },
  gray: {
    bg: 'bg-gray-500/20',
    border: 'border-gray-500/30',
    text: 'text-gray-400',
  },
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

  return date.toLocaleDateString('sv-SE', {
    day: 'numeric',
    month: 'short',
  });
};

const ActivityFeed: React.FC<ActivityFeedProps> = ({
  activities,
  isLoading,
  maxItems,
}) => {
  const displayedActivities = maxItems ? activities.slice(0, maxItems) : activities;

  if (isLoading) {
    return (
      <div className="glass border border-white/10 rounded-xl p-4 sm:p-6">
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

  if (displayedActivities.length === 0) {
    return (
      <div className="glass border border-white/10 rounded-xl p-4 sm:p-6">
        <h3 className="text-lg font-display font-semibold text-white mb-4">
          Senaste aktivitet
        </h3>
        <div className="flex flex-col items-center justify-center py-8 text-gray-500">
          <CheckCircle className="w-12 h-12 mb-3 opacity-50" />
          <p>Ingen aktivitet ännu</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass border border-white/10 rounded-xl p-4 sm:p-6">
      <h3 className="text-lg font-display font-semibold text-white mb-4">
        Senaste aktivitet
      </h3>
      <div className="space-y-4">
        {displayedActivities.map((activity, index) => {
          const config = activityConfig[activity.type];
          const colors = colorClasses[config.color];
          const Icon = config.icon;

          return (
            <div
              key={activity.id}
              className="flex items-start gap-4 group"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div
                className={`w-10 h-10 rounded-xl ${colors.bg} ${colors.border} border flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}
              >
                <Icon className={`w-5 h-5 ${colors.text}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white">{activity.description}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatTimeAgo(activity.createdAt)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ActivityFeed;
