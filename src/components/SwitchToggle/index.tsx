import React, { useState } from 'react';
import { Switch } from '@headlessui/react';

type SwitchToggleProps = {
  color?: string;
};

const SwitchToggle: React.FC<SwitchToggleProps> = ({
  color = 'bg-blue-400',
}) => {
  const [enabled, setEnabled] = useState(false);
  return (
    <Switch
      checked={enabled}
      onChange={setEnabled}
      className={`${
        enabled ? color : 'bg-gray-200'
      } relative inline-flex h-6 w-11 items-center rounded-full`}
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
