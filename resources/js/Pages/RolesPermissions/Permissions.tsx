'use client';

import {
  Anchor,
  Button,
  Container,
  FileButton,
  Grid,
  Paper,
  Stack,
  Text,
  TextInput,
  rem,
  Textarea,
  Accordion,
  Select,
  Image,
  Flex,
  TagsInput,
  SimpleGrid,
  Group,
  Switch,
  useMantineTheme,
  Fieldset,
  Checkbox,
  Divider,
} from '@mantine/core';
import { FormEventHandler, useEffect, useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { notifications } from '@mantine/notifications';
import {
  IconCloudUpload,
  IconDeviceFloppy,
  IconTrash,
  IconPhoto,
  IconPrinter,
  IconHomeSearch,
  IconEye,
  IconLayout,
  IconCheck,
  IconX,
} from '@tabler/icons-react';
import { useDebouncedCallback } from '@mantine/hooks';
import { PageHeader, Surface, TextEditor } from '@/Components';
import { AuthenticatedLayout } from '@/Layouts';
import { Page, PageProps, Role, Tags, User } from '@/types';
import { dashboardRoute, permissionsRoute } from '@/routes';
import { slugify, makeSelectableList, getSelectedPermissions } from '@/Utils';
import { Permission, permissionsOptions } from './permissions';

const items = [
  { title: 'Dashboard', href: dashboardRoute() },
  { title: 'Role & Permissions', href: permissionsRoute().list },
  { title: 'Manage Permissions', href: '#' },
].map((item, index) => (
  <Anchor component={Link} href={item.href} key={index}>
    {item.title}
  </Anchor>
));

type RoleProps = {
  role: Role;
} & PageProps;

export default function ManagePermissions({ auth, role }: RoleProps) {
  const theme = useMantineTheme();
  const [permissions, setPermission] = useState<Permission[]>(permissionsOptions);

  // console.log(role);

  const form = useForm({
    name: role.name ?? '',
    guard_name: role.guard_name ?? '',
    enable_all: false,
    permissions: [] as string[],
  });

  useEffect(() => {
    const filtered = permissions.filter(i => i.checked);
    form.setData('enable_all', filtered.length < permissions.length ? false : true);
    form.setData('permissions', getSelectedPermissions(permissions));
  }, [permissions]);

  const OnEnablePermissions = (event: any) => {
    const checked = event.currentTarget.checked;
    form.setData('enable_all', checked);

    const permission = permissions.map((item: Permission) => {
      const perm = item.permission.map(i => ({ ...i, checked }));
      return { ...item, checked, permission: [...perm] };
    });

    setPermission(() => [...permission]);
  };

  const onSubmit: FormEventHandler = event => {
    event.preventDefault();

    form.patch(route('permission.update', role.id), {
      preserveScroll: true,
      onSuccess: () => {
        notifications.show({
          title: 'Success!',
          message: 'Permission updated successfully.',
        });
      },
      onError: error => {
        console.log(error);
        notifications.show({
          title: 'Failed!',
          message: 'Something went wrong, Try again.',
        });
      },
    });
  };

  const CheckboxThumbIcon = (active: boolean) => {
    return active ? (
      <IconCheck
        style={{ width: rem(12), height: rem(12) }}
        color={theme.colors.teal[6]}
        stroke={3}
      />
    ) : (
      <IconX style={{ width: rem(12), height: rem(12) }} color={theme.colors.red[6]} stroke={3} />
    );
  };

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Manage Permissions | Roles & Permissions" />

      <Container fluid>
        <form onSubmit={onSubmit}>
          <Stack gap="lg">
            <PageHeader user={auth.user} title="Manage Permissions" breadcrumbItems={items} />
            <Grid gutter={{ base: 'lg', lg: 'xl' }}>
              <Grid.Col span={{ base: 12, md: 8 }}>
                <Surface component={Paper} p="md" shadow="md" radius="md" h="100%">
                  <SimpleGrid cols={3} verticalSpacing={38}>
                    {permissions.map(perm => (
                      <Group key={perm.name} w="100%" gap={6}>
                        <Switch
                          size="sm"
                          checked={perm.checked}
                          label={perm.name}
                          onChange={event => {
                            const target = permissions.find(p => p.name === perm.name);
                            if (target) target.checked = event.currentTarget.checked;
                            setPermission(() => [...permissions]);
                          }}
                          thumbIcon={CheckboxThumbIcon(perm.checked)}
                        />
                        <Fieldset w="100%" legend="Permissions">
                          <SimpleGrid cols={2}>
                            {perm.permission.map((item, index) => (
                              <Checkbox
                                size="xs"
                                key={item.name}
                                label={item.name}
                                disabled={!perm.checked}
                                checked={item.checked}
                                onChange={e => {
                                  const target = perm.permission.find(p => p.name === item.name);
                                  if (target) target.checked = e.currentTarget.checked;
                                  setPermission(() => [...permissions]);
                                }}
                              />
                            ))}
                          </SimpleGrid>
                        </Fieldset>
                      </Group>
                    ))}
                  </SimpleGrid>
                </Surface>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 4 }} h="100%">
                <Surface component={Paper} p="md" shadow="md" radius="md" h="100%">
                  <Stack justify="space-between" gap={16} h="100%">
                    <Accordion variant="contained" defaultValue="publishing">
                      <Accordion.Item value="publishing">
                        <Accordion.Control
                          icon={
                            <IconPrinter
                              style={{
                                color: 'var(--mantine-color-blue-6',
                                width: rem(20),
                                height: rem(20),
                              }}
                            />
                          }
                        >
                          Publishing
                        </Accordion.Control>
                        <Accordion.Panel>
                          <Stack>
                            <TextInput
                              withAsterisk
                              label="Role Name"
                              value={form.data.name}
                              error={form.errors.name}
                              disabled={form.processing}
                              onChange={(a: any) => form.setData('name', a)}
                            />
                            <TextInput
                              withAsterisk
                              label="Guard Name"
                              value={form.data.guard_name}
                              error={form.errors.guard_name}
                              disabled={form.processing}
                              onChange={(a: any) => form.setData('guard_name', a)}
                            />
                            <Switch
                              size="sm"
                              label="Enable all Permisions for this role"
                              disabled={form.errors.enable_all as any}
                              checked={form.data.enable_all}
                              onChange={OnEnablePermissions}
                              thumbIcon={CheckboxThumbIcon(form.data.enable_all)}
                            />
                            <Flex justify="flex-end" mt={16}>
                              <Button
                                size="sm"
                                type="submit"
                                disabled={form.processing}
                                loading={form.processing}
                                leftSection={<IconDeviceFloppy size={16} />}
                              >
                                Save Changes
                              </Button>
                            </Flex>
                          </Stack>
                        </Accordion.Panel>
                      </Accordion.Item>
                    </Accordion>
                  </Stack>
                </Surface>
              </Grid.Col>
            </Grid>
          </Stack>
        </form>
      </Container>
    </AuthenticatedLayout>
  );
}
