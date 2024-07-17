'use client';

import {
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
} from '@mantine/core';
import {
  IconCircleHalf2,
  IconMoonStars,
  IconPower,
  IconSearch,
  IconSunHigh,
} from '@tabler/icons-react';
import { useMediaQuery } from '@mantine/hooks';
import { router } from '@inertiajs/react';
import { UserProfileButton } from '@/Components';
import { User } from '@/types';

const ICON_SIZE = 20;

type HeaderNavProps = {
  user?: User;
  isOpen?: boolean;
  onOpen?: () => void;
};

const HeaderNav = ({ user, isOpen, onOpen }: HeaderNavProps) => {
  const theme = useMantineTheme();
  const { setColorScheme, colorScheme } = useMantineColorScheme();
  const laptop_match = useMediaQuery('(max-width: 992px)');
  const tablet_match = useMediaQuery('(max-width: 768px)');
  const mobile_match = useMediaQuery('(max-width: 425px)');

  const onLogOut = () => {
    router.post(route('logout'));
  };

  return (
    <Group justify="space-between">
      <Group gap={0}>
        <Tooltip label="Toggle side navigation">
          <Burger opened={isOpen} onClick={onOpen} size="sm" color={theme.primaryColor} />
        </Tooltip>
        {!mobile_match && (
          <TextInput
            placeholder="search"
            rightSection={<IconSearch size={ICON_SIZE} />}
            ml="md"
            style={{ width: tablet_match ? 'auto' : rem(400) }}
          />
        )}
      </Group>
      <Group>
        {mobile_match && (
          <ActionIcon>
            <IconSearch size={ICON_SIZE} />
          </ActionIcon>
        )}
        <Menu shadow="lg" width={200}>
          <Menu.Target>
            <Tooltip label="Components">
              <ActionIcon variant="light">
                {colorScheme === 'auto' ? (
                  <IconCircleHalf2 size={ICON_SIZE} />
                ) : colorScheme === 'dark' ? (
                  <IconMoonStars size={ICON_SIZE} />
                ) : (
                  <IconSunHigh size={ICON_SIZE} />
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
                  src={user?.image}
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
              <UserProfileButton user={user} />
            </Menu.Item>
            <Menu.Item
              leftSection={<IconPower size={ICON_SIZE} />}
              onClick={() => router.post(route('logout'))}
            >
              Logout
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
    </Group>
  );
};

export default HeaderNav;
