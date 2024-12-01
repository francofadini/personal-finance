import React from 'react';
import styled from 'styled-components';
import { Typography } from 'antd';
import { formatCurrency } from '../utils/formater';

const { Text } = Typography;

const TransactionCell = styled.div`
  margin: 0 8px 8px;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);

  &:active {
    background: #fafafa;
  }
`;

const InfoSection = styled.div`
  flex: 1;
  display: flex;
  gap: 12px;
  align-items: center;
  min-width: 0;
`;

const IconCircle = styled.div`
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  border-radius: 50%;
  background: ${props => props.$color || '#f5f5f5'};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TextSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
`;

const Title = styled(Text)`
  font-size: 15px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Category = styled(Text)`
  font-size: 13px;
  color: rgba(0, 0, 0, 0.45);
`;

const Amount = styled(Text)`
  font-size: 15px;
  font-weight: 600;
  color: ${props => props.$isNegative ? '#ff4d4f' : '#52c41a'};
  flex-shrink: 0;
`;

const TransactionListItem = ({ transaction }) => {
  const isNegative = transaction.amount < 0;
  
  return (
    <TransactionCell>
      <InfoSection>
        <IconCircle $color={transaction.category?.color}>
          {/* Add category icon here */}
        </IconCircle>
        <TextSection>
          <Title>{transaction.description}</Title>
          <Category>{transaction.categoryId?.name || 'Uncategorized'}</Category>
        </TextSection>
      </InfoSection>
      <Amount $isNegative={isNegative}>
        {formatCurrency(transaction.amount, transaction.currency)}
      </Amount>
    </TransactionCell>
  );
};

export default TransactionListItem; 