import { DataTable } from 'mantine-datatable';
import { Badge, Button, Flex, Paper, Stack, Text } from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';
import { Link } from '@inertiajs/react';
import { Comment } from '@/types';
import { commentStatusVariant } from '@/Utils';
import { commentRoute } from '@/routes';

const RecentComments = ({ comments, loading }: { comments?: Comment[]; loading: boolean }) => {
  return (
    <Paper p="md" shadow="md" radius="md" h="100%">
      <Stack>
        <Flex justify="space-between" align="center">
          <Text fw={900} fz={14} c="#373d3f" ff="Open Sans, sans-serif">
            Recent Comments
          </Text>
          <Button
            variant="subtle"
            component={Link}
            href={commentRoute().list}
            rightSection={<IconChevronRight size={18} />}
          >
            View all
          </Button>
        </Flex>
        <DataTable
          verticalSpacing="sm"
          highlightOnHover
          columns={[
            {
              accessor: 'content',
              title: 'Comment',
              render: ({ content }: Comment) => (
                <Text fz="sm" dangerouslySetInnerHTML={{ __html: content }} />
              ),
            },
            {
              accessor: 'user',
              render: ({ user }: Comment) => <Text fz="sm">{user.fullname}</Text>,
            },
            {
              accessor: 'status',
              title: 'Status',
              render: ({ status }: Comment) => (
                <Badge
                  color={commentStatusVariant({ status })}
                  variant="filled"
                  size="sm"
                  radius="sm"
                >
                  {status}
                </Badge>
              ),
            },
          ]}
          records={comments}
          fetching={loading}
        />
      </Stack>
    </Paper>
  );
};

export default RecentComments;
