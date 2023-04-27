import React from 'react';
import Dropdown from 'components/Dropdown';
import { dropdownName, dropdownOptions } from './constants';

const SortByDropdown: React.FC = ({}) => {
  return <Dropdown name={dropdownName} options={dropdownOptions} />;
};

export default SortByDropdown;
