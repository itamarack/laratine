'use client';

import {
  Anchor,
  Button,
  Container,
  Grid,
  Paper,
  Stack,
  rem,
  Accordion,
  Select,
  Flex,
} from '@mantine/core';
import { FormEventHandler } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { notifications } from '@mantine/notifications';
import { IconDeviceFloppy, IconPrinter, IconEye } from '@tabler/icons-react';
import { PageHeader, Surface, TextEditor } from '@/Components';
import { AuthenticatedLayout } from '@/Layouts';
import { Comment, PageProps, Post, User } from '@/types';
import { dashboardRoute, commentRoute } from '@/Routes';
import { makeSelectableList } from '@/Utils';

type PagesProps = {
  authors?: User[];
  posts?: Post[];
  comments?: Comment[];
} & PageProps;

export default function Create({ auth, authors, posts, comments }: PagesProps) {
  const authorsList = makeSelectableList(authors, 'fullname');
  const postsList = makeSelectableList(posts, 'title');
  const commentsList = makeSelectableList(comments, 'content');

  const form = useForm({
    content: '',
    user_id: auth.user.id.toString(),
    status: '',
    parent_id: '',
    post_id: '',
  });

  const onSubmit: FormEventHandler = event => {
    event.preventDefault();

    form.post(route('comment.store'), {
      preserveScroll: true,
      onSuccess: () => {
        notifications.show({
          title: 'Success!',
          message: 'Comment created successfully.',
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
      <Head title="Create | Comments" />

      <Container fluid>
        <form onSubmit={onSubmit}>
          <Stack gap="lg">
            <PageHeader
              user={auth.user}
              title="Create Comment"
              breadcrumbItems={[
                { title: 'Dashboard', href: dashboardRoute.dashboard },
                { title: 'Comments', href: commentRoute.list },
                { title: 'Create', href: '#' },
              ]}
              withActions={
                <Button
                  type="submit"
                  mt={{ base: 12, sm: 0 }}
                  w={{ base: '100%', sm: 'fit-content' }}
                  loading={form.processing}
                  leftSection={<IconDeviceFloppy size={16} />}
                >
                  Create Comment
                </Button>
              }
            />
            <Grid gutter={{ base: 'lg', lg: 'xl' }}>
              <Grid.Col span={{ base: 12, md: 8 }}>
                <Surface component={Paper} p="md" shadow="md" radius="md" h="100%">
                  <Stack justify="space-between" gap={16} h="100%">
                    <TextEditor
                      label="Comment"
                      content={form.data.content}
                      editable={!form.processing}
                      onChange={(content: any) => form.setData('content', content)}
                      style={{ minHeight: 300 }}
                    />
                  </Stack>
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
                            <Select
                              searchable
                              withAsterisk
                              label="In response to"
                              placeholder="Select Post"
                              data={postsList}
                              value={form.data.post_id}
                              error={form.errors.post_id}
                              disabled={form.processing}
                              checkIconPosition="right"
                              onChange={(a: any) => form.setData('post_id', a)}
                            />
                            <Select
                              searchable
                              withAsterisk
                              label="Author"
                              placeholder="Select Author"
                              data={authorsList}
                              value={form.data.user_id}
                              error={form.errors.user_id}
                              disabled={form.processing}
                              checkIconPosition="right"
                              onChange={(a: any) => form.setData('user_id', a)}
                            />
                            <Select
                              searchable
                              label="Parent"
                              placeholder="Select Parent"
                              value={form.data.parent_id}
                              error={form.errors.parent_id}
                              disabled={form.processing}
                              checkIconPosition="right"
                              data={commentsList}
                              onChange={(page: any) => form.setData('parent_id', page)}
                            />
                            <Select
                              withAsterisk
                              label="Status"
                              placeholder="Select Status"
                              value={form.data.status}
                              error={form.errors.status}
                              disabled={form.processing}
                              checkIconPosition="right"
                              data={['Approve', 'Review', 'Disapprove']}
                              onChange={(status: any) => form.setData('status', status)}
                            />
                            <Flex justify="flex-end">
                              <Button
                                size="xs"
                                disabled={form.processing}
                                leftSection={<IconEye size={16} />}
                              >
                                Preview
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
