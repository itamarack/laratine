'use client';

import { Button, Stack, TextInput, Textarea, Modal, SimpleGrid } from '@mantine/core';
import { FormEventHandler } from 'react';
import { router, useForm } from '@inertiajs/react';
import { notifications } from '@mantine/notifications';
import { useDebouncedCallback } from '@mantine/hooks';
import { slugify } from '@/Utils';

type TagProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function Create({ isOpen, onClose }: TagProps) {
  const form = useForm({
    title: '',
    slug: '',
    description: '',
  });

  const onSlugify = useDebouncedCallback((slug: string) => {
    form.setData('slug', slugify(slug));
  }, 200);

  const onSubmit: FormEventHandler = event => {
    event.preventDefault();

    form.post(route('tag.store'), {
      onSuccess: () => {
        notifications.show({
          title: 'Success!',
          message: 'Tag created successfully.',
        });

        form.reset();
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
    <Modal opened={isOpen} onClose={onClose} title="Create Tag" centered>
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
            withAsterisk
            label="Slug"
            placeholder="Tag Slug"
            value={form.data.slug}
            error={form.errors.slug}
            disabled={form.processing}
            onChange={e => form.setData('slug', e.target.value)}
          />
          <Textarea
            label="Description"
            placeholder="Tag Description"
            value={form.data.description}
            error={form.errors.description}
            disabled={form.processing}
            onChange={e => form.setData('description', e.target.value)}
          />
          <SimpleGrid cols={{ base: 1, sm: 3 }} mt={12}>
            <Button loading={form.processing} onClick={onSubmit} variant="filled">
              Create
            </Button>
            <Button
              variant="outline"
              disabled={form.processing}
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
