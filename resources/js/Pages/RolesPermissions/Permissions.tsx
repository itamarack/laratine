'use client';

import {
  Anchor,
  Button,
  Container,
  Grid,
  Paper,
  Stack,
  TextInput,
  rem,
  Textarea,
  Accordion,
  Flex,
  SimpleGrid,
  Group,
  Switch,
  useMantineTheme,
  Fieldset,
  Checkbox,
} from '@mantine/core';
import { FormEventHandler, useEffect, useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { notifications } from '@mantine/notifications';
import { IconDeviceFloppy, IconPrinter, IconCheck, IconX } from '@tabler/icons-react';
import { PageHeader, Surface } from '@/Components';
import { AuthenticatedLayout } from '@/Layouts';
import { PageProps, Role, Permission } from '@/types';
import { dashboardRoute, permissionsRoute } from '@/routes';
import { getSelectedPermissions } from '@/Utils';

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
  permissionList: Permission[];
  enable_all: boolean;
} & PageProps;

export default function ManagePermissions({ auth, role, enable_all, permissionList }: RoleProps) {
  const theme = useMantineTheme();
  const [permissions, setPermission] = useState<Permission[]>(permissionList);

  const form = useForm({
    name: role.name ?? '',
    description: role.description ?? '',
    guard_name: role.guard_name ?? '',
    enable_all: enable_all,
    permissions: [] as string[],
  });

  useEffect(() => {
    const permissionList = getSelectedPermissions(permissions);
    form.setData(data => ({ ...data, permissions: permissionList }));

    const filtered = permissions.filter(i => i.active);
    const enabledAll = filtered.length < permissions.length ? false : true;
    form.setData(data => ({ ...data, enable_all: enabledAll }));
  }, [permissions]);

  const OnEnablePermissions = (event: any) => {
    const active = event.currentTarget.checked;
    form.setData('enable_all', active);

    const permission = permissions.map((item: Permission) => {
      const perm = item.permission.map(i => ({ ...i, active }));
      return { ...item, active, permission: [...perm] };
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
                          checked={perm.active}
                          label={perm.name}
                          onChange={event => {
                            perm.active = event.currentTarget.checked;
                            perm.permission = perm.permission.map(permission => {
                              return { ...permission, active: perm.active };
                            });
                            setPermission(() => [...permissions]);
                          }}
                          thumbIcon={CheckboxThumbIcon(perm.active as boolean)}
                        />
                        <Fieldset w="100%" legend="Permissions">
                          <SimpleGrid cols={2}>
                            {perm.permission.map(item => (
                              <Checkbox
                                size="xs"
                                key={item.name}
                                label={item.name.split(' ')[0]}
                                disabled={!perm.active}
                                checked={item.active}
                                onChange={e => {
                                  const target = perm.permission.find(p => p.name === item.name);
                                  if (target) target.active = e.currentTarget.checked;
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
                            <Switch
                              size="sm"
                              label="Enable all Permisions for this role"
                              disabled={form.errors.enable_all as any}
                              checked={form.data.enable_all}
                              onChange={OnEnablePermissions}
                              thumbIcon={CheckboxThumbIcon(form.data.enable_all)}
                            />
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
                            <Textarea
                              label="Description"
                              placeholder="Description"
                              value={form.data.description}
                              error={form.errors.description}
                              disabled={form.processing}
                              onChange={e => form.setData('description', e.target.value)}
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
