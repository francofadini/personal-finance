import React, { useEffect } from 'react';
import { Layout as AntLayout, Spin, theme } from 'antd';
import styled from 'styled-components';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import BottomNavigation from './BottomNavigation';

const StyledLayout = styled(AntLayout)`
  min-height: 100vh;
  background: ${({ $token }) => $token.colorBgLayout};
`;

const StyledContent = styled(AntLayout.Content)`
  flex: 1;
  margin-bottom: 56px; // Height of bottom nav
  position: relative;
  z-index: 10; // Between header and bottom nav
`;

const StyledSpinContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const Layout = ({ children }) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { token } = theme.useToken();

  useEffect(() => {
    if (status === 'unauthenticated' && !isPublicRoute(router.pathname)) {
      router.push('/auth/login');
    }
  }, [status, router]);

  const isPublicRoute = (path) => {
    const publicRoutes = ['/auth/login', '/auth/register', '/auth/forgot-password'];
    return publicRoutes.includes(path);
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: '/auth/login' });
  };

  if (status === 'loading') {
    return (
      <StyledSpinContainer>
        <Spin size="large" />
      </StyledSpinContainer>
    );
  }

  return (
    <StyledLayout $token={token}>
      <StyledContent>
        {children}
      </StyledContent>
      <BottomNavigation style={{ zIndex: 15 }} onSignOut={handleSignOut} />
    </StyledLayout>
  );
};

export default Layout;
