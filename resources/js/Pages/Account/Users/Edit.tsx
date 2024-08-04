'use client';

import {
  Avatar,
  Button,
  Container,
  FileButton,
  Grid,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  PasswordInput,
  rem,
  Popover,
  Progress,
  Fieldset,
  Accordion,
  Select,
  Group,
} from '@mantine/core';
import { FormEventHandler, useRef, useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { notifications } from '@mantine/notifications';
import {
  IconCheck,
  IconCloudUpload,
  IconDeviceFloppy,
  IconPhoto,
  IconTrash,
  IconUserPin,
  IconX,
} from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { PageHeader, Surface, TextEditor } from '@/Components';
import { AuthenticatedLayout } from '@/Layouts';
import { PageProps, User } from '@/types';
import { dashboardRoute, userRoute } from '@/Routes';
import Delete from './Delete';

type UsersProps = {
  user: User;
  roles: string[];
} & PageProps;

export default function Edit({ auth, user, roles }: UsersProps) {
  const [avatar, setAvatar] = useState<string | undefined>(user.avatar);
  const [popoverOpened, setPopoverOpened] = useState(false);
  const passwordInput = useRef<HTMLInputElement>(null);
  const [isOpenDelete, { open: onOpenDelete, close: onCloseDelete }] = useDisclosure(false);

  const form = useForm({
    _method: 'patch',
    avatar: avatar ?? '',
    role: user.role ?? '',
    firstname: user.firstname ?? '',
    lastname: user.lastname ?? '',
    email: user.email ?? '',
    address: user.address ?? '',
    city: user.city ?? '',
    state: user.state ?? '',
    postcode: user.postcode ?? '',
    biography: user.biography ?? '',
    password: '',
    password_confirmation: '',
  });

  const onFileUpload = (file: File | null) => {
    const objectURL = URL.createObjectURL(file as File);
    setAvatar(() => objectURL);
    form.setData('avatar', file as any);
    return () => URL.revokeObjectURL(objectURL);
  };

  const onDeleteAvatar = () => {
    setAvatar(() => '');
    form.setData('avatar', '');
  };

  const checks = requirements.map((requirement, index) => (
    <PasswordRequirement
      key={index}
      label={requirement.label}
      meets={requirement.re.test(form.data.password)}
    />
  ));

  const strength = getStrength(form.data.password);
  const color = strength === 100 ? 'teal' : strength > 50 ? 'yellow' : 'red';

  const onSubmitAccount: FormEventHandler = () => {
    form.post(route('user.update', user.id), {
      preserveScroll: true,
      onSuccess: () => {
        notifications.show({
          title: 'Account updated!',
          message: 'Profile has been updated successfully.',
        });
      },
      onError: () => {
        notifications.show({
          title: 'Failed!',
          message: 'Something went wrong, Try again.',
        });
      },
    });
  };

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Edit | Account" />
      <Delete user={user} isOpen={isOpenDelete} onClose={onCloseDelete} />

      <Container fluid>
        <Stack gap="lg">
          <PageHeader
            user={auth.user}
            title="Edit User"
            breadcrumbItems={[
              { title: 'Dashboard', href: dashboardRoute.dashboard },
              { title: 'Users', href: userRoute.list },
              { title: 'Edit', href: '#' },
            ]}
            withActions={
              <Group align="center">
                <Button color="red" onClick={onOpenDelete}>
                  Delete User
                </Button>
                <Button
                  style={{ width: 'fit-content' }}
                  loading={form.processing}
                  leftSection={<IconDeviceFloppy size={16} />}
                  onClick={onSubmitAccount}
                >
                  Save Changes
                </Button>
              </Group>
            }
          />

          <Grid gutter={{ base: 'lg', lg: 'xl' }}>
            <Grid.Col span={{ base: 12, md: 8 }}>
              <Surface component={Paper} p="md" shadow="md" radius="md" h="100%">
                <Stack gap={32}>
                  <Fieldset legend="Account Information">
                    <Stack>
                      <SimpleGrid cols={{ base: 1, md: 2 }}>
                        <TextInput
                          withAsterisk
                          label="Firstname"
                          placeholder="Firstname"
                          value={form.data.firstname}
                          error={form.errors.firstname}
                          disabled={form.processing}
                          onChange={e => form.setData('firstname', e.target.value)}
                        />
                        <TextInput
                          withAsterisk
                          label="Lastname"
                          placeholder="Lastname"
                          value={form.data.lastname}
                          error={form.errors.lastname}
                          disabled={form.processing}
                          onChange={e => form.setData('lastname', e.target.value)}
                        />
                      </SimpleGrid>
                      <TextInput
                        withAsterisk
                        type="email"
                        label="Email"
                        placeholder="Email"
                        value={form.data.email}
                        error={form.errors.email}
                        disabled={form.processing}
                        onChange={e => form.setData('email', e.target.value)}
                      />
                      <TextInput
                        withAsterisk
                        type="address"
                        label="Address"
                        placeholder="Address"
                        value={form.data.address}
                        error={form.errors.address}
                        disabled={form.processing}
                        onChange={e => form.setData('address', e.target.value)}
                      />
                      <SimpleGrid cols={{ base: 1, md: 3 }}>
                        <TextInput
                          withAsterisk
                          label="City"
                          placeholder="City"
                          value={form.data.city}
                          error={form.errors.city}
                          disabled={form.processing}
                          onChange={e => form.setData('city', e.target.value)}
                        />
                        <TextInput
                          withAsterisk
                          label="State"
                          placeholder="State"
                          value={form.data.state}
                          error={form.errors.state}
                          disabled={form.processing}
                          onChange={e => form.setData('state', e.target.value)}
                        />
                        <TextInput
                          withAsterisk
                          label="Postcode"
                          placeholder="Postcode"
                          value={form.data.postcode}
                          error={form.errors.postcode}
                          disabled={form.processing}
                          onChange={e => form.setData('postcode', e.target.value)}
                        />
                      </SimpleGrid>
                      <TextEditor
                        label="Biography"
                        content={form.data.biography}
                        editable={!form.processing}
                        onChange={(content: any) => form.setData('biography', content)}
                      />
                    </Stack>
                  </Fieldset>
                  <Fieldset legend="Password & Security">
                    <SimpleGrid cols={{ base: 1, md: 2 }}>
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
                              label="Password"
                              placeholder="Enter password"
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
                        error={form.errors.password}
                        value={form.data.password_confirmation}
                        onChange={e => form.setData('password_confirmation', e.target.value)}
                      />
                    </SimpleGrid>
                  </Fieldset>
                </Stack>
              </Surface>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }} h="100%">
              <Surface component={Paper} p="md" shadow="md" radius="md" h="100%">
                <Stack justify="space-between" gap={16} h="100%">
                  <Accordion variant="contained" defaultValue="featuredImage">
                    <Accordion.Item value="featuredImage">
                      <Accordion.Control
                        icon={
                          <IconPhoto
                            style={{
                              color: 'var(--mantine-color-red-6',
                              width: rem(20),
                              height: rem(20),
                            }}
                          />
                        }
                      >
                        Avatar
                      </Accordion.Control>
                      <Accordion.Panel>
                        <Stack justify="center" align="center">
                          <Avatar size={'100%'} variant="filled" radius="sm" src={avatar} />
                          {form.errors.avatar && (
                            <Text size="xs" c="red" ta="center">
                              {form.errors.avatar}
                            </Text>
                          )}
                          <Grid gutter={12} justify="center">
                            <Grid.Col span={avatar ? 8 : 12}>
                              <FileButton onChange={onFileUpload} accept="image/png,image/jpeg">
                                {props => (
                                  <Button
                                    {...props}
                                    variant="subtle"
                                    leftSection={<IconCloudUpload size={16} />}
                                  >
                                    Upload image
                                  </Button>
                                )}
                              </FileButton>
                            </Grid.Col>
                            {avatar && (
                              <Grid.Col span={4}>
                                <Button onClick={onDeleteAvatar} variant="subtle" color="red">
                                  <IconTrash size={16} />
                                </Button>
                              </Grid.Col>
                            )}
                          </Grid>
                          <Text ta="center" size="xs" c="dimmed">
                            For best results, use an image at least 128px by 128px in .jpg format
                          </Text>
                        </Stack>
                      </Accordion.Panel>
                    </Accordion.Item>
                    <Accordion.Item value="Role">
                      <Accordion.Control
                        icon={
                          <IconUserPin
                            style={{
                              color: 'var(--mantine-color-green-6',
                              width: rem(20),
                              height: rem(20),
                            }}
                          />
                        }
                      >
                        Role
                      </Accordion.Control>
                      <Accordion.Panel>
                        <Stack>
                          <Select
                            label="Role"
                            placeholder="Select User Role"
                            value={form.data.role}
                            error={form.errors.role}
                            disabled={form.processing}
                            checkIconPosition="right"
                            data={roles}
                            onChange={(t: any) => form.setData('role', t)}
                          />
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
