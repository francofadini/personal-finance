import React, { useState } from 'react';
import { Form, Input, InputNumber, Select, Button } from 'antd';
import styled from 'styled-components';
import EmojiPicker from 'emoji-picker-react';
import ModalBottomSheet from './ModalBottomSheet';

const StyledForm = styled(Form)`
  .ant-form-item:last-child {
    margin-bottom: 0;
  }
`;

const EmojiButton = styled(Button)`
  width: 44px;
  height: 44px;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 8px;
  margin-top: auto;
  padding-top: 16px;

  .ant-btn {
    flex: 1;
    height: 44px;
  }
`;

const CategoryForm = ({ 
  initialValues = null,
  parentCategory = null,
  onSubmit,
  onCancel
}) => {
  const [form] = Form.useForm();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const isSubcategory = !!parentCategory || initialValues?.parentId;

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values);
    } catch (error) {
      // Form validation error
    }
  };

  const handleEmojiSelect = (emojiData) => {
    form.setFieldsValue({ icon: emojiData.emoji });
    setShowEmojiPicker(false);
  };

  const handleBudgetChange = (e) => {
    const value = e.target.value.replace(/[^0-9.]/g, '');
    if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
      form.setFieldsValue({ monthlyBudget: value });
    }
  };

  return (
    <>
      <StyledForm
        form={form}
        layout="vertical"
        initialValues={initialValues}
      >
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: 'Please input category name!' }]}
        >
          <Input placeholder="Category name" />
        </Form.Item>

        {!isSubcategory && (
          <Form.Item
            name="icon"
            label="Icon"
            rules={[{ required: !isSubcategory, message: 'Please select an icon!' }]}
          >
            <EmojiButton onClick={() => setShowEmojiPicker(true)}>
              {form.getFieldValue('icon') || '🏷️'}
            </EmojiButton>
          </Form.Item>
        )}

        <Form.Item
          name="monthlyBudget"
          label="Monthly Budget"
          rules={[{ 
            validator: (_, value) => {
              if (!value || value >= 0) return Promise.resolve();
              return Promise.reject('Budget must be a positive number');
            }
          }]}
        >
          <Input
            style={{ width: '100%' }}
            placeholder="0"
            type="number"
            inputMode="decimal"
            pattern="[0-9]*"
            onChange={handleBudgetChange}
            suffix="€"
          />
        </Form.Item>

        <Form.Item name="keywords" label="Keywords">
          <Select
            mode="tags"
            style={{ width: '100%' }}
            placeholder="Type and press enter to add keywords"
            tokenSeparators={[',']}
          />
        </Form.Item>

        <ButtonRow>
          <Button onClick={onCancel}>
            Cancel
          </Button>
          <Button type="primary" onClick={handleSubmit}>
            {initialValues ? 'Update' : 'Create'}
          </Button>
        </ButtonRow>
      </StyledForm>

      <ModalBottomSheet
        open={showEmojiPicker}
        onDismiss={() => setShowEmojiPicker(false)}
        title="Select Icon"
      >
        <EmojiPicker
          onEmojiClick={handleEmojiSelect}
          width="100%"
          height="400px"
          searchPlaceholder="Search emoji..."
          previewConfig={{ showPreview: false }}
          skinTonesDisabled
          categories={[
            {
              name: "Smileys & People",
              category: "smileys_people"
            },
            {
              name: "Animals & Nature",
              category: "animals_nature"
            },
            {
              name: "Food & Drink",
              category: "food_drink"
            },
            {
              name: "Travel & Places",
              category: "travel_places"
            },
            {
              name: "Activities",
              category: "activities"
            },
            {
              name: "Objects",
              category: "objects"
            },
            {
              name: "Symbols",
              category: "symbols"
            }
          ]}
        />
      </ModalBottomSheet>
    </>
  );
};

export default CategoryForm; 