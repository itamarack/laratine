import {
  Button,
  PasswordInput,
  TextInput,
  Title,
  Center,
  Paper,
  Text,
  Stack,
  SimpleGrid,
  rem,
  Box,
  Popover,
  Progress,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { FormEventHandler, useState } from 'react';
import { IconCheck, IconX } from '@tabler/icons-react';
import { Head, Link, useForm } from '@inertiajs/react';
import { AuthLayout } from '@/Layouts';
import { Surface } from '@/Components';
import classes from './Auth.module.css';

function Register() {
  const [popoverOpened, setPopoverOpened] = useState(false);

  const form = useForm({
    firstname: '',
    lastname: '',
    email: '',
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

    form.post(route('register'), {
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
      <Head title="Register" />

      <Center>
        <Stack>
          <Stack className={classes.title}>
            <Title ta="center">Welcome!</Title>
            <Text ta="center">Register your account to continue</Text>
          </Stack>

          <Surface component={Paper} className={classes.card}>
            <form onSubmit={onSubmit}>
              <Stack>
                <SimpleGrid cols={{ base: 1, sm: 2 }}>
                  <TextInput
                    label="Firstname"
                    withAsterisk
                    placeholder="Firstname"
                    classNames={{ label: classes.label }}
                    value={form.data.firstname}
                    error={form.errors.firstname}
                    disabled={form.processing}
                    onChange={e => form.setData('firstname', e.target.value)}
                  />
                  <TextInput
                    label="Lastname"
                    withAsterisk
                    placeholder="Lastname"
                    classNames={{ label: classes.label }}
                    value={form.data.lastname}
                    error={form.errors.lastname}
                    disabled={form.processing}
                    onChange={e => form.setData('lastname', e.target.value)}
                  />
                </SimpleGrid>
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
                  mt="md"
                  classNames={{ label: classes.label }}
                  value={form.data.password_confirmation}
                  error={form.errors.password_confirmation}
                  disabled={form.processing}
                  onChange={e => form.setData('password_confirmation', e.target.value)}
                />
                <Button loading={form.processing} fullWidth mt="xl" type="submit">
                  Register
                </Button>
              </Stack>
            </form>
            <Center mt="md">
              <Text
                fz="sm"
                ta="center"
                component={Link}
                href={route('login')}
                className={classes.link}
              >
                Already registered? Log In
              </Text>
            </Center>
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

export default Register;
