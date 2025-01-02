import React, { useState, useEffect } from 'react';
import { message, Input, theme, Button } from 'antd';
import styled from 'styled-components';
import Layout from '@/components/Layout';
import MobileHeader from '@/components/MobileHeader';
import TransactionList from '@/components/TransactionList';
import TransactionFilters from '@/components/TransactionFilters';
import MainButton from '@/components/MainButton';
import { FilterOutlined, SearchOutlined, PlusOutlined } from '@ant-design/icons';
import TransactionForm from '@/components/TransactionForm';

const FiltersButton = styled(MainButton)`
  margin-left: auto;
`;

const TransactionsPage = () => {
  const { token } = theme.useToken();
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filters, setFilters] = useState({
    dates: null,
    category: null,
    subcategory: null
  });
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    fetchTransactions();
    fetchCategories();
    fetchAccounts();
  }, [filters]);

  const fetchTransactions = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.dates) {
        if (filters.dates[0]) params.append('startDate', filters.dates[0].format('YYYY-MM-DD'));
        if (filters.dates[1]) params.append('endDate', filters.dates[1].format('YYYY-MM-DD'));
      }
      if (filters.category) params.append('categoryId', filters.category);
      if (filters.subcategory) params.append('subcategoryId', filters.subcategory);

      const response = await fetch(`/api/transactions?${params}`);
      if (!response.ok) throw new Error('Failed to fetch transactions');
      const data = await response.json();
      setTransactions(data.transactions);
    } catch (error) {
      console.error(error);
      message.error('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      message.error('Failed to load categories');
    }
  };

  const fetchAccounts = async () => {
    try {
      const response = await fetch('/api/accounts');
      if (!response.ok) throw new Error('Failed to fetch accounts');
      const data = await response.json();
      setAccounts(data);
    } catch (error) {
      message.error('Failed to load accounts');
    }
  };

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
  };

  const filteredTransactions = transactions.filter(transaction => 
    transaction.description?.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleTransactionUpdate = (updatedTransaction) => {
    setTransactions(currentTransactions => 
      currentTransactions.map(t => 
        t._id === updatedTransaction._id ? updatedTransaction : t
      )
    );
  };

  const handleTransactionCreate = (newTransaction) => {
    setTransactions(current => [newTransaction, ...current]);
  };

  const handleTransactionDelete = (transactionId) => {
    setTransactions(current => 
      current.filter(t => t._id !== transactionId)
    );
  };

  return (
    <Layout>
      <MobileHeader
        title="Transactions"
        action={
          <Button 
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setShowAddForm(true)}
          >
            Add
          </Button>
        }
        showSearch
        searchProps={{
          placeholder: "Search transactions...",
          prefix: <SearchOutlined />,
          onChange: (e) => setSearchText(e.target.value),
          value: searchText,
          allowClear: true
        }}
      />

      <TransactionList 
        transactions={filteredTransactions}
        loading={loading}
        onTransactionUpdate={handleTransactionUpdate}
        onTransactionDelete={handleTransactionDelete}
      />

      <TransactionFilters
        visible={showFilters}
        onClose={() => setShowFilters(false)}
        onApply={handleApplyFilters}
        categories={categories}
      />

      <TransactionForm
        visible={showAddForm}
        onClose={() => setShowAddForm(false)}
        onSuccess={handleTransactionCreate}
        accounts={accounts}
      />
    </Layout>
  );
};

export default TransactionsPage; 