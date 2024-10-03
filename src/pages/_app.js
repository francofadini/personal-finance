import React from 'react';
import { ConfigProvider } from 'antd';
import { SessionProvider } from 'next-auth/react';
import { FinanceProvider } from '@/contexts/FinanceContext';
import customTheme from '@/styles/theme';

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <ConfigProvider theme={customTheme}>
        <FinanceProvider>
          <Component {...pageProps} />
        </FinanceProvider>
      </ConfigProvider>
    </SessionProvider>
  );
}

export default MyApp;
