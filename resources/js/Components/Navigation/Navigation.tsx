import { ActionIcon, Box, Flex, Group, ScrollArea, Text } from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import { Logo, UserProfileButton } from '@/Components';
import { useMediaQuery } from '@mantine/hooks';
import { LinksGroup } from '@/Components/Navigation/Links/Links';
import { sidebarNavigation } from '@/Routes';
import classes from './navigation.module.css';
import { User } from '@/types';

type NavigationProps = {
  user?: User;
  onClose: () => void;
};

const Navigation = ({ user, onClose }: NavigationProps) => {
  const tablet_match = useMediaQuery('(max-width: 768px)');

  const links = sidebarNavigation.map(m => (
    <Box pl={0} mb="md" key={m.title}>
      <Text tt="uppercase" size="xs" pl="md" fw={500} mb="sm" className={classes.linkHeader}>
        {m.title}
      </Text>
      {m.links.map(item => (
        <LinksGroup
          key={item.label}
          {...item}
          closeSidebar={() => {
            setTimeout(() => {
              onClose();
            }, 250);
          }}
        />
      ))}
    </Box>
  ));

  return (
    <nav className={classes.navbar}>
      <div className={classes.header}>
        <Flex justify="space-between" align="center" gap="sm">
          <Group justify="space-between" style={{ flex: tablet_match ? 'auto' : 1 }}>
            <Logo text={'Laratine Admin'} href={'/'} className={classes.logo} style={{}} />
          </Group>
          {tablet_match && (
            <ActionIcon onClick={onClose} variant="transparent">
              <IconX color="white" />
            </ActionIcon>
          )}
        </Flex>
      </div>

      <ScrollArea className={classes.links}>
        <div className={classes.linksInner}>{links}</div>
      </ScrollArea>

      <Flex className={classes.footer}>
        <UserProfileButton user={user} hasEmail />
      </Flex>
    </nav>
  );
};

export default Navigation;
