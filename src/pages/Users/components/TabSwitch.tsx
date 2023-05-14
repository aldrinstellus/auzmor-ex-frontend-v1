import clsx from 'clsx';
import React, { ReactNode, useState } from 'react';
import { Tab } from '@headlessui/react';

interface ITab {
  id: number;
  title: string;
  content: ReactNode;
}

interface TabSwitcherProps {
  tabs: ITab[];
  canEdit?: boolean;
}

const TabSwitcher: React.FC<TabSwitcherProps> = ({ tabs, canEdit }) => {
  const [activeTab, setActiveTab] = useState(1);

  const handleTabClick = (tabId: number) => {
    setActiveTab(tabId);
  };

  const styles = (active: boolean) =>
    clsx(
      {
        'font-bold px-4': true,
      },
      {
        'bg-primary-500 rounded-6xl text-white': active,
      },
      {
        'bg-neutral-50 rounded-lg': !active,
      },
    );

  const contentStyles = (active: boolean) => clsx('block', { hidden: !active });

  // whole tab component change...
  // temp fix for width

  return (
    <div className="space-y-8">
      <div className="flex w-[320px] p-1 bg-neutral-50 rounded-6xl border-solid border-1 border-neutral-200">
        {tabs.map((tab) => (
          <div
            style={{ cursor: 'pointer' }}
            key={tab?.id}
            onClick={() => handleTabClick(tab?.id)}
            className={styles(tab?.id === activeTab)}
          >
            {tab?.title}
          </div>
        ))}
      </div>
      <div>
        {tabs.map((tab) => (
          <div key={tab?.id} className={contentStyles(activeTab === tab?.id)}>
            {tab?.content}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TabSwitcher;
