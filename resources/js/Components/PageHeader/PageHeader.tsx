'use client';

import {
  Anchor,
  Breadcrumbs,
  Divider,
  Flex,
  Paper,
  PaperProps,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from '@mantine/core';
import { ReactNode } from 'react';
import { IconMoonStars, IconSunHigh } from '@tabler/icons-react';
import { Surface } from '@/Components';
import { User } from '@/types';
import { Link } from '@inertiajs/react';

type PageHeaderProps = {
  title: string;
  user: User;
  hasGreetings?: boolean;
  withActions?: ReactNode;
  breadcrumbItems?: any;
} & PaperProps;

const PageHeader = (props: PageHeaderProps) => {
  const { hasGreetings, withActions, breadcrumbItems, title, ...others } = props;
  const theme = useMantineTheme();
  const getHours = new Date().getHours();

  return (
    <>
      <Surface shadow={'sm'} p={16} radius={'md'} component={Paper} {...others}>
        {hasGreetings ? (
          <Flex
            justify="space-between"
            direction={{ base: 'column', sm: 'row' }}
            gap={{ base: 'sm', sm: 4 }}
          >
            <Flex gap={16}>
              {getHours >= 0 && getHours <= 6 ? (
                <IconMoonStars size={40} color={theme.colors.blue[9]} />
              ) : getHours >= 7 && getHours <= 18 ? (
                <IconSunHigh size={40} color={theme.colors.yellow[5]} />
              ) : (
                <IconMoonStars size={40} color={theme.colors.blue[9]} />
              )}
              <Stack gap={4}>
                <Title order={3}>
                  {getHours >= 0 && getHours < 12
                    ? 'Good Morning!'
                    : getHours >= 12 && getHours <= 18
                      ? 'Good Afternoon!'
                      : 'Good Evening!'}
                </Title>
                <Text>How are you today, {props.user.firstname}</Text>
              </Stack>
            </Flex>
          </Flex>
        ) : withActions ? (
          <Flex
            align="center"
            justify="space-between"
            direction={{ base: 'column', sm: 'row' }}
            gap={{ base: 12, sm: 4 }}
          >
            <Stack>
              <Title order={3}>{title}</Title>
              <Breadcrumbs separator="→">
                {breadcrumbItems.map((item: { title: string; href: string }, index: number) => (
                  <Anchor component={Link} href={item.href} key={index}>
                    {item.title}
                  </Anchor>
                ))}
              </Breadcrumbs>
            </Stack>
            {withActions}
          </Flex>
        ) : (
          <Stack gap="sm">
            <Title order={3}>{title}</Title>
            <Breadcrumbs separator="→">
              {breadcrumbItems.map((item: { title: string; href: string }, index: number) => (
                <Anchor component={Link} href={item.href} key={index}>
                  {item.title}
                </Anchor>
              ))}
            </Breadcrumbs>
          </Stack>
        )}
      </Surface>
      <Divider />
    </>
  );
};

export default PageHeader;
