import {
  Box,
  Button,
  Container,
  Grid,
  Group,
  Paper,
  PaperProps,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
} from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';
import { Head, Link } from '@inertiajs/react';
import {
  MobileDesktopChart,
  PageHeader,
  ProjectsTable,
  RevenueChart,
  SalesChart,
  StatsCard,
} from '@/Components';
import { PageProps } from '@/types';
import { AuthenticatedLayout } from '@/Layouts';
import ProjectsData from '@/mocks/Projects.json';
import StatsGridData from '@/mocks/StatsGrid.json';
import classes from './Dashboard.module.css';

const PAPER_PROPS: PaperProps = {
  p: 'md',
  shadow: 'md',
  radius: 'md',
  style: { height: '100%' },
};

export default function Dashboard({ auth, userStats, loading }: PageProps) {
  console.log(userStats);
  return (
    <AuthenticatedLayout user={auth.user} header={'Dashboard'}>
      <Head title="Dashboard | Laratine" />

      <Container fluid>
        <Stack gap="lg">
          <PageHeader user={auth.user} title="Welcome!" hasGreetings={true} />
          <Box className={classes.root}>
            <SimpleGrid
              cols={{ base: 1, sm: 2, lg: 4 }}
              spacing={{ base: 10, sm: 'xl' }}
              verticalSpacing={{ base: 'md', sm: 'xl' }}
            >
              {loading
                ? Array.from({ length: 4 }).map((o, i) => (
                    <Skeleton key={`stats-loading-${i}`} visible={true} height={200} />
                  ))
                : StatsGridData.data?.map(stat => (
                    <StatsCard
                      title={stat.title}
                      value={stat.value}
                      difference={stat.diff}
                      period={stat.period}
                      {...PAPER_PROPS}
                    />
                  ))}
            </SimpleGrid>
          </Box>
          <Grid gutter={{ base: 'md', sm: 'md', md: 'xl', xl: 50 }}>
            <Grid.Col span={{ base: 12, md: 8 }}>
              <RevenueChart {...PAPER_PROPS} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <SalesChart {...PAPER_PROPS} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <MobileDesktopChart {...PAPER_PROPS} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 8 }}>
              <Paper {...PAPER_PROPS}>
                <Group justify="space-between" mb="md">
                  <Text size="lg" fw={600}>
                    Tasks
                  </Text>
                  <Button
                    variant="subtle"
                    component={Link}
                    href={''}
                    rightSection={<IconChevronRight size={18} />}
                  >
                    View all
                  </Button>
                </Group>
                <ProjectsTable data={ProjectsData.slice(0, 6)} error={false} loading={false} />
              </Paper>
            </Grid.Col>
          </Grid>
        </Stack>
      </Container>
    </AuthenticatedLayout>
  );
}
