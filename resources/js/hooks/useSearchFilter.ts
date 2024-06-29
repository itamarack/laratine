import { router } from "@inertiajs/react";
import { useThrottledCallback } from "@mantine/hooks";
import { DataTableSortStatus } from "mantine-datatable";
import { useEffect, useState } from "react";

type SearchFilerProps<T> = {
  isFetching: boolean;
  search: string;
  onSearch: (e: string) => void;
  onPageChange: (e: number) => void;
  onRecordsPerPage: (e: number) => void;
  sortStatus: DataTableSortStatus<T>;
  onSortStatus: (e: DataTableSortStatus<T>) => void;
}

export default function useSearchFilter<T>(endpoint: string): SearchFilerProps<T> {
  const [search, setSearch] = useState<string>('');
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus<T>>({
    columnAccessor: 'user',
    direction: 'asc',
  });

  router.on('start', () => setIsFetching(() => true));
  router.on('finish', () => setIsFetching(() => false));

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    setSearch(queryParams.get('search') ?? '');
  }, []);

  const onQueryTable = (queryKey: string, queryValue: string) => {
    const queryParams = new URLSearchParams(window.location.search);
    queryParams.set(queryKey, queryValue.toString());

    if (queryKey === 'per_page') queryParams.set('page', '1');

    const payload = Object.fromEntries(queryParams);
    router.get(route(endpoint), payload, { preserveState: true });
  };

  const onSortStatus = ({ columnAccessor, direction }: DataTableSortStatus<T>) => {
    onQueryTable('sort', direction === 'asc' ? String(columnAccessor) : `-${String(columnAccessor)}`);
    setSortStatus(() => ({ columnAccessor, direction }));
  };

  const throttledCallback = useThrottledCallback(({ search }) => {
    onQueryTable('search', search);
  }, 2000);

  const onSearch = (search: string) => {
    setSearch(() => search);
    throttledCallback({ search });
  }

  const onPageChange = (page: number) => {
    onQueryTable('page', page.toString())
  }

  const onRecordsPerPage = (page: number) => {
    onQueryTable('per_page', page.toString())
  }

  return {
    isFetching,
    search,
    onSearch,
    sortStatus,
    onSortStatus,
    onPageChange,
    onRecordsPerPage
  }
}
