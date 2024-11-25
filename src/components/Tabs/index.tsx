import { FC, ReactNode, useEffect, useState } from 'react';
import './styles.css';
import { clsx } from 'clsx';

export interface ITab {
  tabLabel: (isActive: boolean) => string | ReactNode;
  tabContent: ReactNode;
  tabAction?: ReactNode;
  dataTestId?: string;
  disabled?: boolean;
}

export interface ITabsProps {
  tabs: ITab[];
  title?: string;
  activeTabIndex?: number;
  tabContentClassName?: string;
  className?: string;
  showUnderline?: boolean;
  tabSwitcherClassName?: string;
  disableAnimation?: boolean;
  onTabChange?: (param: any) => void;
  underlineOffset?: number;
}

const Tabs: FC<ITabsProps> = ({
  tabs,
  title,
  tabContentClassName = 'px-6',
  className = '',
  showUnderline = true,
  tabSwitcherClassName = '',
  disableAnimation = false,
  onTabChange,
  activeTabIndex = 0,
  underlineOffset = 0,
}) => {
  const [activeTab, setActiveTab] = useState(activeTabIndex);
  const [previousTab, setPreviousTab] = useState(activeTab);

  useEffect(() => setActiveTab(activeTabIndex), [activeTabIndex]);

  const style = clsx({
    'w-full flex justify-start border-b-1 border-neutral-200 gap-4': true,
    [className]: true,
  });

  useEffect(() => {
    if (!disableAnimation) {
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
    }
  }, [activeTab, previousTab]);

  const isActive = (index: number) => activeTab === index;

  const handleTabSelect = (tab: ITab, index: number) => {
    setPreviousTab(activeTab);
    !tab?.disabled && setActiveTab(index);
    !tab?.disabled && onTabChange?.(index);
  };
  return (
    <div>
      <div className="flex">
        <div className="w-full flex items-center justify-between">
          {title && (
            <h1
              className="text-2xl font-bold"
              data-testid="people-hub-page-title"
              tabIndex={0}
              title={title}
            >
              {title}
            </h1>
          )}
          <ul className={style}>
            {tabs.map((tab, index) => (
              <li
                className={`flex py-4 relative outline-none ${tabSwitcherClassName} ${
                  !tab.disabled
                    ? isActive(index)
                      ? 'cursor-default'
                      : 'cursor-pointer hover:!text-neutral-900 group'
                    : 'cursor-not-allowed'
                }
            `}
                onClick={() => handleTabSelect(tab, index)}
                onKeyUp={(e) =>
                  e.code === 'Enter' ? handleTabSelect(tab, index) : ''
                }
                key={index}
                data-testid={tab.dataTestId}
                tabIndex={isActive(index) ? -1 : 0}
                aria-hidden={isActive(index)}
              >
                {tab.tabLabel(activeTab === index)}
                {isActive(index) && showUnderline && (
                  <div
                    className={`absolute bg-primary-500 w-full rounded-7xl h-1 bottom-${underlineOffset} `}
                  ></div>
                )}
              </li>
            ))}
          </ul>
        </div>
        {tabs[activeTab].tabAction && (
          <div className="w-full flex justify-end items-center">
            {tabs[activeTab].tabAction}
          </div>
        )}
      </div>
      <div className={`${tabContentClassName}`}>
        <div key={`tab-${activeTab}`} id={`tab-${activeTab}-content`}>
          {tabs[activeTab].tabContent}
        </div>
      </div>
    </div>
  );
};

export default Tabs;
