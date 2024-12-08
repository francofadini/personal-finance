import React, { useState } from 'react';
import styled from 'styled-components';
import { Button } from 'antd';
import { EditOutlined, DeleteOutlined, PlusCircleOutlined, ThunderboltOutlined, UpOutlined, DownOutlined } from '@ant-design/icons';

const CategoryContainer = styled.div`
  background: white;
  margin: 0 0 8px 8px;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  overflow: hidden;
`;

const MainRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
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
  display: ${props => props.$isSubcategory ? 'none' : 'flex'};
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
  margin-left: auto;
`;

const ExpandButton = styled(Button)`
  width: 32px;
  height: 32px;
  padding: 0;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SubcategoriesList = styled.div`
  background: #f5f5f5;
  padding: 8px 8px 8px 0;
  border-radius: 0 0 8px 8px;
  
  ${CategoryContainer} {
    margin-bottom: 4px;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
`;

const CategoryListItem = ({ 
  category, 
  onEdit, 
  onDelete, 
  onAddSub, 
  onApplyRules 
}) => {
  const isSubcategory = !!category.categoryId;
  const [applying, setApplying] = useState(false);

  return (
    <CategoryContainer>
      <MainRow>
        {!isSubcategory && (
          <IconCircle $color={category.color}>
            {category.icon}
          </IconCircle>
        )}
        <CategoryInfo>
          <Name>{category.name}</Name>
          <Budget>
            {category.monthlyBudget ? `${category.monthlyBudget}€/month` : 'No budget set'}
          </Budget>
        </CategoryInfo>
        <ActionButtons>
          <Button 
            icon={<EditOutlined />} 
            onClick={() => onEdit(category)} 
          />
          {!isSubcategory && (
            <>
              <Button 
                icon={<PlusCircleOutlined />} 
                onClick={() => onAddSub(category)} 
              />
              <Button
                icon={<ThunderboltOutlined />}
                loading={applying}
                onClick={async () => {
                  setApplying(true);
                  await onApplyRules(category);
                  setApplying(false);
                }}
              />
            </>
          )}
          <Button 
            icon={<DeleteOutlined />} 
            danger 
            onClick={() => onDelete(category)} 
          />
        </ActionButtons>
      </MainRow>
    </CategoryContainer>
  );
};

export default CategoryListItem; 