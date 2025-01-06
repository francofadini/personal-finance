import React, { useState, useEffect } from 'react';
import { Spin, theme } from 'antd';
import styled from 'styled-components';
import Layout from '@/components/Layout';
import MobileHeader from '@/components/MobileHeader';
import { useTranslation } from 'react-i18next';
import { formatCurrency } from '@/utils/formater';

const Container = styled.div`
  padding: 16px;
`;

const MetricCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
`;

const MetricTitle = styled.div`
  font-size: 14px;
  color: rgba(0, 0, 0, 0.45);
  margin-bottom: 8px;
`;

const MetricValue = styled.div`
  font-size: 24px;
  font-weight: 600;
`;

const MetricInfo = styled.div`
  font-size: 13px;
  color: rgba(0, 0, 0, 0.45);
  margin-top: 4px;
`;

const ProgressBar = styled.div`
  height: 24px;
  background: ${({ $token }) => $token.colorFillSecondary};
  border-radius: 12px;
  position: relative;
  overflow: hidden;
  margin: 8px 0;
`;

const ProgressFill = styled.div`
  height: 100%;
  width: ${props => props.$percent}%;
  background: ${props => props.$status === 'exception' ? '#ff4d4f' : 
    props.$status === 'warning' ? '#faad14' : '#52c41a'};
  position: absolute;
  left: 0;
  top: 0;
  transition: width 0.3s ease;
`;

const ExpectedProgress = styled.div`
  height: 100%;
  width: ${props => props.$percent}%;
  background: rgba(0, 0, 0, 0.04);
  position: absolute;
  left: 0;
  top: 0;
  border-right: 2px dashed rgba(0, 0, 0, 0.15);
`;

const ProgressLabels = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
  font-size: 12px;
  z-index: 1;
  color: rgba(0, 0, 0, 0.65);
`;

const CategoryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
  font-size: 14px;
`;

const CategoryName = styled.span`
  color: rgba(0, 0, 0, 0.85);
`;

const CategoryAmount = styled.span`
  color: rgba(0, 0, 0, 0.65);
`;

const HomePage = () => {
  const { t } = useTranslation();
  const { token } = theme.useToken();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    monthlyTotal: 0,
    monthlyProgress: 0,
    monthlyDaysDiff: 0,
    weeklyProgress: 0,
    weeklyDaysDiff: 0,
    expectedMonthlyProgress: 0,
    expectedWeeklyProgress: 0,
    topCategories: []
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const response = await fetch('/api/dashboard');
      if (!response.ok) throw new Error('Failed to load dashboard data');
      const data = await response.json();
      setDashboardData(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getProgressStatus = (actual, expected) => {
    if (actual < 0) return 'exception';
    if (actual > expected * 1.1) return 'exception';
    if (actual > expected) return 'warning';
    return 'normal';
  };

  const renderProgressLabels = (actual, expected) => (
    <ProgressLabels>
      <span>{Math.round(actual)}%</span>
      <span>{Math.round(expected)}%</span>
    </ProgressLabels>
  );

  if (loading) {
    return (
      <Layout>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <Spin size="large" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <MobileHeader title={t('dashboard.title')} />
      <Container>
        <MetricCard>
          <MetricTitle>{t('dashboard.monthlySpent')}</MetricTitle>
          <MetricValue>{formatCurrency(dashboardData.monthlyTotal)}</MetricValue>
        </MetricCard>

        <MetricCard>
          <MetricTitle>{t('dashboard.monthlyProgress')}</MetricTitle>
          <ProgressBar $token={token}>
            <ExpectedProgress $percent={dashboardData.expectedMonthlyProgress} />
            <ProgressFill 
              $percent={dashboardData.monthlyProgress}
              $status={getProgressStatus(dashboardData.monthlyProgress, dashboardData.expectedMonthlyProgress)}
            />
            {renderProgressLabels(dashboardData.monthlyProgress, dashboardData.expectedMonthlyProgress)}
          </ProgressBar>
          <MetricInfo>
            {Math.abs(dashboardData.monthlyDaysDiff)} days 
            {dashboardData.monthlyDaysDiff > 0 ? ' ahead' : ' behind'}
          </MetricInfo>
        </MetricCard>

        <MetricCard>
          <MetricTitle>{t('dashboard.weeklyProgress')}</MetricTitle>
          <ProgressBar $token={token}>
            <ExpectedProgress $percent={dashboardData.expectedWeeklyProgress} />
            <ProgressFill 
              $percent={dashboardData.weeklyProgress}
              $status={getProgressStatus(dashboardData.weeklyProgress, dashboardData.expectedWeeklyProgress)}
            />
            {renderProgressLabels(dashboardData.weeklyProgress, dashboardData.expectedWeeklyProgress)}
          </ProgressBar>
          <MetricInfo>
            {Math.abs(dashboardData.weeklyDaysDiff)} days 
            {dashboardData.weeklyDaysDiff > 0 ? ' ahead' : ' behind'}
          </MetricInfo>
        </MetricCard>

        <MetricCard>
          <MetricTitle>{t('dashboard.topCategories')}</MetricTitle>
          {dashboardData.topCategories
            .filter(category => category.budget > 0)
            .map(category => (
              <div key={category._id} style={{ marginBottom: 16 }}>
                <CategoryHeader>
                  <CategoryName>{category.name}</CategoryName>
                  <CategoryAmount>
                    {formatCurrency(category.spent)} / {formatCurrency(category.budget)}
                  </CategoryAmount>
                </CategoryHeader>
                <ProgressBar $token={token}>
                  <ExpectedProgress $percent={dashboardData.expectedMonthlyProgress} />
                  <ProgressFill 
                    $percent={category.percentage}
                    $status={getProgressStatus(category.percentage, dashboardData.expectedMonthlyProgress)}
                    style={{ 
                      background: category.color.startsWith('#') ? category.color : `#${category.color}` 
                    }}
                  />
                  {renderProgressLabels(category.percentage, dashboardData.expectedMonthlyProgress)}
                </ProgressBar>
              </div>
            ))}
        </MetricCard>
      </Container>
    </Layout>
  );
};

export default HomePage;