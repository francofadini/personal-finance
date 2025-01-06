import React from 'react';
import { Tabs, theme } from 'antd';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { 
  HomeOutlined,
  BookOutlined,
  FolderOutlined,
  MoreOutlined 
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const TabLabel = styled.div`
  position: relative;
  height: 48px;
  width: 56px;

  .anticon {
    position: absolute;
    top: 6px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 22px;
  }

  div {
    position: absolute;
    bottom: 4px;
    left: 0;
    right: 0;
    text-align: center;
    font-size: 10px;
    line-height: 1.2;
  }
`;

const NavContainer = styled.div`
  position: fixed;
  bottom: 0;
  width: 100%;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-top: 1px solid #f0f0f0;
  padding-bottom: env(safe-area-inset-bottom, 0px);

  .ant-tabs {
    .ant-tabs-nav {
      margin: 0;
      &::before {
        display: none;
      }
    }

    .ant-tabs-nav-list {
      width: 100%;
      justify-content: space-around;
    }

    .ant-tabs-tab {
      margin: 0;
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      
      .ant-tabs-tab-btn {
        color: rgba(0, 0, 0, 0.45);
      }
    }

    .ant-tabs-tab-active .ant-tabs-tab-btn {
      color: ${props => props.$token?.colorPrimary || '#1677ff'};
    }

    .ant-tabs-ink-bar {
      display: none;
    }
  }
`;

const BottomNavigation = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const { token } = theme.useToken();

  const items = [
    {
      key: '/',
      label: (
        <TabLabel>
          <HomeOutlined />
          <div>{t('nav.home')}</div>
        </TabLabel>
      )
    },
    {
      key: '/transactions',
      label: (
        <TabLabel>
          <BookOutlined />
          <div>{t('nav.transactions')}</div>
        </TabLabel>
      )
    },
    {
      key: '/categories',
      label: (
        <TabLabel>
          <FolderOutlined />
          <div>{t('nav.categories')}</div>
        </TabLabel>
      )
    },
    {
      key: '/more',
      label: (
        <TabLabel>
          <MoreOutlined />
          <div>{t('nav.more')}</div>
        </TabLabel>
      )
    }
  ];

  const handleChange = (key) => {
    router.push(key);
  };

  return (
    <NavContainer $token={token}>
      <Tabs
        activeKey={router.pathname}
        onChange={handleChange}
        items={items}
        centered
      />
    </NavContainer>
  );
};

export default BottomNavigation;
