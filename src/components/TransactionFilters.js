import React, { useState } from 'react';
import { DatePicker, Select, Button, Row, Col } from 'antd';
import styled from 'styled-components';
import ModalBottomSheet from './ModalBottomSheet';

const FilterContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const DateContainer = styled.div`
  display: flex;
  gap: 8px;
  
  .ant-picker {
    flex: 1;
    height: 44px;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 8px;
  margin-top: auto;
  padding-top: 16px;
`;

const TransactionFilters = ({ visible, onClose, onApply, categories }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);

  const handleApply = () => {
    onApply({ 
      dates: [startDate, endDate].filter(Boolean), 
      category: selectedCategory,
      subcategory: selectedSubcategory
    });
    onClose();
  };

  const handleClear = () => {
    setStartDate(null);
    setEndDate(null);
    setSelectedCategory(null);
    setSelectedSubcategory(null);
    onApply({ dates: null, category: null, subcategory: null });
    onClose();
  };

  return (
    <ModalBottomSheet title="Filter Transactions" open={visible} onDismiss={onClose}>
      <FilterContainer>
        <DateContainer>
          <DatePicker placeholder="Start date" value={startDate} onChange={setStartDate} />
          <DatePicker placeholder="End date" value={endDate} onChange={setEndDate} />
        </DateContainer>

        <Select
          style={{ width: '100%', height: '44px' }}
          placeholder="Select category"
          onChange={(value) => {
            setSelectedCategory(value);
            setSelectedSubcategory(null);
          }}
          value={selectedCategory}
          allowClear
        >
          {categories.map(category => (
            <Option key={category._id} value={category._id}>
              {category.name}
            </Option>
          ))}
        </Select>

        <Select
          placeholder="Select subcategory"
          disabled={!selectedCategory}
          value={selectedSubcategory}
          onChange={setSelectedSubcategory}
          allowClear
        >
          {categories
            .find(c => c._id === selectedCategory)
            ?.subcategories.map(sub => (
              <Option key={sub._id} value={sub._id}>{sub.name}</Option>
            ))}
        </Select>

        <ButtonRow>
          <Button style={{ flex: 1, height: '44px' }} onClick={handleClear}>
            Clear
          </Button>
          <Button style={{ flex: 3, height: '44px' }} type="primary" onClick={handleApply}>
            Apply Filters
          </Button>
        </ButtonRow>
      </FilterContainer>
    </ModalBottomSheet>
  );
};

export default TransactionFilters; 