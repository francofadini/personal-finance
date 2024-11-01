import React from 'react';
import styled from 'styled-components';
import { List, Typography, Button } from 'antd';
import { DeleteOutlined, SyncOutlined } from '@ant-design/icons';

const { Text } = Typography;

const AccountCell = styled(List.Item)`
  background-color: #fff;
  border-bottom: 1px solid #f0f0f0;
  padding: 12px;
`;

const AccountInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledButton = styled(Button)`
  margin-left: 8px;
`;

const AccountListItem = ({ account, onSync, onDelete }) => {
  return (
    <AccountCell
      actions={[
        <StyledButton key="sync" icon={<SyncOutlined />} onClick={onSync} type="text" />,
        <StyledButton key="delete" icon={<DeleteOutlined />} onClick={onDelete} type="text" danger />,
      ]}
    >
      <List.Item.Meta
        avatar={<img src={account.institutionLogo} alt={account.institutionName} width="32" height="32" />}
        title={<Text strong>{account.name}</Text>}
        description={
          <AccountInfo>
            <Text type="secondary">{account.institutionName}</Text>
            <Text>{`${account.balance} ${account.currency}`}</Text>
            <Text type="secondary">{`Last sync: ${new Date(account.lastTransactionsSync).toLocaleString()}`}</Text>
          </AccountInfo>
        }
      />
    </AccountCell>
  );
};

export default AccountListItem; 