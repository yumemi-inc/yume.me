import { AppProps } from 'next/app';
import { ChakraProvider, ChakraTheme, extendTheme } from '@chakra-ui/react';
import { mode, StyleFunctionProps } from '@chakra-ui/theme-tools';
import { Dict } from '@chakra-ui/utils';

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
