import { Button, Container, Grid, Group, Paper, PaperProps, Stack, Text } from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';
import { Head, Link } from '@inertiajs/react';
import {
  MobileDesktopChart,
  PageHeader,
  ProjectsTable,
  RevenueChart,
  SalesChart,
  StatsGrid,
} from '@/Components';
import { PageProps } from '@/types';
import { AuthenticatedLayout } from '@/Layouts';
import { PATH_TASKS } from '@/routes';
import ProjectsData from '@/mocks/Projects.json';
import StatsGridData from '@/mocks/StatsGrid.json';

const PAPER_PROPS: PaperProps = {
  p: 'md',
  shadow: 'md',
  radius: 'md',
  style: { height: '100%' },
};

export default function Dashboard({ auth }: PageProps) {
  return (
    <AuthenticatedLayout user={auth.user} header={'Dashboard'}>
      <Head title="Default Dashboard | Laratine" />

      <Container fluid>
        <Stack gap="lg">
          <PageHeader title="Welcome!" withActions={true} />
          <StatsGrid
            data={StatsGridData.data}
            loading={false}
            error={false}
            paperProps={PAPER_PROPS}
          />
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
                    href={PATH_TASKS.root}
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
