import React from 'react';
import styled from 'styled-components';
import { List, Typography, Skeleton } from 'antd';
import AccountListItem from './AccountListItem';

const { Text } = Typography;

const StyledList = styled(List)`
  margin-top: 16px;
`;

const EmptyText = styled(Text)`
  display: block;
  text-align: center;
  margin-top: 48px;
  font-size: 16px;
  color: #888;
`;

const AccountList = ({ accounts, loading, onDeleteAccount, onSyncAccount }) => {
  return (
    <StyledList
      dataSource={accounts}
      renderItem={(account) => (
        <AccountListItem
          key={account._id}
          account={account}
          loading={loading}
          onDelete={() => onDeleteAccount(account._id)}
          onSync={() => onSyncAccount(account._id)}
        />
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
