import React from 'react';
import Loading from '../common/Loading';
import { PlusIcon, ClockIcon, UserIcon, XCircleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const ActivityList = ({ activities, loading }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'code_created':
        return <PlusIcon className="h-5 w-5 text-green-500" />;
      case 'code_used':
        return <CheckCircleIcon className="h-5 w-5 text-blue-500" />;
      case 'code_expired':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      case 'profile_updated':
        return <UserIcon className="h-5 w-5 text-yellow-500" />;
      case 'payment_completed':
        return <CheckCircleIcon className="h-5 w-5 text-green-600" />;
      case 'login':
        return <ClockIcon className="h-5 w-5 text-gray-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'active': { text: 'Hoạt động', className: 'bg-green-100 text-green-800' },
      'used': { text: 'Đã sử dụng', className: 'bg-blue-100 text-blue-800' },
      'expired': { text: 'Hết hạn', className: 'bg-red-100 text-red-800' }
    };

    const config = statusConfig[status] || { text: status, className: 'bg-gray-100 text-gray-800' };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
        {config.text}
      </span>
    );
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Không rõ';
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Hoạt động mới</h2>
          <p className="text-sm text-gray-600 mt-1">
            Theo dõi các hoạt động gần đây của bạn
          </p>
        </div>
      </div>
      
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loading size="lg" />
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <ClockIcon className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-sm font-medium text-gray-900 mb-1">Chưa có hoạt động nào</h3>
            <p className="text-sm text-gray-500">Các hoạt động của bạn sẽ hiển thị ở đây</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {activities.map((activity) => (
              <div key={activity.id} className="p-6 hover:bg-gray-50 transition-colors duration-150">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 mt-1">
                    {getActivityIcon(activity.type)}
                  </div>
                  
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 mb-1">
                          {activity.description}
                        </p>
                        
                        {activity.details && (
                          <div className="space-y-1">
                            {activity.details.code && (
                              <div className="flex items-center space-x-2">
                                <span className="text-xs text-gray-500">Mã:</span>
                                <code className="text-xs font-mono bg-gray-100 px-2 py-1 rounded text-gray-800">
                                  {activity.details.code}
                                </code>
                              </div>
                            )}
                            
                            {activity.details.status && (
                              <div className="flex items-center space-x-2">
                                <span className="text-xs text-gray-500">Trạng thái:</span>
                                {getStatusBadge(activity.details.status)}
                              </div>
                            )}
                            
                            {activity.details.createdBy && (
                              <div className="flex items-center space-x-2">
                                <span className="text-xs text-gray-500">Người tạo:</span>
                                <span className="text-xs text-gray-700">{activity.details.createdBy}</span>
                              </div>
                            )}
                            
                            {activity.details.expiredAt && (
                              <div className="flex items-center space-x-2">
                                <span className="text-xs text-gray-500">Hết hạn:</span>
                                <span className="text-xs text-gray-700">
                                  {formatDate(activity.details.expiredAt)}
                                </span>
                              </div>
                            )}
                            
                            {activity.details.amount && (
                              <div className="flex items-center space-x-2">
                                <span className="text-xs text-gray-500">Số tiền:</span>
                                <span className="text-xs font-semibold text-green-600">{activity.details.amount}</span>
                              </div>
                            )}
                            
                            {activity.details.device && (
                              <div className="flex items-center space-x-2">
                                <span className="text-xs text-gray-500">Thiết bị:</span>
                                <span className="text-xs text-gray-700">{activity.details.device}</span>
                              </div>
                            )}
                            
                            {activity.details.field && (
                              <div className="flex items-center space-x-2">
                                <span className="text-xs text-gray-500">Trường:</span>
                                <span className="text-xs text-gray-700">{activity.details.field}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-shrink-0 text-right">
                        <div className="text-xs text-gray-500">
                          {formatDate(activity.timestamp)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityList;