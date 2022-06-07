import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Alert, AlertDescription, AlertIcon, Avatar, Box, Button, Flex, Heading, Text } from '@chakra-ui/react';
import { Auth } from 'aws-amplify';
import { CognitoHostedUIIdentityProvider } from '@aws-amplify/auth';

import { useCurrentUser } from '../lib/authn';
import { CheckIcon } from '@chakra-ui/icons';

const Index: NextPage = () => {
  const router = useRouter();
  const user = useCurrentUser();
  const isLoggedIn = !!user;
  const isSucceeded = router.query['success'] !== undefined;
  const error = router.query['failed'];

  return (
    <Flex align="center" justify="center" height="100vh">
      <Box bg="white" w={384} p={8} rounded={8} boxShadow="md">
        <Heading size="md">Welcome</Heading>
        {error && (
          <Alert status="error" my={3}>
            <AlertIcon />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
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
                <Flex align="center" gap={3} mt={5}>
                  <CheckIcon color="green.500" />
                  <Text>You are ready to go!</Text>
                </Flex>
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
