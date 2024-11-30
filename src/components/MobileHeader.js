import React from 'react';
import styled from 'styled-components';
import { Typography, Button, theme } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';

const { Title } = Typography;

const HeaderContainer = styled.div`
  position: sticky;
  top: 0;
  z-index: 19;
  padding: 12px 16px;
  border-bottom: 1px solid ${({ $token }) => $token.colorBorderSecondary};
  background: ${({ $token }) => $token.colorBgContainer};
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

const MobileHeader = ({ title, onBack, action }) => {
  const { token } = theme.useToken();
  
  return (
    <HeaderContainer $token={token}>
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
    </HeaderContainer>
  );
};

export default MobileHeader; 