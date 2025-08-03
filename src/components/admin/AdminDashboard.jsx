import React, { useState, useEffect } from 'react';
import {
  KeyIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  ChatBubbleLeftRightIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import Loading from '../common/Loading';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const emptyStats = {
        totalAccessCodes: 0,
        totalAccounts: 0,
        totalCodePurchases: 0,
        activeRooms: 0,
        trends: {
          accessCodes: { value: 0, isIncrease: false },
          accounts: { value: 0, isIncrease: false },
          codePurchases: { value: 0, isIncrease: false },
          activeRooms: { value: 0, isIncrease: false }
        },
        revenueThisMonth: 0,
        revenueLastMonth: 0
      };

      const emptyActivities = [
        {
          id: 1,
          type: 'info',
          description: 'Chưa có hoạt động nào',
          timestamp: new Date(),
          status: 'info'
        }
      ];

      setStats(emptyStats);
      setRecentActivities(emptyActivities);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatRelativeTime = (date) => {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Vừa xong';
    if (minutes < 60) return `${minutes} phút trước`;
    if (hours < 24) return `${hours} giờ trước`;
    return `${days} ngày trước`;
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'code_purchase':
        return <CurrencyDollarIcon className="h-5 w-5 text-green-600" />;
      case 'account_created':
        return <UserGroupIcon className="h-5 w-5 text-blue-600" />;
      case 'room_created':
        return <ChatBubbleLeftRightIcon className="h-5 w-5 text-indigo-600" />;
      case 'code_expired':
        return <KeyIcon className="h-5 w-5 text-orange-600" />;
      case 'payment_failed':
        return <CurrencyDollarIcon className="h-5 w-5 text-red-600" />;
      default:
        return <EyeIcon className="h-5 w-5 text-gray-600" />;
    }
  };

  const getActivityColor = (status) => {
    switch (status) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
      case 'warning':
        return 'bg-orange-50 border-orange-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loading size="lg" />
      </div>
    );
  }

  const statCards = [
    {
      name: 'Tổng mã truy cập',
      value: stats?.totalAccessCodes || 0,
      trend: stats?.trends?.accessCodes,
      icon: KeyIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      name: 'Tổng tài khoản',
      value: stats?.totalAccounts || 0,
      trend: stats?.trends?.accounts,
      icon: UserGroupIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      name: 'Tổng mua code',
      value: stats?.totalCodePurchases || 0,
      trend: stats?.trends?.codePurchases,
      icon: CurrencyDollarIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      name: 'Phòng hoạt động',
      value: stats?.activeRooms || 0,
      trend: stats?.trends?.activeRooms,
      icon: ChatBubbleLeftRightIcon,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome section */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 overflow-hidden shadow-xl rounded-2xl">
        <div className="px-4 py-8 sm:p-8">
          <h1 className="text-3xl font-bold text-white mb-3">Chào mừng đến với Admin Dashboard</h1>
          <p className="text-blue-100 text-lg">Quản lý và theo dõi hoạt động của hệ thống</p>
          <div className="mt-4 flex items-center text-blue-100">
            <span className="text-2xl mr-2">📊</span>
            <span>Trung tâm điều khiển hệ thống</span>
          </div>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <div key={card.name} className="bg-white overflow-hidden shadow-lg rounded-xl border border-slate-200 hover:shadow-xl transition-all duration-200">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`${card.bgColor} p-3 rounded-xl shadow-md`}>
                    <card.icon className={`h-6 w-6 ${card.color}`} />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-slate-600 truncate">{card.name}</dt>
                    <dd className="flex items-baseline">
                      <div className="text-3xl font-bold text-slate-900">{card.value || 'Chưa có'}</div>
                      {card.trend && (
                        <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                          card.trend.isIncrease ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {card.trend.isIncrease ? (
                            <ArrowUpIcon className="self-center flex-shrink-0 h-4 w-4" />
                          ) : (
                            <ArrowDownIcon className="self-center flex-shrink-0 h-4 w-4" />
                          )}
                          <span className="sr-only">
                            {card.trend.isIncrease ? 'Increased' : 'Decreased'} by
                          </span>
                          {Math.abs(card.trend.value)}
                        </div>
                      )}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue section */}
      <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-slate-200">
        <div className="px-4 py-6 sm:p-8">
          <div className="flex items-center mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mr-3">
              <span className="text-white font-bold text-sm">💰</span>
            </div>
            <h3 className="text-xl leading-6 font-bold text-slate-900">Doanh thu</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl">
              <dt className="text-sm font-medium text-slate-600">Tháng này</dt>
              <dd className="mt-2 text-3xl font-bold text-green-600">
                {stats?.revenueThisMonth ? formatCurrency(stats?.revenueThisMonth) : 'Chưa có'}
              </dd>
            </div>
            <div className="bg-gradient-to-r from-slate-50 to-gray-50 p-4 rounded-xl">
              <dt className="text-sm font-medium text-slate-600">Tháng trước</dt>
              <dd className="mt-2 text-3xl font-bold text-slate-700">
                {stats?.revenueLastMonth ? formatCurrency(stats?.revenueLastMonth) : 'Chưa có'}
              </dd>
              <div className={`mt-2 flex items-baseline text-sm font-semibold ${
                (stats?.revenueThisMonth || 0) > (stats?.revenueLastMonth || 0) 
                  ? 'text-green-600' 
                  : 'text-red-600'
              }`}>
                {(stats?.revenueThisMonth || 0) > (stats?.revenueLastMonth || 0) ? (
                  <ArrowUpIcon className="self-center flex-shrink-0 h-4 w-4 mr-1" />
                ) : (
                  <ArrowDownIcon className="self-center flex-shrink-0 h-4 w-4 mr-1" />
                )}
                {Math.abs(((stats?.revenueThisMonth || 0) - (stats?.revenueLastMonth || 0)) / (stats?.revenueLastMonth || 1) * 100).toFixed(1)}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent activities */}
      <div className="bg-white shadow-lg rounded-xl border border-slate-200">
        <div className="px-4 py-6 sm:p-8">
          <div className="flex items-center mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center mr-3">
              <span className="text-white font-bold text-sm">🔔</span>
            </div>
            <h3 className="text-xl leading-6 font-bold text-slate-900">Hoạt động gần đây</h3>
          </div>
          <div className="flow-root">
            <ul className="-mb-8">
              {recentActivities.map((activity, activityIdx) => (
                <li key={activity.id}>
                  <div className="relative pb-8">
                    {activityIdx !== recentActivities.length - 1 ? (
                      <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" />
                    ) : null}
                    <div className="relative flex space-x-3">
                      <div className={`${getActivityColor(activity.status)} rounded-full p-2 border`}>
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                        <div>
                          <p className="text-sm text-slate-700 font-medium">{activity.description}</p>
                        </div>
                        <div className="text-right text-sm whitespace-nowrap text-slate-500 font-medium">
                          {formatRelativeTime(activity.timestamp)}
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
