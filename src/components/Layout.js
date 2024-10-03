import React, { useEffect } from 'react';
import { Layout as AntLayout, Spin } from 'antd';
import styled from 'styled-components';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import BottomNavigation from './BottomNavigation';

const { Content } = AntLayout;

const StyledLayout = styled(AntLayout)`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const StyledContent = styled(Content)`
  flex: 1;
  padding: 24px;
  padding-bottom: 70px; // Add padding to account for the TabBar height
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
    <StyledLayout>
      <StyledContent>{children}</StyledContent>
      {session && <BottomNavigation onSignOut={handleSignOut} />}
    </StyledLayout>
  );
};

export default Layout;
