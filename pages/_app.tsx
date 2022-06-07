import { AppProps } from 'next/app';
import { ChakraProvider, ChakraTheme, extendTheme } from '@chakra-ui/react';
import { mode, StyleFunctionProps } from '@chakra-ui/theme-tools';
import { Dict } from '@chakra-ui/utils';
import { Amplify, Auth } from 'aws-amplify';
import { AuthOptions } from '@aws-amplify/auth/lib-esm/types';
import NextStorage from 'amplify-auth-next-storage';

const hostname = process.env.NEXT_PUBLIC_HOSTNAME as string;
const basename = process.env.NEXT_PUBLIC_BASENAME as string;
const awsConfig: AuthOptions = {
  region: process.env.NEXT_PUBLIC_AWS_REGION,
  userPoolId: process.env.NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID,
  userPoolWebClientId: process.env.NEXT_PUBLIC_AWS_COGNITO_WEB_CLIENT_ID,
  oauth: {
    domain: process.env.NEXT_PUBLIC_AWS_COGNITO_DOMAIN_NAME as string,
    responseType: 'code',
    scope: ['openid', 'email', 'profile'],
    redirectSignIn: basename,
    redirectSignOut: basename,
  },
  storage: new NextStorage(undefined, {
    domain: hostname,
  }),
};

Amplify.configure(awsConfig);
Auth.configure(awsConfig);

const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
  styles: {
    global: (props: Dict | StyleFunctionProps) => ({
      body: {
        bg: mode('gray.100', '')(props),
      },
    }),
  },
} as Partial<ChakraTheme>);

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <ChakraProvider theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  );
};

// noinspection JSUnusedGlobalSymbols
export default MyApp;
