import clsx from 'clsx';
import SwitchToggle from 'components/SwitchToggle';
import React from 'react';

type AppProps = {
  data: Record<string, any>;
};

const EventsControl: React.FC<AppProps> = ({ data }) => {
  const settings = [
    {
      label: 'An event is about to start',
      inApp: 'EVENT_START_APP',
      email: 'EVENT_START_EMAIL',
    },
    {
      label: 'An event you are attending is cancelled',
      inApp: 'EVENT_CANCELLED_APP',
      email: 'EVENT_CANCELLED_EMAIL',
    },
  ];

  return (
    <div className="px-6 py-4">
      <div className="flex text-sm font-bold text-neutral-700 mb-4">
        <div className="flex-1">Actions</div>
        <div className="w-[144px] flex justify-between">
          <div className="">In app</div>
          <div>Email</div>
        </div>
      </div>
      {settings.map((setting, idx) => (
        <div
          key={setting.label}
          className={clsx('flex text-sm text-neutral-900 py-3', {
            'border-b border-neutral-200': idx !== settings.length - 1,
          })}
        >
          <div className="flex-1">{setting.label}</div>
          <div className="w-[144px] flex justify-between">
            <SwitchToggle />
            <SwitchToggle />
          </div>
        </div>
      ))}
    </div>
  );
};

export default EventsControl;
