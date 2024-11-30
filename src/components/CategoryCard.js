import React from 'react';
import { Button } from 'antd';
import { EditOutlined, DeleteOutlined, PlusCircleOutlined, ThunderboltOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const Card = styled.div`
  margin: 8px 0;
  padding: 16px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
`;

const CategoryHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
`;

const IconCircle = styled.div`
  width: 40px;
  height: 40px;
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

const CategoryName = styled.div`
  font-size: 15px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
`;

const CategoryBudget = styled.div`
  font-size: 13px;
  color: rgba(0, 0, 0, 0.45);
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
  margin-left: auto;
`;

const Button = styled.button`
  border: 1px solid #f0f0f0;
  background: white;
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 14px;
  
  &.danger {
    color: #ff4d4f;
    border-color: #ff4d4f;
  }
`;

const SubcategoryList = styled.div`
  margin-left: 40px;
  border-left: 1px solid #f0f0f0;
  padding-left: 16px;
`;

const CategoryCard = ({ category, onEdit, onDelete, onAddSubcategory, onApplyRules }) => {
  return (
    <Card>
      <CategoryHeader>
        <IconCircle $color={category.color}>
          {category.icon}
        </IconCircle>
        <CategoryInfo>
          <CategoryName>{category.name}</CategoryName>
          <CategoryBudget>{category.monthlyBudget}€/month</CategoryBudget>
        </CategoryInfo>
      </CategoryHeader>
      
      <ActionButtons>
        <Button 
          type="text" 
          icon={<EditOutlined />} 
          onClick={() => onEdit(category)}
        >
          Edit
        </Button>
        {!category.parentId && (
          <Button 
            type="text" 
            icon={<PlusCircleOutlined />} 
            onClick={() => onAddSubcategory(category)}
          >
            Add Sub
          </Button>
        )}
        <Button 
          type="text" 
          icon={<ThunderboltOutlined />} 
          onClick={() => onApplyRules(category._id)}
        >
          Apply Rules
        </Button>
        <Button 
          type="text" 
          danger 
          icon={<DeleteOutlined />} 
          onClick={() => onDelete(category._id)}
        >
          Delete
        </Button>
      </ActionButtons>
    </Card>
  );
};

export default CategoryCard; 