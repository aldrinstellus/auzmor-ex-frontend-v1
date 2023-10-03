import Dropdown from 'components/Dropdown';
import Button, { Variant, Size } from 'components/Button';
import { FC } from 'react';

const SortByDropdown: FC = ({}) => {
  return (
    <div className="flex items-center ml-6">
      <div className="whitespace-nowrap text-sm font-bold mr-4">Sort by</div>
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
              className={`px-4 py-2 cursor-pointer text-sm ${
                (active || selected) && 'bg-primary-50'
              }`}
              data-testid={`feed-sortpost-by${option.value}`}
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
              iconColor="text-neutral-900"
              className="min-w-[112px]"
              dataTestId="feed-sortby-dropdown"
            />
          )}
        />
      </div>
    </div>
  );
};

export default SortByDropdown;
