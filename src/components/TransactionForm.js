import React, { useState } from 'react';
import { Form, Input, InputNumber, DatePicker, Modal, Select, message } from 'antd';
import styled from 'styled-components';
import CategorySelector from './CategorySelector';
import dayjs from 'dayjs';

const StyledForm = styled(Form)`
  .ant-form-item {
    margin-bottom: 16px;
  }
`;

const TransactionForm = ({ visible, onClose, onSuccess, accounts }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [showCategorySelector, setShowCategorySelector] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          date: values.date.toISOString(),
          categoryId: selectedCategory?.categoryId,
          subcategoryId: selectedCategory?.subcategoryId
        })
      });

      if (!response.ok) throw new Error('Failed to create transaction');
      
      const transaction = await response.json();
      message.success('Transaction created successfully');
      form.resetFields();
      onSuccess?.(transaction);
      onClose();
    } catch (error) {
      message.error('Failed to create transaction');
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySelect = ({ categoryId, subcategoryId }) => {
    setSelectedCategory({ categoryId, subcategoryId });
    setShowCategorySelector(false);
  };

  return (
    <>
      <Modal
        title="Add Transaction"
        open={visible}
        onCancel={onClose}
        onOk={form.submit}
        confirmLoading={loading}
      >
        <StyledForm
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            currency: 'EUR',
            date: dayjs()
          }}
        >
          <Form.Item
            name="accountId"
            label="Account"
            rules={[{ required: true }]}
          >
            <Select>
              {accounts?.map(account => (
                <Select.Option key={account._id} value={account._id}>
                  {account.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="amount"
            label="Amount"
            rules={[{ required: true }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
            />
          </Form.Item>

          <Form.Item
            name="date"
            label="Date"
            rules={[{ required: true }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item label="Category">
            <div onClick={() => setShowCategorySelector(true)} style={{ cursor: 'pointer' }}>
              {selectedCategory ? 
                `${selectedCategory.categoryName} / ${selectedCategory.subcategoryName}` : 
                'Select category'}
            </div>
          </Form.Item>
        </StyledForm>
      </Modal>

      <Modal
        title="Select Category"
        open={showCategorySelector}
        onCancel={() => setShowCategorySelector(false)}
        footer={null}
      >
        <CategorySelector
          onSelect={handleCategorySelect}
        />
      </Modal>
    </>
  );
};

export default TransactionForm; 