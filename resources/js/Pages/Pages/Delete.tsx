'use client';

import { Button, Stack, Modal, SimpleGrid, Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import { Page } from '@/types';

type TagProps = {
  page?: Page;
  isOpen: boolean;
  onClose: () => void;
};

export default function Delete({ page, isOpen, onClose }: TagProps) {
  const [fetching, setFetching] = useState<boolean>(false);

  router.on('start', () => setFetching(() => true));
  router.on('finish', () => setFetching(() => false));

  const onSubmit = () => {
    if (!page) return;

    router.delete(route('page.destroy', page.id), {
      onSuccess: () => {
        onClose();
        notifications.show({
          title: 'Success!',
          message: 'Page permanently deleted successfully',
        });
      },
      onError: error => {
        notifications.show({ title: 'Failed!', message: error.message });
      },
    });
  };

  return (
    <Modal opened={isOpen} onClose={onClose} title="Delete Comment" centered>
      <Stack>
        <Text fw={600}>Are You sure you want to delete this comment?</Text>
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
