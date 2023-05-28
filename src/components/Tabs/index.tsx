import React, { ReactNode, useState } from 'react';

interface ITab {
  tabLable: (isActive: boolean) => string | ReactNode;
  tabContent: ReactNode;
  dataTestId?: string;
}

export interface ITabsProps {
  tabs: ITab[];
  activeTabIndex?: number;
}

const Tabs: React.FC<ITabsProps> = ({ tabs, activeTabIndex = 0 }) => {
  const [activeTab, setActiveTab] = useState(activeTabIndex);

  const isActive = (index: number) => activeTab === index;
  return (
    <div>
      <div className="w-full flex justify-start border-b-1 border border-neutral-200 px-8">
        {tabs.map((tab, index) => (
          <div
            className={`flex py-4 relative ${
              isActive(index) ? 'cursor-default' : 'cursor-pointer'
            } ${index !== tabs.length - 1 && 'mr-10'}`}
            onClick={() => setActiveTab(index)}
            key={index}
            data-test-id={tab.dataTestId}
          >
            {tab.tabLable(activeTab === index)}
            {isActive(index) && (
              <div className="absolute bottom-0 bg-primary-500 w-full rounded-7xl h-0.5"></div>
            )}
          </div>
        ))}
      </div>
      <div className="px-6">{tabs[activeTab].tabContent}</div>
    </div>
  );
};

export default Tabs;
