'use client';

import { Button, Stack, TextInput, Textarea, Select, Modal, SimpleGrid } from '@mantine/core';
import { FormEventHandler } from 'react';
import { useForm } from '@inertiajs/react';
import { notifications } from '@mantine/notifications';
import { useDebouncedCallback } from '@mantine/hooks';
import { slugify } from '@/Utils';

type CategoryProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function Create({ isOpen, onClose }: CategoryProps) {
  const form = useForm({
    title: '',
    slug: '',
    description: '',
    parent_id: '',
  });

  const onSlugify = useDebouncedCallback((slug: string) => {
    form.setData('slug', slugify(slug));
  }, 200);

  const onSubmit: FormEventHandler = event => {
    event.preventDefault();

    form.post(route('category.store'), {
      onSuccess: () => {
        notifications.show({
          title: 'Success!',
          message: 'Category created successfully.',
        });

        form.reset();
        onClose();
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
    <Modal opened={isOpen} onClose={onClose} title="Create Category" centered>
      <form onSubmit={onSubmit}>
        <Stack>
          <TextInput
            withAsterisk
            label="Title"
            placeholder="Category Title"
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
            placeholder="Category Slug"
            value={form.data.slug}
            error={form.errors.slug}
            onChange={e => form.setData('slug', e.target.value)}
          />
          <Select
            searchable
            label="Parent"
            placeholder="Select Parent Category"
            data={[]}
            value={form.data.parent_id}
            error={form.errors.parent_id}
            disabled={form.processing}
            checkIconPosition="right"
            onChange={(a: any) => form.setData('parent_id', a)}
          />
          <Textarea
            label="Description"
            placeholder="Description"
            value={form.data.description}
            error={form.errors.description}
            disabled={form.processing}
            onChange={e => form.setData('description', e.target.value)}
          />
          <SimpleGrid cols={{ base: 1, sm: 3 }} mt={12}>
            <Button loading={form.processing} onClick={onSubmit} variant="filled">
              Create
            </Button>
            <Button disabled={form.processing} onClick={onClose} variant="outline">
              Cancel
            </Button>
          </SimpleGrid>
        </Stack>
      </form>
    </Modal>
  );
}
