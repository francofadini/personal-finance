import React, { useState } from 'react';
import { DatePicker, Select, Button } from 'antd';
import styled from 'styled-components';
import ModalBottomSheet from './ModalBottomSheet';

const { RangePicker } = DatePicker;
const { Option } = Select;

const FilterContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ApplyButton = styled(Button)`
  margin-top: 16px;
`;

const TransactionFilters = ({ visible, onClose, onApply, categories }) => {
  const [selectedDates, setSelectedDates] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleApply = () => {
    onApply({ dates: selectedDates, category: selectedCategory });
    onClose();
  };

  return (
    <ModalBottomSheet title="Filter Transactions" open={visible} onDismiss={onClose}>
      <FilterContainer>
        <RangePicker
          style={{ width: '100%' }}
          onChange={setSelectedDates}
          value={selectedDates}
        />
        <Select
          style={{ width: '100%' }}
          placeholder="Select a category"
          onChange={setSelectedCategory}
          value={selectedCategory}
          allowClear
        >
          {categories.map(category => (
            <Option key={category._id} value={category._id}>
              {category.name}
            </Option>
          ))}
        </Select>
        <ApplyButton type="primary" onClick={handleApply}>
          Apply Filters
        </ApplyButton>
      </FilterContainer>
    </ModalBottomSheet>
  );
};

export default TransactionFilters; 