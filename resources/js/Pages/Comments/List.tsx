'use client';

import {
  Anchor,
  Avatar,
  Badge,
  Button,
  Container,
  Flex,
  Menu,
  Paper,
  Stack,
  Text,
  TextInput,
  UnstyledButton,
  useMantineTheme,
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
import { PageProps, Comment } from '@/types';
import { useSearchFilter } from '@/Hooks';
import { commentRoute, dashboardRoute } from '@/Routes';
import { commentStatusVariant } from '@/Utils';
import { DeleteComment } from '@/Pages/Comments';

type CommentProps = {
  comments: {
    data: Comment[];
    total: number;
    per_page: number;
    current_page: number;
  };
} & PageProps;

export default function List({ auth, comments }: CommentProps) {
  const theme = useMantineTheme();
  const [selected, setSelected] = useState<Comment>();
  const [isOpen, { open: onOpen, close: onClose }] = useDisclosure(false);
  const [selectedRecords, setSelectedRecords] = useState<Comment[]>([]);
  const searchFilter = useSearchFilter('comment.index');

  const columns: DataTableProps<Comment>['columns'] = [
    {
      accessor: 'user',
      title: 'Author',
      sortable: true,
      render: ({ user }: Comment) => {
        return (
          <Flex component={UnstyledButton} gap="xs" align="center">
            <Avatar
              variant="filled"
              radius="xl"
              size="md"
              src={user.featured_image}
              alt={`${user.firstname} ${user.lastname}`}
              color={theme.primaryColor}
            >
              {_first(user.firstname)} {_first(user.lastname)}
            </Avatar>
            <Stack gap={0}>
              <Text fz="sm" fw={600}>
                {user.firstname} {user.lastname}
              </Text>
              <Text fz="xs">{user.email}</Text>
            </Stack>
          </Flex>
        );
      },
      filter: (
        <TextInput
          label="Comments"
          description="Show all comments in the system"
          placeholder="Search comments..."
          leftSection={<IconSearch size={16} />}
          value={searchFilter.search}
          onChange={e => {
            searchFilter.onSearch(e.currentTarget.value);
          }}
        />
      ),
    },
    {
      accessor: 'content',
      title: 'Comment',
      render: ({ content }: Comment) => (
        <Text fz="sm" dangerouslySetInnerHTML={{ __html: content }} />
      ),
    },
    {
      accessor: 'post',
      title: 'In response to',
      sortable: true,
      render: ({ post }: Comment) => <Text fz="sm">{post?.title}</Text>,
    },
    {
      accessor: 'status',
      title: 'Status',
      render: ({ status }: Comment) => (
        <Badge color={commentStatusVariant({ status })} variant="filled" size="sm" radius="sm">
          {status}
        </Badge>
      ),
    },
    {
      accessor: 'created_at',
      title: 'Submitted on',
      sortable: true,
      render: ({ created_at }: Comment) => (
        <Text fz="sm">{dayjs(new Date(created_at)).format('MMM D, YYYY')}</Text>
      ),
    },
    {
      accessor: 'id',
      title: 'Actions',
      width: 100,
      render: (comment: Comment) => (
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
              href={commentRoute.update(comment.id)}
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
                setSelected(() => comment);
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
      <Head title="Comments | Publishing" />
      <DeleteComment comment={selected} isOpen={isOpen} onClose={onClose} />

      <Container fluid>
        <Stack gap="lg">
          <PageHeader
            user={auth.user}
            title="Comments"
            breadcrumbItems={[
              { title: 'Dashboard', href: dashboardRoute.dashboard },
              { title: 'Comments', href: commentRoute.list },
            ]}
            withActions={
              <Button
                component={Link}
                href={commentRoute.create}
                leftSection={<IconPlus size={18} />}
              >
                New Comment
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
              records={comments.data}
              selectedRecords={selectedRecords}
              fetching={searchFilter.isFetching}
              totalRecords={comments.total}
              recordsPerPage={comments.per_page}
              page={comments.current_page}
              recordsPerPageOptions={[5, 10, 20, 50]}
              onSelectedRecordsChange={setSelectedRecords}
              onPageChange={page => searchFilter.onPageChange(page)}
              onRecordsPerPageChange={perPage => searchFilter.onRecordsPerPage(perPage)}
              sortStatus={searchFilter.sortStatus as DataTableSortStatus<Comment>}
              onSortStatusChange={(sortStatus: DataTableSortStatus<Comment>) =>
                searchFilter.onSortStatus(sortStatus as DataTableSortStatus<any>)
              }
            />
          </Paper>
        </Stack>
      </Container>
    </AuthenticatedLayout>
  );
}
