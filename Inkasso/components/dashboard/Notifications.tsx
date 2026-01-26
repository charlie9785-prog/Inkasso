import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import {
  Bell,
  X,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  Clock,
  FileText,
  ChevronRight,
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';

export interface Notification {
  id: string;
  type: 'payment' | 'overdue' | 'status_change' | 'new_case' | 'alert';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  caseId?: string;
  metadata?: Record<string, unknown>;
}

interface NotificationsProps {
  onViewCase?: (caseId: string) => void;
}

const typeConfig: Record<string, { icon: typeof Bell; color: string; bgColor: string }> = {
  payment: {
    icon: DollarSign,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/20 border-emerald-500/30',
  },
  overdue: {
    icon: AlertTriangle,
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/20 border-amber-500/30',
  },
  status_change: {
    icon: CheckCircle,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/20 border-blue-500/30',
  },
  new_case: {
    icon: FileText,
    color: 'text-violet-400',
    bgColor: 'bg-violet-500/20 border-violet-500/30',
  },
  alert: {
    icon: AlertTriangle,
    color: 'text-rose-400',
    bgColor: 'bg-rose-500/20 border-rose-500/30',
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

  return date.toLocaleDateString('sv-SE', { day: 'numeric', month: 'short' });
};

const Notifications: React.FC<NotificationsProps> = ({ onViewCase }) => {
  const { tenant } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const generateNotifications = useCallback(async () => {
    if (!tenant?.id) return;

    setIsLoading(true);
    const generatedNotifications: Notification[] = [];

    try {
      // Fetch recent payments (last 7 days) for payment notifications
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      const { data: payments } = await supabase
        .from('payments')
        .select('id, amount_sek, payment_date, invoice_id')
        .eq('tenant_id', tenant.id)
        .gte('payment_date', sevenDaysAgo)
        .order('payment_date', { ascending: false })
        .limit(5);

      if (payments) {
        payments.forEach((payment) => {
          generatedNotifications.push({
            id: `payment-${payment.id}`,
            type: 'payment',
            title: 'Betalning mottagen',
            message: `${payment.amount_sek.toLocaleString('sv-SE')} kr har betalats`,
            timestamp: payment.payment_date,
            read: false,
            caseId: payment.invoice_id,
          });
        });
      }

      // Fetch overdue cases (> 30 days overdue)
      const { data: invoices, error: invoicesError } = await supabase
        .from('invoices')
        .select('id, fortnox_invoice_number, due_date, remaining_amount_sek, status')
        .eq('tenant_id', tenant.id)
        .in('status', ['in_collection', 'pending', 'new'])
        .order('due_date', { ascending: true })
        .limit(10);

      if (invoicesError) {
        console.warn('Could not fetch invoices for notifications:', invoicesError.message);
      }

      if (invoices && !invoicesError) {
        const now = new Date();
        invoices.forEach((invoice) => {
          const dueDate = new Date(invoice.due_date);
          const daysOverdue = Math.floor((now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));

          if (daysOverdue > 60) {
            generatedNotifications.push({
              id: `overdue-critical-${invoice.id}`,
              type: 'alert',
              title: 'Kritiskt försenat ärende',
              message: `Faktura ${invoice.fortnox_invoice_number || invoice.id.slice(0, 8)} är ${daysOverdue} dagar försenad`,
              timestamp: new Date(now.getTime() - Math.random() * 86400000).toISOString(),
              read: false,
              caseId: invoice.id,
            });
          } else if (daysOverdue > 30) {
            generatedNotifications.push({
              id: `overdue-${invoice.id}`,
              type: 'overdue',
              title: 'Försenat ärende',
              message: `Faktura ${invoice.fortnox_invoice_number || invoice.id.slice(0, 8)} är ${daysOverdue} dagar försenad`,
              timestamp: new Date(now.getTime() - Math.random() * 86400000 * 2).toISOString(),
              read: false,
              caseId: invoice.id,
            });
          }
        });
      }

      // Fetch recent status changes from communication log
      const { data: statusChanges } = await supabase
        .from('communication_log')
        .select('id, invoice_id, subject, created_at')
        .eq('tenant_id', tenant.id)
        .ilike('subject', '%status%')
        .gte('created_at', sevenDaysAgo)
        .order('created_at', { ascending: false })
        .limit(3);

      if (statusChanges) {
        statusChanges.forEach((change) => {
          generatedNotifications.push({
            id: `status-${change.id}`,
            type: 'status_change',
            title: 'Statusändring',
            message: change.subject || 'Ärendet har uppdaterats',
            timestamp: change.created_at,
            read: false,
            caseId: change.invoice_id || undefined,
          });
        });
      }

      // Sort by timestamp (most recent first)
      generatedNotifications.sort((a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      setNotifications(generatedNotifications.slice(0, 10));
    } catch (error) {
      console.error('Error generating notifications:', error);
    } finally {
      setIsLoading(false);
    }
  }, [tenant?.id]);

  useEffect(() => {
    generateNotifications();
  }, [generateNotifications]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    if (notification.caseId && onViewCase) {
      onViewCase(notification.caseId);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all"
      >
        <Bell className="w-5 h-5 text-gray-400" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-xs font-bold bg-violet-500 text-white rounded-full">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown - rendered via portal to escape stacking context */}
      {isOpen && createPortal(
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/30 z-[99998]"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown Panel */}
          <div className="fixed top-20 right-6 w-96 max-h-[70vh] overflow-hidden bg-[#1a1a2e] border border-white/20 rounded-xl shadow-2xl z-[99999]">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-[#1a1a2e]">
              <h3 className="text-lg font-display font-semibold text-white">
                Notifikationer
              </h3>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-violet-400 hover:text-violet-300 transition-colors"
                  >
                    Markera alla lästa
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Notification List */}
            <div className="max-h-[50vh] overflow-y-auto bg-[#1a1a2e]">
              {isLoading ? (
                <div className="p-4 space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse flex gap-3">
                      <div className="w-10 h-10 rounded-lg bg-white/5" />
                      <div className="flex-1">
                        <div className="w-32 h-4 bg-white/5 rounded mb-2" />
                        <div className="w-48 h-3 bg-white/5 rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-500">Inga notifikationer</p>
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {notifications.map((notification) => {
                    const config = typeConfig[notification.type] || typeConfig.alert;
                    const Icon = config.icon;

                    return (
                      <button
                        key={notification.id}
                        onClick={() => handleNotificationClick(notification)}
                        className={`w-full p-4 flex items-start gap-3 text-left hover:bg-white/5 transition-colors ${
                          !notification.read ? 'bg-white/[0.02]' : ''
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-lg ${config.bgColor} border flex items-center justify-center flex-shrink-0`}>
                          <Icon className={`w-5 h-5 ${config.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-medium ${notification.read ? 'text-gray-300' : 'text-white'}`}>
                              {notification.title}
                            </span>
                            {!notification.read && (
                              <span className="w-2 h-2 rounded-full bg-violet-500 flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-xs text-gray-400 truncate mt-0.5">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatTimeAgo(notification.timestamp)}
                          </p>
                        </div>
                        {notification.caseId && (
                          <ChevronRight className="w-4 h-4 text-gray-600 flex-shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-3 border-t border-white/10 bg-[#1a1a2e]">
                <button
                  onClick={() => {
                    generateNotifications();
                  }}
                  className="w-full text-center text-sm text-violet-400 hover:text-violet-300 transition-colors"
                >
                  Uppdatera
                </button>
              </div>
            )}
          </div>
        </>,
        document.body
      )}
    </div>
  );
};

export default Notifications;
