'use client';

import { Button, Stack, Modal, SimpleGrid, Text } from '@mantine/core';
import { useState } from 'react';
import { router } from '@inertiajs/react';
import { notifications } from '@mantine/notifications';
import { Role } from '@/types';

type RoleProps = {
  role?: Role;
  isOpen: boolean;
  onClose: () => void;
};

export default function Delete({ role, isOpen, onClose }: RoleProps) {
  const [fetching, setFetching] = useState<boolean>(false);

  router.on('start', () => setFetching(() => true));
  router.on('finish', () => setFetching(() => false));

  const onSubmit = () => {
    if (!role) return;

    router.delete(route('role.destroy', role.id), {
      onSuccess: () => {
        onClose();
        notifications.show({
          title: 'Success!',
          message: 'Role permanently deleted successfully',
        });
      },
      onError: error => {
        notifications.show({ title: 'Failed!', message: error.message });
      },
    });
  };

  return (
    <Modal opened={isOpen} onClose={onClose} title="Delete Role" centered>
      <Stack>
        <Text fw={600}>Are You sure you want to delete this role?</Text>
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
