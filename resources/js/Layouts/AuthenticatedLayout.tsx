'use client';

import { AppShell, Container, rem, useMantineTheme } from '@mantine/core';
import { useState, PropsWithChildren, ReactNode } from 'react';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import AppMain from '@/Components/AppMain';
import Navigation from '@/Components/Navigation';
import HeaderNav from '@/Components/HeaderNav';
import FooterNav from '@/Components/FooterNav';
import { User } from '@/types';

interface AuthenticatedProps {
  user: User;
  header?: ReactNode;
  children: ReactNode;
}

function AuthenticatedLayout(props: PropsWithChildren<AuthenticatedProps>) {
  const theme = useMantineTheme();
  const tablet_match = useMediaQuery('(max-width: 768px)');
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);

  return (
    <AppShell
      layout="alt"
      header={{ height: 60 }}
      footer={{ height: 60 }}
      navbar={{
        width: 250,
        breakpoint: 'md',
        collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
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
          <HeaderNav
            desktopOpened={desktopOpened}
            mobileOpened={mobileOpened}
            toggleDesktop={toggleDesktop}
            toggleMobile={toggleMobile}
          />
        </Container>
      </AppShell.Header>
      <AppShell.Navbar>
        <Navigation onClose={toggleMobile} />
      </AppShell.Navbar>
      <AppShell.Main>
        <AppMain>{props.children}</AppMain>
      </AppShell.Main>
      <AppShell.Footer p="md">
        <Container fluid px="lg">
          <FooterNav />
        </Container>
      </AppShell.Footer>
    </AppShell>
  );
}

export default AuthenticatedLayout;
