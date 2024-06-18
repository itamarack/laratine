'use client';

import { AppShell, Container, Group, UnstyledButton, rem, useMantineTheme } from '@mantine/core';
import { PropsWithChildren, ReactNode } from 'react';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import AppMain from '@/Components/AppMain';
import Navigation from '@/Components/Navigation';
import HeaderNav from '@/Components/HeaderNav';
import { User } from '@/types';
import { Link } from '@inertiajs/react';

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
          <HeaderNav user={props.user} isOpen={isOpen} onOpen={onOpen} />
        </Container>
      </AppShell.Header>
      <AppShell.Navbar>
        <Navigation user={props.user} onClose={onOpen} />
      </AppShell.Navbar>
      <AppShell.Main>
        <AppMain>{props.children}</AppMain>
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
