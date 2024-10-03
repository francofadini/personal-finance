import React from 'react';
import styled from 'styled-components';
import { List, Button, Typography, Collapse } from 'antd';
import { DeleteOutlined, SyncOutlined } from '@ant-design/icons';

const { Text } = Typography;
const { Panel } = Collapse;

const StyledList = styled(List)`
  margin-bottom: 20px;
`;

const AccountList = ({ accounts, onDeleteAccount, onSyncAccount }) => {
  return (
    <StyledList
      itemLayout="vertical"
      dataSource={accounts}
      renderItem={(account) => (
        <List.Item
          actions={[
            <Button
              icon={<SyncOutlined />}
              onClick={() => onSyncAccount(account.id)}
            >
              Sincronizar
            </Button>,
            <Button
              icon={<DeleteOutlined />}
              onClick={() => onDeleteAccount(account.id)}
              danger
            >
              Eliminar
            </Button>
          ]}
        >
          <List.Item.Meta
            title={account.name}
            description={`Última sincronización: ${new Date(account.lastSyncDate).toLocaleString()}`}
          />
          <Collapse>
            <Panel header="Cuentas vinculadas" key="1">
              {account.gocardlessAccounts.map((gocardlessAccount) => (
                <div key={gocardlessAccount.id}>
                  <Text strong>{gocardlessAccount.name}</Text>
                  <br />
                  <Text>{`Saldo: ${gocardlessAccount.balance} ${gocardlessAccount.currency}`}</Text>
                  <br />
                  <Text>{`Tipo: ${gocardlessAccount.accountType}`}</Text>
                </div>
              ))}
            </Panel>
          </Collapse>
        </List.Item>
      )}
    />
  );
};

export default AccountList;
