import { Button, Group, Center, Paper, Text, Stack, UnstyledButton, rem } from '@mantine/core';
import { Head, Link, router } from '@inertiajs/react';
import { IconCheck } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { IconChevronLeft } from '@tabler/icons-react';
import { useMediaQuery } from '@mantine/hooks';
import { AuthLayout } from '@/Layouts';
import { Surface } from '@/Components';
import classes from './Auth.module.css';

function VerifyEmail({ status }: { status?: string }) {
  const mobile_match = useMediaQuery('(max-width: 425px)');

  const onSubmit = (event: any) => {
    event.preventDefault();
    router.post(route('verification.send'));

    if (status === 'verification-link-sent') {
      notifications.show({
        title: 'Verification Link Sent!',
        message:
          'A new verification link has been sent to the email address you provided during registration.',
        color: 'green',
        icon: <IconCheck />,
      });
    }
  };

  return (
    <AuthLayout>
      <Head title="Email Verification" />

      <Center>
        <Stack>
          <Surface component={Paper} className={classes.card}>
            <Text ta="center">
              Thanks for signing up! Before getting started, could you verify your email address by
              clicking on the link we just emailed to you? If you didn't receive the email, we will
              gladly send you another.
            </Text>
            <form onSubmit={onSubmit}>
              <Group justify="space-between" align={'center'} mt="xl">
                <Button type="submit" fullWidth={mobile_match}>
                  Resend Verification Email
                </Button>
                <UnstyledButton
                  color="dimmed"
                  component={Link}
                  href={route('logout')}
                  className={classes.control}
                >
                  <Group gap={2} align="center">
                    <IconChevronLeft stroke={1.5} style={{ width: rem(14), height: rem(14) }} />
                    <Text size="sm">Log Out</Text>
                  </Group>
                </UnstyledButton>
              </Group>
            </form>
          </Surface>
        </Stack>
      </Center>
    </AuthLayout>
  );
}

export default VerifyEmail;
