import clsx from 'clsx';
import React, { ReactNode, useState } from 'react';
import { find } from 'lodash';

interface ITab {
  id: number;
  title: string;
  dataTestId?: string;
  content?: ReactNode;
}

interface TabSwitcherProps {
  tabs: ITab[];
}

const TabSwitcher: React.FC<TabSwitcherProps> = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id);

  const handleTabClick = (tabId: number) => {
    setActiveTab(tabId);
  };

  const styles = (active: boolean) =>
    clsx(
      {
        'font-bold px-4 cursor-pointer py-1': true,
      },
      {
        'bg-primary-500 rounded-6xl text-white': active,
      },
      {
        'bg-neutral-50 rounded-lg': !active,
      },
    );

  const activeTabNode = find(tabs, { id: activeTab });

  return (
    <div className="space-y-8">
      <div className="flex max-w-min p-1 bg-neutral-50 rounded-6xl border-solid border-1 border-neutral-200">
        {tabs.map((tab) => (
          <div
            key={tab?.id}
            onClick={() => handleTabClick(tab?.id)}
            className={styles(tab?.id === activeTab)}
            data-testId={tab?.dataTestId}
          >
            {tab?.title}
          </div>
        ))}
      </div>

      <div>{activeTabNode?.content}</div>
    </div>
  );
};

export default TabSwitcher;
