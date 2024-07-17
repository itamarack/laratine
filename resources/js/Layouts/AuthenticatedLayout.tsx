'use client';

import {
  AppShell,
  Container,
  UnstyledButton,
  ActionIcon,
  Avatar,
  Burger,
  Group,
  Menu,
  rem,
  TextInput,
  Tooltip,
  useMantineColorScheme,
  useMantineTheme,
  Box,
} from '@mantine/core';
import {
  IconCircleHalf2,
  IconMoonStars,
  IconPower,
  IconSearch,
  IconSunHigh,
} from '@tabler/icons-react';
import { router, Link } from '@inertiajs/react';
import { PropsWithChildren, ReactNode } from 'react';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { UserProfileButton, Navigation } from '@/Components';
import { User } from '@/types';
import classes from './layouts.module.css';

interface AuthenticatedProps {
  user: User;
  header?: ReactNode;
  children: ReactNode;
}

function AuthenticatedLayout(props: PropsWithChildren<AuthenticatedProps>) {
  const theme = useMantineTheme();
  const laptop_match = useMediaQuery('(min-width: 769px)');
  const tablet_match = useMediaQuery('(max-width: 768px)');
  const mobile_match = useMediaQuery('(max-width: 425px)');
  const { setColorScheme, colorScheme } = useMantineColorScheme();
  const [isOpen, { toggle: onOpen }] = useDisclosure(laptop_match);

  return (
    <AppShell
      layout="alt"
      header={{ height: 60 }}
      footer={{ height: 60 }}
      navbar={{
        width: 250,
        breakpoint: 'md',
        collapsed: { mobile: !isOpen, desktop: isOpen },
      }}
      padding={0}
    >
      <AppShell.Header
        style={{
          height: rem(60),
          border: 'none',
          boxShadow: tablet_match ? theme.shadows.md : theme.shadows.sm,
        }}
      >
        <Container fluid py="sm" px="lg">
          <Group justify="space-between">
            <Group gap={0}>
              <Tooltip label="Toggle side navigation">
                <Burger opened={isOpen} onClick={onOpen} size="sm" color={theme.primaryColor} />
              </Tooltip>
              {!mobile_match && (
                <TextInput
                  placeholder="search"
                  rightSection={<IconSearch size={20} />}
                  ml="md"
                  style={{ width: tablet_match ? 'auto' : rem(400) }}
                />
              )}
            </Group>
            <Group>
              {mobile_match && (
                <ActionIcon>
                  <IconSearch size={20} />
                </ActionIcon>
              )}
              <Menu shadow="lg" width={200}>
                <Menu.Target>
                  <Tooltip label="Switch color modes">
                    <ActionIcon variant="light">
                      {colorScheme === 'auto' ? (
                        <IconCircleHalf2 size={20} />
                      ) : colorScheme === 'dark' ? (
                        <IconMoonStars size={20} />
                      ) : (
                        <IconSunHigh size={20} />
                      )}
                    </ActionIcon>
                  </Tooltip>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Label tt="uppercase" ta="center" fw={600}>
                    Select color modes
                  </Menu.Label>
                  <Menu.Item
                    leftSection={<IconSunHigh size={16} />}
                    onClick={() => setColorScheme('light')}
                  >
                    Light
                  </Menu.Item>
                  <Menu.Item
                    leftSection={<IconMoonStars size={16} />}
                    onClick={() => setColorScheme('dark')}
                  >
                    Dark
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
              <Menu shadow="lg" width={200}>
                <Menu.Target>
                  <Tooltip label="User Account">
                    <ActionIcon radius={'xl'} color={theme.primaryColor}>
                      <Avatar
                        src={props.user.avatar}
                        variant="filled"
                        size="md"
                        radius={'xl'}
                        color={theme.primaryColor}
                      />
                    </ActionIcon>
                  </Tooltip>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Label tt="uppercase" ta="center" fw={600}>
                    User Account
                  </Menu.Label>
                  <Menu.Item>
                    <UserProfileButton user={props.user} />
                  </Menu.Item>
                  <Menu.Item
                    leftSection={<IconPower size={20} />}
                    onClick={() => router.post(route('logout'))}
                  >
                    Logout
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Group>
          </Group>
        </Container>
      </AppShell.Header>
      <AppShell.Navbar>
        <Navigation user={props.user} onClose={onOpen} />
      </AppShell.Navbar>
      <AppShell.Main>
        <Box py="lg" px="md" className={classes.main}>
          {props.children}
        </Box>
      </AppShell.Main>
      <AppShell.Footer p="md">
        <Container fluid px="lg">
          <Group justify="space-between">
            <UnstyledButton c="dimmed" fz="sm" component={Link} href={'/'} target="_blank">
              &copy;&nbsp;{new Date().getFullYear()}&nbsp;Laratine
            </UnstyledButton>
          </Group>
        </Container>
      </AppShell.Footer>
    </AppShell>
  );
}

export default AuthenticatedLayout;
