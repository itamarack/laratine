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
import { PageProps, Post } from '@/types';
import { useSearchFilter } from '@/hooks';
import { dashboardRoute, postRoute } from '@/routes';
import { DeletePost } from '@/Pages/Posts';
import { badgeVariant } from '@/Utils';

type PostsProps = {
  posts: {
    data: Post[];
    total: number;
    per_page: number;
    current_page: number;
  };
} & PageProps;

const items = [
  { title: 'Dashboard', href: dashboardRoute() },
  { title: 'Posts', href: '#' },
].map((item, index) => (
  <Anchor component={Link} href={item.href} key={index}>
    {item.title}
  </Anchor>
));

export default function List({ auth, posts }: PostsProps) {
  const [selected, setSelected] = useState<Post>();
  const [isOpen, { open: onOpen, close: onClose }] = useDisclosure(false);
  const [selectedRecords, setSelectedRecords] = useState<Post[]>([]);
  const searchFilter = useSearchFilter('post.index');

  const columns: DataTableProps<Post>['columns'] = [
    {
      accessor: 'title',
      title: 'Title',
      render: ({ title, excerpt }: Post) => {
        return (
          <Stack gap={0}>
            <Text fw={600}>{title}</Text>
            <Text fz="xs">{excerpt}</Text>
          </Stack>
        );
      },
      sortable: true,
      filter: (
        <TextInput
          label="Posts"
          description="Show all posts in the system"
          placeholder="Search posts..."
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
      render: ({ user }: Post) => <Text fz="sm">{user.fullname}</Text>,
    },
    {
      accessor: 'category',
      sortable: true,
      render: ({ category }: Post) => <Text fz="sm">{category.title}</Text>,
    },
    {
      accessor: 'tags',
      title: 'Tags',
      render: ({ meta_tags }: Post) => (
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
      render: ({ status }: Post) => (
        <Badge color={badgeVariant({ status })} variant="filled" size="sm" radius="sm">
          {status}
        </Badge>
      ),
    },
    {
      accessor: 'created_at',
      sortable: true,
      render: ({ created_at }: Post) => (
        <Text fz="sm">{dayjs(new Date(created_at)).format('MMM D, YYYY')}</Text>
      ),
    },
    {
      accessor: 'last_modified',
      sortable: true,
      render: ({ updated_at }: Post) => (
        <Text fz="sm">{dayjs(new Date(updated_at)).format('MMM D, YYYY')}</Text>
      ),
    },
    {
      accessor: 'id',
      title: 'Actions',
      width: 100,
      render: (post: Post) => (
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
              href={postRoute(post.id).update}
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
                setSelected(() => post);
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
      <Head title="Posts | Publishing" />
      <DeletePost post={selected} isOpen={isOpen} onClose={onClose} />

      <Container fluid>
        <Stack gap="lg">
          <PageHeader
            user={auth.user}
            title="Posts"
            breadcrumbItems={items}
            withActions={
              <Button
                component={Link}
                href={postRoute().create}
                leftSection={<IconPlus size={18} />}
              >
                New Post
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
              records={posts.data}
              selectedRecords={selectedRecords}
              fetching={searchFilter.isFetching}
              totalRecords={posts.total}
              recordsPerPage={posts.per_page}
              page={posts.current_page}
              recordsPerPageOptions={[5, 10, 20, 50]}
              onSelectedRecordsChange={setSelectedRecords}
              onPageChange={page => searchFilter.onPageChange(page)}
              onRecordsPerPageChange={perPage => searchFilter.onRecordsPerPage(perPage)}
              sortStatus={searchFilter.sortStatus as DataTableSortStatus<Post>}
              onSortStatusChange={(sortStatus: DataTableSortStatus<Post>) =>
                searchFilter.onSortStatus(sortStatus as DataTableSortStatus<any>)
              }
            />
          </Paper>
        </Stack>
      </Container>
    </AuthenticatedLayout>
  );
}
