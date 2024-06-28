'use client';

import {
  ActionIcon,
  Anchor,
  Badge,
  Button,
  Container,
  Group,
  Modal,
  Paper,
  PaperProps,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  useMantineTheme,
} from '@mantine/core';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import _first from 'lodash/first';
import { Head, Link, router } from '@inertiajs/react';
import { useThrottledCallback, useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { DataTable, DataTableProps, DataTableSortStatus } from 'mantine-datatable';
import { IconDotsVertical, IconEdit, IconPlus, IconSearch, IconTrash } from '@tabler/icons-react';
import { PageHeader } from '@/Components';
import { AuthenticatedLayout } from '@/Layouts';
import { PageProps, Post } from '@/types';
import { postRoute } from '@/routes';

type PostsProps = {
  posts: any;
} & PageProps;

const items = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Posts', href: '#' },
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

export default function List({ auth, posts }: PostsProps) {
  const theme = useMantineTheme();
  const [selected, setSelected] = useState<Post>();
  const [fetching, setFetching] = useState<boolean>(false);
  const [isOpen, { open: onOpen, close: onClose }] = useDisclosure(false);
  const [search, setSearch] = useState<string>('');
  const [selectedRecords, setSelectedRecords] = useState<Post[]>([]);
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus<Post>>({
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
    router.get(route('user.index'), payload, { preserveState: true });
  };

  const onSortStatusChange = ({ columnAccessor, direction }: DataTableSortStatus<Post>) => {
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

  const onDeletePost = () => {
    if (!selected) {
      return notifications.show({
        title: 'Failed!',
        message: 'Something went wrong, Try again!',
      });
    }

    router.delete(route('user.destroy', selected.id), {
      onSuccess: () => {
        onClose();
        notifications.show({
          title: 'Success!',
          message: 'User permanently deleted successfully',
        });
      },
      onError: error => {
        notifications.show({ title: 'Failed!', message: error.message });
      },
    });
  };

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
          value={search}
          onChange={e => {
            setSearch(e.currentTarget.value);
            throttledSearch(e.currentTarget.value);
          }}
        />
      ),
    },
    {
      accessor: 'Status',
      title: 'Status',
      render: ({ status }: Post) => (
        <Badge color={status ? 'green.8' : 'red'} variant="filled" size="sm" radius="sm">
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
      accessor: 'updated_at',
      sortable: true,
      render: ({ updated_at }: Post) => (
        <Text fz="sm">{dayjs(new Date(updated_at)).format('MMM D, YYYY')}</Text>
      ),
    },
    {
      accessor: '',
      title: 'Actions',
      render: (post: Post) => (
        <Group gap="sm">
          <Button
            component={Link}
            href={`/users/${post.id}/edit`}
            variant="filled"
            size="xs"
            leftSection={<IconEdit size={16} />}
          >
            Edit
          </Button>
          <Button
            onClick={() => {
              setSelected(() => post);
              onOpen();
            }}
            variant="filled"
            size="xs"
            color="red"
            leftSection={<IconTrash size={16} />}
          >
            Delete
          </Button>
        </Group>
      ),
    },
  ];

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Posts | Publishing" />

      <Modal opened={isOpen} onClose={onClose} title="Delete Post" centered>
        <Stack>
          <Text fw={600}>Are You sure you want to delete this post?</Text>
          <SimpleGrid cols={{ base: 1, sm: 2 }}>
            <Button loading={fetching} onClick={onDeletePost} variant="filled">
              Delete
            </Button>
            <Button disabled={fetching} onClick={onClose} variant="outline">
              Cancel
            </Button>
          </SimpleGrid>
        </Stack>
      </Modal>

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
          <Paper {...PAPER_PROPS}>
            <Group justify="space-between" mb="md">
              <Text fz="lg" fw={600}>
                Posts
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
              records={posts.data}
              selectedRecords={selectedRecords}
              onSelectedRecordsChange={setSelectedRecords}
              totalRecords={posts.total}
              recordsPerPage={posts.per_page}
              page={posts.current_page}
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
