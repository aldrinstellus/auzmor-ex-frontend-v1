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

  return (
    <>
      <div className='flex'>
        <span className="p-1 mb-6 bg-[#fafafa] rounded-6xl border-solid border-2 border-[#e5e5e5]">
          {tabs.map((tab, index) => (
            <span
              style={{ cursor: 'pointer' }}
              key={tab.label}
              onClick={() => handleTabClick(index)}
              className={index === activeTabIndex ? 'active bg-primary-500 rounded-6xl pl-3 pr-3 pt-1 pb-1 text-white' : 'bg-[#fafafa] rounded-lg pl-3 pr-3 pt-1 pb-1'}
            >
              {tab.label}
            </span>
          ))}
        </span>
      </div>
    </>
  );
};

export default TabSwitcher;
