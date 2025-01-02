import React, { useState } from 'react';
import styled from 'styled-components';
import { Typography, Modal, message, Button } from 'antd';
import { formatCurrency } from '../utils/formater';
import CategorySelector from './CategorySelector';
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';

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
  cursor: pointer;
  opacity: ${props => props.$ignored ? 0.5 : 1};
  
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
  background: ${props => props.$color || '#ffffff'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
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

const TransactionListItem = ({ transaction, onUpdate }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const isNegative = transaction.amount < 0;
  const isDefault = transaction.categoryId?.name == transaction.subcategoryId?.name;
  const categoryLabel = !isDefault ? 
    `${transaction.categoryId?.name} / ${transaction.subcategoryId?.name}` : 
    (transaction.categoryId?.name ?? 'Uncategorized');

  const handleCategorySelect = async ({ categoryId, subcategoryId }) => {
    try {
      const response = await fetch('/api/transactions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transactionId: transaction._id,
          categoryId,
          subcategoryId
        })
      });

      if (!response.ok) throw new Error('Failed to update category');
      
      const updatedTransaction = await response.json();
      onUpdate?.(updatedTransaction);
      setIsModalVisible(false);
      message.success('Category updated successfully');
    } catch (error) {
      message.error('Failed to update category');
    }
  };

  const handleIgnoreToggle = async (e) => {
    e.stopPropagation(); // Prevent modal from opening
    try {
      const response = await fetch('/api/transactions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transactionId: transaction._id,
          ignored: !transaction.ignored
        })
      });

      if (!response.ok) throw new Error('Failed to update transaction');
      
      const updatedTransaction = await response.json();
      onUpdate?.(updatedTransaction);
      message.success(updatedTransaction.ignored ? 'Transaction ignored' : 'Transaction un-ignored');
    } catch (error) {
      message.error('Failed to update transaction');
    }
  };

  return (
    <>
      <TransactionCell 
        $ignored={transaction.ignored}
        onClick={() => setIsModalVisible(true)}
      >
        <InfoSection>
          <IconCircle>
            {transaction.categoryId?.icon}
          </IconCircle>
          <TextSection>
            <Title>{transaction.description}</Title>
            <Category>{categoryLabel}</Category>
          </TextSection>
        </InfoSection>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Amount $isNegative={isNegative}>
            {formatCurrency(transaction.amount, transaction.currency)}
          </Amount>
          <Button 
            type="text"
            icon={transaction.ignored ? <EyeInvisibleOutlined /> : <EyeOutlined />}
            onClick={handleIgnoreToggle}
          />
        </div>
      </TransactionCell>

      <Modal
        title="Select Category"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <CategorySelector
          selectedCategoryId={transaction.categoryId?._id}
          selectedSubcategoryId={transaction.subcategoryId?._id}
          onSelect={handleCategorySelect}
        />
      </Modal>
    </>
  );
};

export default TransactionListItem; 