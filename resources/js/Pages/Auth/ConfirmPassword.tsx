import { Button, PasswordInput, Center, Paper, Text, Stack } from '@mantine/core';
import { Head, useForm } from '@inertiajs/react';
import { AuthLayout } from '@/Layouts';
import { Surface } from '@/Components';
import classes from './Auth.module.css';
import { FormEventHandler } from 'react';
import { notifications } from '@mantine/notifications';

function ConfirmPassword() {
  const form = useForm({
    password: '',
  });

  const onSubmit: FormEventHandler = event => {
    event.preventDefault();

    form.post(route('password.confirm'), {
      onSuccess: () => {
        notifications.show({
          title: 'Success!',
          message: 'Passeord confirmed successfully.',
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
      <Head title="Confirm Password" />

      <Center>
        <Stack>
          <Text ta="center" className={classes.title}>
            This is a secure area of the application. <br /> Please confirm your password before
            continuing.
          </Text>

          <Surface component={Paper} className={classes.card}>
            <form onSubmit={onSubmit}>
              <Stack>
                <PasswordInput
                  withAsterisk
                  label="Password"
                  placeholder="Your password"
                  classNames={{ label: classes.label }}
                  value={form.data.password}
                  error={form.errors.password}
                  disabled={form.processing}
                  onChange={e => form.setData('password', e.target.value)}
                />
                <Button loading={form.processing} fullWidth mt="xl" type="submit">
                  Confirm
                </Button>
              </Stack>
            </form>
          </Surface>
        </Stack>
      </Center>
    </AuthLayout>
  );
}

export default ConfirmPassword;
