import { Box, Container, Grid, SimpleGrid, Skeleton, Stack } from '@mantine/core';
import { IconArticle, IconEyeSearch, IconMessage, IconUsersGroup } from '@tabler/icons-react';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import {
  PageHeader,
  RecentPosts,
  AreaChart,
  ContentChart,
  StatsCard,
  RecentComments,
} from '@/Components';
import { Category, Comment, PageProps, Post, Stat } from '@/types';
import { AuthenticatedLayout } from '@/Layouts';
import classes from './dashboard.module.css';

type DashboardProps = {
  stats: {
    user: Stat;
    post: Stat;
    likes: Stat;
    comments: Stat;
    visitors: Stat[];
    categories?: Category[];
  };
  category_count: Category[];
  recent_posts: Post[];
  recent_comments: Comment[];
  loading: boolean;
} & PageProps;

export default function Dashboard({
  auth,
  stats,
  category_count,
  recent_posts,
  recent_comments,
  loading,
}: DashboardProps) {
  const [categories, setCategories] = useState<(string | number | undefined)[]>();
  const [series, setSeries] = useState<any>([]);

  useEffect(() => {
    const categories = stats.visitors?.map(i => i.start);
    const data = stats.visitors.map(i => i.value);

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
          <Grid gutter={{ base: 'md', sm: 'md', md: 'xl' }}>
            <Grid.Col span={{ base: 12, md: 8 }}>
              <AreaChart title="Visitors" series={series} categories={categories} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <ContentChart categories={category_count} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 5 }}>
              <RecentComments comments={recent_comments} loading={loading} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 7 }}>
              <RecentPosts posts={recent_posts} loading={loading} />
            </Grid.Col>
          </Grid>
        </Stack>
      </Container>
    </AuthenticatedLayout>
  );
}
