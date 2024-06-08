import { Button, PasswordInput, Center, Paper, Text, Stack } from '@mantine/core';
import { useForm } from '@mantine/form';
import { Head, router, usePage } from '@inertiajs/react';
import { RequestPayload } from '@inertiajs/core';
import { AuthLayout } from '@/Layouts';
import { Surface } from '@/Components';
import classes from '~/css/auth.module.css';

function ConfirmPassword() {
  const { errors } = usePage().props;

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      password: '',
    },
  });

  const onSubmit = (values: RequestPayload) => {
    router.post(route('password.confirm'), values);
    form.setErrors(errors);
  };

  return (
    <AuthLayout>
      <Head title="Confirm Password" />

      <Center>
        <Stack>
          <Text ta="center">
            This is a secure area of the application. <br /> Please confirm your password before
            continuing.
          </Text>

          <Surface component={Paper} className={classes.card}>
            <form onSubmit={form.onSubmit(values => onSubmit(values))}>
              <PasswordInput
                withAsterisk
                label="Password"
                placeholder="Your password"
                mt="md"
                key={form.key('password')}
                {...form.getInputProps('password')}
                classNames={{ label: classes.label }}
              />
              <Button fullWidth mt="xl" type="submit">
                Confirm
              </Button>
            </form>
          </Surface>
        </Stack>
      </Center>
    </AuthLayout>
  );
}

export default ConfirmPassword;
