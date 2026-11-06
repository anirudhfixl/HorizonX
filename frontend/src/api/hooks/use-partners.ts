import { useAsyncQuery } from './use-async-query';
import { partnerService } from '../services/partners/partner.service';
import type {
  PartnerItem,
  PartnerFilters,
  PartnerSortParams,
  PaginationParams,
} from '../types';

export function usePartners(
  filters?: PartnerFilters,
  pagination?: PaginationParams,
  sort?: PartnerSortParams
) {
  const query = useAsyncQuery(
    async () => {
      const res = await partnerService.getAll(filters, pagination, sort);
      return res.data;
    },
    [JSON.stringify(filters), JSON.stringify(pagination), JSON.stringify(sort)]
  );

  return {
    partners: query.data?.items ?? [],
    data: query.data?.items ?? [],
    pagination: query.data?.pagination,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    isEmpty: query.isEmpty,
    refetch: query.refetch,
  };
}

export function usePartner(id: string | undefined) {
  const query = useAsyncQuery(
    async () => {
      if (!id) return null;
      const res = await partnerService.getById(id);
      return res.data;
    },
    [id],
    { enabled: Boolean(id) }
  );

  return {
    partner: query.data ?? null,
    data: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

export function usePartnerProgramMetrics() {
  const query = useAsyncQuery(async () => {
    const res = await partnerService.getProgramMetrics();
    return res.data;
  }, []);

  return {
    metrics: query.data ?? null,
    data: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

export function usePartnerBenefits() {
  const query = useAsyncQuery(async () => {
    const res = await partnerService.getBenefits();
    return res.data;
  }, []);

  return {
    benefits: query.data ?? [],
    data: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
