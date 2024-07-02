'use client';

import { Button, Stack, TextInput, Textarea, Modal, SimpleGrid } from '@mantine/core';
import { FormEventHandler, useEffect } from 'react';
import { router, useForm } from '@inertiajs/react';
import { notifications } from '@mantine/notifications';
import { useDebouncedCallback } from '@mantine/hooks';
import { slugify } from '@/Utils';
import { Category, Tags } from '@/types';

type TagsProps = {
  tag?: Category;
  isOpen: boolean;
  onClose: () => void;
};

export default function Edit({ tag, isOpen, onClose }: TagsProps) {
  const form = useForm({
    id: '',
    title: '',
    slug: '',
    description: '',
  });

  useEffect(() => {
    if (tag) form.setData(tag as Tags);
  }, [tag]);

  const onSlugify = useDebouncedCallback((slug: string) => {
    form.setData('slug', slugify(slug));
  }, 200);

  const onSubmit: FormEventHandler = event => {
    event.preventDefault();
    if (!tag) return;

    form.patch(route('tag.update', tag.id), {
      onSuccess: () => {
        notifications.show({
          title: 'Success!',
          message: 'Tag updated successfully.',
        });

        onClose();
        router.visit(route('tag.index'));
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
    <Modal opened={isOpen} onClose={onClose} title="Update Tag" centered>
      <form onSubmit={onSubmit}>
        <Stack>
          <TextInput
            withAsterisk
            label="Title"
            placeholder="Tag Title"
            value={form.data.title}
            error={form.errors.title}
            disabled={form.processing}
            onChange={e => form.setData('title', e.target.value)}
            onInput={e => onSlugify(e.currentTarget.value)}
          />
          <TextInput
            disabled
            withAsterisk
            label="Slug"
            placeholder="Tag Slug"
            value={form.data.slug}
            error={form.errors.slug}
            onChange={e => form.setData('slug', e.target.value)}
          />
          <Textarea
            label="Description"
            placeholder="Tag Description"
            value={form.data.description ?? ''}
            error={form.errors.description}
            disabled={form.processing}
            onChange={e => form.setData('description', e.target.value)}
          />
          <SimpleGrid cols={{ base: 2, sm: 3 }} mt={12}>
            <Button loading={form.processing} px={0} type="submit" variant="filled">
              Save Changes
            </Button>
            <Button
              disabled={form.processing}
              variant="outline"
              onClick={() => {
                onClose();
                router.visit(route('tag.index'));
              }}
            >
              Cancel
            </Button>
          </SimpleGrid>
        </Stack>
      </form>
    </Modal>
  );
}
