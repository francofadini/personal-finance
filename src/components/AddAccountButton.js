import React, { useState, useEffect } from 'react';
import { Button, Modal, Select, Spin, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const { Option } = Select;

const COUNTRIES = [
  { code: 'ES', name: 'Spain', emoji: '🇪🇸' },
  { code: 'BE', name: 'Belgium', emoji: '🇧🇪' },
];

const DEFAULT_COUNTRY = 'ES';

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
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(DEFAULT_COUNTRY);
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    if (selectedCountry) {
      fetchInstitutions(selectedCountry);
    }
  }, [selectedCountry]);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSearchValue('');
  };

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
      console.error('Error fetching institutions:', error);
      // You might want to show an error message to the user here
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
      console.error('Error creating requisition:', error);
      message.error('Failed to connect to the selected institution. Please try again.');
    }
  };

  return (
    <>
      <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
        Add Account
      </Button>
      <Modal
        title="Select Institution"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Select
          style={{ width: '100%', marginBottom: '20px' }}
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
      </Modal>
    </>
  );
};

export default AddAccountButton;