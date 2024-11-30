import React from 'react';
import { ConfigProvider } from 'antd';
import { SessionProvider } from 'next-auth/react';
import { FinanceProvider } from '@/contexts/FinanceContext';
import customTheme from '@/styles/theme';
import '@/i18n';
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
  }
`;

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session} refetchInterval={0}>
      <ConfigProvider theme={customTheme}>
        <FinanceProvider>
          <GlobalStyle />
          <Component {...pageProps} />
        </FinanceProvider>
      </ConfigProvider>
    </SessionProvider>
  );
}

export default MyApp;
