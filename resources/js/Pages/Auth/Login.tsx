import {
  Button,
  Checkbox,
  Group,
  PasswordInput,
  TextInput,
  Title,
  Center,
  Paper,
  Text,
  Stack,
} from '@mantine/core';
import { Head, Link, useForm } from '@inertiajs/react';
import { notifications } from '@mantine/notifications';
import { FormEventHandler } from 'react';
import { AuthLayout } from '@/Layouts';
import { Surface } from '@/Components';
import classes from './auth.module.css';

type LoginType = {
  status?: string;
  canResetPassword: boolean;
};

function Login({ status, canResetPassword }: LoginType) {
  const form = useForm({
    email: 'laratine@email.com',
    password: 'password',
    remember: false,
  });

  const onSubmit: FormEventHandler = event => {
    event.preventDefault();

    form.post(route('login'), {
      onSuccess: () => {
        notifications.show({
          title: 'Success!',
          message: 'Loggged In successfully.',
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
      <Head title="Log in" />
      {status && <Text ta="center">{status}</Text>}

      <Center>
        <Stack>
          <Stack className={classes.title}>
            <Title ta="center">Welcome back :)</Title>
            <Text ta="center">Sign in to your account to continue</Text>
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
              <PasswordInput
                withAsterisk
                label="Password"
                placeholder="Your password"
                mt="md"
                classNames={{ label: classes.label }}
                value={form.data.password}
                error={form.errors.password}
                disabled={form.processing}
                onChange={e => form.setData('password', e.target.value)}
              />
              <Group justify="space-between" mt="lg">
                <Checkbox
                  label="Remember me"
                  classNames={{ label: classes.label }}
                  value={form.data.remember as any}
                  error={form.errors.remember}
                  disabled={form.processing}
                  onChange={e => form.setData('remember', e.currentTarget.checked)}
                />
                {canResetPassword && (
                  <Text
                    component={Link}
                    href={route('password.request')}
                    size="sm"
                    className={classes.link}
                  >
                    Forgot password?
                  </Text>
                )}
              </Group>
              <Button loading={form.processing} fullWidth mt="xl" type="submit">
                Log In
              </Button>
            </form>
            <Center mt="md">
              <Text
                fz="sm"
                ta="center"
                component={Link}
                href={route('register')}
                className={classes.link}
              >
                Do not have an account yet? Create account
              </Text>
            </Center>
          </Surface>
        </Stack>
      </Center>
    </AuthLayout>
  );
}

export default Login;
