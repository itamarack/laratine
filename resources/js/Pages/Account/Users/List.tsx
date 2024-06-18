'use client';

import {
  ActionIcon,
  Anchor,
  Button,
  Container,
  Group,
  Paper,
  PaperProps,
  Stack,
  Text,
} from '@mantine/core';
import { Head, Link } from '@inertiajs/react';
import { PageHeader } from '@/Components';
import Datatable from './Datatable';
import { IconDotsVertical, IconPlus } from '@tabler/icons-react';
import { AuthenticatedLayout } from '@/Layouts';
import { PageProps, User } from '@/types';

type UsersProps = {
  users: User[];
} & PageProps;

const items = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Users', href: '#' },
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

function ListUsers({ auth, users }: UsersProps) {
  console.log(users);

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Users | Account" />

      <Container fluid>
        <Stack gap="lg">
          <PageHeader
            user={auth.user}
            title="Users"
            breadcrumbItems={items}
            withActions={
              <Button component={Link} href={'/users/create'} leftSection={<IconPlus size={18} />}>
                New User
              </Button>
            }
          />
          <Paper {...PAPER_PROPS}>
            <Group justify="space-between" mb="md">
              <Text fz="lg" fw={600}>
                Users
              </Text>
              <ActionIcon>
                <IconDotsVertical size={18} />
              </ActionIcon>
            </Group>
            <Datatable data={users} loading={false} />
          </Paper>
        </Stack>
      </Container>
    </AuthenticatedLayout>
  );
}

export default ListUsers;
