'use client';

import { ReactNode, useEffect, useMemo, useState } from 'react';
import { DataTable, DataTableProps, DataTableSortStatus } from 'mantine-datatable';
import {
  Avatar,
  Badge,
  Button,
  Flex,
  Group,
  Stack,
  Text,
  TextInput,
  UnstyledButton,
  useMantineTheme,
} from '@mantine/core';
import sortBy from 'lodash/sortBy';
import { useDebouncedValue } from '@mantine/hooks';
import { IconTrash, IconEdit, IconSearch } from '@tabler/icons-react';
import '@mantine/core/styles.layer.css';
import 'mantine-datatable/styles.layer.css';
import { ErrorAlert } from '@/Components';
import { User } from '@/types';

type DatatableProps = {
  data: User[];
  error?: ReactNode;
  loading?: boolean;
};

const Datatable = ({ data, error, loading }: DatatableProps) => {
  const theme = useMantineTheme();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [selectedRecords, setSelectedRecords] = useState<User[]>([]);
  const [records, setRecords] = useState<User[]>(data.slice(0, pageSize));
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus<User>>({
    columnAccessor: 'user',
    direction: 'asc',
  });
  const [query, setQuery] = useState('');
  const [debouncedQuery] = useDebouncedValue(query, 200);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const statuses = useMemo(() => {
    const statuses = new Set(data.map(e => e.email_verified_at));
    return [...statuses];
  }, [data]);

  const columns: DataTableProps<User>['columns'] = [
    {
      accessor: 'user',
      title: 'User',
      render: ({ firstname = '', lastname = '', email, avatar }: User) => {
        return (
          <Flex component={UnstyledButton} gap="xs" align="center">
            <Avatar
              variant="filled"
              radius="xl"
              size="md"
              src={avatar}
              alt={`${firstname} ${lastname}`}
              color={theme.primaryColor}
            >
              {firstname[0]} {lastname[0]}
            </Avatar>
            <Stack gap={0}>
              <Text fz="sm" fw={600}>
                {firstname} {lastname}
              </Text>
              <Text fz="xs">{email}</Text>
            </Stack>
          </Flex>
        );
      },
      sortable: true,
      filter: (
        <TextInput
          label="Users"
          description="Show all users in the system"
          placeholder="Search users..."
          leftSection={<IconSearch size={16} />}
          value={query}
          onChange={e => setQuery(e.currentTarget.value)}
        />
      ),
      filtering: query !== '',
    },
    {
      accessor: 'Status',
      render: ({ email_verified_at }: User) => (
        <Badge color={email_verified_at ? 'green.8' : 'red'} variant="filled" size="sm" radius="sm">
          {email_verified_at ? 'Verified' : 'Unverified'}
        </Badge>
      ),
    },
    {
      accessor: 'created_at',
      sortable: true,
      render: ({ created_at }: User) => <Text fz="sm">{created_at}</Text>,
    },
    {
      accessor: 'updated_at',
      sortable: true,
      render: ({ updated_at }: User) => <Text fz="sm">{updated_at}</Text>,
    },
    {
      accessor: '',
      title: 'Actions',
      render: (item: any) => (
        <Group gap="sm">
          <Button variant="filled" size="xs" leftSection={<IconEdit size={16} />}>
            Edit
          </Button>
          <Button variant="filled" size="xs" color="red" leftSection={<IconTrash size={16} />}>
            Delete
          </Button>
        </Group>
      ),
    },
  ];

  useEffect(() => {
    setPage(1);
  }, [pageSize]);

  useEffect(() => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize;
    const d = sortBy(data, sortStatus.columnAccessor) as User[];
    const dd = sortStatus.direction === 'desc' ? d.reverse() : d;
    let filtered = dd.slice(from, to) as User[];

    if (debouncedQuery || selectedStatuses.length) {
      filtered = data
        .filter(({ firstname, lastname, email_verified_at }) => {
          if (
            (debouncedQuery !== '' &&
              !firstname?.toLowerCase().includes(debouncedQuery.trim().toLowerCase())) ||
            !lastname?.toLowerCase().includes(debouncedQuery.trim().toLowerCase())
          ) {
            return false;
          }

          if (selectedStatuses.length && !selectedStatuses.some(s => s === email_verified_at)) {
            return false;
          }

          return true;
        })
        .slice(from, to);
    }

    setRecords(filtered);
  }, [sortStatus, data, page, pageSize, debouncedQuery, selectedStatuses]);

  return error ? (
    <ErrorAlert title="Error loading users" message={error.toString()} />
  ) : (
    <DataTable
      minHeight={200}
      verticalSpacing="xs"
      striped
      highlightOnHover
      columns={columns}
      records={records}
      selectedRecords={selectedRecords}
      onSelectedRecordsChange={setSelectedRecords}
      totalRecords={debouncedQuery || selectedStatuses.length > 0 ? records.length : data.length}
      recordsPerPage={pageSize}
      page={page}
      onPageChange={p => setPage(p)}
      recordsPerPageOptions={[5, 10, 20]}
      onRecordsPerPageChange={setPageSize}
      sortStatus={sortStatus}
      onSortStatusChange={setSortStatus}
      fetching={loading}
    />
  );
};

export default Datatable;
