import React, { useState, useMemo } from 'react';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Mail,
  Phone,
  MessageSquare,
  FileText,
  Banknote,
  AlertCircle,
  Clock,
  CheckCircle,
  Filter,
} from 'lucide-react';
import { CaseWithCustomer } from '../../hooks/useCases';
import { CommunicationLog } from '../../types/supabase';

interface TimelineViewProps {
  cases: CaseWithCustomer[];
  communications: CommunicationLog[];
  isLoading?: boolean;
  onSelectCase?: (caseId: string) => void;
}

interface TimelineEvent {
  id: string;
  date: Date;
  type: 'communication' | 'payment' | 'due_date' | 'status_change';
  title: string;
  description?: string;
  caseId?: string;
  invoiceNumber?: string;
  customerName?: string;
  amount?: number;
  channel?: string;
  status?: string;
}

const channelIcons: Record<string, typeof Mail> = {
  email: Mail,
  sms: MessageSquare,
  phone: Phone,
  letter: FileText,
};

const typeColors: Record<string, { bg: string; text: string; border: string }> = {
  communication: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30' },
  payment: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/30' },
  due_date: { bg: 'bg-rose-500/20', text: 'text-rose-400', border: 'border-rose-500/30' },
  status_change: { bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/30' },
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('sv-SE', {
    style: 'currency',
    currency: 'SEK',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const TimelineView: React.FC<TimelineViewProps> = ({
  cases,
  communications,
  isLoading,
  onSelectCase,
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedTypes, setSelectedTypes] = useState<string[]>(['communication', 'payment', 'due_date']);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  // Build timeline events
  const allEvents = useMemo(() => {
    const events: TimelineEvent[] = [];

    // Add communications
    communications.forEach((comm) => {
      events.push({
        id: `comm-${comm.id}`,
        date: new Date(comm.created_at),
        type: 'communication',
        title: comm.subject || `${comm.channel} skickad`,
        description: comm.ai_summary,
        caseId: comm.invoice_id || undefined,
        channel: comm.channel,
        status: comm.status,
      });
    });

    // Add payments and due dates from cases
    cases.forEach((caseItem) => {
      // Due date
      const dueDate = new Date(caseItem.due_date);
      events.push({
        id: `due-${caseItem.id}`,
        date: dueDate,
        type: 'due_date',
        title: `Förfallodatum: ${caseItem.fortnox_invoice_number || caseItem.id.slice(0, 8)}`,
        description: caseItem.customer_name,
        caseId: caseItem.id,
        invoiceNumber: caseItem.fortnox_invoice_number || caseItem.id.slice(0, 8),
        customerName: caseItem.customer_name,
        amount: caseItem.remaining_amount_sek,
      });

      // Payments
      if (caseItem.payments) {
        caseItem.payments.forEach((payment) => {
          events.push({
            id: `payment-${payment.id}`,
            date: new Date(payment.payment_date),
            type: 'payment',
            title: 'Betalning mottagen',
            description: `${caseItem.fortnox_invoice_number || caseItem.id.slice(0, 8)} - ${caseItem.customer_name}`,
            caseId: caseItem.id,
            invoiceNumber: caseItem.fortnox_invoice_number || caseItem.id.slice(0, 8),
            customerName: caseItem.customer_name,
            amount: payment.amount_sek,
          });
        });
      }
    });

    return events.sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [cases, communications]);

  // Filter events by selected types and month
  const filteredEvents = useMemo(() => {
    return allEvents.filter((event) => {
      if (!selectedTypes.includes(event.type)) return false;

      if (viewMode === 'calendar') {
        const eventMonth = event.date.getMonth();
        const eventYear = event.date.getFullYear();
        return eventMonth === currentMonth.getMonth() && eventYear === currentMonth.getFullYear();
      }

      return true;
    });
  }, [allEvents, selectedTypes, currentMonth, viewMode]);

  // Group events by date for list view
  const groupedEvents = useMemo(() => {
    const groups: Record<string, TimelineEvent[]> = {};

    filteredEvents.forEach((event) => {
      const dateKey = event.date.toISOString().split('T')[0];
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(event);
    });

    return Object.entries(groups)
      .sort(([a], [b]) => b.localeCompare(a))
      .slice(0, 30); // Limit to 30 days
  }, [filteredEvents]);

  // Calendar grid
  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startPadding = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1; // Monday start

    const days: { date: Date; events: TimelineEvent[]; isCurrentMonth: boolean }[] = [];

    // Previous month padding
    for (let i = startPadding - 1; i >= 0; i--) {
      const date = new Date(year, month, -i);
      days.push({
        date,
        events: filteredEvents.filter((e) => e.date.toDateString() === date.toDateString()),
        isCurrentMonth: false,
      });
    }

    // Current month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(year, month, i);
      days.push({
        date,
        events: filteredEvents.filter((e) => e.date.toDateString() === date.toDateString()),
        isCurrentMonth: true,
      });
    }

    // Next month padding
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      const date = new Date(year, month + 1, i);
      days.push({
        date,
        events: filteredEvents.filter((e) => e.date.toDateString() === date.toDateString()),
        isCurrentMonth: false,
      });
    }

    return days;
  }, [currentMonth, filteredEvents]);

  const toggleType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const navigateMonth = (direction: number) => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + direction, 1));
  };

  if (isLoading) {
    return (
      <div className="glass border border-white/10 rounded-xl p-6">
        <div className="animate-pulse space-y-4">
          <div className="w-48 h-6 bg-white/5 rounded" />
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-white/5" />
                <div className="flex-1">
                  <div className="w-32 h-4 bg-white/5 rounded mb-2" />
                  <div className="w-48 h-3 bg-white/5 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass border border-white/10 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-violet-500/20 border border-violet-500/30 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-violet-400" />
            </div>
            <div>
              <h3 className="text-lg font-display font-semibold text-white">Tidslinje</h3>
              <p className="text-sm text-gray-500">Alla händelser kronologiskt</p>
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                viewMode === 'list'
                  ? 'bg-violet-500/20 text-violet-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Lista
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                viewMode === 'calendar'
                  ? 'bg-violet-500/20 text-violet-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Kalender
            </button>
          </div>
        </div>

        {/* Type Filters */}
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="text-xs text-gray-500 flex items-center gap-1">
            <Filter className="w-3 h-3" />
            Visa:
          </span>
          {[
            { type: 'communication', label: 'Kommunikation', color: 'blue' },
            { type: 'payment', label: 'Betalningar', color: 'emerald' },
            { type: 'due_date', label: 'Förfallodatum', color: 'rose' },
          ].map((filter) => (
            <button
              key={filter.type}
              onClick={() => toggleType(filter.type)}
              className={`px-3 py-1 rounded-full text-xs transition-colors ${
                selectedTypes.includes(filter.type)
                  ? `${typeColors[filter.type].bg} ${typeColors[filter.type].text} border ${typeColors[filter.type].border}`
                  : 'bg-white/5 border border-white/10 text-gray-500'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Month Navigation (Calendar mode) */}
        {viewMode === 'calendar' && (
          <div className="mt-4 flex items-center justify-between">
            <button
              onClick={() => navigateMonth(-1)}
              className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-white font-medium">
              {currentMonth.toLocaleDateString('sv-SE', { month: 'long', year: 'numeric' })}
            </span>
            <button
              onClick={() => navigateMonth(1)}
              className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      {viewMode === 'list' ? (
        /* List View */
        <div className="max-h-[65vh] sm:max-h-[600px] overflow-y-auto">
          {groupedEvents.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Inga händelser att visa</p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {groupedEvents.map(([dateKey, events]) => (
                <div key={dateKey} className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="text-sm font-medium text-white">
                      {new Date(dateKey).toLocaleDateString('sv-SE', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                      })}
                    </div>
                    <div className="flex-1 h-px bg-white/10" />
                    <span className="text-xs text-gray-500">{events.length} händelser</span>
                  </div>
                  <div className="space-y-3 ml-4">
                    {events.map((event) => {
                      const colors = typeColors[event.type];
                      const Icon = event.channel ? channelIcons[event.channel] || Mail :
                        event.type === 'payment' ? Banknote :
                        event.type === 'due_date' ? AlertCircle : CheckCircle;

                      return (
                        <div
                          key={event.id}
                          className={`flex items-start gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors ${
                            onSelectCase && event.caseId ? 'cursor-pointer' : ''
                          }`}
                          onClick={() => onSelectCase && event.caseId && onSelectCase(event.caseId)}
                        >
                          <div className={`w-8 h-8 rounded-lg ${colors.bg} border ${colors.border} flex items-center justify-center flex-shrink-0`}>
                            <Icon className={`w-4 h-4 ${colors.text}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <p className="text-sm font-medium text-white">{event.title}</p>
                                {event.description && (
                                  <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{event.description}</p>
                                )}
                              </div>
                              {event.amount && (
                                <span className={`text-sm font-semibold ${event.type === 'payment' ? 'text-emerald-400' : 'text-white'}`}>
                                  {event.type === 'payment' ? '+' : ''}{formatCurrency(event.amount)}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              {event.date.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Calendar View */
        <div className="p-4">
          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Mån', 'Tis', 'Ons', 'Tor', 'Fre', 'Lör', 'Sön'].map((day) => (
              <div key={day} className="text-center text-xs text-gray-500 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, index) => {
              const isToday = day.date.toDateString() === new Date().toDateString();
              const hasEvents = day.events.length > 0;

              return (
                <div
                  key={index}
                  className={`min-h-[60px] sm:min-h-[80px] p-1 rounded-lg border transition-colors ${
                    day.isCurrentMonth
                      ? 'bg-white/5 border-white/10'
                      : 'bg-transparent border-transparent'
                  } ${isToday ? 'ring-1 ring-violet-500/50' : ''}`}
                >
                  <div className={`text-xs mb-1 ${
                    day.isCurrentMonth ? 'text-white' : 'text-gray-600'
                  } ${isToday ? 'font-bold text-violet-400' : ''}`}>
                    {day.date.getDate()}
                  </div>
                  {hasEvents && (
                    <div className="space-y-0.5">
                      {day.events.slice(0, 3).map((event) => (
                        <div
                          key={event.id}
                          className={`text-[10px] px-1 py-0.5 rounded truncate ${typeColors[event.type].bg} ${typeColors[event.type].text}`}
                          title={event.title}
                        >
                          {event.type === 'payment' ? '💰' : event.type === 'due_date' ? '📅' : '📧'}
                        </div>
                      ))}
                      {day.events.length > 3 && (
                        <div className="text-[10px] text-gray-500 px-1">
                          +{day.events.length - 3} mer
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default TimelineView;
