import clsx from 'clsx';
import React, { useState } from 'react';

interface Tab {
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
        'pl-6 pr-6 pt-1 pb-1 font-bold gap-1': true,
      },
      {
        'bg-primary-500 rounded-6xl text-white': active,
      },
      {
        'bg-neutral-50 rounded-lg': !active,
      },
    );

  return (
    <div className="p-1 bg-neutral-50 rounded-6xl border-solid border-2 border-neutral-200 flex max-w-min">
      {tabs.map((tab, index) => (
        <div
          style={{ cursor: 'pointer' }}
          key={tab.label}
          onClick={() => handleTabClick(index)}
          className={styles(index === activeTabIndex)}
        >
          {tab.label}
        </div>
      ))}
    </div>
  );
};

export default TabSwitcher;
