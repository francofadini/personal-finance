import React, { useState, useEffect } from 'react';
import { message, Input, theme, Button } from 'antd';
import styled from 'styled-components';
import Layout from '@/components/Layout';
import MobileHeader from '@/components/MobileHeader';
import TransactionList from '@/components/TransactionList';
import TransactionFilters from '@/components/TransactionFilters';
import MainButton from '@/components/MainButton';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import TransactionForm from '@/components/TransactionForm';

const FiltersButton = styled(MainButton)`
  margin-left: auto;
`;

const TransactionsPage = () => {
  const { token } = theme.useToken();
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filters, setFilters] = useState({
    dates: null,
    category: null,
    subcategory: null
  });
  const [accounts, setAccounts] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 50,
    total: 0
  });
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    setPage(1);
    fetchTransactions(1);
    fetchCategories();
    fetchAccounts();
  }, [filters]);

  const fetchTransactions = async (pageNum = page) => {
    if (loading) return;
    
    try {
      setLoading(true);
      console.log('Fetching page:', pageNum);
      
      const params = new URLSearchParams();
      params.append('page', pageNum);
      params.append('limit', 50);
      if (filters.dates) {
        if (filters.dates[0]) params.append('startDate', filters.dates[0].format('YYYY-MM-DD'));
        if (filters.dates[1]) params.append('endDate', filters.dates[1].format('YYYY-MM-DD'));
      }
      if (filters.category) params.append('categoryId', filters.category);
      if (filters.subcategory) params.append('subcategoryId', filters.subcategory);

      const response = await fetch(`/api/transactions?${params}`);
      if (!response.ok) throw new Error('Failed to fetch transactions');
      const data = await response.json();
      console.log('Fetched transactions:', data.transactions.length);
      
      setTransactions(prev => 
        pageNum === 1 ? data.transactions : [...prev, ...data.transactions]
      );
      setHasMore(data.transactions.length === 50);
      setPage(pageNum);
    } catch (error) {
      console.error('Fetch error:', error);
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

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, current: page }));
  };

  const handleLoadMore = () => {
    if (!hasMore || loading) return;
    fetchTransactions(page + 1);
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
        hasMore={hasMore}
        onLoadMore={handleLoadMore}
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