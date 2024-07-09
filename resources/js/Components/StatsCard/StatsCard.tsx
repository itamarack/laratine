import { Badge, Box, Group, Paper, PaperProps, Text } from '@mantine/core';
import { IconArrowDownRight, IconArrowUpRight } from '@tabler/icons-react';
import { Surface } from '@/Components';
import classes from './Stats.module.css';

type StatsCardProps = {
  title: string;
  value: string;
  difference: number;
  period?: string;
} & PaperProps;

const StatsCard = ({ title, value, period, difference, ...others }: StatsCardProps) => {
  return (
    <Surface component={Paper} {...others}>
      <Group justify="space-between">
        <Text size="xs" c="dimmed" className={classes.title}>
          {title}
        </Text>
        {period && (
          <Badge variant="filled" radius="sm">
            {period}
          </Badge>
        )}
      </Group>

      <Group align="flex-end" gap="xs" mt={25}>
        <Text className={classes.value}>{value}</Text>
        <Text c={difference > 0 ? 'teal' : 'red'} fz="sm" fw={500} className={classes.diff}>
          <Box>{difference}%</Box>
          {difference > 0 ? (
            <IconArrowUpRight size="1rem" stroke={1.5} />
          ) : (
            <IconArrowDownRight size="1rem" stroke={1.5} />
          )}
        </Text>
      </Group>

      <Text fz="xs" c="dimmed" mt={7}>
        Compared to previous month
      </Text>
    </Surface>
  );
};

export default StatsCard;
