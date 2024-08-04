'use client';

import {
  Button,
  Container,
  Grid,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  PasswordInput,
  rem,
  Popover,
  Progress,
  Accordion,
  Fieldset,
  Group,
} from '@mantine/core';
import dayjs from 'dayjs';
import { FormEventHandler, useRef, useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconDeviceFloppy, IconInfoCircle, IconX } from '@tabler/icons-react';
import { PageHeader, Surface } from '@/Components';
import { AuthenticatedLayout } from '@/Layouts';
import { PageProps } from '@/types';
import { dashboardRoute } from '@/Routes';

function AccountSecurity({ auth }: PageProps & { roles: any }) {
  const [popoverOpened, setPopoverOpened] = useState(false);
  const passwordInput = useRef<HTMLInputElement>(null);
  const currentPasswordInput = useRef<HTMLInputElement>(null);

  const form = useForm({
    password: '',
    current_password: '',
    password_confirmation: '',
  });

  const checks = requirements.map((requirement, index) => (
    <PasswordRequirement
      key={index}
      label={requirement.label}
      meets={requirement.re.test(form.data.password)}
    />
  ));

  const strength = getStrength(form.data.password);
  const color = strength === 100 ? 'teal' : strength > 50 ? 'yellow' : 'red';

  const onSubmitSecurity: FormEventHandler = () => {
    form.put(route('password.update'), {
      preserveScroll: true,
      onSuccess: () => {
        form.reset();
        notifications.show({
          title: 'Account securityupdated!',
          message: 'Account Security has been updated successfully.',
        });
      },
      onError: errors => {
        if (errors.password) {
          form.reset('password', 'password_confirmation');
          passwordInput.current?.focus();
        }

        if (errors.current_password) {
          form.reset('current_password');
          currentPasswordInput.current?.focus();
        }

        notifications.show({
          title: 'Failed!',
          message: 'Something went wrong, Try again.',
        });
      },
    });
  };

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Account Security | Account" />

      <Container fluid>
        <Stack gap="lg">
          <PageHeader
            user={auth.user}
            title="Account Security"
            breadcrumbItems={[
              { title: 'Dashboard', href: dashboardRoute.dashboard },
              { title: 'Account Security', href: '#' },
            ]}
            withActions={
              <Button
                type="submit"
                style={{ width: 'fit-content' }}
                loading={form.processing}
                leftSection={<IconDeviceFloppy size={16} />}
                onClick={onSubmitSecurity}
              >
                Save Changes
              </Button>
            }
          />
          <Grid>
            <Grid.Col span={{ base: 12, md: 8 }}>
              <Surface component={Paper} p="md" shadow="md" radius="md" h="100%">
                <Fieldset legend="Account Security">
                  <Stack h="100%" justify="space-between" gap={12}>
                    <PasswordInput
                      withAsterisk
                      label="Current Password"
                      placeholder="Enter current password"
                      ref={currentPasswordInput}
                      error={form.errors.current_password}
                      value={form.data.current_password}
                      disabled={form.processing}
                      onChange={e => form.setData('current_password', e.target.value)}
                    />

                    <SimpleGrid cols={{ base: 1, sm: 2 }}>
                      <Popover
                        opened={popoverOpened}
                        position="bottom"
                        width="target"
                        transitionProps={{ transition: 'pop' }}
                      >
                        <Popover.Target>
                          <div
                            onFocusCapture={() => setPopoverOpened(true)}
                            onBlurCapture={() => setPopoverOpened(false)}
                          >
                            <PasswordInput
                              withAsterisk
                              label="New Password"
                              placeholder="Enter new password"
                              ref={passwordInput}
                              value={form.data.password}
                              disabled={form.processing}
                              error={form.errors.password}
                              onChange={e => form.setData('password', e.target.value)}
                            />
                          </div>
                        </Popover.Target>
                        <Popover.Dropdown>
                          <Progress color={color} value={strength} size={5} mb="xs" />
                          <PasswordRequirement
                            label="Includes at least 6 characters"
                            meets={form.data.password.length > 5}
                          />
                          {checks}
                        </Popover.Dropdown>
                      </Popover>
                      <PasswordInput
                        withAsterisk
                        label="Confirm Password"
                        placeholder="Confirm password"
                        disabled={form.processing}
                        error={form.errors.password_confirmation}
                        value={form.data.password_confirmation}
                        onChange={e => form.setData('password_confirmation', e.target.value)}
                      />
                    </SimpleGrid>
                  </Stack>
                </Fieldset>
              </Surface>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }} h="100%">
              <Surface component={Paper} p="md" shadow="md" radius="md" h="100%">
                <Stack justify="space-between" gap={16} h="100%">
                  <Accordion variant="contained" defaultValue="publishing">
                    <Accordion.Item value="layout">
                      <Accordion.Control
                        icon={
                          <IconInfoCircle
                            style={{
                              color: 'var(--mantine-color-green-6',
                              width: rem(20),
                              height: rem(20),
                            }}
                          />
                        }
                      >
                        User Information
                      </Accordion.Control>
                      <Accordion.Panel>
                        <Stack>
                          <Group>
                            <Text fw={700}>Name:</Text>
                            <Text>{auth.user.fullname}</Text>
                          </Group>
                          <Group>
                            <Text fw={700}>Role:</Text>
                            <Text>{auth.user.role}</Text>
                          </Group>
                          <Group>
                            <Text fw={700}>Last Modified:</Text>
                            <Text>
                              {dayjs(new Date(auth.user.updated_at)).format('MMM D, YYYY')}
                            </Text>
                          </Group>
                        </Stack>
                      </Accordion.Panel>
                    </Accordion.Item>
                  </Accordion>
                </Stack>
              </Surface>
            </Grid.Col>
          </Grid>
        </Stack>
      </Container>
    </AuthenticatedLayout>
  );
}

function PasswordRequirement({ meets, label }: { meets: boolean; label: string }) {
  return (
    <Text
      c={meets ? 'teal' : 'red'}
      style={{ display: 'flex', alignItems: 'center' }}
      mt={7}
      size="sm"
    >
      {meets ? (
        <IconCheck style={{ width: rem(14), height: rem(14) }} />
      ) : (
        <IconX style={{ width: rem(14), height: rem(14) }} />
      )}{' '}
      <Text component="span" ml={10}>
        {label}
      </Text>
    </Text>
  );
}

const requirements = [
  { re: /[0-9]/, label: 'Includes number' },
  { re: /[a-z]/, label: 'Includes lowercase letter' },
  { re: /[A-Z]/, label: 'Includes uppercase letter' },
  { re: /[$&+,:;=?@#|'<>.^*()%!-]/, label: 'Includes special symbol' },
];

function getStrength(password: string) {
  let multiplier = password.length > 5 ? 0 : 1;

  requirements.forEach(requirement => {
    if (!requirement.re.test(password)) {
      multiplier += 1;
    }
  });

  return Math.max(100 - (100 / (requirements.length + 1)) * multiplier, 10);
}

export default AccountSecurity;
