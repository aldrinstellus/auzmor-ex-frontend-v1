import React, { useEffect, useState } from 'react';
import { Switch } from '@headlessui/react';

type SwitchToggleProps = {
  defaultValue?: boolean;
  color?: string;
  disabled?: boolean;
  onChange?: (state: boolean, setEnabled: (state: boolean) => void) => void;
};

const SwitchToggle: React.FC<SwitchToggleProps> = ({
  defaultValue = false,
  color = 'bg-primary-500',
  disabled = false,
  onChange = () => {},
}) => {
  const [enabled, setEnabled] = useState(defaultValue);
  useEffect(() => {
    setEnabled(defaultValue);
  }, []);
  return (
    <Switch
      checked={enabled}
      onChange={(checked: boolean) => {
        onChange(checked, setEnabled);
        setEnabled(checked);
      }}
      className={`${
        enabled ? color : 'bg-gray-200'
      } relative inline-flex h-6 w-11 items-center rounded-full`}
      disabled={disabled}
    >
      <span
        className={`${
          enabled ? 'translate-x-6' : 'translate-x-1'
        } inline-block h-4 w-4 transform rounded-full bg-white transition`}
      />
    </Switch>
  );
};

export default SwitchToggle;
