import { Listbox } from '@headlessui/react';
import React, { Fragment, ReactElement, ReactNode, useState } from 'react';

export type DropdownProps = {
  options: Record<string, any>[];
  triggerNode: (
    selectedOption: Record<string, any>,
    open: boolean,
  ) => ReactNode;
  optionRenderer: (
    active: boolean,
    selected: boolean,
    option: Record<string, any>,
  ) => JSX.Element;
  selectedIndex?: number;
};

const Dropdown: React.FC<DropdownProps> = ({
  options,
  triggerNode,
  optionRenderer,
  selectedIndex = 0,
}): ReactElement => {
  const [selectedOption, setSelectedOption] = useState(options[selectedIndex]);
  return (
    <Listbox value={selectedOption} onChange={setSelectedOption}>
      {({ open }) => (
        <>
          <Listbox.Button>{triggerNode(selectedOption, open)}</Listbox.Button>
          <Listbox.Options className="absolute mt-1 max-h-60 overflow-auto rounded-md bg-white py-1 text-base shadow-lg min-w-[112px] z-10">
            {options.map((option) => (
              <Listbox.Option key={option.id} value={option} as={Fragment}>
                {({ active, selected }) =>
                  optionRenderer(active, selected, option)
                }
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </>
      )}
    </Listbox>
  );
};

export default Dropdown;
