import { Group, Paper, PaperProps, Stack, Text } from '@mantine/core';
import { IconArrowDownRight, IconArrowUpRight } from '@tabler/icons-react';
import { Surface } from '@/Components';
import classes from './stats.module.css';

type StatsCardProps = {
  title: string;
  value: string | number;
  difference: number;
  icon?: any;
} & PaperProps;

const StatsCard = ({ title, value, icon: Icon, difference }: StatsCardProps) => {
  return (
    <Surface component={Paper} p="md" shadow="md" radius="md" h="100%">
      <Group justify="space-between" align="start">
        <Stack>
          <Text size="xs" c="dimmed" className={classes.title}>
            {title}
          </Text>
          <Group align="flex-end" gap="xs">
            <Text className={classes.value}>{value}</Text>
            <Text c={difference > 0 ? 'teal' : 'red'} fz="sm" fw={500} className={classes.diff}>
              <span>{difference}%</span>
              {difference > 0 ? (
                <IconArrowUpRight size="1rem" stroke={1.5} />
              ) : (
                <IconArrowDownRight size="1rem" stroke={1.5} />
              )}
            </Text>
          </Group>
        </Stack>
        {Icon && <Icon size={40} className={classes.icon} />}
      </Group>

      <Text fz="xs" c="dimmed" mt={7}>
        Compared to previous month
      </Text>
    </Surface>
  );
};

export default StatsCard;
