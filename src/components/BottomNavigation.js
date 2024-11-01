import React from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { WalletOutlined, TagsOutlined, LogoutOutlined, TransactionOutlined } from '@ant-design/icons';

const NavBar = styled.nav`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 56px;
  background-color: #fff;
  display: flex;
  justify-content: space-around;
  align-items: center;
  box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
`;

const NavItem = styled.a`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: ${props => props.active ? '#1890ff' : '#8c8c8c'};
  font-size: 12px;
  text-decoration: none;

  &:hover {
    color: #1890ff;
  }
`;

const IconWrapper = styled.span`
  font-size: 24px;
  margin-bottom: 4px;
`;

const BottomNavigation = ({ onSignOut }) => {
  const router = useRouter();

  const handleNavigation = (path) => {
    if (path === 'signout') {
      onSignOut();
    } else {
      router.push(path);
    }
  };

  return (
    <NavBar>
      <NavItem 
        href="/" 
        onClick={(e) => { e.preventDefault(); handleNavigation('/'); }}
        active={router.pathname === '/'}
      >
        <IconWrapper><WalletOutlined /></IconWrapper>
        Cuentas
      </NavItem>
      <NavItem 
        href="/transactions" 
        onClick={(e) => { e.preventDefault(); handleNavigation('/transactions'); }}
        active={router.pathname === '/transactions'}
      >
        <IconWrapper><TransactionOutlined /></IconWrapper>
        Transacciones
      </NavItem>
      <NavItem 
        href="/categories" 
        onClick={(e) => { e.preventDefault(); handleNavigation('/categories'); }}
        active={router.pathname === '/categories'}
      >
        <IconWrapper><TagsOutlined /></IconWrapper>
        Categorías
      </NavItem>
      <NavItem 
        href="/recurrent-expenses" 
        onClick={(e) => { e.preventDefault(); handleNavigation('/recurrent-expenses'); }}
        active={router.pathname === '/recurrent-expenses'}
      >
        <IconWrapper><WalletOutlined /></IconWrapper>
        Gastos recurrentes
      </NavItem>
      <NavItem 
        href="#" 
        onClick={(e) => { e.preventDefault(); handleNavigation('signout'); }}
      >
        <IconWrapper><LogoutOutlined /></IconWrapper>
        Salir
      </NavItem>
    </NavBar>
  );
};

export default BottomNavigation;
