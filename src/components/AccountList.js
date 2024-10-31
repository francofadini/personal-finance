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
              key="sync"
              icon={<SyncOutlined />}
              onClick={() => onSyncAccount(account._id)}
            >
              Sincronizar
            </Button>,
            <Button
              key="delete"
              icon={<DeleteOutlined />}
              onClick={() => onDeleteAccount(account._id)}
              danger
            >
              Eliminar
            </Button>
          ]}
        >
          <List.Item.Meta
            title={account.name}
            description={`Última sincronización: ${new Date(account.lastSync).toLocaleString()}`}
          />
          <Collapse>
            <Panel header="Detalles de la cuenta" key="1">
              <Text>{`Saldo: ${account.balance} ${account.currency}`}</Text>
              <br />
              <Text>{`Identificador: ${account.identifier}`}</Text>
              <br />
              <Text>{`Estado: ${account.status}`}</Text>
              {account.metadata && (
                <>
                  <br />
                  <Text strong>Metadata:</Text>
                  <pre>{JSON.stringify(account.metadata, null, 2)}</pre>
                </>
              )}
            </Panel>
          </Collapse>
        </List.Item>
      )}
    />
  );
};

export default AccountList;
