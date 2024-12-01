import React from 'react';
import styled from 'styled-components';
import { Typography, Button, Input, theme } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';

const { Title } = Typography;

const HeaderContainer = styled.div`
  position: sticky;
  top: 0;
  z-index: 19;
  background: ${({ $token }) => $token.colorBgContainer};
  border-bottom: 1px solid ${({ $token }) => $token.colorBorderSecondary};
`;

const HeaderContent = styled.div`
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 32px;
  position: relative;
`;

const BackButtonWrapper = styled.div`
  position: absolute;
  left: 0;
`;

const ActionWrapper = styled.div`
  position: absolute;
  right: 0;
`;

const BackButton = styled(Button)`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  
  .anticon {
    color: ${() => {
      const { token } = theme.useToken();
      return token.colorPrimary;
    }};
  }
`;

const SearchContainer = styled.div`
  padding: 0 16px 12px;
`;

const StyledSearch = styled(Input)`
  background: ${({ $token }) => $token.colorFillTertiary};
  border-radius: 8px;
  border: none;
  padding: 8px 12px;
  height: 40px;
  
  .ant-input {
    background: transparent;
    &::placeholder {
      color: ${({ $token }) => $token.colorTextPlaceholder};
    }
  }
`;

const MobileHeader = ({ title, onBack, action, showSearch, searchProps }) => {
  const { token } = theme.useToken();
  
  return (
    <HeaderContainer $token={token}>
      <HeaderContent>
        <TopRow>
          {onBack && (
            <BackButtonWrapper>
              <BackButton onClick={onBack}>
                <ArrowLeftOutlined />
              </BackButton>
            </BackButtonWrapper>
          )}
          {action && <ActionWrapper>{action}</ActionWrapper>}
        </TopRow>
        <Title level={4} style={{ margin: 0 }}>{title}</Title>
      </HeaderContent>
      {showSearch && (
        <SearchContainer>
          <StyledSearch $token={token} {...searchProps} />
        </SearchContainer>
      )}
    </HeaderContainer>
  );
};

export default MobileHeader; 