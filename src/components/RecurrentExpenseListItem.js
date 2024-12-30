import React from 'react';
import styled from 'styled-components';
import { Button, Tag, Space, Modal, theme } from 'antd';
import { EditOutlined, DeleteOutlined, CalendarOutlined } from '@ant-design/icons';
import { formatCurrency } from '@/utils/formater';
import { useTranslation } from 'react-i18next';

const ExpenseCell = styled.div`
  margin: 0 8px 8px;
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
`;

const InfoSection = styled.div`
  flex: 1;
  min-width: 0;
`;

const TextSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Title = styled.div`
  font-size: 15px;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Subtitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

const MonthTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
`;

const DayInfo = styled.span`
  color: rgba(0, 0, 0, 0.45);
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const MonthTag = styled(Tag)`
  && {
    background: ${({ $token }) => $token?.colorInfoBg};
    color: ${({ $token }) => $token?.colorInfo};
    border: none;
    margin: 0;
  }
`;

const Amount = styled.div`
  font-size: 15px;
  font-weight: 600;
  text-align: right;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 4px;
`;

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const CategoryText = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const IconCircle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${({ $token }) => $token?.colorInfoBg};
  color: ${({ $token }) => $token?.colorInfo};
`;

const RecurrentExpenseListItem = ({ expense, onEdit, onDelete }) => {
  const { t } = useTranslation();
  const { token } = theme.useToken();
  const { name, estimatedAmount, months, dayOfMonth } = expense;
  const isDefault = expense.categoryId?.name === expense.subcategoryId?.name;
  const categoryLabel = !isDefault 
    ? `${expense.categoryId?.name} / ${expense.subcategoryId?.name}` 
    : (expense.categoryId?.name ?? 'Uncategorized');
  
  const handleDelete = () => {
    Modal.confirm({
      title: t('recurrentExpenses.deleteConfirm.title'),
      content: t('recurrentExpenses.deleteConfirm.content'),
      okText: t('common.delete'),
      cancelText: t('common.cancel'),
      okButtonProps: { danger: true },
      onOk: () => onDelete()
    });
  };

  return (
    <ExpenseCell>
      <InfoSection>
        <IconCircle>{expense.categoryId?.icon}</IconCircle>
        <TextSection>
          <Title>{name}</Title>
          <Subtitle>
            <CategoryText>{categoryLabel}</CategoryText>
            <DayInfo>
              <CalendarOutlined /> Day {dayOfMonth}
            </DayInfo>
          </Subtitle>
        </TextSection>
      </InfoSection>
      
      <Space direction="vertical" align="end">
        <Amount $token={token}>-{formatCurrency(estimatedAmount)}</Amount>
        <ActionButtons>
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            onClick={() => onEdit()}
          />
          <Button 
            type="text" 
            danger 
            icon={<DeleteOutlined />} 
            onClick={handleDelete}
          />
        </ActionButtons>
      </Space>
    </ExpenseCell>
  );
};

export default RecurrentExpenseListItem; 