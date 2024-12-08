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
      // Load both categories and subcategories
      const [categories, subcategories] = await Promise.all([
        categoryService.list(),
        categoryService.listSubcategories()
      ]);

      // Combine them with proper structure
      const categoriesWithSubs = categories.map(category => ({
        ...category,
        subcategories: subcategories.filter(sub => sub.categoryId === category._id)
      }));

      setCategories(categoriesWithSubs);
    } catch (error) {
      message.error('Error loading categories');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (parentCategory) {
        // Handle subcategory creation/update
        const dataToSubmit = {
          ...values,
          categoryId: parentCategory._id
        };

        if (editingCategory?._id) {
          await categoryService.updateSubcategory(editingCategory._id, dataToSubmit);
          message.success('Subcategory updated successfully');
        } else {
          await categoryService.createSubcategory(dataToSubmit);
          message.success('Subcategory created successfully');
        }
      } else {
        // Handle main category creation/update
        if (editingCategory?._id) {
          await categoryService.update(editingCategory._id, values);
          message.success('Category updated successfully');
        } else {
          await categoryService.create(values);
          message.success('Category created successfully');
        }
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

  const handleDelete = async (category) => {
    try {
      if (category.parentId) {
        await categoryService.deleteSubcategory(category._id);
        message.success('Subcategory deleted successfully');
      } else {
        await categoryService.delete(category._id);
        message.success('Category deleted successfully');
      }
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
        {category.subcategories?.length > 0 && (
          <SubcategoryList>
            {category.subcategories.map(subcat => (
              <CategoryListItem
                key={subcat._id}
                category={subcat}
                onEdit={() => {
                  setEditingCategory(subcat);
                  setParentCategory(category);
                  setFormVisible(true);
                }}
                onDelete={handleDelete}
              />
            ))}
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
        {categories.map(renderCategory)}
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