import React from 'react';
import styled from 'styled-components';
import { Button } from 'antd';

const StyledButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 8px;
  border-radius: 50px;
`;

const MainButton = ({ icon, children, ...props }) => {
  return (
    <StyledButton type="primary" {...props}>
      {children}
      {icon}
    </StyledButton>
  );
};

export default MainButton; 