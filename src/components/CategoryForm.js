import React, { useEffect } from 'react';
import { Form, Input, InputNumber, Select, Modal, ColorPicker, Space, Button, Popover } from 'antd';
import EmojiPicker from 'emoji-picker-react';
import styled from 'styled-components';

const COLORS = [
  '#F7B731', '#8854d0', '#E04443', '#4E74EF', '#20bf6b',
  '#778ca3', '#0fb9b1', '#2d98da', '#B33771', '#6D214F'
];

const StyledForm = styled(Form)`
  .ant-form-item { margin-bottom: 16px; }
`;

const EmojiButton = styled(Button)`
  min-width: 50px;
  height: 50px;
  font-size: 24px;
`;

const CategoryForm = ({ 
  visible, 
  onCancel, 
  onSubmit, 
  initialValues = null,
  parentCategory = null,
  loading 
}) => {
  const [form] = Form.useForm();
  const [showEmojiPicker, setShowEmojiPicker] = React.useState(false);

  useEffect(() => {
    if (visible) {
      if (initialValues) {
        // Editing mode
        form.setFieldsValue({
          name: initialValues.name,
          monthlyBudget: initialValues.monthlyBudget,
          keywords: initialValues.keywords || [],
          color: initialValues.color,
          icon: initialValues.icon
        });
      } else {
        // Creation mode
        form.setFieldsValue({
          name: '',
          monthlyBudget: 0,
          keywords: [],
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          icon: '😀'
        });
      }
    }
  }, [visible, initialValues, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await onSubmit(values);
      form.resetFields();
    } catch (error) {
      message.error('Failed to save category. Please try again.');
    }
  };

  const getTitle = () => {
    if (initialValues) return "Edit Category";
    if (parentCategory) return `New Subcategory for ${parentCategory.name}`;
    return "New Category";
  };

  return (
    <Modal
      title={getTitle()}
      open={visible}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      onOk={handleSubmit}
      confirmLoading={loading}
      destroyOnClose={true}
    >
      <StyledForm form={form} layout="vertical">
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: 'Please input category name!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="monthlyBudget"
          label="Monthly Budget"
          rules={[{ type: 'number', min: 0 }]}
        >
          <InputNumber 
            style={{ width: '100%' }}
            formatter={value => `${value}€`}
            parser={value => value.replace('€', '')}
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

        <Form.Item name="color" label="Color">
          <ColorPicker
            presets={[{ label: 'Recommended', colors: COLORS }]}
            format="hex"
          />
        </Form.Item>

        <Form.Item name="icon" label="Icon">
          <Space direction="vertical" style={{ width: '100%' }}>
            <EmojiButton onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
              {form.getFieldValue('icon') || '😀'}
            </EmojiButton>
            {showEmojiPicker && (
              <Popover
                content={
                  <EmojiPicker
                    onEmojiClick={(emojiData) => {
                      form.setFieldsValue({ icon: emojiData.emoji });
                      setShowEmojiPicker(false);
                    }}
                  />
                }
                trigger="click"
                open={showEmojiPicker}
                onOpenChange={setShowEmojiPicker}
              >
                <div style={{ position: 'absolute', zIndex: 1000 }} />
              </Popover>
            )}
          </Space>
        </Form.Item>
      </StyledForm>
    </Modal>
  );
};

export default CategoryForm; 