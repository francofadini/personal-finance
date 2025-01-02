import React from 'react';
import styled from 'styled-components';
import { List, Typography, Skeleton, theme } from 'antd';
import TransactionListItem from './TransactionListItem';

const ListContainer = styled.div`
  padding-bottom: 56px;
`;

const StyledList = styled(List)`
  .ant-list-item {
    padding: 0;
    border: none;
  }
`;

const DateGroup = styled.div`
  position: relative;
  margin-bottom: 8px;
`;

const DateHeader = styled.div`
  padding: 16px;
  position: sticky;
  top: 148px;
  z-index: 5;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
  background: ${({ $token }) => $token.colorBgLayout};
  border-bottom: 1px solid ${({ $token }) => $token.colorBorderSecondary};
  
  // Add subtle shadow for better separation
  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: -1px;
    height: 1px;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.03), transparent);
  }
`;

const TransactionList = ({ transactions, loading, onTransactionUpdate, onTransactionDelete }) => {
  const { token } = theme.useToken();
  
  const handleTransactionUpdate = (updatedTransaction) => {
    onTransactionUpdate?.(updatedTransaction);
  };

  const handleTransactionDelete = (transactionId) => {
    onTransactionDelete?.(transactionId);
  };

  const groupedTransactions = transactions.reduce((groups, transaction) => {
    const date = new Date(transaction.date).toLocaleDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(transaction);
    return groups;
  }, {});

  return (
    <ListContainer>
      <StyledList
        dataSource={Object.entries(groupedTransactions)}
        renderItem={([date, dayTransactions]) => (
          <DateGroup>
            <DateHeader $token={token}>{date}</DateHeader>
            {dayTransactions.map(transaction => (
              <TransactionListItem 
                key={transaction._id} 
                transaction={transaction}
                onUpdate={handleTransactionUpdate}
                onDelete={handleTransactionDelete}
              />
            ))}
          </DateGroup>
        )}
      />
    </ListContainer>
  );
};

export default TransactionList; 