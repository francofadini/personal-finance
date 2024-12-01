import React from 'react';
import { List } from 'antd';
import { useRouter } from 'next/router';
import { 
  CalendarOutlined, 
  LogoutOutlined 
} from '@ant-design/icons';
import styled from 'styled-components';
import Layout from '@/components/Layout';
import MobileHeader from '@/components/MobileHeader';
import { useTranslation } from 'react-i18next';
import { signOut } from 'next-auth/react';

const StyledList = styled(List)`
  .ant-list-item {
    padding: 16px;
    cursor: pointer;
  }

  .anticon {
    font-size: 20px;
    margin-right: 12px;
  }
`;

const MorePage = () => {
  const router = useRouter();
  const { t } = useTranslation();

  const menuItems = [
    {
      key: 'recurrent',
      icon: <CalendarOutlined />,
      title: t('nav.recurrentExpenses'),
      onClick: () => router.push('/recurrent-expenses')
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      title: t('common.logout'),
      onClick: () => signOut(),
      danger: true
    }
  ];

  return (
    <Layout>
      <MobileHeader title={t('nav.more')} />
      <StyledList
        dataSource={menuItems}
        renderItem={(item) => (
          <List.Item 
            onClick={item.onClick}
            style={{ 
              color: item.danger ? '#ff4d4f' : 'inherit'
            }}
          >
            {item.icon}
            {item.title}
          </List.Item>
        )}
      />
    </Layout>
  );
};

export default MorePage; 