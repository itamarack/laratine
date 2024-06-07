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
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { RequestPayload } from '@inertiajs/core';
import AuthLayout from '@/Layouts/AuthLayout';
import { Surface } from '@/Components';
import classes from './css/login.module.css';

function Login({ status, canResetPassword }: { status?: string; canResetPassword: boolean }) {
  const { errors } = usePage().props;

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      email: '',
      password: '',
      remember: false,
    },

    validate: {
      email: value => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
    },
  });

  const onSubmit = (values: RequestPayload) => {
    router.post(route('login'), values);
    form.setErrors(errors);
    console.log(errors);
  };

  return (
    <AuthLayout>
      <Head title="Log in" />

      {status && <div className="mb-4 text-sm font-medium text-green-600">{status}</div>}

      <Title ta="center">Welcome back!</Title>
      <Text ta="center">Sign in to your account to continue</Text>

      <Surface component={Paper} className={classes.card}>
        <form onSubmit={form.onSubmit(values => onSubmit(values))}>
          <TextInput
            label="Email"
            withAsterisk
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
          <Group justify="space-between" mt="lg">
            <Checkbox
              label="Remember me"
              key={form.key('password')}
              {...form.getInputProps('remember')}
              classNames={{ label: classes.label }}
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
          <Button fullWidth mt="xl" type="submit">
            Sign in
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
    </AuthLayout>
  );
}

export default Login;
