import React, { useEffect, useState } from 'react';
import { Form, Input, InputNumber, Select, Modal, Space, Tag, message } from 'antd';
import styled from 'styled-components';
import { FREQUENCY_PRESETS } from '@/services/recurrentExpenseService';

const StyledForm = styled(Form)`
  .ant-form-item { margin-bottom: 16px; }
`;

const MonthsSelect = styled(Select)`
  .month-tag {
    margin: 2px;
    padding: 0 4px;
  }
`;

const MONTHS = [
  { value: 1, label: 'January' },
  { value: 2, label: 'February' },
  { value: 3, label: 'March' },
  { value: 4, label: 'April' },
  { value: 5, label: 'May' },
  { value: 6, label: 'June' },
  { value: 7, label: 'July' },
  { value: 8, label: 'August' },
  { value: 9, label: 'September' },
  { value: 10, label: 'October' },
  { value: 11, label: 'November' },
  { value: 12, label: 'December' }
];

const RecurrentExpenseForm = ({ 
  visible, 
  onCancel, 
  onSubmit, 
  initialValues = null,
  loading,
  categories = [] // We'll need to fetch this
}) => {
  const [form] = Form.useForm();
  const [selectedPreset, setSelectedPreset] = useState(null);

  useEffect(() => {
    if (visible) {
      if (initialValues) {
        form.setFieldsValue({
          name: initialValues.name,
          estimatedAmount: initialValues.estimatedAmount,
          categoryId: initialValues.categoryId._id,
          keywords: initialValues.keywords,
          months: initialValues.months,
          dayOfMonth: initialValues.dayOfMonth
        });
        // Try to detect preset
        const preset = Object.entries(FREQUENCY_PRESETS).find(
          ([_, p]) => p.months.length === initialValues.months.length && 
                      p.months.every(m => initialValues.months.includes(m))
        );
        setSelectedPreset(preset ? preset[0] : 'CUSTOM');
      } else {
        form.setFieldsValue({
          name: '',
          estimatedAmount: 0,
          keywords: [],
          months: FREQUENCY_PRESETS.MONTHLY.months,
          dayOfMonth: 1
        });
        setSelectedPreset('MONTHLY');
      }
    }
  }, [visible, initialValues, form]);

  const handlePresetChange = (preset) => {
    setSelectedPreset(preset);
    if (preset !== 'CUSTOM') {
      form.setFieldsValue({ months: FREQUENCY_PRESETS[preset].months });
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await onSubmit(values);
      form.resetFields();
    } catch (error) {
      message.error('Failed to save recurrent expense. Please try again.');
    }
  };

  return (
    <Modal
      title={initialValues ? "Edit Recurrent Expense" : "New Recurrent Expense"}
      open={visible}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      onOk={handleSubmit}
      confirmLoading={loading}
      width={600}
    >
      <StyledForm form={form} layout="vertical">
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: 'Please input expense name!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="estimatedAmount"
          label="Estimated Amount"
          rules={[{ required: true, type: 'number', min: 0 }]}
        >
          <InputNumber 
            style={{ width: '100%' }}
            formatter={value => `${value}€`}
            parser={value => value.replace('€', '')}
          />
        </Form.Item>

        <Form.Item
          name="categoryId"
          label="Category"
          rules={[{ required: true, message: 'Please select a category!' }]}
        >
          <Select>
            {categories.map(category => (
              <Select.Option key={category._id} value={category._id}>
                <Space>
                  <span style={{ color: category.color }}>{category.icon}</span>
                  {category.fullName}
                </Space>
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="keywords" label="Keywords">
          <Select
            mode="tags"
            style={{ width: '100%' }}
            placeholder="Type and press enter to add keywords"
            tokenSeparators={[',']}
          />
        </Form.Item>

        <Form.Item label="Frequency">
          <Space direction="vertical" style={{ width: '100%' }}>
            <Select
              value={selectedPreset}
              onChange={handlePresetChange}
              style={{ width: '100%' }}
            >
              {Object.entries(FREQUENCY_PRESETS).map(([key, preset]) => (
                <Select.Option key={key} value={key}>
                  {preset.label}
                </Select.Option>
              ))}
              <Select.Option value="CUSTOM">Custom</Select.Option>
            </Select>

            <Form.Item
              name="months"
              noStyle
              rules={[{ 
                required: true,
                message: 'Please select at least one month!' 
              }]}
            >
              <MonthsSelect
                mode="multiple"
                style={{ width: '100%' }}
                placeholder="Select months"
                disabled={selectedPreset !== 'CUSTOM'}
              >
                {MONTHS.map(month => (
                  <Select.Option key={month.value} value={month.value}>
                    {month.label}
                  </Select.Option>
                ))}
              </MonthsSelect>
            </Form.Item>
          </Space>
        </Form.Item>

        <Form.Item
          name="dayOfMonth"
          label="Day of Month"
          rules={[{ 
            required: true,
            type: 'number',
            min: 1,
            max: 31,
            message: 'Please enter a valid day (1-31)!'
          }]}
        >
          <InputNumber style={{ width: '100%' }} />
        </Form.Item>
      </StyledForm>
    </Modal>
  );
};

export default RecurrentExpenseForm; 