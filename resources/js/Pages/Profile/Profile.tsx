'use client';

import {
  Anchor,
  Avatar,
  Box,
  Button,
  Container,
  FileButton,
  Grid,
  Paper,
  PaperProps,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  PasswordInput,
  rem,
  Popover,
  Progress,
  Flex,
} from '@mantine/core';
import { FormEventHandler, useRef, useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { notifications } from '@mantine/notifications';
import {
  IconCheck,
  IconCloudUpload,
  IconDeviceFloppy,
  IconTrash,
  IconX,
} from '@tabler/icons-react';
import { PageHeader, Surface, TextEditor } from '@/Components';
import { AuthenticatedLayout } from '@/Layouts';
import { PageProps } from '@/types';

const items = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Profile', href: '#' },
].map((item, index) => (
  <Anchor href={item.href} key={index}>
    {item.title}
  </Anchor>
));

const ICON_SIZE = 16;
const PAPER_PROPS: PaperProps = {
  p: 'md',
  shadow: 'md',
  radius: 'md',
  style: { height: '100%' },
};

function Profile({ auth }: PageProps<{ mustVerifyEmail: boolean; status?: string }>) {
  const [avatar, setAvatar] = useState<string | undefined>(auth.user.avatar);
  const [popoverOpened, setPopoverOpened] = useState(false);
  const passwordInput = useRef<HTMLInputElement>(null);
  const currentPasswordInput = useRef<HTMLInputElement>(null);

  const onFileUpload = (file: any) => {
    userInfo.setData('avatar', file);
    const objectURL = URL.createObjectURL(file);
    setAvatar(() => objectURL);

    return () => URL.revokeObjectURL(objectURL);
  };

  const onDeleteAvatar = () => {
    setAvatar(() => undefined);
    userInfo.setData('avatar', null);
  };

  const userInfo = useForm({
    _method: 'patch',
    avatar: null,
    firstname: auth.user.firstname ?? '',
    lastname: auth.user.lastname ?? '',
    email: auth.user.email ?? '',
    address: auth.user.address ?? '',
    city: auth.user.city ?? '',
    state: auth.user.state ?? '',
    postcode: auth.user.postcode ?? '',
    biography: auth.user.biography ?? '',
  });

  const userSecurity = useForm({
    password: '',
    current_password: '',
    password_confirmation: '',
  });

  const checks = requirements.map((requirement, index) => (
    <PasswordRequirement
      key={index}
      label={requirement.label}
      meets={requirement.re.test(userSecurity.data.password)}
    />
  ));

  const strength = getStrength(userSecurity.data.password);
  const color = strength === 100 ? 'teal' : strength > 50 ? 'yellow' : 'red';

  const onSubmitAccount: FormEventHandler = event => {
    event.preventDefault();

    userInfo.post(route('profile.update'), {
      preserveScroll: true,
      onSuccess: () => {
        notifications.show({
          title: 'Account updated!',
          message: 'Profile has been updated successfully.',
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

  const onSubmitSecurity: FormEventHandler = event => {
    event.preventDefault();

    userSecurity.put(route('password.update'), {
      preserveScroll: true,
      onSuccess: () => {
        userSecurity.reset();
        notifications.show({
          title: 'Account updated!',
          message: 'Profile has been updated successfully.',
        });
      },
      onError: errors => {
        if (errors.password) {
          userSecurity.reset('password', 'password_confirmation');
          passwordInput.current?.focus();
        }

        if (errors.current_password) {
          userSecurity.reset('current_password');
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
      <Head title="Profile | Settings" />

      <Container fluid>
        <Stack gap="lg">
          <PageHeader title="Profile" breadcrumbItems={items} />
          <Grid>
            <Grid.Col span={{ base: 12, md: 8 }}>
              <Surface component={Paper} {...PAPER_PROPS}>
                <Text size="lg" fw={600} mb="md">
                  Account information
                </Text>
                <form onSubmit={onSubmitAccount}>
                  <Stack justify="space-between" gap={16} h="100%">
                    <Grid gutter={{ base: 5, xs: 'md', md: 'md', lg: 'lg' }}>
                      <Grid.Col span={{ base: 12, md: 4 }}>
                        <Stack justify="center" align="center">
                          <Avatar size={'100%'} variant="filled" radius="sm" src={avatar} />
                          <Grid gutter={12} justify="center">
                            <Grid.Col span={avatar ? 8 : 12}>
                              <FileButton onChange={onFileUpload} accept="image/png,image/jpeg">
                                {props => (
                                  <Button
                                    {...props}
                                    variant="subtle"
                                    leftSection={<IconCloudUpload size={ICON_SIZE} />}
                                  >
                                    Upload image
                                  </Button>
                                )}
                              </FileButton>
                            </Grid.Col>
                            {avatar && (
                              <Grid.Col span={4}>
                                <Button onClick={onDeleteAvatar} variant="subtle" color="red">
                                  <IconTrash size={ICON_SIZE} />
                                </Button>
                              </Grid.Col>
                            )}
                          </Grid>
                          <Text ta="center" size="xs" c="dimmed">
                            For best results, use an image at least 128px by 128px in .jpg format
                          </Text>
                        </Stack>
                      </Grid.Col>
                      <Grid.Col span={{ base: 12, md: 8 }}>
                        <Stack>
                          <SimpleGrid cols={{ base: 1, md: 2 }}>
                            <TextInput
                              withAsterisk
                              label="Firstname"
                              placeholder="Firstname"
                              value={userInfo.data.firstname}
                              error={userInfo.errors.firstname}
                              disabled={userInfo.processing}
                              onChange={e => userInfo.setData('firstname', e.target.value)}
                            />
                            <TextInput
                              withAsterisk
                              label="Lastname"
                              placeholder="Lastname"
                              value={userInfo.data.lastname}
                              error={userInfo.errors.lastname}
                              disabled={userInfo.processing}
                              onChange={e => userInfo.setData('lastname', e.target.value)}
                            />
                          </SimpleGrid>
                          <TextInput
                            withAsterisk
                            type="email"
                            label="Email"
                            placeholder="Email"
                            value={userInfo.data.email}
                            error={userInfo.errors.email}
                            disabled={userInfo.processing}
                            onChange={e => userInfo.setData('email', e.target.value)}
                          />
                          <TextInput
                            type="address"
                            label="Address"
                            placeholder="Address"
                            value={userInfo.data.address}
                            error={userInfo.errors.address}
                            disabled={userInfo.processing}
                            onChange={e => userInfo.setData('address', e.target.value)}
                          />
                          <SimpleGrid cols={{ base: 1, md: 3 }}>
                            <TextInput
                              label="City"
                              placeholder="City"
                              value={userInfo.data.city}
                              error={userInfo.errors.city}
                              disabled={userInfo.processing}
                              onChange={e => userInfo.setData('city', e.target.value)}
                            />
                            <TextInput
                              label="State"
                              placeholder="State"
                              value={userInfo.data.state}
                              error={userInfo.errors.state}
                              disabled={userInfo.processing}
                              onChange={e => userInfo.setData('state', e.target.value)}
                            />
                            <TextInput
                              label="Postcode"
                              placeholder="Postcode"
                              value={userInfo.data.postcode}
                              error={userInfo.errors.postcode}
                              disabled={userInfo.processing}
                              onChange={e => userInfo.setData('postcode', e.target.value)}
                            />
                          </SimpleGrid>
                          <TextEditor
                            label="Biography"
                            content={userInfo.data.biography}
                            editable={!userInfo.processing}
                            onChange={(content: any) => userInfo.setData('biography', content)}
                          />
                        </Stack>
                      </Grid.Col>
                    </Grid>
                    <Button
                      type="submit"
                      style={{ width: 'fit-content' }}
                      loading={userInfo.processing}
                      leftSection={<IconDeviceFloppy size={ICON_SIZE} />}
                    >
                      Save Changes
                    </Button>
                  </Stack>
                </form>
              </Surface>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Surface component={Paper} {...PAPER_PROPS}>
                <form onSubmit={onSubmitSecurity}>
                  <Stack h="100%" justify="space-between" gap={12}>
                    <Stack>
                      <Text size="lg" fw={600}>
                        Account Security
                      </Text>
                      <Stack>
                        <Text size={'sm'}>Change password</Text>
                        <PasswordInput
                          withAsterisk
                          label="Current Password"
                          placeholder="Enter current password"
                          ref={currentPasswordInput}
                          error={userSecurity.errors.current_password}
                          value={userSecurity.data.current_password}
                          disabled={userSecurity.processing}
                          onChange={e => userSecurity.setData('current_password', e.target.value)}
                        />
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
                                value={userSecurity.data.password}
                                disabled={userSecurity.processing}
                                error={userSecurity.errors.password}
                                onChange={e => userSecurity.setData('password', e.target.value)}
                              />
                            </div>
                          </Popover.Target>
                          <Popover.Dropdown>
                            <Progress color={color} value={strength} size={5} mb="xs" />
                            <PasswordRequirement
                              label="Includes at least 6 characters"
                              meets={userSecurity.data.password.length > 5}
                            />
                            {checks}
                          </Popover.Dropdown>
                        </Popover>
                        <PasswordInput
                          withAsterisk
                          label="Confirm Password"
                          placeholder="Confirm password"
                          disabled={userSecurity.processing}
                          error={userSecurity.errors.password_confirmation}
                          value={userSecurity.data.password_confirmation}
                          onChange={e =>
                            userSecurity.setData('password_confirmation', e.target.value)
                          }
                        />
                      </Stack>
                    </Stack>
                    <Box style={{ width: 'auto' }}>
                      <Button
                        type="submit"
                        loading={userSecurity.processing}
                        leftSection={<IconDeviceFloppy size={16} />}
                      >
                        Save changes
                      </Button>
                    </Box>
                  </Stack>
                </form>
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

export default Profile;
