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
} from '@mantine/core';
import { FormEventHandler, useState } from 'react';
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
} from '@tabler/icons-react';
import { useDebouncedCallback } from '@mantine/hooks';
import { PageHeader, Surface, TextEditor } from '@/Components';
import { AuthenticatedLayout } from '@/Layouts';
import { Page, PageProps, Tags, User } from '@/types';
import { dashboardRoute, pageRoute } from '@/Routes';
import { slugify, makeSelectableList } from '@/Utils';

type PagesProps = {
  page: Page;
  authors?: User[];
  pages?: Page[];
  tags?: Tags[];
} & PageProps;

export default function Edit({ auth, page, authors, pages, tags }: PagesProps) {
  const [featuredImage, setFeaturedImage] = useState<string | undefined>(page.featured_image);
  const authorsList = makeSelectableList(authors, 'fullname');
  const pagesList = makeSelectableList(pages, 'title', page);
  const tagList = makeSelectableList(tags, 'title');

  const form = useForm({
    _method: 'patch',
    title: page.title ?? '',
    slug: page.slug ?? '',
    excerpt: page.excerpt ?? '',
    content: page.content ?? '',
    user_id: page.user_id ?? '',
    status: page.status ?? '',
    parent_id: page.parent_id ?? '',
    featured_image: page.featured_image ?? '',
    meta_description: page.meta_description ?? '',
    meta_tags: page.meta_tags ?? [],
    layout_template: page.layout_template ?? '',
    layout_width: page.layout_width ?? '',
  });

  const onSlugify = useDebouncedCallback((slug: string) => {
    form.setData('slug', slugify(slug));
  }, 200);

  const onFileUpload = (file: File | null) => {
    const objectURL = URL.createObjectURL(file as File);
    setFeaturedImage(() => objectURL);
    form.setData('featured_image', file as any);
    return () => URL.revokeObjectURL(objectURL);
  };

  const onDeleteFeaturedImage = () => {
    setFeaturedImage(() => '');
    form.setData('featured_image', '');
  };

  const onSubmit: FormEventHandler = event => {
    event.preventDefault();

    form.post(route('page.update', page.id), {
      preserveScroll: true,
      onSuccess: () => {
        notifications.show({
          title: 'Success!',
          message: 'Page updated successfully.',
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
      <Head title="Edit | Pages" />

      <Container fluid>
        <form onSubmit={onSubmit}>
          <Stack gap="lg">
            <PageHeader
              user={auth.user}
              title="Edit Page"
              breadcrumbItems={[
                { title: 'Dashboard', href: dashboardRoute.dashboard },
                { title: 'Pages', href: pageRoute.list },
                { title: 'Edit', href: '#' },
              ]}
              withActions={
                <Button
                  type="submit"
                  mt={{ base: 12, sm: 0 }}
                  w={{ base: '100%', sm: 'fit-content' }}
                  loading={form.processing}
                  leftSection={<IconDeviceFloppy size={16} />}
                >
                  Save Changes
                </Button>
              }
            />
            <Grid gutter={{ base: 'lg', lg: 'xl' }}>
              <Grid.Col span={{ base: 12, md: 8 }}>
                <Surface component={Paper} p="md" shadow="md" radius="md" h="100%">
                  <Stack justify="space-between" gap={16} h="100%">
                    <TextInput
                      withAsterisk
                      label="Title"
                      placeholder="Title"
                      value={form.data.title}
                      error={form.errors.title}
                      disabled={form.processing}
                      onChange={e => form.setData('title', e.target.value)}
                      onInput={e => onSlugify(e.currentTarget.value)}
                    />
                    <TextInput
                      withAsterisk
                      label="Slug"
                      placeholder="Slug"
                      value={form.data.slug}
                      error={form.errors.slug}
                      disabled={form.processing}
                      onChange={e => form.setData('slug', e.target.value)}
                    />
                    <Textarea
                      label="Excerpt"
                      placeholder="Excerpt"
                      value={form.data.excerpt}
                      error={form.errors.excerpt}
                      disabled={form.processing}
                      onChange={e => form.setData('excerpt', e.target.value)}
                    />
                    <TextEditor
                      label="Content"
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
                              withAsterisk
                              label="Parent"
                              placeholder="Select Parent"
                              value={form.data.parent_id}
                              error={form.errors.parent_id}
                              disabled={form.processing}
                              checkIconPosition="right"
                              data={pagesList}
                              onChange={(category: any) => form.setData('parent_id', category)}
                            />
                            <Select
                              withAsterisk
                              label="Status"
                              placeholder="Select Status"
                              value={form.data.status}
                              error={form.errors.status}
                              disabled={form.processing}
                              checkIconPosition="right"
                              data={['Publish', 'Draft', 'Review', 'Unpublish']}
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
                          Featured Image
                        </Accordion.Control>
                        <Accordion.Panel>
                          <Stack justify="center" align="center">
                            <Image w={'100%'} variant="filled" src={featuredImage} />
                            {form.errors.featured_image && (
                              <Text size="xs" c="red" ta="center">
                                {form.errors.featured_image}
                              </Text>
                            )}
                            <Grid gutter={24} justify="center">
                              <Grid.Col span={featuredImage ? 8 : 12}>
                                <FileButton onChange={onFileUpload} accept="image/png,image/jpeg">
                                  {props => (
                                    <Button
                                      {...props}
                                      variant="filled"
                                      leftSection={<IconCloudUpload size={16} />}
                                    >
                                      Upload image
                                    </Button>
                                  )}
                                </FileButton>
                              </Grid.Col>
                              {featuredImage && (
                                <Grid.Col span={4}>
                                  <Button
                                    onClick={onDeleteFeaturedImage}
                                    variant="filled"
                                    color="red"
                                  >
                                    <IconTrash size={16} />
                                  </Button>
                                </Grid.Col>
                              )}
                            </Grid>
                            <Text ta="center" size="xs" c="dimmed">
                              For best results, use an image at least 512px by 512px in .jpg format
                            </Text>
                          </Stack>
                        </Accordion.Panel>
                      </Accordion.Item>

                      <Accordion.Item value="layout">
                        <Accordion.Control
                          icon={
                            <IconLayout
                              style={{
                                color: 'var(--mantine-color-green-6',
                                width: rem(20),
                                height: rem(20),
                              }}
                            />
                          }
                        >
                          Layout
                        </Accordion.Control>
                        <Accordion.Panel>
                          <Stack>
                            <Select
                              label="Layout Template"
                              placeholder="Select Layout Template"
                              value={form.data.layout_template}
                              error={form.errors.layout_template}
                              disabled={form.processing}
                              checkIconPosition="right"
                              data={['Page Template', 'Page With Sidebar']}
                              onChange={(t: any) => form.setData('layout_template', t)}
                            />
                            <Select
                              label="Layout Width"
                              placeholder="Select Layout Width"
                              value={form.data.layout_width}
                              error={form.errors.layout_width}
                              disabled={form.processing}
                              checkIconPosition="right"
                              data={['Full Width Layout', 'Boxed Layout']}
                              onChange={(t: any) => form.setData('layout_width', t)}
                            />
                          </Stack>
                        </Accordion.Panel>
                      </Accordion.Item>

                      <Accordion.Item value="meta">
                        <Accordion.Control
                          icon={
                            <IconHomeSearch
                              style={{
                                color: 'var(--mantine-color-orange-6',
                                width: rem(20),
                                height: rem(20),
                              }}
                            />
                          }
                        >
                          Meta
                        </Accordion.Control>
                        <Accordion.Panel>
                          <Stack>
                            <Textarea
                              label="Meta Description"
                              placeholder="Meta Description"
                              value={form.data.meta_description}
                              error={form.errors.meta_description}
                              disabled={form.processing}
                              onChange={e => form.setData('meta_description', e.target.value)}
                            />
                            <TagsInput
                              label="Meta Tags"
                              placeholder="Select Multiple Tags"
                              maxDropdownHeight={200}
                              value={form.data.meta_tags}
                              error={form.errors.meta_tags}
                              disabled={form.processing}
                              data={tagList}
                              onChange={(tag: any) => form.setData('meta_tags', tag)}
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
        </form>
      </Container>
    </AuthenticatedLayout>
  );
}
