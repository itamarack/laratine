import { Link } from '@inertiajs/react';
import { Center, Stack } from '@mantine/core';
import { PropsWithChildren } from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';

function AuthLayout({ children }: PropsWithChildren) {
  return (
    <Center className={'bg-gray-50 h-screen w-screen'}>
      <Stack>
        <Center>
          <Link href="/">
            <ApplicationLogo className="w-20 h-20 text-gray-500 fill-current" />
          </Link>
        </Center>
        {children}
      </Stack>
    </Center>
  );
}

export default AuthLayout;
