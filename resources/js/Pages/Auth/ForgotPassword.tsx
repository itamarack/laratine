import {
  Button,
  Group,
  TextInput,
  Title,
  Center,
  Paper,
  Text,
  Stack,
  UnstyledButton,
  rem,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconChevronLeft } from '@tabler/icons-react';
import { Head, Link, useForm } from '@inertiajs/react';
import { AuthLayout } from '@/Layouts';
import { Surface } from '@/Components';
import classes from './Auth.module.css';
import { FormEventHandler } from 'react';

function ResetPassword({ status }: { status: string }) {
  const mobile_match = useMediaQuery('(max-width: 425px)');

  const form = useForm({
    email: '',
    status: status,
  });

  const onSubmit: FormEventHandler = event => {
    event.preventDefault();

    form.post(route('password.email'), {
      onSuccess: () => {
        notifications.show({
          title: 'Success!',
          message: 'Verification sent successfully',
        });
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
    <AuthLayout>
      <Head title="Forgot Password" />

      <Center>
        <Stack align={'center'}>
          <Stack className={classes.title}>
            <Title ta="center">Forgot your password?</Title>
            <Text ta="center">Enter your email to get a reset link</Text>
          </Stack>

          <Surface component={Paper} className={classes.card}>
            <form onSubmit={onSubmit}>
              <TextInput
                label="Email"
                withAsterisk
                placeholder="your@email.com"
                classNames={{ label: classes.label }}
                value={form.data.email}
                error={form.errors.email}
                disabled={form.processing}
                onChange={e => form.setData('email', e.target.value)}
              />
              <Group justify="space-between" align={'center'} mt="lg">
                <UnstyledButton
                  color="dimmed"
                  component={Link}
                  href={route('login')}
                  className={classes.control}
                >
                  <Group gap={2} align="center">
                    <IconChevronLeft stroke={1.5} style={{ width: rem(14), height: rem(14) }} />
                    <Text size="sm">Back to the login page</Text>
                  </Group>
                </UnstyledButton>
                <Button loading={form.processing} type="submit" fullWidth={mobile_match}>
                  Reset password
                </Button>
              </Group>
            </form>
          </Surface>
        </Stack>
      </Center>
    </AuthLayout>
  );
}

export default ResetPassword;
