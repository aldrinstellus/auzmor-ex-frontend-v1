import { FC, useState } from 'react';
import { Switch } from '@headlessui/react';

type SwitchToggleProps = {
  defaultValue?: boolean;
  color?: string;
  disabled?: boolean;
  onChange?: (checked: boolean, setChecked: (checked: boolean) => void) => void;
  dataTestId?: string;
};

const SwitchToggle: FC<SwitchToggleProps> = ({
  defaultValue = false,
  color = 'bg-primary-500',
  disabled = false,
  onChange = () => {},
  dataTestId,
}) => {
  const [checked, setChecked] = useState(defaultValue);
  return (
    <Switch
      data-testid={dataTestId}
      checked={checked}
      onChange={(checked: boolean) => {
        setChecked(checked);
        onChange(checked, setChecked);
      }}
      className={`${
        checked ? color : 'bg-gray-200'
      } relative inline-flex h-6 w-11 items-center rounded-full`}
      disabled={disabled}
    >
      <span
        className={`${
          checked ? 'translate-x-6' : 'translate-x-1'
        } inline-block h-4 w-4 transform rounded-full bg-white transition`}
      />
    </Switch>
  );
};

export default SwitchToggle;
