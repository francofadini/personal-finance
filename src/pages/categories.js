import React, { useState, useEffect } from 'react';
import { Button, message, ButtonGroup } from 'antd';
import { PlusOutlined, ThunderboltOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import Layout from '@/components/Layout';
import MobileHeader from '@/components/MobileHeader';
import CategoryListItem from '@/components/CategoryListItem';
import CategoryForm from '@/components/CategoryForm';
import ModalBottomSheet from '@/components/ModalBottomSheet';
import { categoryService } from '@/services/categoryService';
import { useTranslation } from 'react-i18next';
import MainButton from '@/components/MainButton';

const Container = styled.div`
  padding: 8px;
`;

const SubcategoryList = styled.div`
  margin-left: 52px;
  margin-top: 8px;
`;

const ActionButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CategoriesPage = () => {
  const { t } = useTranslation();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formVisible, setFormVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [parentCategory, setParentCategory] = useState(null);
  const [applying, setApplying] = useState(false);

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

  const handleApplyAllRules = async () => {
    try {
      setApplying(true);
      const response = await fetch('/api/categories/apply-all-rules', {
        method: 'POST'
      });
      
      if (!response.ok) throw new Error('Failed to apply rules');
      
      const data = await response.json();
      const categorized = data.results.reduce((sum, r) => sum + (r.categorized || 0), 0);
      
      message.success(t('categories.applyRules.success', { 
        count: categorized, 
        total: data.total 
      }));
    } catch (error) {
      message.error(t('common.error'));
    } finally {
      setApplying(false);
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
          onApplyRules={handleApplyAllRules}
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
        title={t('categories.title')}
        action={
          <ActionButtons>
            <Button
              type="text"
              icon={<ThunderboltOutlined />}
              onClick={handleApplyAllRules}
              loading={applying}
            />
            <MainButton
              icon={<PlusOutlined />} 
              onClick={() => setFormVisible(true)}
            >
              Add
            </MainButton>
          </ActionButtons>
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