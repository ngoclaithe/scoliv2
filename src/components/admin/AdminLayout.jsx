import React, { useState } from 'react';
import { 
  Bars3Icon, 
  XMarkIcon,
  HomeIcon,
  KeyIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  ChatBubbleLeftRightIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

const AdminLayout = ({ children, currentPage, onNavigate, onLogout, adminInfo }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: 'dashboard', icon: HomeIcon, current: currentPage === 'dashboard' },
    { name: 'Quản lý mã truy cập', href: 'access-codes', icon: KeyIcon, current: currentPage === 'access-codes' },
    { name: 'Quản lý tài khoản', href: 'accounts', icon: UserGroupIcon, current: currentPage === 'accounts' },
    { name: 'Quản lý mua code', href: 'code-purchases', icon: CurrencyDollarIcon, current: currentPage === 'code-purchases' },
    { name: 'Phòng hoạt động', href: 'active-rooms', icon: ChatBubbleLeftRightIcon, current: currentPage === 'active-rooms' },
  ];

  const handleNavigation = (href) => {
    onNavigate(href);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={`relative z-50 lg:hidden ${sidebarOpen ? '' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-900/80" onClick={() => setSidebarOpen(false)} />
        
        <div className="fixed inset-0 flex">
          <div className="relative mr-16 flex w-full max-w-xs flex-1">
            <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
              <button type="button" className="-m-2.5 p-2.5" onClick={() => setSidebarOpen(false)}>
                <span className="sr-only">Close sidebar</span>
                <XMarkIcon className="h-6 w-6 text-white" />
              </button>
            </div>

            <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-2">
              <div className="flex h-16 shrink-0 items-center">
                <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
              </div>
              <nav className="flex flex-1 flex-col">
                <ul role="list" className="flex flex-1 flex-col gap-y-7">
                  <li>
                    <ul role="list" className="-mx-2 space-y-1">
                      {navigation.map((item) => (
                        <li key={item.name}>
                          <button
                            onClick={() => handleNavigation(item.href)}
                            className={`w-full text-left group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold ${
                              item.current
                                ? 'bg-primary-50 text-primary-600'
                                : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                            }`}
                          >
                            <item.icon
                              className={`h-6 w-6 shrink-0 ${
                                item.current ? 'text-primary-600' : 'text-gray-400 group-hover:text-primary-600'
                              }`}
                            />
                            {item.name}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </li>
                  <li className="-mx-6 mt-auto">
                    <div className="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-900">
                      <div className="h-8 w-8 rounded-full bg-primary-50 flex items-center justify-center">
                        <span className="text-sm font-medium text-primary-700">
                          {adminInfo?.name?.charAt(0) || 'A'}
                        </span>
                      </div>
                      <span className="sr-only">Your profile</span>
                      <span>{adminInfo?.name || 'Admin'}</span>
                      <button
                        onClick={onLogout}
                        className="ml-auto text-gray-400 hover:text-red-600"
                        title="Đăng xuất"
                      >
                        <ArrowRightOnRectangleIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6">
          <div className="flex h-16 shrink-0 items-center">
            <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <button
                        onClick={() => handleNavigation(item.href)}
                        className={`w-full text-left group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold ${
                          item.current
                            ? 'bg-primary-50 text-primary-600'
                            : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                        }`}
                      >
                        <item.icon
                          className={`h-6 w-6 shrink-0 ${
                            item.current ? 'text-primary-600' : 'text-gray-400 group-hover:text-primary-600'
                          }`}
                        />
                        {item.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </li>
              <li className="-mx-6 mt-auto">
                <div className="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-900 border-t border-gray-200">
                  <div className="h-8 w-8 rounded-full bg-primary-50 flex items-center justify-center">
                    <span className="text-sm font-medium text-primary-700">
                      {adminInfo?.name?.charAt(0) || 'A'}
                    </span>
                  </div>
                  <span className="sr-only">Your profile</span>
                  <span>{adminInfo?.name || 'Admin'}</span>
                  <button
                    onClick={onLogout}
                    className="ml-auto text-gray-400 hover:text-red-600"
                    title="Đăng xuất"
                  >
                    <ArrowRightOnRectangleIcon className="h-5 w-5" />
                  </button>
                </div>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-72">
        {/* Top bar */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" />
          </button>

          {/* Separator */}
          <div className="h-6 w-px bg-gray-200 lg:hidden" />

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="relative flex flex-1 items-center">
              <h2 className="text-lg font-semibold text-gray-900 capitalize">
                {navigation.find(nav => nav.current)?.name || 'Dashboard'}
              </h2>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-6">
          <div className="px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
