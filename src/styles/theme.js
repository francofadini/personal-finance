import { theme } from 'antd';

const { defaultAlgorithm, defaultSeed } = theme;

const customTheme = {
  algorithm: defaultAlgorithm,
  token: {
    ...defaultSeed,
    colorPrimary: '#1890ff',
    fontFamily: "'Roboto', sans-serif",
    borderRadius: 50,
  },
};

export default customTheme;
