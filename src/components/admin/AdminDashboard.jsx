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
import StatisticsAPI from '../../API/apiStatistics';
import ActivitiesAPI from '../../API/apiActivities';

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
      const [
        accessCodesResponse,
        usersResponse,
        paymentRequestsResponse,
        activeRoomsResponse,
        activitiesResponse
      ] = await Promise.allSettled([
        StatisticsAPI.getTotalAccessCodes(),
        StatisticsAPI.getTotalUsers(),
        StatisticsAPI.getTotalPaymentRequests(),
        StatisticsAPI.getActiveRoomSessionsCount(),
        ActivitiesAPI.getActivities()
      ]);

      console.log("Gía trị getActivities", activitiesResponse);
      const totalAccessCodes = accessCodesResponse.status === 'fulfilled'
        ? accessCodesResponse.value?.data?.total || 0
        : 0;

      const totalAccounts = usersResponse.status === 'fulfilled'
        ? usersResponse.value?.data?.total || 0
        : 0;

      const totalCodePurchases = paymentRequestsResponse.status === 'fulfilled'
        ? paymentRequestsResponse.value?.data?.total || 0
        : 0;

      const activeRooms = activeRoomsResponse.status === 'fulfilled'
        ? activeRoomsResponse.value?.data?.total || 0
        : 0;

      const activities = activitiesResponse.status === 'fulfilled'
        ? activitiesResponse.value?.data || []
        : [];

      const statsData = {
        totalAccessCodes,
        totalAccounts,
        totalCodePurchases,
        activeRooms,
        trends: {
          accessCodes: { value: 0, isIncrease: false },
          accounts: { value: 0, isIncrease: false },
          codePurchases: { value: 0, isIncrease: false },
          activeRooms: { value: 0, isIncrease: false }
        }
      };

      if (accessCodesResponse.status === 'rejected') {
        console.error('Error loading access codes count:', accessCodesResponse.reason);
      }
      if (usersResponse.status === 'rejected') {
        console.error('Error loading users count:', usersResponse.reason);
      }
      if (paymentRequestsResponse.status === 'rejected') {
        console.error('Error loading payment requests count:', paymentRequestsResponse.reason);
      }
      if (activeRoomsResponse.status === 'rejected') {
        console.error('Error loading active rooms count:', activeRoomsResponse.reason);
      }
      if (activitiesResponse.status === 'rejected') {
        console.error('Error loading activities:', activitiesResponse.reason);
      }

      setStats(statsData);
      setRecentActivities(activities);
    } catch (error) {
      console.error('Error loading dashboard data:', error);

      // Fallback data nếu có lỗi
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
        }
      };

      const emptyActivities = [
        {
          id: 1,
          type: 'error',
          description: 'Không thể tải dữ liệu từ server',
          timestamp: new Date(),
          status: 'error'
        }
      ];

      setStats(emptyStats);
      setRecentActivities(emptyActivities);
    } finally {
      setLoading(false);
    }
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
      case 'payment_request':
        return <CurrencyDollarIcon className="h-5 w-5 text-green-600" />;
      case 'user':
        return <UserGroupIcon className="h-5 w-5 text-blue-600" />;
      case 'access_code':
        return <KeyIcon className="h-5 w-5 text-indigo-600" />;
      case 'room_created':
        return <ChatBubbleLeftRightIcon className="h-5 w-5 text-indigo-600" />;
      case 'code_expired':
        return <KeyIcon className="h-5 w-5 text-orange-600" />;
      case 'payment_failed':
        return <CurrencyDollarIcon className="h-5 w-5 text-red-600" />;
      case 'error':
        return <EyeIcon className="h-5 w-5 text-red-600" />;
      default:
        return <EyeIcon className="h-5 w-5 text-gray-600" />;
    }
  };

  const getActivityColor = (status) => {
    switch (status) {
      case 'completed':
      case 'active':
        return 'bg-green-50 border-green-200';
      case 'cancelled':
        return 'bg-orange-50 border-orange-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getActivityDescription = (activity) => {
    switch (activity.type) {
      case 'payment_request':
        if (activity.status === 'completed') {
          return `Yêu cầu thanh toán ${activity.code} đã hoàn thành - ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(activity.amount)}`;
        } else if (activity.status === 'cancelled') {
          return `Yêu cầu thanh toán ${activity.code} đã bị hủy - ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(activity.amount)}`;
        }
        return `Yêu cầu thanh toán ${activity.code} - ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(activity.amount)}`;
      case 'access_code':
        return `Mã truy cập ${activity.code} được tạo bởi ${activity.createdBy?.name || 'Unknown'}`;
      case 'user':
        return `Tài khoản mới: ${activity.name} (${activity.email})`;
      default:
        return activity.description || 'Hoạt động không xác định';
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
      name: 'Yêu cầu thanh toán',
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
                        <div className={`ml-2 flex items-baseline text-sm font-semibold ${card.trend.isIncrease ? 'text-green-600' : 'text-red-600'
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
                <li key={`${activity.type}-${activity.id}`}>
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
                          <p className="text-sm text-slate-700 font-medium">
                            {getActivityDescription(activity)}
                          </p>
                        </div>
                        <div className="text-right text-sm whitespace-nowrap text-slate-500 font-medium">
                          {formatRelativeTime(new Date(activity.createdAt))}
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