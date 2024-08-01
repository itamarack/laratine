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
import {
  IconDotsVertical,
  IconEdit,
  IconPlus,
  IconSearch,
  IconShield,
  IconTrash,
} from '@tabler/icons-react';
import {
  CreateRolePermission,
  DeleteRolePermission,
  EditRolePermission,
} from '@/Pages/RolesPermissions';
import { PageHeader } from '@/Components';
import { AuthenticatedLayout } from '@/Layouts';
import { PageProps, Role } from '@/types';
import { dashboardRoute, permissionsRoute } from '@/routes';
import { useSearchFilter } from '@/hooks';

type RolesProps = {
  roles: {
    data: Role[];
    total: number;
    per_page: number;
    current_page: number;
  };
} & PageProps;

const items = [
  { title: 'Dashboard', href: dashboardRoute() },
  { title: 'Roles & Permissions ', href: '#' },
].map((item, index) => (
  <Anchor component={Link} href={item.href} key={index}>
    {item.title}
  </Anchor>
));

export default function List({ auth, roles }: RolesProps) {
  const [selected, setSelected] = useState<Role>();
  const [isOpenDelete, { open: onOpenDelete, close: onCloseDelete }] = useDisclosure(false);
  const [isOpenCreate, { open: onOpenCreate, close: onCloseCreate }] = useDisclosure(false);
  const [isOpenEdit, { open: onOpenEdit, close: onCloseEdit }] = useDisclosure(false);
  const [selectedRecords, setSelectedRecords] = useState<Role[]>([]);
  const searchFilter = useSearchFilter('role.index');

  const columns: DataTableProps<Role>['columns'] = [
    {
      accessor: 'name',
      title: 'Name',
      render: ({ name }: Role) => {
        return <Text fz={'sm'}>{name}</Text>;
      },
      sortable: true,
      filter: (
        <TextInput
          label="Roles"
          description="Show all roles in the system"
          placeholder="Search roles..."
          leftSection={<IconSearch size={16} />}
          value={searchFilter.search}
          onChange={e => {
            searchFilter.onSearch(e.currentTarget.value);
          }}
        />
      ),
    },
    {
      accessor: 'created_at',
      sortable: true,
      render: ({ created_at }: Role) => (
        <Text fz="sm">{dayjs(new Date(created_at)).format('MMM D, YYYY')}</Text>
      ),
    },
    {
      title: 'Last modified',
      accessor: 'updated_at',
      sortable: true,
      render: ({ updated_at }: Role) => (
        <Text fz="sm">{dayjs(new Date(updated_at)).format('MMM D, YYYY')}</Text>
      ),
    },
    {
      accessor: 'id',
      title: 'Actions',
      width: 280,
      render: (role: Role) => (
        <Menu withArrow width={200} shadow="md">
          <Menu.Target>
            <Flex justify="space-between">
              <Button
                variant="filled"
                size="xs"
                component={Link}
                leftSection={<IconShield size={16} />}
                href={permissionsRoute(role.id).update}
              >
                Manage Permissions
              </Button>
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
              onClick={() => {
                setSelected(() => role);
                onOpenEdit();
              }}
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
                setSelected(() => role);
                onOpenDelete();
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
      <Head title="Roles & Permissions | Publishing" />

      <CreateRolePermission isOpen={isOpenCreate} onClose={onCloseCreate} />
      <EditRolePermission role={selected} isOpen={isOpenEdit} onClose={onCloseEdit} />
      <DeleteRolePermission role={selected} isOpen={isOpenDelete} onClose={onCloseDelete} />

      <Container fluid>
        <Stack gap="lg">
          <PageHeader
            user={auth.user}
            title="Roles & Permissions"
            breadcrumbItems={items}
            withActions={
              <Button leftSection={<IconPlus size={18} />} onClick={onOpenCreate}>
                New Role
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
              records={roles.data}
              selectedRecords={selectedRecords}
              fetching={searchFilter.isFetching}
              totalRecords={roles.total}
              recordsPerPage={roles.per_page}
              page={roles.current_page}
              recordsPerPageOptions={[5, 10, 20, 50]}
              onSelectedRecordsChange={setSelectedRecords}
              onPageChange={page => searchFilter.onPageChange(page)}
              onRecordsPerPageChange={perPage => searchFilter.onRecordsPerPage(perPage)}
              sortStatus={searchFilter.sortStatus as DataTableSortStatus<Role>}
              onSortStatusChange={(sortStatus: DataTableSortStatus<Role>) =>
                searchFilter.onSortStatus(sortStatus as DataTableSortStatus<any>)
              }
            />
          </Paper>
        </Stack>
      </Container>
    </AuthenticatedLayout>
  );
}
