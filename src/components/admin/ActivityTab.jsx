import React, { useState, useEffect } from 'react';
import {
  MagnifyingGlassIcon,
  XCircleIcon,
  ClockIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import UserAPI from '../../API/apiUser';
import Loading from '../common/Loading';

const ActivityTab = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    loadActivities();
  }, [currentPage, searchTerm]);

  const loadActivities = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Trong thực tế, sẽ cần API riêng cho activities
      const params = {
        page: currentPage,
        limit: 10
      };
      
      if (searchTerm) params.name = searchTerm;

      const response = await UserAPI.getUsers(params);
      
      if (response.success) {
        // Chuyển đổi user data thành activity format
        const activityData = response.data.map(user => ({
          id: user.id,
          type: 'user_login',
          description: `Người dùng ${user.name} đã đăng nhập`,
          user: user,
          timestamp: new Date().toISOString(),
          details: {
            userAgent: 'Browser',
            ip: '192.168.1.1'
          }
        }));
        
        setActivities(activityData);
        setTotalPages(response.pagination?.totalPages || 1);
        setTotalItems(response.pagination?.totalItems || activityData.length);
      }
    } catch (error) {
      console.error('Error loading activities:', error);
      setError(error.message || 'Không thể tải danh sách hoạt động');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'user_login':
        return <UserIcon className="h-5 w-5 text-green-500" />;
      case 'user_logout':
        return <UserIcon className="h-5 w-5 text-red-500" />;
      case 'match_created':
        return <ClockIcon className="h-5 w-5 text-blue-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getActivityTypeText = (type) => {
    switch (type) {
      case 'user_login':
        return 'Đăng nhập';
      case 'user_logout':
        return 'Đăng xuất';
      case 'match_created':
        return 'Tạo trận đấu';
      default:
        return type;
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <XCircleIcon className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Hoạt động mới</h2>
          <p className="mt-1 text-sm text-gray-700">Theo dõi các hoạt động gần đây trong hệ thống ({totalItems} hoạt động)</p>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm hoạt động..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loading size="lg" />
          </div>
        ) : (
          <>
            <div className="divide-y divide-gray-200">
              {activities.map((activity) => (
                <div key={activity.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {activity.description}
                          </p>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {getActivityTypeText(activity.type)}
                            </span>
                            {activity.user && (
                              <span className="text-xs text-gray-500">
                                Email: {activity.user.email}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <time className="text-xs text-gray-500">
                            {formatDate(activity.timestamp)}
                          </time>
                          {activity.details && (
                            <div className="text-xs text-gray-400 mt-1">
                              {activity.details.ip}
                            </div>
                          )}
                        </div>
                      </div>
                      {activity.details && activity.details.userAgent && (
                        <p className="text-xs text-gray-500 mt-2">
                          Thiết bị: {activity.details.userAgent}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Trước
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Sau
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Hiển thị <span className="font-medium">{((currentPage - 1) * 10) + 1}</span> đến{' '}
                      <span className="font-medium">{Math.min(currentPage * 10, totalItems)}</span> trong{' '}
                      <span className="font-medium">{totalItems}</span> kết quả
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        Trước
                      </button>
                      {[...Array(Math.min(totalPages, 10))].map((_, index) => {
                        const pageNumber = index + 1;
                        return (
                          <button
                            key={pageNumber}
                            onClick={() => setCurrentPage(pageNumber)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              currentPage === pageNumber
                                ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                            }`}
                          >
                            {pageNumber}
                          </button>
                        );
                      })}
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        Sau
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ActivityTab;
