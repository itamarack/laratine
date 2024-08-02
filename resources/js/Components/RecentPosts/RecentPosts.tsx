import { DataTable } from 'mantine-datatable';
import { Badge, Button, Flex, Paper, Stack, Text } from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';
import { Link } from '@inertiajs/react';
import { Post } from '@/types';
import { badgeVariant } from '@/Utils';
import { postRoute } from '@/Routes';

const RecentPosts = ({ posts, loading }: { posts?: Post[]; loading: boolean }) => {
  return (
    <Paper p="md" shadow="md" radius="md" h="100%">
      <Stack>
        <Flex justify="space-between" align="center">
          <Text fw={900} fz={14} c="#373d3f" ff="Open Sans, sans-serif">
            Recent Posts
          </Text>
          <Button
            variant="subtle"
            component={Link}
            href={postRoute.list}
            rightSection={<IconChevronRight size={18} />}
          >
            View all
          </Button>
        </Flex>
        <DataTable
          verticalSpacing="sm"
          highlightOnHover
          columns={[
            { accessor: 'title' },
            {
              accessor: 'user',
              render: ({ user }: Post) => <Text fz="sm">{user.fullname}</Text>,
            },
            {
              accessor: 'status',
              title: 'Status',
              render: ({ status }: Post) => (
                <Badge color={badgeVariant({ status })} variant="filled" size="sm" radius="sm">
                  {status}
                </Badge>
              ),
            },
          ]}
          records={posts}
          fetching={loading}
        />
      </Stack>
    </Paper>
  );
};

export default RecentPosts;
