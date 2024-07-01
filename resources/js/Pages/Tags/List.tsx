'use client';

import {
  Anchor,
  Button,
  Container,
  Flex,
  Menu,
  Paper,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { useState } from 'react';
import dayjs from 'dayjs';
import _first from 'lodash/first';
import { Head, Link } from '@inertiajs/react';
import { useDisclosure } from '@mantine/hooks';
import { DataTable, DataTableProps, DataTableSortStatus } from 'mantine-datatable';
import { IconDotsVertical, IconEdit, IconPlus, IconSearch, IconTrash } from '@tabler/icons-react';
import { CreateTag, DeleteTag, EditTag } from '@/Pages/Tags';
import { PageHeader } from '@/Components';
import { AuthenticatedLayout } from '@/Layouts';
import { Category, PageProps } from '@/types';
import { dashboardRoute } from '@/routes';
import { useSearchFilter } from '@/hooks';

type CategoryProps = {
  tags: {
    data: Category[];
    total: number;
    per_page: number;
    current_page: number;
  };
} & PageProps;

const items = [
  { title: 'Dashboard', href: dashboardRoute() },
  { title: 'Tags', href: '#' },
].map((item, index) => (
  <Anchor component={Link} href={item.href} key={index}>
    {item.title}
  </Anchor>
));

export default function List({ auth, tags }: CategoryProps) {
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
          label="Tags"
          description="Show all tags in the system"
          placeholder="Search tags..."
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
      <Head title="Tags | Publishing" />

      <CreateTag isOpen={isOpenCreate} onClose={onCloseCreate} />
      <EditTag
        categories={tags.data}
        category={selected}
        isOpen={isOpenEdit}
        onClose={onCloseEdit}
        onSearch={s => searchFilter.onSearch(s.toString())}
      />
      <DeleteTag category={selected} isOpen={isOpenDelete} onClose={onCloseDelete} />

      <Container fluid>
        <Stack gap="lg">
          <PageHeader
            user={auth.user}
            title="Tags"
            breadcrumbItems={items}
            withActions={
              <Button leftSection={<IconPlus size={18} />} onClick={onOpenCreate}>
                New Tag
              </Button>
            }
          />
          <Paper p="md" shadow="md" radius="md">
            <DataTable
              minHeight={200}
              verticalSpacing="xs"
              striped
              highlightOnHover
              columns={columns}
              records={tags.data}
              selectedRecords={selectedRecords}
              fetching={searchFilter.isFetching}
              totalRecords={tags.total}
              recordsPerPage={tags.per_page}
              page={tags.current_page}
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
