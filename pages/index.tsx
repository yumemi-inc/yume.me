import { NextPage } from 'next';
import { Box, Button, Flex, Heading, Stack } from '@chakra-ui/react';

const Index: NextPage = () => {
  return (
    <Flex align="center" justify="center" height="100vh">
      <Box bg="white" w={384} p={8} rounded={8} boxShadow="md">
        <Heading size="md">Welcome</Heading>
        <Stack gap={5} pt={5}>
          <Button colorScheme="teal" variant="solid" w="full">
            Sign in with Google
          </Button>
        </Stack>
      </Box>
    </Flex>
  );
};

// noinspection JSUnusedGlobalSymbols
export default Index;
