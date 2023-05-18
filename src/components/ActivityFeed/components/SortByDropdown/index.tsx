import React from 'react';
import Dropdown from 'components/Dropdown';
import { dropdownName, dropdownOptions } from './constants';

const SortByDropdown: React.FC = ({}) => {
  return (
    <div className="flex items-center ml-6">
      <div className="whitespace-nowrap mr-6 text-sm font-bold">Sort by</div>
      <Dropdown name={dropdownName} options={dropdownOptions} />
    </div>
  );
};

export default SortByDropdown;
