import { ReactNode } from 'react';
import { Box, Avatar, Group, Text, UnstyledButton, UnstyledButtonProps } from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';
import classes from './UserButton.module.css';
import { User } from '@/types';
import { Link } from '@inertiajs/react';

type UserProfileButtonProps = {
  user?: User;
  icon?: ReactNode;
  asAction?: boolean;
} & UnstyledButtonProps;

const UserProfileButton = ({ user, icon, asAction, ...others }: UserProfileButtonProps) => {
  return (
    <UnstyledButton
      href={route('profile.edit')}
      component={Link}
      className={classes.user}
      {...others}
    >
      <Group>
        <Avatar src={user?.image} radius="2xl" />
        <Box style={{ flex: 1 }}>
          <Text size="sm" fw={500}>
            {user?.firstname} {user?.lastname}
          </Text>
          <Text size="xs">{user?.email}</Text>
        </Box>

        {icon && asAction && <IconChevronRight size="0.9rem" stroke={1.5} />}
      </Group>
    </UnstyledButton>
  );
};

export default UserProfileButton;
