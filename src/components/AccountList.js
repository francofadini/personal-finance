import React from 'react';
import styled from 'styled-components';
import { List, Typography, Skeleton } from 'antd';
import AccountListItem from './AccountListItem';

const { Text } = Typography;

const StyledList = styled(List)`
  padding:8px;
`;

const EmptyText = styled(Text)`
  display: block;
  text-align: center;
  margin-top: 48px;
  color: rgba(0, 0, 0, 0.45);
`;

const AccountList = ({ accounts, loading, onDeleteAccount, onSyncAccount }) => {
  return (
    <StyledList
      grid={{ 
        gutter: 16,
        column: 1  // Forces 1 item per row
      }}
      dataSource={accounts}
      renderItem={(account) => (
        <List.Item>
          <AccountListItem
            key={account._id}
            account={account}
            loading={loading}
            onDelete={() => onDeleteAccount(account._id)}
            onSync={() => onSyncAccount(account._id)}
          />
        </List.Item>
      )}
      locale={{
        emptyText: loading ? (
          <Skeleton paragraph={{ rows: 2 }} active />
        ) : (
          <EmptyText>No accounts found</EmptyText>
        ),
      }}
    />
  );
};

export default AccountList;
