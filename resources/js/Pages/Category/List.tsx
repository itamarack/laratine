'use client';

import {
  ActionIcon,
  Anchor,
  Button,
  Container,
  Flex,
  Group,
  Paper,
  PaperProps,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import _first from 'lodash/first';
import { Head, Link, router } from '@inertiajs/react';
import { useThrottledCallback, useDisclosure } from '@mantine/hooks';
import { DataTable, DataTableProps, DataTableSortStatus } from 'mantine-datatable';
import { IconDotsVertical, IconEdit, IconPlus, IconSearch, IconTrash } from '@tabler/icons-react';
import { CreateCategory, DeleteCategory, EditCategory } from '@/Pages/Category';
import { PageHeader } from '@/Components';
import { AuthenticatedLayout } from '@/Layouts';
import { Category, PageProps } from '@/types';
import { dashboardRoute } from '@/routes';

type CategoryProps = {
  categories: any;
} & PageProps;

const items = [
  { title: 'Dashboard', href: dashboardRoute() },
  { title: 'Categories', href: '#' },
].map((item, index) => (
  <Anchor component={Link} href={item.href} key={index}>
    {item.title}
  </Anchor>
));

const PAPER_PROPS: PaperProps = {
  p: 'md',
  shadow: 'md',
  radius: 'md',
};

export default function List({ auth, categories }: CategoryProps) {
  const [fetching, setFetching] = useState<boolean>(false);
  const [selected, setSelected] = useState<Category>();
  const [isOpenDelete, { open: onOpenDelete, close: onCloseDelete }] = useDisclosure(false);
  const [isOpenCreate, { open: onOpenCreate, close: onCloseCreate }] = useDisclosure(false);
  const [isOpenEdit, { open: onOpenEdit, close: onCloseEdit }] = useDisclosure(false);
  const [search, setSearch] = useState<string>('');
  const [selectedRecords, setSelectedRecords] = useState<Category[]>([]);
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus<Category>>({
    columnAccessor: 'user',
    direction: 'asc',
  });

  const RECORD_PAGINATOR = [5, 10, 20, 50];

  router.on('start', () => setFetching(() => true));
  router.on('finish', () => setFetching(() => false));

  const onQueryTable = (queryKey: string, queryValue: string) => {
    const queryParams = new URLSearchParams(window.location.search);
    queryParams.set(queryKey, queryValue.toString());

    if (queryKey === 'per_page') queryParams.set('page', '1');

    const payload = Object.fromEntries(queryParams);
    router.get(route('category.index'), payload, { preserveState: true });
  };

  const onSortStatusChange = ({ columnAccessor, direction }: DataTableSortStatus<Category>) => {
    onQueryTable('sort', direction === 'asc' ? columnAccessor : `-${columnAccessor}`);
    setSortStatus(() => ({ columnAccessor, direction }));
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    setSearch(queryParams.get('search') ?? '');
  }, []);

  const throttledSearch = useThrottledCallback(search => {
    onQueryTable('search', search);
  }, 3000);

  const columns: DataTableProps<Category>['columns'] = [
    {
      accessor: 'title',
      title: 'Title',
      render: ({ title }: Category) => {
        return <Text fz={'sm'}>{title}</Text>;
      },
      sortable: true,
      filter: (
        <TextInput
          label="Categories"
          description="Show all categories in the system"
          placeholder="Search categories..."
          leftSection={<IconSearch size={16} />}
          value={search}
          onChange={e => {
            setSearch(e.currentTarget.value);
            throttledSearch(e.currentTarget.value);
          }}
        />
      ),
    },
    {
      accessor: 'slug',
      render: ({ slug }: Category) => <Text fz="sm">{slug}</Text>,
    },
    {
      accessor: 'description',
      width: 300,
      render: ({ description }: Category) => <Text fz="sm">{description}</Text>,
    },
    {
      accessor: 'created_at',
      sortable: true,
      render: ({ created_at }: Category) => (
        <Text fz="sm">{dayjs(new Date(created_at)).format('MMM D, YYYY')}</Text>
      ),
    },
    {
      accessor: 'updated_at',
      sortable: true,
      render: ({ updated_at }: Category) => (
        <Text fz="sm">{dayjs(new Date(updated_at)).format('MMM D, YYYY')}</Text>
      ),
    },
    {
      accessor: '',
      title: 'Actions',
      render: (category: Category) => (
        <Flex gap="sm">
          <Button
            variant="filled"
            size="xs"
            leftSection={<IconEdit size={16} />}
            onClick={() => {
              setSelected(() => category);
              onOpenEdit();
            }}
          >
            Edit
          </Button>
          <Button
            onClick={() => {
              setSelected(() => category);
              onOpenDelete();
            }}
            variant="filled"
            size="xs"
            color="red"
            leftSection={<IconTrash size={16} />}
          >
            Delete
          </Button>
        </Flex>
      ),
    },
  ];

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Categories | Publishing" />

      <CreateCategory isOpen={isOpenCreate} onClose={onCloseCreate} />
      <EditCategory category={selected} isOpen={isOpenEdit} onClose={onCloseEdit} />
      <DeleteCategory category={selected} isOpen={isOpenDelete} onClose={onCloseDelete} />

      <Container fluid>
        <Stack gap="lg">
          <PageHeader
            user={auth.user}
            title="Categories"
            breadcrumbItems={items}
            withActions={
              <Button leftSection={<IconPlus size={18} />} onClick={onOpenCreate}>
                New Category
              </Button>
            }
          />
          <Paper {...PAPER_PROPS}>
            <Group justify="space-between" mb="md">
              <Text fz="lg" fw={600}>
                Categories
              </Text>
              <ActionIcon>
                <IconDotsVertical size={18} />
              </ActionIcon>
            </Group>
            <DataTable
              minHeight={200}
              verticalSpacing="xs"
              striped
              highlightOnHover
              columns={columns}
              records={categories.data}
              selectedRecords={selectedRecords}
              onSelectedRecordsChange={setSelectedRecords}
              totalRecords={categories.total}
              recordsPerPage={categories.per_page}
              page={categories.current_page}
              onPageChange={p => onQueryTable('page', p.toString())}
              recordsPerPageOptions={RECORD_PAGINATOR}
              onRecordsPerPageChange={p => onQueryTable('per_page', p.toString())}
              sortStatus={sortStatus}
              onSortStatusChange={onSortStatusChange}
              fetching={fetching}
            />
          </Paper>
        </Stack>
      </Container>
    </AuthenticatedLayout>
  );
}
