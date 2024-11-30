import React, { useState, useEffect } from 'react';
import { message } from 'antd';
import styled from 'styled-components';
import Layout from '@/components/Layout';
import MobileHeader from '@/components/MobileHeader';
import TransactionList from '@/components/TransactionList';
import TransactionFilters from '@/components/TransactionFilters';
import MainButton from '@/components/MainButton';
import { FilterOutlined } from '@ant-design/icons';

const FiltersButton = styled(MainButton)`
  margin-left: auto;
`;

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    dates: null,
    category: null
  });

  useEffect(() => {
    fetchTransactions();
    fetchCategories();
  }, [filters]);

  const fetchTransactions = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.dates) {
        params.append('startDate', filters.dates[0].toISOString());
        params.append('endDate', filters.dates[1].toISOString());
      }
      if (filters.category) {
        params.append('categoryId', filters.category);
      }

      const response = await fetch(`/api/transactions?${params}`);
      if (!response.ok) throw new Error('Failed to fetch transactions');
      const data = await response.json();
      setTransactions(data.transactions);
    } catch (error) {
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

  return (
    <Layout>
      <MobileHeader
        title="Transactions"
        action={
          <FiltersButton
            icon={<FilterOutlined />}
            onClick={() => setShowFilters(true)}
          >
            Filter
          </FiltersButton>
        }
      />
      
      <TransactionList 
        transactions={transactions}
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