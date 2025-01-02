import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { List, Typography } from 'antd';

const CategoryItem = styled.div`
  padding: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  border-radius: 8px;

  &:hover {
    background: #f5f5f5;
  }

  ${props => props.$selected && `
    background: #e6f7ff;
    &:hover {
      background: #e6f7ff;
    }
  `}
`;

const IconCircle = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
`;

const SubcategoryList = styled.div`
  margin-left: 44px;
`;

const CategorySelector = ({ selectedCategoryId, selectedSubcategoryId, onSelect }) => {
  const [categories, setCategories] = useState([]);
  const [expandedCategory, setExpandedCategory] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const handleCategoryClick = (category) => {
    if (category.subcategories?.length) {
      setExpandedCategory(expandedCategory === category._id ? null : category._id);
    } else {
      // If no subcategories, select the default subcategory
      onSelect({
        categoryId: category._id,
        subcategoryId: category.defaultSubcategoryId
      });
    }
  };

  const handleSubcategoryClick = (category, subcategory) => {
    onSelect({
      categoryId: category._id,
      subcategoryId: subcategory._id
    });
  };

  return (
    <List
      dataSource={categories}
      renderItem={category => (
        <>
          <CategoryItem
            $selected={category._id === selectedCategoryId}
            onClick={() => handleCategoryClick(category)}
          >
            <IconCircle>{category.icon}</IconCircle>
            <Typography.Text strong>{category.name}</Typography.Text>
          </CategoryItem>

          {expandedCategory === category._id && (
            <SubcategoryList>
              {category.subcategories?.map(subcategory => (
                <CategoryItem
                  key={subcategory._id}
                  $selected={subcategory._id === selectedSubcategoryId}
                  onClick={() => handleSubcategoryClick(category, subcategory)}
                >
                  <Typography.Text>{subcategory.name}</Typography.Text>
                </CategoryItem>
              ))}
            </SubcategoryList>
          )}
        </>
      )}
    />
  );
};

export default CategorySelector; 