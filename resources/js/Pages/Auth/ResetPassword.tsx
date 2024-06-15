import {
  Button,
  PasswordInput,
  TextInput,
  Title,
  Center,
  Paper,
  Text,
  Stack,
  Popover,
  Progress,
  rem,
  Box,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useState } from 'react';
import { IconCheck, IconX } from '@tabler/icons-react';
import { Head, router, usePage } from '@inertiajs/react';
import { notifications } from '@mantine/notifications';
import { RequestPayload } from '@inertiajs/core';
import { AuthLayout } from '@/Layouts';
import { Surface } from '@/Components';
import classes from './Auth.module.css';

function ResetPassword({ token, email }: { token: string; email: string }) {
  const { errors } = usePage().props;
  const [popoverOpened, setPopoverOpened] = useState(false);

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
      password: value => (getStrength(value) ? 'Password must meet all criteria' : null),
      password_confirmation: (value, values) =>
        value !== values.password ? 'Passwords did not match' : null,
    },
  });

  const checks = requirements.map((requirement, index) => (
    <PasswordRequirement
      key={index}
      label={requirement.label}
      meets={requirement.re.test(form.getInputProps('password').value)}
    />
  ));

  const strength = getStrength(form.getInputProps('password').value);
  const color = strength === 100 ? 'teal' : strength > 50 ? 'yellow' : 'red';

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
          <Stack className={classes.title}>
            <Title ta="center">Password Reset!</Title>
            <Text ta="center">Reset your account to continue</Text>
          </Stack>

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
              <Popover
                opened={popoverOpened}
                position="bottom"
                width="target"
                transitionProps={{ transition: 'pop' }}
              >
                <Popover.Target>
                  <div
                    onFocusCapture={() => setPopoverOpened(true)}
                    onBlurCapture={() => setPopoverOpened(false)}
                  >
                    <PasswordInput
                      mt="md"
                      withAsterisk
                      label="Password"
                      key={form.key('password')}
                      placeholder="Your password"
                      {...form.getInputProps('password')}
                      classNames={{ label: classes.label }}
                    />
                  </div>
                </Popover.Target>
                <Popover.Dropdown>
                  <Progress color={color} value={strength} size={5} mb="xs" />
                  <PasswordRequirement
                    label="Includes at least 6 characters"
                    meets={form.getInputProps('password').value.length > 5}
                  />
                  {checks}
                </Popover.Dropdown>
              </Popover>
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

function PasswordRequirement({ meets, label }: { meets: boolean; label: string }) {
  return (
    <Text
      c={meets ? 'teal' : 'red'}
      style={{ display: 'flex', alignItems: 'center' }}
      mt={7}
      size="sm"
    >
      {meets ? (
        <IconCheck style={{ width: rem(14), height: rem(14) }} />
      ) : (
        <IconX style={{ width: rem(14), height: rem(14) }} />
      )}{' '}
      <Box ml={10}>{label}</Box>
    </Text>
  );
}

const requirements = [
  { re: /[0-9]/, label: 'Includes number' },
  { re: /[a-z]/, label: 'Includes lowercase letter' },
  { re: /[A-Z]/, label: 'Includes uppercase letter' },
  { re: /[$&+,:;=?@#|'<>.^*()%!-]/, label: 'Includes special symbol' },
];

function getStrength(password: string) {
  let multiplier = password.length > 5 ? 0 : 1;

  requirements.forEach(requirement => {
    if (!requirement.re.test(password)) {
      multiplier += 1;
    }
  });

  return Math.max(100 - (100 / (requirements.length + 1)) * multiplier, 10);
}

export default ResetPassword;
