import { useState } from 'react';
import { router, Link } from '@inertiajs/react';
import { Box, Collapse, Group, Text, UnstyledButton } from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';
import classes from './Links.module.css';
import { useMatchPath } from '@/Hooks';

interface LinksGroupProps {
  icon?: any;
  label: string;
  permission?: string;
  initiallyOpened?: boolean;
  link?: string;
  links?: {
    label: string;
    link: string;
  }[];
  closeSidebar: () => void;
}

export function LinksGroup({ icon: Icon, label, initiallyOpened, link, links }: LinksGroupProps) {
  const [isOpen, onOpen] = useState(initiallyOpened || false);
  const matchPath = useMatchPath(link);

  const items = links?.map(link => (
    <Text
      component={Link}
      href={link.link}
      className={classes.link}
      key={link.label}
      data-active={matchPath || undefined}
    >
      {link.label}
    </Text>
  ));

  return (
    <>
      <UnstyledButton
        onClick={() => {
          onOpen(isOpen => !isOpen);
          link && router.get(link || '#');
        }}
        className={classes.control}
        data-active={matchPath || undefined}
      >
        <Group justify="space-between" gap={0}>
          <Box style={{ display: 'flex', alignItems: 'center' }}>
            <Icon size={18} />
            <Box ml="md">{label}</Box>
          </Box>
          {Array.isArray(links) && (
            <IconChevronRight
              className={classes.chevron}
              size="1rem"
              stroke={1.5}
              style={{
                transform: isOpen ? `rotate(90deg)` : 'none',
              }}
            />
          )}
        </Group>
      </UnstyledButton>

      {Array.isArray(links) ? <Collapse in={isOpen}>{items}</Collapse> : null}
    </>
  );
}
