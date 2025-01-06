import React from 'react';
import styled from 'styled-components';
import { Typography, Button, theme } from 'antd';
import { DeleteOutlined, SyncOutlined } from '@ant-design/icons';
import { formatCurrency } from '../utils/formater';
const { Text } = Typography;

const useAntdToken = () => theme.useToken().token;

const AccountCell = styled.div(({ $token }) => `
  background-color: ${$token.colorBgContainer};
  border-radius: 16px;
  padding: 16px;
  padding-bottom: 4px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`);

const MainRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const BottomRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const AccountInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const InstitutionInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
`;

const Title = styled(Text)`
  font-size: 16px;
  font-weight: 600;
`;

const Balance = styled(Text)`
  font-size: 15px;
`;

const LastSync = styled(Text)`
  margin-top: 8px;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.45);
`;

const InstitutionName = styled(Text)`
  font-size: 13px;
  color: rgba(0, 0, 0, 0.45);
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;
`;

const AccountListItem = ({ account, onSync, onDelete, syncing }) => {
  const token = useAntdToken();
  
  return (
    <AccountCell $token={token}>
      <MainRow>
        <AccountInfo>
          <Title>{account.name}</Title>
          <Balance>{formatCurrency(account.balance, account.currency)}</Balance>
        </AccountInfo>
        <InstitutionInfo>
          <img src={account.institutionLogo} alt={account.institutionName} width="32" height="32" />
          <InstitutionName>{account.institutionName}</InstitutionName>
        </InstitutionInfo>
      </MainRow>
      
      <BottomRow>
        <LastSync>{`Last sync: ${new Date(account.lastTransactionsSync).toLocaleString()}`}</LastSync>
        <ActionButtons>
          <Button 
            icon={<SyncOutlined spin={syncing} />} 
            onClick={onSync} 
            type="text"
            loading={syncing}
            disabled={syncing}
          />
          <Button 
            icon={<DeleteOutlined />} 
            onClick={onDelete} 
            type="text" 
            danger 
            disabled={syncing}
          />
        </ActionButtons>
      </BottomRow>
    </AccountCell>
  );
};

export default AccountListItem; 