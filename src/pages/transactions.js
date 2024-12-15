import React, { useState, useEffect } from 'react';
import { message, Input, theme } from 'antd';
import styled from 'styled-components';
import Layout from '@/components/Layout';
import MobileHeader from '@/components/MobileHeader';
import TransactionList from '@/components/TransactionList';
import TransactionFilters from '@/components/TransactionFilters';
import MainButton from '@/components/MainButton';
import { FilterOutlined, SearchOutlined } from '@ant-design/icons';

const FiltersButton = styled(MainButton)`
  margin-left: auto;
`;

const TransactionsPage = () => {
  const { token } = theme.useToken();
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filters, setFilters] = useState({
    dates: null,
    category: null,
    subcategory: null
  });

  useEffect(() => {
    fetchTransactions();
    fetchCategories();
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

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
  };

  const filteredTransactions = transactions.filter(transaction => 
    transaction.description?.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <Layout>
      <MobileHeader
        title="Transactions"
        action={
          <FiltersButton
            icon={<FilterOutlined />}
            onClick={() => setShowFilters(true)}
            onApply={handleApplyFilters}
          >
            Filter
          </FiltersButton>
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
      />

      <TransactionFilters
        visible={showFilters}
        onClose={() => setShowFilters(false)}
        onApply={handleApplyFilters}
        categories={categories}
      />
    </Layout>
  );
};

export default TransactionsPage; 