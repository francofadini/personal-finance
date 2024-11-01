import { useState, useEffect } from 'react';
import { Table, Card, DatePicker, Select, Space, message } from 'antd';
import styled from 'styled-components';
import Layout from '@/components/Layout';
import { useRouter } from 'next/router';

const { RangePicker } = DatePicker;

const FiltersCard = styled(Card)`
  margin-bottom: 16px;
`;

const TransactionsPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 50,
    total: 0
  });
  const [filters, setFilters] = useState({
    dateRange: null,
    accountId: null,
    categoryId: null
  });
  const [accounts, setAccounts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    loadData();
  }, [filters, pagination.current]);

  const loadData = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: pagination.current,
        limit: pagination.pageSize,
        ...(filters.accountId && { accountId: filters.accountId }),
        ...(filters.categoryId && { categoryId: filters.categoryId }),
        ...(filters.dateRange?.[0] && { startDate: filters.dateRange[0].toISOString() }),
        ...(filters.dateRange?.[1] && { endDate: filters.dateRange[1].toISOString() })
      });

      const response = await fetch(`/api/transactions?${queryParams}`);
      if (!response.ok) throw new Error('Failed to fetch transactions');
      
      const data = await response.json();
      setTransactions(data.transactions);
      setPagination(prev => ({
        ...prev,
        total: data.pagination.total
      }));
    } catch (error) {
      message.error('Error loading transactions');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      render: (date) => new Date(date).toLocaleDateString()
    },
    {
      title: 'Description',
      dataIndex: 'description'
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      render: (amount, record) => `${amount} ${record.currency}`
    },
    {
      title: 'Category',
      dataIndex: ['categoryId', 'name'],
      render: (name, record) => name ? (
        <Space>
          <span style={{ color: record.categoryId.color }}>
            {record.categoryId.icon}
          </span>
          {name}
        </Space>
      ) : 'Uncategorized'
    },
    {
      title: 'Account',
      dataIndex: ['accountId', 'name']
    }
  ];

  return (
    <Layout>
      <FiltersCard>
        <Space>
          <RangePicker 
            value={filters.dateRange}
            onChange={(dates) => setFilters(prev => ({ ...prev, dateRange: dates }))}
          />
          <Select
            placeholder="Select account"
            allowClear
            value={filters.accountId}
            onChange={(value) => setFilters(prev => ({ ...prev, accountId: value }))}
            options={accounts.map(acc => ({ 
              label: acc.name, 
              value: acc._id 
            }))}
          />
          <Select
            placeholder="Select category"
            allowClear
            value={filters.categoryId}
            onChange={(value) => setFilters(prev => ({ ...prev, categoryId: value }))}
            options={categories.map(cat => ({ 
              label: cat.name, 
              value: cat._id 
            }))}
          />
        </Space>
      </FiltersCard>

      <Table
        columns={columns}
        dataSource={transactions}
        rowKey="_id"
        pagination={pagination}
        onChange={(pagination) => setPagination(pagination)}
        loading={loading}
      />
    </Layout>
  );
};

export default TransactionsPage; 