import React, { ReactNode, useState } from 'react';

interface ITab {
  tabLable: (isActive: boolean) => string | ReactNode;
  tabContent: ReactNode;
  dataTestId?: string;
}

export interface ITabsProps {
  tabs: ITab[];
  activeTabIndex?: number;
  tabContentClassName?: string;
  className?: string;
  itemSpacing?: number;
}

const Tabs: React.FC<ITabsProps> = ({
  tabs,
  activeTabIndex = 0,
  tabContentClassName = 'px-6',
  className = 'w-full flex justify-start border-b-1 border border-neutral-200 px-8',
  itemSpacing = 4,
}) => {
  const [activeTab, setActiveTab] = useState(activeTabIndex);

  const isActive = (index: number) => activeTab === index;
  return (
    <div>
      <div className={className}>
        {tabs.map((tab, index) => (
          <div
            className={`flex py-4 relative ${
              isActive(index) ? 'cursor-default' : 'cursor-pointer'
            } ${index !== tabs.length - 1 && `mr-${itemSpacing}`}`}
            onClick={() => setActiveTab(index)}
            key={index}
            data-testid={tab.dataTestId}
          >
            {tab.tabLable(activeTab === index)}
            {isActive(index) && (
              <div className="absolute bottom-0 bg-primary-500 w-full rounded-7xl h-1"></div>
            )}
          </div>
        ))}
      </div>
      <div className={tabContentClassName}>{tabs[activeTab].tabContent}</div>
    </div>
  );
};

export default Tabs;
