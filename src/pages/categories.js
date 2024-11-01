import React, { useState, useEffect } from 'react';
import { List, Button, message, Space, Card } from 'antd';
import { PlusOutlined, PlusCircleOutlined } from '@ant-design/icons';
import Layout from '@/components/Layout';
import { categoryService } from '@/services/categoryService';
import styled from 'styled-components';
import CategoryForm from '@/components/CategoryForm';

const AddButton = styled(Button)`
  position: fixed;
  bottom: 80px;
  right: 20px;
`;

const StyledCard = styled(Card)`
  margin-bottom: 16px;
  .ant-card-body {
    padding: 12px 24px;
  }
`;

const CategoryItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  
  .category-icon {
    font-size: 20px;
    min-width: 24px;
    text-align: center;
  }
  
  .category-name {
    flex: 1;
    font-weight: 500;
  }
  
  .category-budget {
    color: #8c8c8c;
    margin-right: 16px;
  }
`;

const SubcategoriesList = styled.div`
  margin-left: 40px;
  margin-top: 8px;
  border-left: 1px solid #f0f0f0;
  padding-left: 16px;
`;

const ActionSpace = styled(Space)`
  margin-top: 8px;
`;

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formVisible, setFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    initialValues: null,
    parentCategory: null
  });
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await categoryService.list();
      setCategories(data);
    } catch (error) {
      message.error('Error loading categories');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    setFormLoading(true);
    try {
      const dataToSubmit = {
        ...values,
        parentId: formData.parentCategory?._id || null
      };

      if (formData.initialValues?._id) {
        await categoryService.update(formData.initialValues._id, dataToSubmit);
        message.success('Category updated successfully');
      } else {
        await categoryService.create(dataToSubmit);
        message.success('Category created successfully');
      }
      
      loadCategories();
      handleCloseForm();
    } catch (error) {
      message.error('Error saving category');
    } finally {
      setFormLoading(false);
    }
  };

  const handleCloseForm = () => {
    setFormVisible(false);
    setFormData({ initialValues: null, parentCategory: null });
  };

  const handleEdit = (category) => {
    setFormData({
      initialValues: category,
      parentCategory: null
    });
    setFormVisible(true);
  };

  const handleAddSubcategory = (parentCategory) => {
    setFormData({
      initialValues: null,
      parentCategory
    });
    setFormVisible(true);
  };

  const handleDelete = async (categoryId) => {
    try {
      await categoryService.delete(categoryId);
      message.success('Category deleted successfully');
      loadCategories();
    } catch (error) {
      message.error('Error deleting category');
    }
  };

  const renderCategory = (category) => {
    const subcategories = categories.filter(cat => cat.parentId === category._id);
    
    return (
      <StyledCard key={category._id}>
        <CategoryItem>
          <span className="category-icon" style={{ color: category.color }}>
            {category.icon}
          </span>
          <span className="category-name">{category.name}</span>
          <span className="category-budget">{category.monthlyBudget}€</span>
          <ActionSpace>
            {category.parentId === null && <Button 
              size="small"
              icon={<PlusCircleOutlined />}
              onClick={() => handleAddSubcategory(category)}
            >
              Add Subcategory
            </Button>}
            <Button 
              size="small"
              onClick={() => handleEdit(category)}
            >
              Edit
            </Button>
            <Button 
              size="small" 
              danger 
              onClick={() => handleDelete(category._id)}
            >
              Delete
            </Button>
          </ActionSpace>
        </CategoryItem>
        {subcategories.length > 0 && (
          <SubcategoriesList>
            {subcategories.map(subcat => renderCategory(subcat))}
          </SubcategoriesList>
        )}
      </StyledCard>
    );
  };

  return (
    <Layout>
      <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
        {categories
          .filter(cat => !cat.parentId)
          .map(category => renderCategory(category))
        }
      </div>
      <AddButton 
        type="primary" 
        icon={<PlusOutlined />} 
        shape="circle" 
        size="large"
        onClick={() => {
          setFormData({ initialValues: null, parentCategory: null });
          setFormVisible(true);
        }}
      />
      <CategoryForm
        visible={formVisible}
        onCancel={handleCloseForm}
        onSubmit={handleSubmit}
        initialValues={formData.initialValues}
        parentCategory={formData.parentCategory}
        loading={formLoading}
      />
    </Layout>
  );
};

export default CategoriesPage; 