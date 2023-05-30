import React from 'react';
import Dropdown from 'components/Dropdown';
import Button, { Variant, Size } from 'components/Button';
import { twConfig } from 'utils/misc';

const SortByDropdown: React.FC = ({}) => {
  return (
    <div className="flex items-center ml-6">
      <div className="whitespace-nowrap mr-6 text-sm font-bold">Sort by</div>
      <div className="relative">
        <Dropdown
          options={[
            {
              label: 'Latest',
              value: 'latest',
              id: 'latest',
            },
          ]}
          optionRenderer={(active, selected, option) => (
            <div
              className={`px-4 py-1 cursor-pointer text-sm ${
                (active || selected) && 'bg-primary-50'
              }`}
            >
              {option.label}
            </div>
          )}
          triggerNode={(selectedOption, open) => (
            <Button
              label={selectedOption.label}
              variant={Variant.Secondary}
              rightIcon={open ? 'arrowUp' : 'arrowDown'}
              size={Size.Small}
              rightIconClassName="ml-1"
              iconStroke={twConfig.theme.colors.neutral['900']}
              className="min-w-[112px]"
            />
          )}
        />
      </div>
    </div>
  );
};

export default SortByDropdown;
