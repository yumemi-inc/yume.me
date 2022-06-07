import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Flex, Spinner } from '@chakra-ui/react';

const Callback: NextPage = () => {
  const router = useRouter();
  console.log(router.query);

  return (
    <Flex align="center" justify="center" height="100vh">
      <Spinner />
    </Flex>
  );
};

// noinspection JSUnusedGlobalSymbols
export default Callback;
