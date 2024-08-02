'use client';

import {
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
import { PageProps, User } from '@/types';
import { useSearchFilter } from '@/Hooks';
import { dashboardRoute, userRoute } from '@/Routes';
import Delete from './Delete';

type UsersProps = {
  users: {
    data: User[];
    total: number;
    per_page: number;
    current_page: number;
  };
} & PageProps;

export default function List({ auth, users }: UsersProps) {
  const theme = useMantineTheme();
  const [selected, setSelected] = useState<User>();
  const [isOpen, { open: onOpen, close: onClose }] = useDisclosure(false);
  const [selectedRecords, setSelectedRecords] = useState<User[]>([]);
  const searchFilter = useSearchFilter('user.index');

  const columns: DataTableProps<User>['columns'] = [
    {
      accessor: 'firstname',
      title: 'User',
      render: (user: User) => {
        return (
          <Flex component={UnstyledButton} gap="xs" align="center">
            <Avatar
              variant="filled"
              radius="xl"
              size="md"
              src={user.avatar}
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
      sortable: true,
      filter: (
        <TextInput
          label="Users"
          description="Show all users in the system"
          placeholder="Search users..."
          leftSection={<IconSearch size={16} />}
          value={searchFilter.search}
          onChange={e => {
            searchFilter.onSearch(e.currentTarget.value);
          }}
        />
      ),
    },
    {
      accessor: 'Status',
      render: (user: User) => (
        <Badge
          color={user.email_verified_at ? 'green.8' : 'red'}
          variant="filled"
          size="sm"
          radius="sm"
        >
          {user.email_verified_at ? 'Verified' : 'Unverified'}
        </Badge>
      ),
    },
    {
      accessor: 'created_at',
      sortable: true,
      render: (user: User) => (
        <Text fz="sm">{dayjs(new Date(user.created_at)).format('MMM D, YYYY')}</Text>
      ),
    },
    {
      accessor: 'updated_at',
      sortable: true,
      render: (user: User) => (
        <Text fz="sm">{dayjs(new Date(user.updated_at)).format('MMM D, YYYY')}</Text>
      ),
    },
    {
      accessor: 'id',
      title: 'Actions',
      width: 100,
      render: (user: User) => (
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
              href={userRoute.update(user.id)}
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
                setSelected(() => user);
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
      <Head title="Users | Account" />
      <Delete user={selected} isOpen={isOpen} onClose={onClose} />

      <Container fluid>
        <Stack gap="lg">
          <PageHeader
            user={auth.user}
            title="Users"
            breadcrumbItems={[
              { title: 'Dashboard', href: dashboardRoute.dashboard },
              { title: 'Users', href: userRoute.list },
            ]}
            withActions={
              <Button component={Link} href={userRoute.create} leftSection={<IconPlus size={18} />}>
                New User
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
              records={users.data}
              selectedRecords={selectedRecords}
              fetching={searchFilter.isFetching}
              totalRecords={users.total}
              recordsPerPage={users.per_page}
              page={users.current_page}
              recordsPerPageOptions={[5, 10, 20, 50]}
              onSelectedRecordsChange={setSelectedRecords}
              onPageChange={page => searchFilter.onPageChange(page)}
              onRecordsPerPageChange={perPage => searchFilter.onRecordsPerPage(perPage)}
              sortStatus={searchFilter.sortStatus as DataTableSortStatus<User>}
              onSortStatusChange={(sortStatus: DataTableSortStatus<User>) =>
                searchFilter.onSortStatus(sortStatus as DataTableSortStatus<any>)
              }
            />
          </Paper>
        </Stack>
      </Container>
    </AuthenticatedLayout>
  );
}
