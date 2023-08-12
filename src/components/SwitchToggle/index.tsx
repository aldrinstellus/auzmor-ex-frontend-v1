import React, { useState } from 'react';
import { Switch } from '@headlessui/react';

type SwitchToggleProps = {
  color?: string;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
};

const SwitchToggle: React.FC<SwitchToggleProps> = ({
  color = 'bg-primary-500',
  disabled = false,
  onChange = () => {},
}) => {
  const [enabled, setEnabled] = useState(false);
  return (
    <Switch
      checked={enabled}
      onChange={(checked: boolean) => {
        onChange(checked);
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
