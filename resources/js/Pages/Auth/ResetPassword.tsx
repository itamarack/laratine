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
import { FormEventHandler, useState } from 'react';
import { IconCheck, IconX } from '@tabler/icons-react';
import { Head, useForm } from '@inertiajs/react';
import { notifications } from '@mantine/notifications';
import { AuthLayout } from '@/Layouts';
import { Surface } from '@/Components';
import classes from './auth.module.css';

function ResetPassword({ token, email }: { token: string; email: string }) {
  const [popoverOpened, setPopoverOpened] = useState(false);

  const form = useForm({
    token: token,
    email: email,
    password: '',
    password_confirmation: '',
  });

  const checks = requirements.map((requirement, index) => (
    <PasswordRequirement
      key={index}
      label={requirement.label}
      meets={requirement.re.test(form.data.password)}
    />
  ));

  const strength = getStrength(form.data.password);
  const color = strength === 100 ? 'teal' : strength > 50 ? 'yellow' : 'red';

  const onSubmit: FormEventHandler = event => {
    event.preventDefault();

    form.post(route('password.store'), {
      onSuccess: () => {
        notifications.show({
          title: 'Success!',
          message: 'Account created successfully.',
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
      <Head title="Reset Password" />

      <Center>
        <Stack>
          <Stack className={classes.title}>
            <Title ta="center">Password Reset!</Title>
            <Text ta="center">Reset your account to continue</Text>
          </Stack>

          <Surface component={Paper} className={classes.card}>
            <form onSubmit={onSubmit}>
              <Stack>
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
                        withAsterisk
                        label="Password"
                        placeholder="Your password"
                        classNames={{ label: classes.label }}
                        value={form.data.password}
                        error={form.errors.password}
                        disabled={form.processing}
                        onChange={e => form.setData('password', e.target.value)}
                      />
                    </div>
                  </Popover.Target>
                  <Popover.Dropdown>
                    <Progress color={color} value={strength} size={5} mb="xs" />
                    <PasswordRequirement
                      label="Includes at least 6 characters"
                      meets={form.data.password.length > 5}
                    />
                    {checks}
                  </Popover.Dropdown>
                </Popover>
                <PasswordInput
                  withAsterisk
                  label="Confirm Password"
                  placeholder="Confirm password"
                  classNames={{ label: classes.label }}
                  value={form.data.password_confirmation}
                  error={form.errors.password_confirmation}
                  disabled={form.processing}
                  onChange={e => form.setData('password_confirmation', e.target.value)}
                />
                <Button loading={form.processing} fullWidth mt="xl" type="submit">
                  Reset Password
                </Button>
              </Stack>
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
