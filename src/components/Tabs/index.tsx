import React, { ReactNode, useEffect, useState } from 'react';
import './styles.css';

interface ITab {
  tabLable: (isActive: boolean) => string | ReactNode;
  tabContent: ReactNode;
  dataTestId?: string;
  disabled?: boolean;
}

export interface ITabsProps {
  tabs: ITab[];
  activeTabIndex?: number;
  tabContentClassName?: string;
  className?: string;
  itemSpacing?: number;
  showUnderline?: boolean;
  tabSwitcherClassName?: string;
}

const Tabs: React.FC<ITabsProps> = ({
  tabs,
  activeTabIndex = 0,
  tabContentClassName = 'px-6',
  className = 'w-full flex justify-start border-b-1 border border-neutral-200 px-8',
  itemSpacing = 4,
  showUnderline = true,
  tabSwitcherClassName = '',
}) => {
  const [activeTab, setActiveTab] = useState(activeTabIndex);
  const [previousTab, setPreviousTab] = useState(activeTab);

  useEffect(() => {
    const tabContent = document.getElementById(
      `tab-${activeTab}-content`,
    ) as HTMLElement;
    if (activeTab > previousTab) {
      tabContent.classList.remove('slide-in-right'); // reset animation
      tabContent.classList.remove('slide-in-left'); // reset animation
      void tabContent.offsetWidth; // trigger reflow
      tabContent.classList.add('slide-in-right'); // start animation
    } else if (activeTab < previousTab) {
      tabContent.classList.remove('slide-in-left'); // reset animation
      tabContent.classList.remove('slide-in-right'); // reset animation
      void tabContent.offsetWidth; // trigger reflow
      tabContent.classList.add('slide-in-left'); // start animation
    }
  }, [activeTab, previousTab]);

  const isActive = (index: number) => activeTab === index;
  return (
    <div>
      <div className={className}>
        {tabs.map((tab, index) => (
          <div
            className={`flex py-4 relative ${tabSwitcherClassName} ${
              !tab.disabled
                ? isActive(index)
                  ? 'cursor-default'
                  : 'cursor-pointer'
                : 'cursor-not-allowed'
            } ${index !== tabs.length - 1 && `mr-${itemSpacing}`}
            `}
            onClick={() => {
              setPreviousTab(activeTab);
              !tab?.disabled && setActiveTab(index);
            }}
            key={index}
            data-testid={tab.dataTestId}
          >
            {tab.tabLable(activeTab === index)}
            {isActive(index) && showUnderline && (
              <div className="absolute bottom-0 bg-primary-500 w-full rounded-7xl h-1"></div>
            )}
          </div>
        ))}
      </div>
      <div className={`${tabContentClassName}`}>
        <div id={`tab-${activeTab}-content`}>{tabs[activeTab].tabContent}</div>
      </div>
    </div>
  );
};

export default Tabs;
