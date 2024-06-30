'use client';

import {
  ActionIcon,
  Anchor,
  Button,
  Container,
  Flex,
  Group,
  Menu,
  Paper,
  PaperProps,
  Stack,
  Text,
  TextInput,
  rem,
} from '@mantine/core';
import { useState } from 'react';
import dayjs from 'dayjs';
import _first from 'lodash/first';
import { Head, Link } from '@inertiajs/react';
import { useDisclosure } from '@mantine/hooks';
import { DataTable, DataTableProps, DataTableSortStatus } from 'mantine-datatable';
import {
  IconDotsVertical,
  IconEdit,
  IconExternalLink,
  IconPlus,
  IconSearch,
  IconTrash,
} from '@tabler/icons-react';
import { CreateCategory, DeleteCategory, EditCategory } from '@/Pages/Category';
import { PageHeader } from '@/Components';
import { AuthenticatedLayout } from '@/Layouts';
import { Category, PageProps } from '@/types';
import { dashboardRoute } from '@/routes';
import { useSearchFilter } from '@/hooks';

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
  const [selected, setSelected] = useState<Category>();
  const [isOpenDelete, { open: onOpenDelete, close: onCloseDelete }] = useDisclosure(false);
  const [isOpenCreate, { open: onOpenCreate, close: onCloseCreate }] = useDisclosure(false);
  const [isOpenEdit, { open: onOpenEdit, close: onCloseEdit }] = useDisclosure(false);
  const [selectedRecords, setSelectedRecords] = useState<Category[]>([]);
  const searchFilter = useSearchFilter('category.index');

  const onColumnAction = (selected: Category, action: string) => {
    setSelected(() => selected);
    if (action === 'DELETE_ACTION') onOpenDelete();
    else if (action === 'EDIT_ACTION') onOpenEdit();
  };

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
          value={searchFilter.search}
          onChange={e => {
            searchFilter.onSearch(e.currentTarget.value);
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
      accessor: 'id',
      title: 'Actions',
      width: 100,
      render: (category: Category) => (
        <Menu withArrow width={150} shadow="md">
          <Menu.Target>
            <Flex>
              <Button variant="filled" size="xs" rightSection={<IconDotsVertical size={16} />}>
                More
              </Button>
            </Flex>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item
              fw={600}
              fz="sm"
              color="blue"
              variant="filled"
              leftSection={<IconEdit size={16} />}
              onClick={() => onColumnAction(category, 'EDIT_ACTION')}
            >
              Edit
            </Menu.Item>
            <Menu.Item
              fw={600}
              fz="sm"
              color="red"
              variant="filled"
              leftSection={<IconTrash size={16} />}
              onClick={() => onColumnAction(category, 'DELETE_ACTION')}
            >
              Delete
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      ),
    },
  ];

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Categories | Publishing" />

      <CreateCategory
        categories={categories.data}
        isOpen={isOpenCreate}
        onClose={onCloseCreate}
        onSearch={s => searchFilter.onSearch(s.toString())}
      />
      <EditCategory
        categories={categories.data}
        category={selected}
        isOpen={isOpenEdit}
        onClose={onCloseEdit}
        onSearch={s => searchFilter.onSearch(s.toString())}
      />
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
              fetching={searchFilter.isFetching}
              totalRecords={categories.total}
              recordsPerPage={categories.per_page}
              page={categories.current_page}
              recordsPerPageOptions={[5, 10, 20, 50]}
              onSelectedRecordsChange={setSelectedRecords}
              onPageChange={page => searchFilter.onPageChange(page)}
              onRecordsPerPageChange={perPage => searchFilter.onRecordsPerPage(perPage)}
              sortStatus={searchFilter.sortStatus as DataTableSortStatus<Category>}
              onSortStatusChange={(sortStatus: DataTableSortStatus<Category>) =>
                searchFilter.onSortStatus(sortStatus as DataTableSortStatus<any>)
              }
            />
          </Paper>
        </Stack>
      </Container>
    </AuthenticatedLayout>
  );
}
