import { AppProps } from 'next/app';
import { ChakraProvider, ChakraTheme, extendTheme } from '@chakra-ui/react';
import { mode, StyleFunctionProps } from '@chakra-ui/theme-tools';
import { Dict } from '@chakra-ui/utils';
import { Amplify, Auth } from 'aws-amplify';
import { AuthOptions } from '@aws-amplify/auth/lib-esm/types';

const basename = `http://localhost:3000/`;
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
