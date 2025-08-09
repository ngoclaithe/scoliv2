import React, { useState } from 'react';
import {
  KeyIcon,
  ClockIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

import AccessCodeTab from './AccessCodeTab';
import ActivityTab from './ActivityTab';
import AccountTab from './AccountTab';

const AccessCodeManagement = () => {
  const [activeTab, setActiveTab] = useState('access-codes');

  const tabs = [
    {
      id: 'access-codes',
      name: 'Mã truy cập',
      icon: KeyIcon,
      component: AccessCodeTab
    },
    {
      id: 'activities',
      name: 'Hoạt động mới',
      icon: ClockIcon,
      component: ActivityTab
    },
    {
      id: 'accounts',
      name: 'Quản lý tài khoản',
      icon: UserGroupIcon,
      component: AccountTab
    }
  ];

  const getCurrentComponent = () => {
    const currentTab = tabs.find(tab => tab.id === activeTab);
    if (currentTab) {
      const Component = currentTab.component;
      return <Component />;
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Quản lý hệ thống</h1>
        <p className="mt-2 text-sm text-gray-700">
          Quản lý mã truy cập, theo dõi hoạt động và quản lý tài khoản người dùng
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
              >
                <Icon className="h-5 w-5" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {getCurrentComponent()}
      </div>
    </div>
  );
};

export default AccessCodeManagement;
