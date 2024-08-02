'use client';

import {
  Anchor,
  Badge,
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
import { PageHeader } from '@/Components';
import { AuthenticatedLayout } from '@/Layouts';
import { Page, PageProps } from '@/types';
import { useSearchFilter } from '@/Hooks';
import { dashboardRoute, pageRoute } from '@/Routes';
import { badgeVariant } from '@/Utils';
import { DeletePage } from '@/Pages/Pages';

type PagesProps = {
  pages: {
    data: Page[];
    total: number;
    per_page: number;
    current_page: number;
  };
} & PageProps;

export default function List({ auth, pages }: PagesProps) {
  const [selected, setSelected] = useState<Page>();
  const [isOpen, { open: onOpen, close: onClose }] = useDisclosure(false);
  const [selectedRecords, setSelectedRecords] = useState<Page[]>([]);
  const searchFilter = useSearchFilter('page.index');

  const columns: DataTableProps<Page>['columns'] = [
    {
      accessor: 'title',
      sortable: true,
      render: ({ title, excerpt }: Page) => {
        return (
          <Stack gap={0}>
            <Text fw={600}>{title}</Text>
            <Text fz="xs">{excerpt}</Text>
          </Stack>
        );
      },
      filter: (
        <TextInput
          label="Pages"
          description="Show all pages in the system"
          placeholder="Search pages..."
          leftSection={<IconSearch size={16} />}
          value={searchFilter.search}
          onChange={e => {
            searchFilter.onSearch(e.currentTarget.value);
          }}
        />
      ),
    },
    {
      accessor: 'user',
      sortable: true,
      render: ({ user }: Page) => <Text fz="sm">{user.fullname}</Text>,
    },
    {
      accessor: 'parent',
      sortable: true,
      render: ({ parent }: Page) => <Text fz="sm">{parent?.title}</Text>,
    },
    {
      accessor: 'tags',
      title: 'Tags',
      render: ({ meta_tags }: Page) => (
        <Flex gap={4}>
          {meta_tags.map((tag: string) => (
            <Badge key={tag} size="xs">
              {tag}
            </Badge>
          ))}
        </Flex>
      ),
    },
    {
      accessor: 'status',
      title: 'Status',
      render: ({ status }: Page) => (
        <Badge color={badgeVariant({ status })} variant="filled" size="sm" radius="sm">
          {status}
        </Badge>
      ),
    },
    {
      accessor: 'created_at',
      sortable: true,
      render: ({ created_at }: Page) => (
        <Text fz="sm">{dayjs(new Date(created_at)).format('MMM D, YYYY')}</Text>
      ),
    },
    {
      accessor: 'last_modified',
      sortable: true,
      render: ({ updated_at }: Page) => (
        <Text fz="sm">{dayjs(new Date(updated_at)).format('MMM D, YYYY')}</Text>
      ),
    },
    {
      accessor: 'id',
      title: 'Actions',
      width: 100,
      render: (page: Page) => (
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
              component={Link}
              leftSection={<IconEdit size={16} />}
              href={pageRoute.update(page.id)}
            >
              Edit
            </Menu.Item>
            <Menu.Item
              fw={600}
              fz="sm"
              color="red"
              variant="filled"
              leftSection={<IconTrash size={16} />}
              onClick={() => {
                setSelected(() => page);
                onOpen();
              }}
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
      <Head title="Pages | Publishing" />
      <DeletePage page={selected} isOpen={isOpen} onClose={onClose} />

      <Container fluid>
        <Stack gap="lg">
          <PageHeader
            user={auth.user}
            title="Pages"
            breadcrumbItems={[
              { title: 'Dashboard', href: dashboardRoute.dashboard },
              { title: 'Pages', href: pageRoute.list },
            ]}
            withActions={
              <Button component={Link} href={pageRoute.create} leftSection={<IconPlus size={18} />}>
                New Page
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
              records={pages.data}
              selectedRecords={selectedRecords}
              fetching={searchFilter.isFetching}
              totalRecords={pages.total}
              recordsPerPage={pages.per_page}
              page={pages.current_page}
              recordsPerPageOptions={[5, 10, 20, 50]}
              onSelectedRecordsChange={setSelectedRecords}
              onPageChange={page => searchFilter.onPageChange(page)}
              onRecordsPerPageChange={perPage => searchFilter.onRecordsPerPage(perPage)}
              sortStatus={searchFilter.sortStatus as DataTableSortStatus<Page>}
              onSortStatusChange={(sortStatus: DataTableSortStatus<Page>) =>
                searchFilter.onSortStatus(sortStatus as DataTableSortStatus<any>)
              }
            />
          </Paper>
        </Stack>
      </Container>
    </AuthenticatedLayout>
  );
}
