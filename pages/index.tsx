import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Avatar, Box, Button, Flex, Heading, Text } from '@chakra-ui/react';
import { Auth } from 'aws-amplify';
import { CognitoHostedUIIdentityProvider } from '@aws-amplify/auth';

import { useCurrentUser } from '../lib/authn';

const Index: NextPage = () => {
  const router = useRouter();
  const user = useCurrentUser();
  const isLoggedIn = !!user;
  const isSucceeded = router.query['success'] !== undefined;

  return (
    <Flex align="center" justify="center" height="100vh">
      <Box bg="white" w={384} p={8} rounded={8} boxShadow="md">
        <Heading size="md">Welcome</Heading>
        {isLoggedIn ? (
          <>
            <Text py={3}>Hello,</Text>
            <Flex align="center" gap={3}>
              <Avatar src={user.picture} />
              <Box>
                <Text>{user.name}</Text>
                <Text fontSize="sm">{user.email}</Text>
              </Box>
            </Flex>
            {isSucceeded ? (
              <>
                <Text pt={5}>You are ready to go!</Text>
              </>
            ) : (
              <>
                <Text pt={5}>Next, we need access to your Discord account.</Text>
                <Button
                  bg="#7289da"
                  color="white"
                  variant="solid"
                  w="full"
                  mt={5}
                  onClick={() => router.push('/api/oauth')}
                >
                  Sign in with Discord
                </Button>
              </>
            )}
          </>
        ) : (
          <>
            <Text pt={3}>
              First, we need to identify you. Sign in with Google using your email to verify your membership.
            </Text>
            <Button
              colorScheme="teal"
              variant="solid"
              w="full"
              mt={5}
              onClick={() =>
                Auth.federatedSignIn({
                  provider: CognitoHostedUIIdentityProvider.Google,
                })
              }
            >
              Sign in with Google
            </Button>
          </>
        )}
      </Box>
    </Flex>
  );
};

// noinspection JSUnusedGlobalSymbols
export default Index;
