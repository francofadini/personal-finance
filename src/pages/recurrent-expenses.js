import React, { useState, useEffect } from 'react';
import { Card, Button, message, Spin, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import Layout from '@/components/Layout';
import { recurrentExpenseService, FREQUENCY_PRESETS } from '@/services/recurrentExpenseService';
import styled from 'styled-components';
import RecurrentExpenseForm from '@/components/RecurrentExpenseForm';
import { categoryService } from '@/services/categoryService';

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

const ExpenseItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  .expense-name {
    flex: 1;
    font-weight: 500;
  }

  .expense-amount {
    font-size: 1.1em;
    color: #52c41a;
  }

  .expense-category {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .expense-months {
    display: flex;
    gap: 4px;
    flex-wrap: wrap;
  }
`;

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const RecurrentExpensesPage = () => {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formVisible, setFormVisible] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [expensesData, categoriesData] = await Promise.all([
        recurrentExpenseService.list(),
        categoryService.list()
      ]);
      setExpenses(expensesData);
      
      const processedCategories = categoriesData.map(category => {
        if (!category.parentId) {
          return { ...category, fullName: category.name };
        }
        
        const parent = categoriesData.find(c => c._id === category.parentId);
        return {
          ...category,
          fullName: parent ? `${parent.name} / ${category.name}` : category.name
        };
      });
      
      setCategories(processedCategories);
    } catch (error) {
      message.error('Error loading data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    setFormLoading(true);
    try {
      if (editingExpense) {
        await recurrentExpenseService.update(editingExpense._id, values);
      } else {
        await recurrentExpenseService.create(values);
      }
      message.success(`Expense ${editingExpense ? 'updated' : 'created'} successfully`);
      loadData();
      handleCloseForm();
    } catch (error) {
      message.error('Error saving expense');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await recurrentExpenseService.delete(id);
      message.success('Expense deleted successfully');
      loadData();
    } catch (error) {
      message.error('Error deleting expense');
    }
  };

  const handleCloseForm = () => {
    setFormVisible(false);
    setEditingExpense(null);
  };

  const getFrequencyLabel = (months) => {
    const preset = Object.values(FREQUENCY_PRESETS).find(
      p => p.months.length === months.length && 
          p.months.every(m => months.includes(m))
    );
    return preset ? preset.label : 'Custom';
  };

  const renderExpense = (expense) => (
    <StyledCard
      key={expense._id}
      actions={[
        <Button key="edit" onClick={() => {
          setEditingExpense(expense);
          setFormVisible(true);
        }}>
          Edit
        </Button>,
        <Button key="delete" danger onClick={() => handleDelete(expense._id)}>
          Delete
        </Button>
      ]}
    >
      <ExpenseItem>
        <div className="expense-name">{expense.name}</div>
        <div className="expense-amount">
          {expense.estimatedAmount.toFixed(2)}€
          {expense.lastMatchedTransaction && (
            <Tag color="blue" style={{ marginLeft: 8 }}>
              Last: {expense.lastMatchedTransaction.amount.toFixed(2)}€
            </Tag>
          )}
        </div>
        <div className="expense-category">
          <span style={{ color: expense.categoryId.color }}>
            {expense.categoryId.icon}
          </span>
          {expense.categoryId.name}
        </div>
        <div>Day: {expense.dayOfMonth}</div>
        <div className="expense-months">
          <Tag color="green">{getFrequencyLabel(expense.months)}</Tag>
          {expense.months.map(m => (
            <Tag key={m} color="blue">{MONTHS[m-1]}</Tag>
          ))}
        </div>
      </ExpenseItem>
    </StyledCard>
  );

  return (
    <Layout>
      <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <Spin size="large" />
          </div>
        ) : (
          expenses.map(renderExpense)
        )}
      </div>
      <AddButton 
        type="primary" 
        icon={<PlusOutlined />} 
        shape="circle" 
        size="large"
        onClick={() => setFormVisible(true)}
      />
      <RecurrentExpenseForm
        visible={formVisible}
        onCancel={handleCloseForm}
        onSubmit={handleSubmit}
        initialValues={editingExpense}
        categories={categories}
        loading={formLoading}
      />
    </Layout>
  );
};

export default RecurrentExpensesPage; 