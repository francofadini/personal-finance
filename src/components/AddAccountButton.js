import React, { useState, useEffect } from 'react';
import { Select, Spin, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import ModalBottomSheet from './ModalBottomSheet';
import MainButton from './MainButton';

const { Option } = Select;

const COUNTRIES = [
  { code: 'ES', name: 'Spain', emoji: '🇪🇸' },
  { code: 'BE', name: 'Belgium', emoji: '🇧🇪' },
];

const Logo = styled.img`
  width: 20px;
  height: 20px;
  margin-right: 8px;
  vertical-align: middle;
`;

const InstitutionOption = styled.div`
  display: flex;
  align-items: center;
`;

const AddAccountButton = ({ onAccountAdded }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('ES');
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    if (selectedCountry) {
      fetchInstitutions(selectedCountry);
    }
  }, [selectedCountry]);

  const fetchInstitutions = async (countryCode) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/gocardless/institutions?country=${countryCode}`);
      if (!response.ok) {
        throw new Error('Failed to fetch institutions');
      }
      const data = await response.json();
      setInstitutions(data);
    } catch (error) {
      message.error('Failed to fetch institutions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCountryChange = (value) => {
    setSelectedCountry(value);
    setSearchValue('');
  };

  const handleSearch = (value) => {
    setSearchValue(value);
  };

  const filteredInstitutions = institutions.filter((institution) =>
    institution.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleInstitutionSelect = async (institutionId) => {
    try {
      const result = await onAccountAdded(institutionId);
      window.location.href = result.link;
    } catch (error) {
      message.error('Failed to connect to the selected institution. Please try again.');
    }
  };

  const handleDismiss = () => {
    setIsOpen(false);
  };

  return (
    <>
      <MainButton 
        icon={<PlusOutlined />} 
        onClick={() => setIsOpen(true)}
      >
        Add
      </MainButton>
      
      <ModalBottomSheet
        open={isOpen}
        onDismiss={handleDismiss}
        title="Select Institution"
      >
        <Select
          style={{ width: '100%', marginBottom: '16px' }}
          placeholder="Select a country"
          onChange={handleCountryChange}
          value={selectedCountry}
        >
          {COUNTRIES.map((country) => (
            <Option key={country.code} value={country.code}>
              {country.emoji} {country.name}
            </Option>
          ))}
        </Select>

        {loading ? (
          <Spin />
        ) : (
          <Select
            style={{ width: '100%' }}
            placeholder="Select an institution"
            showSearch
            onSearch={handleSearch}
            filterOption={false}
            notFoundContent={searchValue ? 'No institutions found' : null}
            onChange={handleInstitutionSelect}
          >
            {filteredInstitutions.map((institution) => (
              <Option key={institution.id} value={institution.id}>
                <InstitutionOption>
                  {institution.logo && <Logo src={institution.logo} alt={institution.name} />}
                  {institution.name}
                </InstitutionOption>
              </Option>
            ))}
          </Select>
        )}
      </ModalBottomSheet>
    </>
  );
};

export default AddAccountButton;