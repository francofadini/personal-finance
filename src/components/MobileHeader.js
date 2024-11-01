import React from 'react';
import styled from 'styled-components';
import { Typography } from 'antd';

const { Title } = Typography;

const HeaderContainer = styled.div`
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background-color: #fff;
  border-bottom: 1px solid #f0f0f0;
`;

const TitleWrapper = styled.div`
  flex: 1;
`;

const StyledTitle = styled(Title).attrs({ level: 4 })`
  margin: 0 !important;
`;

const ActionsWrapper = styled.div`
  display: flex;
  gap: 8px;
`;

const MobileHeader = ({ title, extra }) => {
  return (
    <HeaderContainer>
      <TitleWrapper>
        <StyledTitle>{title}</StyledTitle>
      </TitleWrapper>
      {extra && <ActionsWrapper>{extra}</ActionsWrapper>}
    </HeaderContainer>
  );
};

export default MobileHeader; 