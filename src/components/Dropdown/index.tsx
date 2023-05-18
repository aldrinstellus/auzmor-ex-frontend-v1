import ArrowDown from 'components/Icon/components/ArrowDown';
import React, { ReactElement, useState } from 'react';

export type DropdownOption = {
  value: string;
  label: string;
  default: boolean;
};

export type DropdownProps = {
  name: string;
  options?: DropdownOption[];
  onChange?: any;
  className?: string;
  error?: string;
  loading?: boolean;
  disabled?: boolean;
  dataTestId?: string;
};

const Dropdown: React.FC<DropdownProps> = ({
  name,
  options,
  error = '',
  loading = false,
  disabled = false,
  dataTestId = '',
}): ReactElement => {
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [dropdownName, setDropdownName] = useState<string>(
    options?.find((option) => option.default)?.label || name,
  );

  return (
    <div className="relative">
      <button
        className="box-border font-bold flex flex-row justify-center items-center py-2 px-4 gap-4 bg-white border border-gray-300 rounded-[24px]"
        onClick={() => {
          setShowDropdown(!showDropdown);
        }}
        data-testid={dataTestId}
      >
        {dropdownName}
        <ArrowDown />
        {showDropdown && (
          <div className="absolute top-full min-w-full w-max bg-white shadow-md mt-1 rounded z-10">
            <ul className="text-left border rounded-md space-y-1">
              {options?.map((option) => (
                <li
                  className="px-4 py-2 hover:bg-green-50 rounded-md"
                  onClick={() => setDropdownName(option?.label)}
                  key={option?.value}
                  value={option?.value}
                >
                  {option?.label}
                </li>
              ))}
            </ul>
          </div>
        )}
      </button>
    </div>
  );
};

export default Dropdown;
