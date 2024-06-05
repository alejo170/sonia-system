'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

const Tabs = ({ children }) => {

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab');
  const defaultTab = tab || children[0].props.label;
  const [activeTab, setActiveTab] = useState(defaultTab);
  
  
  useEffect(() => {
      if (tab && tab !== activeTab) {
        setActiveTab(tab);
      }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClick = (e, newActiveTab) => {
    e.preventDefault();
    setActiveTab(newActiveTab);
    const newUrl = `${pathname}?tab=${newActiveTab}`;
    window.history.pushState({}, '', newUrl);
  };

  return (
    <div className="mx-auto pt-4">
      <div className="flex border-b border-gray-300">
        {children.map((child) => (
          <button
            key={child.props.label}
            className={`${
              activeTab === child.props.label
                ? 'border-b-2 border-500 bg-50'
                : ''
            } flex-1 py-2 font-medium text-gray-700`}
            onClick={(e) => handleClick(e, child.props.label)}
          >
            {child.props.label}
          </button>
        ))}
      </div>
      <div className="py-4">
        {children.map((child) => {
          if (child.props.label === activeTab) {
            return <div key={child.props.label}>{child.props.children}</div>;
          }
          return null;
        })}
      </div>
    </div>
  );
};

const Tab = ({ label, children }) => {
  return (
    <div label={label} className="hidden">
      {children}
    </div>
  );
};
export { Tabs, Tab };
