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
import adminAPI from '../../API/apiAdmin';
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
      
      // For demo purposes, we'll use mock data
      // In production, you would call: const data = await adminAPI.getDashboardStats();
      
      // Mock data
      const mockStats = {
        totalAccessCodes: 145,
        totalAccounts: 89,
        totalCodePurchases: 234,
        activeRooms: 12,
        trends: {
          accessCodes: { value: 12, isIncrease: true },
          accounts: { value: 5, isIncrease: true },
          codePurchases: { value: -3, isIncrease: false },
          activeRooms: { value: 2, isIncrease: true }
        },
        revenueThisMonth: 15420000,
        revenueLastMonth: 12340000
      };

      const mockActivities = [
        {
          id: 1,
          type: 'code_purchase',
          description: 'Người dùng john@example.com đã mua 5 code',
          timestamp: new Date(Date.now() - 2 * 60 * 1000),
          status: 'success'
        },
        {
          id: 2,
          type: 'account_created',
          description: 'Tài khoản mới: mary@example.com',
          timestamp: new Date(Date.now() - 15 * 60 * 1000),
          status: 'info'
        },
        {
          id: 3,
          type: 'room_created',
          description: 'Phòng ABC123 đã được tạo',
          timestamp: new Date(Date.now() - 30 * 60 * 1000),
          status: 'info'
        },
        {
          id: 4,
          type: 'code_expired',
          description: 'Mã XYZ789 đã hết hạn',
          timestamp: new Date(Date.now() - 45 * 60 * 1000),
          status: 'warning'
        },
        {
          id: 5,
          type: 'payment_failed',
          description: 'Thanh toán thất bại cho đơn hàng #12345',
          timestamp: new Date(Date.now() - 60 * 60 * 1000),
          status: 'error'
        }
      ];

      setStats(mockStats);
      setRecentActivities(mockActivities);
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
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Chào mừng đến với Admin Dashboard</h1>
          <p className="text-gray-600">Quản lý và theo dõi hoạt động của hệ thống</p>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <div key={card.name} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`${card.bgColor} p-3 rounded-md`}>
                    <card.icon className={`h-6 w-6 ${card.color}`} />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{card.name}</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">{card.value}</div>
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
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Doanh thu</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <dt className="text-sm font-medium text-gray-500">Tháng này</dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">
                {formatCurrency(stats?.revenueThisMonth || 0)}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Tháng trước</dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">
                {formatCurrency(stats?.revenueLastMonth || 0)}
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
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Hoạt động gần đây</h3>
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
                          <p className="text-sm text-gray-500">{activity.description}</p>
                        </div>
                        <div className="text-right text-sm whitespace-nowrap text-gray-500">
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
