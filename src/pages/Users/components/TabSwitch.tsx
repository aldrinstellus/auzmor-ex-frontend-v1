import clsx from 'clsx';
import React, { useState } from 'react';
import { Tab } from '@headlessui/react';

interface Tab {
  id: number;
  label: string;
}

interface TabSwitcherProps {
  tabs: Tab[];
}

const TabSwitcher: React.FC<TabSwitcherProps> = ({ tabs }) => {
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const handleTabClick = (index: number) => {
    setActiveTabIndex(index);
  };

  const styles = (active: boolean) =>
    clsx(
      {
        'font-bold': true,
      },
      {
        'bg-primary-500 rounded-6xl text-white': active,
      },
      {
        'bg-neutral-50 rounded-lg': !active,
      },
    );

  // whole tab component change...
  // temp fix for width

  return (
    <div className="flex w-[377px] p-1 bg-neutral-50 rounded-6xl border-solid border-1 border-neutral-200">
      {tabs.map((tab, index) => (
        <div
          style={{ cursor: 'pointer' }}
          key={tab?.id}
          onClick={() => handleTabClick(index)}
          className={styles(index === activeTabIndex)}
        >
          {tab.label}
        </div>
      ))}
    </div>

    // <div className="p-1 bg-neutral-50 rounded-6xl border-solid border-1 border-neutral-200 flex max-w-md w-full px-2 py-16 sm:px-0">
    //   <Tab.Group>
    //     <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
    //       {tabs.map((tab, index) => (
    //         <Tab key={tab?.id} className={styles(index === activeTabIndex)}>
    //           {children}
    //         </Tab>
    //       ))}
    //     </Tab.List>
    //   </Tab.Group>
    // </div>
  );
};

export default TabSwitcher;
