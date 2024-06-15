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
import { useState } from 'react';
import { useForm } from '@mantine/form';
import { IconCheck, IconX } from '@tabler/icons-react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { RequestPayload } from '@inertiajs/core';
import { AuthLayout } from '@/Layouts';
import { Surface } from '@/Components';
import classes from './Auth.module.css';

function Register() {
  const { errors } = usePage().props;
  const [popoverOpened, setPopoverOpened] = useState(false);

  const form = useForm({
    initialValues: {
      firstname: '',
      lastname: '',
      email: '',
      password: '',
      password_confirmation: '',
    },

    validate: {
      email: value => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      firstname: value => (value.length < 2 ? 'Name must have at least 2 letters' : null),
      lastname: value => (value.length < 2 ? 'Name must have at least 2 letters' : null),
      // password: value => (getStrength(value) ? 'Password must meet all criteria' : null),
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
    router.post(route('register'), values);
    form.setErrors(errors);
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
            <form onSubmit={form.onSubmit(values => onSubmit(values))}>
              <SimpleGrid cols={{ base: 1, sm: 2 }}>
                <TextInput
                  label="Firstname"
                  withAsterisk
                  placeholder="Firstname"
                  key={form.key('firstname')}
                  {...form.getInputProps('firstname')}
                  classNames={{ label: classes.label }}
                />
                <TextInput
                  label="Lastname"
                  withAsterisk
                  placeholder="Lastname"
                  key={form.key('lastname')}
                  {...form.getInputProps('lastname')}
                  classNames={{ label: classes.label }}
                />
              </SimpleGrid>
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
                Register
              </Button>
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
