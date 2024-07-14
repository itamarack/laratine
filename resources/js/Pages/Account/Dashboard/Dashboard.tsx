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
import {
  IconArticle,
  IconArticleFilled,
  IconChevronRight,
  IconEyeSearch,
  IconMessage,
  IconMessage2,
  IconUsersGroup,
} from '@tabler/icons-react';
import { Head, Link } from '@inertiajs/react';
import {
  MobileDesktopChart,
  PageHeader,
  ProjectsTable,
  AreaChart,
  SalesChart,
  StatsCard,
} from '@/Components';
import { PageProps, Stat } from '@/types';
import { AuthenticatedLayout } from '@/Layouts';
import ProjectsData from '@/mocks/Projects.json';
import classes from './Dashboard.module.css';
import { useEffect, useState } from 'react';

const PAPER_PROPS: PaperProps = {
  p: 'md',
  shadow: 'md',
  radius: 'md',
  style: { height: '100%' },
};

type DashboardProps = {
  stats: {
    user: Stat;
    post: Stat;
    likes: Stat;
    comments: Stat;
    visitors: Stat[];
  };
} & PageProps;

export default function Dashboard({ auth, stats, loading }: DashboardProps) {
  const [categories, setCategories] = useState<(string | number | undefined)[]>();
  const [series, setSeries] = useState<any>([]);

  console.log(stats.visitors);

  // const series = [{ data: [31, 40, 28, 51, 42] }];

  useEffect(() => {
    const categories = stats.visitors?.map(i => i.start);
    const data = stats.visitors.map(i => i.value);

    console.log('VALUE', data);

    setCategories(() => categories);
    setSeries(() => [{ data: data }]);
  }, [stats.visitors]);

  return (
    <AuthenticatedLayout user={auth.user} header={'Dashboard'}>
      <Head title="Dashboard | Laratine" />

      <Container fluid>
        <Stack gap="lg">
          <PageHeader user={auth.user} title="Welcome!" hasGreetings={true} />
          <Box className={classes.root}>
            {loading ? (
              <SimpleGrid
                cols={{ base: 1, sm: 2, lg: 4 }}
                spacing={{ base: 10, sm: 'xl' }}
                verticalSpacing={{ base: 'md', sm: 'xl' }}
              >
                {Array.from({ length: 4 }).map((o, i) => (
                  <Skeleton key={`stats-loading-${i}`} visible={true} height={200} />
                ))}
              </SimpleGrid>
            ) : (
              <SimpleGrid
                cols={{ base: 1, sm: 2, lg: 4 }}
                spacing={{ base: 10, sm: 'xl' }}
                verticalSpacing={{ base: 'md', sm: 'xl' }}
              >
                <StatsCard
                  title="Total Users"
                  icon={IconUsersGroup}
                  value={stats.user?.value}
                  difference={stats.user.difference}
                />
                <StatsCard
                  title="Total Posts"
                  icon={IconArticle}
                  value={stats.post?.value}
                  difference={stats.post.difference}
                />
                <StatsCard
                  title="Total Comments"
                  icon={IconMessage}
                  value={stats.comments?.value}
                  difference={stats.comments.difference}
                />
                <StatsCard
                  title="Likes"
                  icon={IconEyeSearch}
                  value={stats.likes?.value}
                  difference={stats.likes.difference}
                />
              </SimpleGrid>
            )}
          </Box>
          <Grid gutter={{ base: 'md', sm: 'md', md: 'xl', xl: 50 }}>
            <Grid.Col span={{ base: 12, md: 8 }}>
              <AreaChart title="Visitors" series={series} categories={categories} />
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
