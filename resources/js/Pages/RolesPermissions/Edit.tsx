'use client';

import { Button, Stack, TextInput, Textarea, Modal, SimpleGrid } from '@mantine/core';
import { FormEventHandler, useEffect } from 'react';
import { router, useForm } from '@inertiajs/react';
import { notifications } from '@mantine/notifications';
import { Role } from '@/types';

type RoleProps = {
  role?: Role;
  isOpen: boolean;
  onClose: () => void;
};

export default function Edit({ role, isOpen, onClose }: RoleProps) {
  const form = useForm({
    id: '',
    name: '',
    description: '',
  });

  useEffect(() => {
    if (role && role.id) {
      form.setData(role as Role);
    }
  }, [role]);

  const onSubmit: FormEventHandler = event => {
    event.preventDefault();
    if (!role) return;

    form.patch(route('role.update', role.id), {
      onSuccess: () => {
        notifications.show({
          title: 'Success!',
          message: 'Role Updated successfully.',
        });

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
    <Modal opened={isOpen} onClose={onClose} title="Update Role" centered>
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
            placeholder="Role Description"
            value={form.data.description ?? ''}
            error={form.errors.description}
            disabled={form.processing}
            onChange={e => form.setData('description', e.target.value)}
          />
          <SimpleGrid cols={{ base: 1, sm: 3 }} mt={12} w={'100%'}>
            <Button loading={form.processing} px={0} type="submit" variant="filled">
              Save Changes
            </Button>
            <Button
              disabled={form.processing}
              variant="outline"
              onClick={() => {
                onClose();
                router.visit(route('role.index'));
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
