'use client';

import { Button, Stack, Modal, SimpleGrid, Text } from '@mantine/core';
import { useState } from 'react';
import { router } from '@inertiajs/react';
import { notifications } from '@mantine/notifications';
import { Category } from '@/types';

type CategoryProps = {
  category?: Category;
  isOpen: boolean;
  onClose: () => void;
};

export default function Delete({ category, isOpen, onClose }: CategoryProps) {
  const [fetching, setFetching] = useState<boolean>(false);

  router.on('start', () => setFetching(() => true));
  router.on('finish', () => setFetching(() => false));

  const onSubmit = () => {
    if (!category) return;

    router.delete(route('category.destroy', category.id), {
      onSuccess: () => {
        onClose();
        notifications.show({
          title: 'Success!',
          message: 'Category permanently deleted successfully',
        });
      },
      onError: error => {
        notifications.show({ title: 'Failed!', message: error.message });
      },
    });
  };

  return (
    <Modal opened={isOpen} onClose={onClose} title="Delete Category" centered>
      <Stack>
        <Text fw={600}>Are You sure you want to delete this category?</Text>
        <SimpleGrid cols={{ base: 1, sm: 2 }}>
          <Button loading={fetching} onClick={onSubmit} variant="filled">
            Delete
          </Button>
          <Button disabled={fetching} onClick={onClose} variant="outline">
            Cancel
          </Button>
        </SimpleGrid>
      </Stack>
    </Modal>
  );
}
