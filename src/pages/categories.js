import React, { useState, useEffect } from 'react';
import { Button, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import Layout from '@/components/Layout';
import MobileHeader from '@/components/MobileHeader';
import CategoryListItem from '@/components/CategoryListItem';
import CategoryForm from '@/components/CategoryForm';
import ModalBottomSheet from '@/components/ModalBottomSheet';
import { categoryService } from '@/services/categoryService';

const Container = styled.div`
  padding: 8px;
`;

const SubcategoryList = styled.div`
  margin-left: 52px;
  margin-top: 8px;
`;

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formVisible, setFormVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [parentCategory, setParentCategory] = useState(null);

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
    try {
      const dataToSubmit = {
        ...values,
        parentId: parentCategory?._id || null
      };

      if (editingCategory?._id) {
        await categoryService.update(editingCategory._id, dataToSubmit);
        message.success('Category updated successfully');
      } else {
        await categoryService.create(dataToSubmit);
        message.success('Category created successfully');
      }
      
      loadCategories();
      handleCloseForm();
    } catch (error) {
      message.error('Error saving category');
    }
  };

  const handleCloseForm = () => {
    setFormVisible(false);
    setEditingCategory(null);
    setParentCategory(null);
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

  const handleApplyRules = async (categoryId) => {
    try {
      const response = await fetch(`/api/categories/${categoryId}/apply-rules`, {
        method: 'POST'
      });
      if (!response.ok) throw new Error('Failed to apply rules');
      const result = await response.json();
      message.success(`Categorized ${result.categorized} transactions`);
    } catch (error) {
      message.error('Error applying category rules');
    }
  };

  const renderCategory = (category) => {
    const subcategories = categories.filter(cat => cat.parentId === category._id);
    
    return (
      <div key={category._id}>
        <CategoryListItem
          category={category}
          onEdit={() => {
            setEditingCategory(category);
            setFormVisible(true);
          }}
          onDelete={handleDelete}
          onAddSub={() => {
            setParentCategory(category);
            setFormVisible(true);
          }}
          onApplyRules={handleApplyRules}
        />
        {subcategories.length > 0 && (
          <SubcategoryList>
            {subcategories.map(subcat => renderCategory(subcat))}
          </SubcategoryList>
        )}
      </div>
    );
  };

  return (
    <Layout>
      <MobileHeader
        title="Categories"
        action={
          <Button 
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setFormVisible(true)}
          >
            Add
          </Button>
        }
      />
      
      <Container>
        {categories
          .filter(cat => !cat.parentId)
          .map(renderCategory)}
      </Container>

      <ModalBottomSheet
        title={`${editingCategory ? 'Edit' : 'Add'} Category`}
        open={formVisible}
        onDismiss={handleCloseForm}
      >
        <CategoryForm
          initialValues={editingCategory}
          parentCategory={parentCategory}
          onSubmit={handleSubmit}
          onCancel={handleCloseForm}
        />
      </ModalBottomSheet>
    </Layout>
  );
};

export default CategoriesPage; 