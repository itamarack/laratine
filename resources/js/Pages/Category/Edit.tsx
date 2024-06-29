'use client';

import { Button, Stack, TextInput, Textarea, Select, Modal, SimpleGrid } from '@mantine/core';
import { FormEventHandler, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { notifications } from '@mantine/notifications';
import { useDebouncedCallback } from '@mantine/hooks';
import { slugify } from '@/Utils';
import { Category } from '@/types';

type CategoryProps = {
  category?: Category;
  isOpen: boolean;
  onClose: () => void;
};

export default function Edit({ category, isOpen, onClose }: CategoryProps) {
  const form = useForm({
    id: '',
    title: '',
    slug: '',
    description: '',
    parent_id: '',
  });

  useEffect(() => {
    if (category && category.id) {
      form.setData(category as Category);
    }
  }, [category]);

  const onSlugify = useDebouncedCallback((slug: string) => {
    form.setData('slug', slugify(slug));
  }, 200);

  const onSubmit: FormEventHandler = event => {
    event.preventDefault();
    if (!category) return;

    form.patch(route('category.update', category.id), {
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
    <Modal opened={isOpen} onClose={onClose} title="Update Category" centered>
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
            value={form.data.description ?? ''}
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
