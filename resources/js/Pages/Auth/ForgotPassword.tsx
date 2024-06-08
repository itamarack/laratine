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
  UnstyledButton,
  rem,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMediaQuery } from '@mantine/hooks';
import { IconX, IconCheck } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { IconChevronLeft } from '@tabler/icons-react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { RequestPayload } from '@inertiajs/core';
import { AuthLayout } from '@/Layouts';
import { Surface } from '@/Components';
import classes from './Auth.module.css';

function ResetPassword({ status }: { status: string }) {
  const { errors, flash } = usePage().props;
  const mobile_match = useMediaQuery('(max-width: 425px)');

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      email: '',
      status: status,
    },

    validate: {
      email: value => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
    },
  });

  const onSubmit = (values: RequestPayload) => {
    router.post(route('password.email'), values);
    form.setErrors(errors);

    if (status) {
      notifications.show({
        title: 'Verification Sent!',
        message: status,
        color: 'green',
        icon: <IconCheck />,
      });
    }

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
      <Head title="Forgot Password" />

      <Center>
        <Stack align={'center'}>
          <Title ta="center">Forgot your password?</Title>
          <Text ta="center">Enter your email to get a reset link</Text>

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
                <Button type="submit" fullWidth={mobile_match}>
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
