'use client';

import { ReactNode, useEffect, useState } from 'react';
import { DataTable, DataTableProps, DataTableSortStatus } from 'mantine-datatable';
import {
  Avatar,
  Badge,
  Button,
  Flex,
  Group,
  Modal,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  UnstyledButton,
  useMantineTheme,
} from '@mantine/core';
import { format } from 'date-fns';
import { sortBy, first } from 'lodash';
import { useDisclosure } from '@mantine/hooks';
import { IconTrash, IconEdit, IconSearch } from '@tabler/icons-react';
import { Link, useForm, router } from '@inertiajs/react';
import { notifications } from '@mantine/notifications';
import '@mantine/core/styles.layer.css';
import 'mantine-datatable/styles.layer.css';
import { ErrorAlert } from '@/Components';
import { User } from '@/types';

type DatatableProps = {
  error?: ReactNode;
  fetching?: boolean;
  payload: any;
  onQuery: (query: any) => void;
};

export default function Datatable({ payload, error, fetching, onQuery }: DatatableProps) {
  console.log(payload);

  const theme = useMantineTheme();
  const [selectedRecords, setSelectedRecords] = useState<User[]>([]);
  const [user, setUser] = useState<User>();
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus<User>>({
    columnAccessor: 'user',
    direction: 'asc',
  });
  const [query, setQuery] = useState('');
  const [isOpenDelete, { open: onOpenDelete, close: onCloseDelete }] = useDisclosure(false);

  const columns: DataTableProps<User>['columns'] = [
    {
      accessor: 'user',
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
              {first(user.firstname)} {first(user.lastname)}
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
          value={query}
          onChange={e => setQuery(e.currentTarget.value)}
        />
      ),
      filtering: query !== '',
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
        <Text fz="sm">{format(new Date(user.created_at), 'MMM dd, yyyy')}</Text>
      ),
    },
    {
      accessor: 'updated_at',
      sortable: true,
      render: (user: User) => (
        <Text fz="sm">{format(new Date(user.updated_at), 'MMM dd, yyyy')}</Text>
      ),
    },
    {
      accessor: '',
      title: 'Actions',
      render: (user: any) => (
        <Group gap="sm">
          <Button
            component={Link}
            href={`/users/${user.id}/edit`}
            variant="filled"
            size="xs"
            leftSection={<IconEdit size={16} />}
          >
            Edit
          </Button>
          <Button
            onClick={() => {
              setUser(() => user);
              onOpenDelete();
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

  const userInfo = useForm({});

  const onDeleteAccount = () => {
    if (!user) {
      return notifications.show({
        title: 'Failed!',
        message: 'Something went wrong, Try again!',
      });
    }

    userInfo.delete(route('user.destroy', user.id), {
      onSuccess: () => {
        onCloseDelete();
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

  return error ? (
    <ErrorAlert title="Error loading users" message={error.toString()} />
  ) : (
    <>
      <Modal opened={isOpenDelete} onClose={onCloseDelete} title="Delete Account" centered>
        <Stack>
          <Text fw={600}>Are You sure you want to delete this user?</Text>
          <SimpleGrid cols={{ base: 1, sm: 2 }}>
            <Button loading={userInfo.processing} onClick={onDeleteAccount} variant="filled">
              Delete
            </Button>
            <Button disabled={userInfo.processing} onClick={onCloseDelete} variant="outline">
              Cancel
            </Button>
          </SimpleGrid>
        </Stack>
      </Modal>
      <DataTable
        minHeight={200}
        verticalSpacing="xs"
        striped
        highlightOnHover
        columns={columns}
        records={payload.data}
        selectedRecords={selectedRecords}
        onSelectedRecordsChange={setSelectedRecords}
        totalRecords={payload.total}
        recordsPerPage={payload.per_page}
        page={payload.current_page}
        onPageChange={e => {}}
        recordsPerPageOptions={[1, 5, 10, 20, 50]}
        onRecordsPerPageChange={(perPage: number) => onQuery({ perPage })}
        sortStatus={sortStatus}
        onSortStatusChange={setSortStatus}
        fetching={fetching}
      />
    </>
  );
}
