'use client';

import {
  ActionIcon,
  Avatar,
  Burger,
  Flex,
  Group,
  Indicator,
  Menu,
  rem,
  Stack,
  Text,
  TextInput,
  Tooltip,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import {
  IconBell,
  IconCircleHalf2,
  IconMessageCircle,
  IconMoonStars,
  IconPower,
  IconSearch,
  IconSunHigh,
} from '@tabler/icons-react';
import { useMediaQuery } from '@mantine/hooks';
import { router } from '@inertiajs/react';
import { LanguagePicker, UserProfileButton } from '@/Components';
import NOTIFICATIONS from '@/mocks/Notifications.json';
import MESSAGES from '@/mocks/Messages.json';
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

  const messages = MESSAGES.map(m => (
    <Menu.Item
      key={m.id}
      style={{
        borderBottom: `1px solid ${
          colorScheme === 'dark' ? theme.colors.gray[7] : theme.colors.gray[3]
        }`,
      }}
    >
      <Flex gap="sm" align="center">
        <Avatar
          src={null}
          alt={`${m.first_name} ${m.last_name}`}
          variant="filled"
          size="sm"
          color={theme.colors[theme.primaryColor][7]}
        >
          {Array.from(m.first_name)[0]}
          {Array.from(m.last_name)[0]}
        </Avatar>
        <Stack gap={1}>
          <Text fz="sm" fw={600}>
            {m.first_name} {m.last_name}
          </Text>
          <Text lineClamp={2} fz="xs" c="dimmed">
            {m.message}
          </Text>
        </Stack>
      </Flex>
    </Menu.Item>
  ));

  const notifications = NOTIFICATIONS.slice(0, 3).map(n => (
    <Menu.Item
      key={n.id}
      style={{
        borderBottom: `1px solid ${
          colorScheme === 'dark' ? theme.colors.gray[7] : theme.colors.gray[3]
        }`,
      }}
    >
      <Flex gap="sm" align="center">
        <Avatar src={n.icon} alt={n.title} variant="filled" size="sm" />
        <Stack gap={1}>
          <Text fz="sm" fw={600}>
            {n.title}
          </Text>
          <Text lineClamp={2} fz="xs" c="dimmed">
            {n.message}
          </Text>
        </Stack>
      </Flex>
    </Menu.Item>
  ));

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
        <LanguagePicker type="collapsed" />
        <Menu shadow="lg" width={320}>
          <Menu.Target>
            <Indicator processing size={10} offset={6}>
              <Tooltip label="Messages">
                <ActionIcon size="lg" title="Nessages">
                  <IconMessageCircle size={ICON_SIZE} />
                </ActionIcon>
              </Tooltip>
            </Indicator>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Label tt="uppercase" ta="center" fw={600}>
              {MESSAGES.length} new notifications
            </Menu.Label>
            {messages}
            <Menu.Item tt="uppercase" ta="center" fw={600}>
              Show all messages
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
        <Menu shadow="lg" width={320}>
          <Menu.Target>
            <Indicator processing size={10} offset={6}>
              <Tooltip label="Notifications">
                <ActionIcon size="lg" title="Notifications">
                  <IconBell size={ICON_SIZE} />
                </ActionIcon>
              </Tooltip>
            </Indicator>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Label tt="uppercase" ta="center" fw={600}>
              {NOTIFICATIONS.length} new notifications
            </Menu.Label>
            {notifications}
            <Menu.Item tt="uppercase" ta="center" fw={600}>
              Show all notifications
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
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
