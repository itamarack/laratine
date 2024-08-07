import { ReactNode } from 'react';
import {
  Avatar,
  Group,
  Text,
  UnstyledButton,
  UnstyledButtonProps,
  Flex,
  Stack,
} from '@mantine/core';
import { Link } from '@inertiajs/react';
import { IconChevronRight } from '@tabler/icons-react';
import classes from './user-button.module.css';
import { User } from '@/types';

type UserProfileButtonProps = {
  user?: User;
  icon?: ReactNode;
  asAction?: boolean;
  hasEmail?: boolean;
} & UnstyledButtonProps;

const UserProfileButton = ({
  user,
  icon,
  hasEmail,
  asAction,
  ...others
}: UserProfileButtonProps) => {
  return (
    <UnstyledButton
      href={route('profile.show')}
      component={Link}
      className={classes.user}
      {...others}
    >
      <Flex align={'center'} gap={8}>
        <Avatar variant={'filled'} radius={'xl'} size={hasEmail ? 'md' : 'sm'} src={user?.avatar} />
        <Stack gap={0}>
          <Group gap={4}>
            <Text size={'sm'}>{user?.firstname}</Text>
            <Text size={'sm'}>{user?.lastname}</Text>
          </Group>
          {hasEmail && <Text size={'xs'}>{user?.email}</Text>}
        </Stack>

        {icon && asAction && <IconChevronRight size="0.9rem" stroke={1.5} />}
      </Flex>
    </UnstyledButton>
  );
};

export default UserProfileButton;
