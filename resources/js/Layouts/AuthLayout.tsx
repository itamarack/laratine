import { Center, Flex, Box, BackgroundImage } from '@mantine/core';
import { PropsWithChildren } from 'react';
import { Logo } from '@/Components';
import LoginIllustration from '~/assets/svgs/login-illustration.svg';

function AuthLayout({ children }: PropsWithChildren) {
  return (
    <BackgroundImage src={LoginIllustration}>
      <Flex h={'100vh'} w={'100vw'}>
        <Box style={{ padding: 24, position: 'absolute', height: '100%' }}>
          <Logo text={'Laratine Admin'} href={'/'} style={{ color: 'indigo' }} />
        </Box>
        <Center w={'100%'} h={'100%'}>
          {children}
        </Center>
      </Flex>
    </BackgroundImage>
  );
}

export default AuthLayout;
