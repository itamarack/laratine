import { Button, PasswordInput, TextInput, Title, Center, Paper, Text, Stack } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconX } from '@tabler/icons-react';
import { Head, router, usePage } from '@inertiajs/react';
import { notifications } from '@mantine/notifications';
import { RequestPayload } from '@inertiajs/core';
import { AuthLayout } from '@/Layouts';
import { Surface } from '@/Components';
import classes from './Auth.module.css';

function ResetPassword({ token, email }: { token: string; email: string }) {
  const { errors } = usePage().props;

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      token: token,
      email: email,
      password: '',
      password_confirmation: '',
    },

    validate: {
      email: value => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password_confirmation: (value, values) =>
        value !== values.password ? 'Passwords did not match' : null,
    },
  });

  const onSubmit = (values: RequestPayload) => {
    router.post(route('password.store'), values);
    form.setErrors(errors);

    if (Object.keys(errors).length) {
      Object.values(errors).forEach(error => {
        notifications.show({
          title: 'Error!',
          message: error,
          color: 'red',
          icon: <IconX />,
        });
      });
    }
  };

  return (
    <AuthLayout>
      <Head title="Reset Password" />

      <Center>
        <Stack>
          <Title ta="center">Password Reset!</Title>
          <Text ta="center">Reset your account to continue</Text>

          <Surface component={Paper} className={classes.card}>
            <form onSubmit={form.onSubmit(values => onSubmit(values))}>
              <TextInput
                label="Email"
                withAsterisk
                mt="md"
                placeholder="your@email.com"
                key={form.key('email')}
                {...form.getInputProps('email')}
                classNames={{ label: classes.label }}
              />
              <PasswordInput
                withAsterisk
                label="Password"
                placeholder="Your password"
                mt="md"
                key={form.key('password')}
                {...form.getInputProps('password')}
                classNames={{ label: classes.label }}
              />
              <PasswordInput
                withAsterisk
                label="Confirm Password"
                placeholder="Confirm password"
                mt="md"
                key={form.key('password_confirmation')}
                {...form.getInputProps('password_confirmation')}
                classNames={{ label: classes.label }}
              />
              <Button fullWidth mt="xl" type="submit">
                Reset Password
              </Button>
            </form>
          </Surface>
        </Stack>
      </Center>
    </AuthLayout>
  );
}

export default ResetPassword;
