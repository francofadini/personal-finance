import React, { useState, useEffect } from 'react';
import { Form, Input, Select, InputNumber, Space, Button } from 'antd';
import styled from 'styled-components';
import { FREQUENCY_PRESETS } from '@/services/recurrentExpenseService';
import { useTranslation } from 'react-i18next';

const StyledForm = styled(Form)`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 24px;

  .ant-btn {
    flex: 1;
    height: 44px;
  }
`;

const RecurrentExpenseForm = ({ 
  onCancel, 
  onSubmit, 
  initialValues = null,
  loading,
  categories = []
}) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  
  // Helper function to compare arrays
  const compareArrays = (a = [], b = []) => {
    if (a.length !== b.length) return false;
    const sortedA = [...a].sort((x, y) => x - y);
    const sortedB = [...b].sort((x, y) => x - y);
    return sortedA.every((val, idx) => val === sortedB[idx]);
  };

  const [selectedPreset, setSelectedPreset] = useState(() => {
    if (initialValues?.months) {
      // Determine preset based on months pattern
      const months = initialValues.months;
      const preset = Object.entries(FREQUENCY_PRESETS).find(([_, p]) => 
        compareArrays(p.months, months)
      );
      return preset ? preset[0] : 'CUSTOM';
    }
    return 'MONTHLY';
  });

  useEffect(() => {
    if (!initialValues) {
      // New expense defaults
      form.setFieldsValue({
        months: FREQUENCY_PRESETS.MONTHLY.months,
        dayOfMonth: new Date().getDate()
      });
    } else {
      // Editing existing expense
      form.setFieldsValue({
        ...initialValues,
        categoryId: initialValues.categoryId._id
      });
    }
  }, [initialValues]);

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
      // Form validation will handle the error display
    }
  };

  return (
    <StyledForm
      form={form}
      layout="vertical"
      initialValues={{
        ...initialValues,
        preset: initialValues?.preset || 'MONTHLY'
      }}
    >
      <Form.Item
        name="name"
        label={t('recurrentExpenses.form.name')}
        rules={[{ required: true, message: t('form.required') }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="estimatedAmount"
        label={t('recurrentExpenses.form.amount')}
        rules={[{ required: true, type: 'number', min: 0 }]}
      >
        <InputNumber 
          style={{ width: '100%' }}
          formatter={value => `${value}€`}
          parser={value => value.replace('€', '')}
          inputMode="decimal"
          keyboard={false}
        />
      </Form.Item>

      <Form.Item name="categoryId" label="Category">
        <Select onChange={(value) => {
          setSelectedCategory(value);
          setSelectedSubcategory(null);
          form.setFieldsValue({ subcategoryId: null });
        }}>
          {categories.map(category => (
            <Select.Option key={category._id} value={category._id}>
              {category.icon} {category.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item name="subcategoryId" label="Subcategory">
        <Select disabled={!selectedCategory}>
          {categories
            .find(c => c._id === selectedCategory)
            ?.subcategories.map(sub => (
              <Select.Option key={sub._id} value={sub._id}>
                {sub.name}
              </Select.Option>
            ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="dayOfMonth"
        label={t('recurrentExpenses.form.day')}
        rules={[{ required: true, type: 'number', min: 1, max: 31 }]}
      >
        <InputNumber 
          style={{ width: '100%' }} 
          min={1} 
          max={31}
          inputMode="numeric"
          keyboard={false}
        />
      </Form.Item>

      <Form.Item label={t('recurrentExpenses.form.frequency')}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Select
            value={selectedPreset}
            onChange={handlePresetChange}
            style={{ width: '100%' }}
          >
            {Object.entries(FREQUENCY_PRESETS).map(([key, preset]) => (
              <Select.Option key={key} value={key}>
                {t(`recurrentExpenses.frequency.${key.toLowerCase()}`)}
              </Select.Option>
            ))}
            <Select.Option value="CUSTOM">{t('recurrentExpenses.frequency.custom')}</Select.Option>
          </Select>

          <Form.Item
            name="months"
            noStyle
            rules={[{ required: true }]}
          >
            <Select
              mode="multiple"
              style={{ width: '100%' }}
              placeholder={t('recurrentExpenses.form.selectMonths')}
              disabled={selectedPreset !== 'CUSTOM'}
            >
              {Array.from({ length: 12 }, (_, i) => (
                <Select.Option key={i + 1} value={i + 1}>
                  {new Date(0, i).toLocaleString('default', { month: 'long' })}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Space>
      </Form.Item>

      <ButtonRow>
        <Button onClick={onCancel}>
          {t('common.cancel')}
        </Button>
        <Button 
          type="primary" 
          onClick={handleSubmit}
          loading={loading}
        >
          {initialValues ? t('common.save') : t('common.create')}
        </Button>
      </ButtonRow>
    </StyledForm>
  );
};

export default RecurrentExpenseForm; 