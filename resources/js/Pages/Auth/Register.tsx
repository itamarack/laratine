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
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { RequestPayload } from '@inertiajs/core';
import { AuthLayout } from '@/Layouts';
import { Surface } from '@/Components';
import classes from './Auth.module.css';

function Register() {
  const { errors } = usePage().props;

  const form = useForm({
    mode: 'uncontrolled',
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
      password_confirmation: (value, values) =>
        value !== values.password ? 'Passwords did not match' : null,
    },
  });

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

export default Register;
