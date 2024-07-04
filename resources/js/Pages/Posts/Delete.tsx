'use client';

import { Button, Stack, Modal, SimpleGrid, Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import { Post } from '@/types';

type TagProps = {
  post?: Post;
  isOpen: boolean;
  onClose: () => void;
};

export default function Delete({ post, isOpen, onClose }: TagProps) {
  const [fetching, setFetching] = useState<boolean>(false);

  router.on('start', () => setFetching(() => true));
  router.on('finish', () => setFetching(() => false));

  const onSubmit = () => {
    if (!post) return;

    router.delete(route('post.destroy', post.id), {
      onSuccess: () => {
        onClose();
        notifications.show({
          title: 'Success!',
          message: 'Post permanently deleted successfully',
        });
      },
      onError: error => {
        notifications.show({ title: 'Failed!', message: error.message });
      },
    });
  };

  return (
    <Modal opened={isOpen} onClose={onClose} title="Delete Tag" centered>
      <Stack>
        <Text fw={600}>Are You sure you want to delete this tag?</Text>
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
