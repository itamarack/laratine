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
  rem,
  Accordion,
  Fieldset,
  Select,
} from '@mantine/core';
import { FormEventHandler, useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { notifications } from '@mantine/notifications';
import {
  IconCloudUpload,
  IconDeviceFloppy,
  IconPhoto,
  IconTrash,
  IconUserHexagon,
} from '@tabler/icons-react';
import { PageHeader, Surface, TextEditor } from '@/Components';
import { AuthenticatedLayout } from '@/Layouts';
import { PageProps } from '@/types';
import { dashboardRoute } from '@/Routes';

function Profile({ auth, roles }: PageProps & { roles: any }) {
  const [avatar, setAvatar] = useState<string | undefined>(auth.user.avatar);

  console.log(auth.can);

  const form = useForm({
    _method: 'patch',
    avatar: avatar ?? null,
    role: auth.user.role ?? '',
    firstname: auth.user.firstname ?? '',
    lastname: auth.user.lastname ?? '',
    email: auth.user.email ?? '',
    address: auth.user.address ?? '',
    city: auth.user.city ?? '',
    state: auth.user.state ?? '',
    postcode: auth.user.postcode ?? '',
    biography: auth.user.biography ?? '',
  });

  const onFileUpload = (file: File | null) => {
    const objectURL = URL.createObjectURL(file as File);
    setAvatar(() => objectURL);
    form.setData('avatar', file as any);
    return () => URL.revokeObjectURL(objectURL);
  };

  const onDeleteAvatar = () => {
    setAvatar(() => undefined);
    form.setData('avatar', '');
  };

  const onSubmitAccount: FormEventHandler = () => {
    form.post(route('profile.update'), {
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

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Profile | Account" />

      <Container fluid>
        <Stack gap="lg">
          <PageHeader
            user={auth.user}
            title="Profile"
            breadcrumbItems={[
              { title: 'Dashboard', href: dashboardRoute.dashboard },
              { title: 'Profile', href: '#' },
            ]}
            withActions={
              auth.can['Update Profiles'] && (
                <Button
                  type="submit"
                  style={{ width: 'fit-content' }}
                  loading={form.processing}
                  leftSection={<IconDeviceFloppy size={16} />}
                  onClick={onSubmitAccount}
                >
                  Save Changes
                </Button>
              )
            }
          />
          <Grid>
            <Grid.Col span={{ base: 12, md: 8 }}>
              <Stack>
                <Surface component={Paper} p="md" shadow="md" radius="md" h="100%">
                  <Fieldset legend="Account information">
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
                          label="City"
                          placeholder="City"
                          value={form.data.city}
                          error={form.errors.city}
                          disabled={form.processing}
                          onChange={e => form.setData('city', e.target.value)}
                        />
                        <TextInput
                          label="State"
                          placeholder="State"
                          value={form.data.state}
                          error={form.errors.state}
                          disabled={form.processing}
                          onChange={e => form.setData('state', e.target.value)}
                        />
                        <TextInput
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
                </Surface>
              </Stack>
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
                    <Accordion.Item value="layout">
                      <Accordion.Control
                        icon={
                          <IconUserHexagon
                            style={{
                              color: 'var(--mantine-color-green-6',
                              width: rem(20),
                              height: rem(20),
                            }}
                          />
                        }
                      >
                        User Role
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

export default Profile;
