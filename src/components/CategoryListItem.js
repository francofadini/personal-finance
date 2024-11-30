import React from 'react';
import styled from 'styled-components';
import { Button } from 'antd';
import { EditOutlined, DeleteOutlined, PlusCircleOutlined, ThunderboltOutlined } from '@ant-design/icons';

const CategoryCell = styled.div`
  margin: 0 8px 8px;
  padding: 16px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
`;

const MainRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

// Reusing same IconCircle from TransactionListItem
const IconCircle = styled.div`
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  border-radius: 50%;
  background: ${props => props.$color || '#f5f5f5'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
`;

const CategoryInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const Name = styled.div`
  font-size: 15px;
  font-weight: 500;
`;

const Budget = styled.div`
  font-size: 13px;
  color: rgba(0, 0, 0, 0.45);
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;
`;

const CategoryListItem = ({ category, onEdit, onDelete, onAddSub, onApplyRules }) => {
  return (
    <CategoryCell>
      <MainRow>
        <IconCircle $color={category.color}>
          {category.icon}
        </IconCircle>
        <CategoryInfo>
          <Name>{category.name}</Name>
          <Budget>{category.monthlyBudget ? `${category.monthlyBudget}€/month` : 'No budget set'}</Budget>
        </CategoryInfo>
      </MainRow>
      
      <ActionButtons>
        <Button icon={<EditOutlined />} onClick={() => onEdit(category)} type="text" />
        {!category.parentId && (
          <Button icon={<PlusCircleOutlined />} onClick={() => onAddSub(category)} type="text" />
        )}
        <Button icon={<ThunderboltOutlined />} onClick={() => onApplyRules(category._id)} type="text" />
        <Button icon={<DeleteOutlined />} onClick={() => onDelete(category._id)} type="text" danger />
      </ActionButtons>
    </CategoryCell>
  );
};

export default CategoryListItem; 