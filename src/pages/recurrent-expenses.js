import React, { useState, useEffect } from 'react';
import { message, Spin, theme } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import Layout from '@/components/Layout';
import MobileHeader from '@/components/MobileHeader';
import RecurrentExpenseListItem from '@/components/RecurrentExpenseListItem';
import RecurrentExpenseForm from '@/components/RecurrentExpenseForm';
import ModalBottomSheet from '@/components/ModalBottomSheet';
import MainButton from '@/components/MainButton';
import { recurrentExpenseService } from '@/services/recurrentExpenseService';
import { categoryService } from '@/services/categoryService';
import { useTranslation } from 'react-i18next';
import { formatCurrency } from '@/utils/formater';

const Container = styled.div`
  padding: 8px;
  padding-bottom: calc(56px + env(safe-area-inset-bottom, 0px));
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 200px);
  text-align: center;
  color: rgba(0, 0, 0, 0.45);
`;

const CategoryGroup = styled.div`
  margin-bottom: 24px;
`;

const CategoryHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  margin-bottom: 8px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
`;

const CategoryIcon = styled.span`
  font-size: 16px;
`;

const CategoryName = styled.span`
  font-size: 14px;
`;

const CategoryTotal = styled.span`
  margin-left: auto;
  color: ${({ $token }) => $token.colorTextTertiary};
  font-weight: 500;
  font-size: 14px;
`;

const RecurrentExpensesPage = () => {
  const { t } = useTranslation();
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formVisible, setFormVisible] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const { token } = theme.useToken();

  const loadData = async () => {
    try {
      const [expensesData, categoriesData] = await Promise.all([
        recurrentExpenseService.list(),
        categoryService.list()
      ]);
      setExpenses(expensesData);
      setCategories(categoriesData);
    } catch (error) {
      message.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (values) => {
    setFormLoading(true);
    try {
      if (editingExpense) {
        await recurrentExpenseService.update(editingExpense._id, values);
        message.success(t('recurrentExpenses.messages.updateSuccess'));
      } else {
        await recurrentExpenseService.create(values);
        message.success(t('recurrentExpenses.messages.createSuccess'));
      }
      setFormVisible(false);
      setEditingExpense(null);
      loadData();
    } catch (error) {
      message.error(t('recurrentExpenses.messages.error'));
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setFormVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await recurrentExpenseService.delete(id);
      message.success('Expense deleted successfully');
      loadData();
    } catch (error) {
      message.error('Failed to delete expense');
    }
  };

  const headerAction = (
    <MainButton
      icon={<PlusOutlined />}
      onClick={() => setFormVisible(true)}
    >
      Add
    </MainButton>
  );

  const groupExpensesByCategory = (expenses) => {
    return expenses.reduce((groups, expense) => {
      const categoryId = expense.categoryId._id;
      if (!groups[categoryId]) {
        groups[categoryId] = {
          category: expense.categoryId,
          expenses: [],
          total: 0
        };
      }
      groups[categoryId].expenses.push(expense);
      groups[categoryId].total += expense.estimatedAmount;
      return groups;
    }, {});
  };

  const sortedGroups = (groups) => {
    return Object.values(groups).sort((a, b) => {
      // Sort by category name
      return a.category.name.localeCompare(b.category.name);
    });
  };

  if (loading) {
    return (
      <Layout>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <Spin size="large" />
        </div>
      </Layout>
    );
  }

  const groupedExpenses = groupExpensesByCategory(expenses);
  const sortedGroupedExpenses = sortedGroups(groupedExpenses);

  return (
    <Layout>
      <MobileHeader 
        title={t('recurrentExpenses.title')} 
        action={headerAction}
      />
      
      <Container>
        {expenses.length === 0 ? (
          <EmptyState>
            <p>{t('recurrentExpenses.empty')}</p>
          </EmptyState>
        ) : (
          sortedGroupedExpenses.map(({ category, expenses, total }) => (
            <CategoryGroup key={category._id}>
              <CategoryHeader>
                <CategoryIcon style={{ color: category.color }}>
                  {category.icon}
                </CategoryIcon>
                <CategoryName>{category.name}</CategoryName>
                <CategoryTotal $token={token}>
                  -{formatCurrency(total)}
                </CategoryTotal>
              </CategoryHeader>
              {expenses
                .sort((a, b) => a.name.localeCompare(b.name))
                .map(expense => (
                  <RecurrentExpenseListItem
                    key={expense._id}
                    expense={expense}
                    onEdit={() => handleEdit(expense)}
                    onDelete={() => handleDelete(expense._id)}
                  />
                ))}
            </CategoryGroup>
          ))
        )}
      </Container>

      <ModalBottomSheet
        open={formVisible}
        onDismiss={() => {
          setFormVisible(false);
          setEditingExpense(null);
        }}
        title={editingExpense ? t('recurrentExpenses.edit') : t('recurrentExpenses.new')}
      >
        <RecurrentExpenseForm
          visible={formVisible}
          initialValues={editingExpense}
          onSubmit={handleSubmit}
          onCancel={() => {
            setFormVisible(false);
            setEditingExpense(null);
          }}
          categories={categories}
          loading={formLoading}
        />
      </ModalBottomSheet>
    </Layout>
  );
};

export default RecurrentExpensesPage; 