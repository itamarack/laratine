'use client';

import { Button, Stack, TextInput, Textarea, Modal, SimpleGrid } from '@mantine/core';
import { FormEventHandler } from 'react';
import { router, useForm } from '@inertiajs/react';
import { notifications } from '@mantine/notifications';

type RoleProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function Create({ isOpen, onClose }: RoleProps) {
  const form = useForm({
    name: '',
    description: '',
  });

  const onSubmit: FormEventHandler = event => {
    event.preventDefault();

    form.post(route('role.store'), {
      onSuccess: () => {
        notifications.show({
          title: 'Success!',
          message: 'Role created successfully.',
        });

        form.reset();
        onClose();
        router.visit(route('role.index'));
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
    <Modal opened={isOpen} onClose={onClose} title="Create Role" centered>
      <form onSubmit={onSubmit}>
        <Stack>
          <TextInput
            withAsterisk
            label="Name"
            placeholder="Role Name"
            value={form.data.name}
            error={form.errors.name}
            disabled={form.processing}
            onChange={e => form.setData('name', e.target.value)}
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
            <Button
              disabled={form.processing}
              onClick={() => {
                onClose();
                router.visit(route('role.index'));
              }}
              variant="outline"
            >
              Cancel
            </Button>
          </SimpleGrid>
        </Stack>
      </form>
    </Modal>
  );
}
