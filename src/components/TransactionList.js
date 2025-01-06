import React from 'react';
import styled from 'styled-components';
import { List, Spin, theme } from 'antd';
import TransactionListItem from './TransactionListItem';
import InfiniteScroll from 'react-infinite-scroll-component';

const ListContainer = styled.div`
  height: calc(100vh - 64px);
  overflow-y: auto;
  background: ${props => props.bgColor};
`;

const DateHeader = styled.div`
  padding: 12px 16px;
  position: sticky;
  top: 0;
  background: ${props => props.bgColor};
  font-weight: 500;
  font-size: 14px;
  border-bottom: 1px solid #f0f0f0;
  z-index: 10;
`;

const TransactionList = ({ transactions, loading, hasMore, onLoadMore, onTransactionUpdate, onTransactionDelete }) => {
  const { token } = theme.useToken();

  const groupedTransactions = transactions.reduce((groups, transaction) => {
    const date = new Date(transaction.date).toLocaleDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(transaction);
    return groups;
  }, {});

  return (
    <ListContainer id="scrollableTransactionList" bgColor={token.colorBgLayout}>
      <InfiniteScroll
        dataLength={transactions.length}
        next={onLoadMore}
        hasMore={hasMore}
        loader={<Spin style={{ display: 'block', margin: '20px auto' }} />}
        scrollableTarget="scrollableTransactionList"
      >
        {Object.entries(groupedTransactions).map(([date, dayTransactions]) => (
          <div key={date}>
            <DateHeader bgColor={token.colorBgLayout}>{date}</DateHeader>
            {dayTransactions.map(transaction => (
              <TransactionListItem 
                key={transaction._id} 
                transaction={transaction}
                onUpdate={onTransactionUpdate}
                onDelete={onTransactionDelete}
              />
            ))}
          </div>
        ))}
      </InfiniteScroll>
    </ListContainer>
  );
};

export default TransactionList; 