'use client';

import {
  Anchor,
  Avatar,
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
  Modal,
} from '@mantine/core';
import { FormEventHandler, useRef, useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { notifications } from '@mantine/notifications';
import {
  IconCheck,
  IconCloudUpload,
  IconDeviceFloppy,
  IconTrash,
  IconX,
} from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { PageHeader, Surface, TextEditor } from '@/Components';
import { AuthenticatedLayout } from '@/Layouts';
import { PageProps, User } from '@/types';

const items = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Users', href: '/users' },
  { title: 'Edit', href: '#' },
].map((item, index) => (
  <Anchor component={Link} href={item.href} key={index}>
    {item.title}
  </Anchor>
));

const PAPER_PROPS: PaperProps = {
  p: 'md',
  shadow: 'md',
  radius: 'md',
  style: { height: '100%' },
};

type UsersProps = {
  user: User;
} & PageProps;

export default function Edit({ auth, user }: UsersProps) {
  const [avatar, setAvatar] = useState<string | undefined>(user.avatar);
  const [popoverOpened, setPopoverOpened] = useState(false);
  const passwordInput = useRef<HTMLInputElement>(null);
  const [isOpenDelete, { open: onOpenDelete, close: onCloseDelete }] = useDisclosure(false);

  const onFileUpload = (file: any): void => {
    const reader = new FileReader();

    reader.onload = () => {
      const base64URL = reader.result as string;
      userInfo.setData('avatar', base64URL);
      setAvatar(() => base64URL);
    };

    reader.readAsDataURL(file);
  };

  const onDeleteAvatar = () => {
    setAvatar(() => '');
    userInfo.setData('avatar', '');
  };

  const userInfo = useForm({
    avatar: user.avatar ?? '',
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

  const checks = requirements.map((requirement, index) => (
    <PasswordRequirement
      key={index}
      label={requirement.label}
      meets={requirement.re.test(userInfo.data.password)}
    />
  ));

  const strength = getStrength(userInfo.data.password);
  const color = strength === 100 ? 'teal' : strength > 50 ? 'yellow' : 'red';

  const onSubmitAccount: FormEventHandler = event => {
    event.preventDefault();

    userInfo.patch(route('user.update', user.id), {
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

  const onDeleteAccount = () => {
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

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Edit | Account" />

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

      <Container fluid>
        <Stack gap="lg">
          <PageHeader
            user={auth.user}
            title="Edit User"
            breadcrumbItems={items}
            withActions={
              <Button color="red" onClick={onOpenDelete}>
                Delete User
              </Button>
            }
          />
          <Surface component={Paper} {...PAPER_PROPS}>
            <Text size="lg" fw={600} mb="md">
              Account information
            </Text>
            <form onSubmit={onSubmitAccount}>
              <Stack justify="space-between" gap={16} h="100%">
                <Grid gutter={{ base: 'lg', lg: 'xl' }}>
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
                        withAsterisk
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
                          withAsterisk
                          label="City"
                          placeholder="City"
                          value={userInfo.data.city}
                          error={userInfo.errors.city}
                          disabled={userInfo.processing}
                          onChange={e => userInfo.setData('city', e.target.value)}
                        />
                        <TextInput
                          withAsterisk
                          label="State"
                          placeholder="State"
                          value={userInfo.data.state}
                          error={userInfo.errors.state}
                          disabled={userInfo.processing}
                          onChange={e => userInfo.setData('state', e.target.value)}
                        />
                        <TextInput
                          withAsterisk
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
                      <Stack mt={16}>
                        <Text fw="bold">Password & Security</Text>
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
                                  value={userInfo.data.password}
                                  disabled={userInfo.processing}
                                  error={userInfo.errors.password}
                                  onChange={e => userInfo.setData('password', e.target.value)}
                                />
                              </div>
                            </Popover.Target>
                            <Popover.Dropdown>
                              <Progress color={color} value={strength} size={5} mb="xs" />
                              <PasswordRequirement
                                label="Includes at least 6 characters"
                                meets={userInfo.data.password.length > 5}
                              />
                              {checks}
                            </Popover.Dropdown>
                          </Popover>
                          <PasswordInput
                            withAsterisk
                            label="Confirm Password"
                            placeholder="Confirm password"
                            disabled={userInfo.processing}
                            error={userInfo.errors.password}
                            value={userInfo.data.password_confirmation}
                            onChange={e =>
                              userInfo.setData('password_confirmation', e.target.value)
                            }
                          />
                        </SimpleGrid>
                      </Stack>
                    </Stack>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 4 }}>
                    <Stack justify="center" align="center">
                      <Avatar size={'100%'} variant="filled" radius="sm" src={avatar} />
                      {userInfo.errors.avatar && (
                        <Text size="xs" c="red" ta="center">
                          {userInfo.errors.avatar}
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
                  </Grid.Col>
                </Grid>
                <Button
                  type="submit"
                  mt={16}
                  style={{ width: 'fit-content' }}
                  loading={userInfo.processing}
                  leftSection={<IconDeviceFloppy size={16} />}
                >
                  Save Changes
                </Button>
              </Stack>
            </form>
          </Surface>
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
