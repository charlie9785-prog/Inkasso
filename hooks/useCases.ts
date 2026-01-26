import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';
import { Invoice, Customer, CommunicationLog, Payment } from '../types/supabase';

// Extended invoice type with customer info for display
export interface CaseWithCustomer extends Invoice {
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  customer_org_number?: string;
  days_overdue: number;
  activities?: CommunicationLog[];
  payments?: Payment[];
  customer?: Customer;
}

interface UseCasesReturn {
  cases: CaseWithCustomer[];
  selectedCase: CaseWithCustomer | null;
  recentCommunications: CommunicationLog[];
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  totalCount: number;
  selectCase: (caseId: string | null) => void;
  loadMore: () => void;
  refetch: () => void;
}

const PAGE_SIZE = 50;

export const useCases = (): UseCasesReturn => {
  const { tenant } = useAuth();
  const [cases, setCases] = useState<CaseWithCustomer[]>([]);
  const [selectedCase, setSelectedCase] = useState<CaseWithCustomer | null>(null);
  const [recentCommunications, setRecentCommunications] = useState<CommunicationLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);

  // Transform invoice data to CaseWithCustomer format
  const transformInvoice = (invoice: any): CaseWithCustomer => {
    const today = new Date();
    const dueDate = new Date(invoice.due_date);
    const daysOverdue = Math.max(0, Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)));

    return {
      ...invoice,
      customer_name: invoice.customer?.name || 'Okänd kund',
      customer_email: invoice.customer?.email,
      customer_phone: invoice.customer?.phone,
      customer_org_number: invoice.customer?.org_number,
      days_overdue: daysOverdue,
    };
  };

  const fetchCases = useCallback(async (reset = true) => {
    if (!tenant?.id) {
      setCases([]);
      setIsLoading(false);
      return;
    }

    if (reset) {
      setIsLoading(true);
      setPage(0);
    } else {
      setIsLoadingMore(true);
    }
    setError(null);

    const currentPage = reset ? 0 : page;
    const from = currentPage * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    try {
      // Get total count first (only on reset)
      if (reset) {
        const { count, error: countError } = await supabase
          .from('invoices')
          .select('*', { count: 'exact', head: true })
          .eq('tenant_id', tenant.id);

        if (!countError && count !== null) {
          setTotalCount(count);
        }
      }

      // Fetch paginated invoices with customer info
      const { data, error: fetchError } = await supabase
        .from('invoices')
        .select(`
          *,
          customer:customers(id, name, email, phone, org_number)
        `)
        .eq('tenant_id', tenant.id)
        .order('due_date', { ascending: false })
        .range(from, to);

      if (fetchError) {
        throw new Error(fetchError.message);
      }

      const transformedCases = (data || []).map(transformInvoice);

      if (reset) {
        setCases(transformedCases);
      } else {
        setCases(prev => [...prev, ...transformedCases]);
      }

      setHasMore(transformedCases.length === PAGE_SIZE);
      if (!reset) {
        setPage(currentPage + 1);
      } else {
        setPage(1);
      }

      // Also fetch recent communications (only on reset)
      if (reset) {
        const { data: commsData, error: commsError } = await supabase
          .from('communication_log')
          .select('*')
          .eq('tenant_id', tenant.id)
          .order('created_at', { ascending: false })
          .limit(20);

        if (!commsError && commsData) {
          setRecentCommunications(commsData);
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Kunde inte hämta ärenden';
      setError(message);
      console.error('Error fetching cases:', err);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, [tenant?.id, page]);

  const loadMore = useCallback(() => {
    if (!isLoadingMore && hasMore) {
      fetchCases(false);
    }
  }, [fetchCases, isLoadingMore, hasMore]);

  const selectCase = useCallback(async (caseId: string | null) => {
    if (!caseId || !tenant?.id) {
      setSelectedCase(null);
      return;
    }

    setIsLoading(true);

    try {
      // Fetch the case details with customer info
      const { data: caseData, error: caseError } = await supabase
        .from('invoices')
        .select(`
          *,
          customer:customers(id, name, email, phone, org_number, address_line1, postal_code, city)
        `)
        .eq('id', caseId)
        .eq('tenant_id', tenant.id)
        .single();

      if (caseError || !caseData) {
        throw new Error(caseError?.message || 'Ärendet hittades inte');
      }

      // Fetch communication log (activities) for this case
      const { data: activities, error: activitiesError } = await supabase
        .from('communication_log')
        .select('*')
        .eq('invoice_id', caseId)
        .eq('tenant_id', tenant.id)
        .order('created_at', { ascending: false });

      if (activitiesError) {
        console.warn('Could not fetch activities:', activitiesError.message);
      }

      // Fetch payments for this invoice
      const { data: payments, error: paymentsError } = await supabase
        .from('payments')
        .select('*')
        .eq('invoice_id', caseId)
        .eq('tenant_id', tenant.id)
        .order('payment_date', { ascending: false });

      if (paymentsError) {
        console.warn('Could not fetch payments:', paymentsError.message);
      }

      // Calculate days overdue
      const today = new Date();
      const dueDate = new Date(caseData.due_date);
      const daysOverdue = Math.max(0, Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)));

      setSelectedCase({
        ...caseData,
        customer_name: caseData.customer?.name || 'Okänd kund',
        customer_email: caseData.customer?.email,
        customer_phone: caseData.customer?.phone,
        customer_org_number: caseData.customer?.org_number,
        days_overdue: daysOverdue,
        activities: activities || [],
        payments: payments || [],
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Kunde inte hämta ärendedetaljer';
      setError(message);
      console.error('Error fetching case details:', err);
      setSelectedCase(null);
    } finally {
      setIsLoading(false);
    }
  }, [tenant?.id]);

  useEffect(() => {
    fetchCases(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tenant?.id]);

  return {
    cases,
    selectedCase,
    recentCommunications,
    isLoading,
    isLoadingMore,
    error,
    hasMore,
    totalCount,
    selectCase,
    loadMore,
    refetch: () => fetchCases(true),
  };
};

export default useCases;
