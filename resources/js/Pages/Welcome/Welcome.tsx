import { Link, Head } from '@inertiajs/react';
import { Button, Flex, Stack, Text, useMantineTheme } from '@mantine/core';
import { IconApps, IconDashboard, IconGitFork } from '@tabler/icons-react';
import classes from './welcome.module.css';
import { PageProps } from '@/types';

export default function Welcome({ laravelVersion }: PageProps<{ laravelVersion: string }>) {
  const theme = useMantineTheme();

  return (
    <>
      <Head title="Laratine Admin | Welcome!" />

      <Stack h="100vh" w="100%" justify={'space-between'} align="center" p={32}>
        <Flex></Flex>
        <Stack>
          <Flex justify={'flex-start'} align={'center'} gap={12} className={classes.logo}>
            <IconApps size={80} />
            <Text fz={60} fw={700}>
              Laratine Admin
            </Text>
          </Flex>
          <Flex justify="center">
            <Button
              variant="subtle"
              leftSection={<IconDashboard size={16} />}
              component={Link}
              href="/admin/dashboard"
            >
              DASHBOARD
            </Button>
            <Button
              component={Link}
              href="www.github.com"
              variant="subtle"
              leftSection={<IconGitFork />}
            >
              Github
            </Button>
          </Flex>
        </Stack>
        <Text c={theme.primaryColor}>Laravel Version: {laravelVersion}</Text>
      </Stack>
    </>
  );
}
