import React from 'react';
import styled from 'styled-components';
import { Button, Tag, Space, Modal, theme } from 'antd';
import { EditOutlined, DeleteOutlined, CalendarOutlined } from '@ant-design/icons';
import { formatCurrency } from '@/utils/formater';
import { useTranslation } from 'react-i18next';

const ExpenseCell = styled.div`
  margin: 0 8px 8px;
  padding: 16px;
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
  font-size: 24px;
`;

const TextSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
`;

const Title = styled.div`
  font-size: 15px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Subtitle = styled.div`
  font-size: 13px;
  color: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Amount = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: #52c41a;
  text-align: right;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
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
  background: ${({ $token }) => $token.colorPrimaryBg};
  color: ${({ $token }) => $token.colorPrimary};
  border: none;
  margin: 0;
`;

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const RecurrentExpenseListItem = ({ expense, onEdit, onDelete }) => {
  const { t } = useTranslation();
  const { token } = theme.useToken();
  const { name, estimatedAmount, categoryId, months, dayOfMonth } = expense;
  
  const handleDelete = () => {
    Modal.confirm({
      title: t('recurrentExpenses.deleteConfirm.title'),
      content: t('recurrentExpenses.deleteConfirm.content'),
      okText: t('common.delete'),
      cancelText: t('common.cancel'),
      okButtonProps: { danger: true },
      onOk: () => onDelete(expense._id)
    });
  };

  return (
    <ExpenseCell>
      <InfoSection>
        <IconCircle $color={categoryId.color}>
          {categoryId.icon}
        </IconCircle>
        <TextSection>
          <Title>{name}</Title>
          <Subtitle>
            {months.length === 12 ? (
              <span>Every month</span>
            ) : (
              <MonthTags>
                {months.sort((a, b) => a - b).map(m => (
                  <MonthTag key={m} $token={token}>
                    {MONTHS[m-1]}
                  </MonthTag>
                ))}
              </MonthTags>
            )}
            <DayInfo>
              <CalendarOutlined /> Day {dayOfMonth}
            </DayInfo>
          </Subtitle>
        </TextSection>
      </InfoSection>
      
      <Space direction="vertical" align="end">
        <Amount>{formatCurrency(estimatedAmount)}</Amount>
        <ActionButtons>
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            onClick={() => onEdit(expense)}
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