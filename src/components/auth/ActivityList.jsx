import React from 'react';
import Loading from '../common/Loading';
import { PlusIcon, ClockIcon, UserIcon } from '@heroicons/react/24/outline';

const ActivityList = ({ activities, loading }) => {
  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Hoạt động mới</h2>
      </div>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loading size="lg" />
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {activities.map((activity) => (
              <div key={activity.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    {activity.type === 'code_created' && <PlusIcon className="h-5 w-5 text-green-500" />}
                    {activity.type === 'code_used' && <UserIcon className="h-5 w-5 text-blue-500" />}
                    {activity.type === 'profile_updated' && <UserIcon className="h-5 w-5 text-yellow-500" />}
                    {activity.type === 'payment_completed' && <ClockIcon className="h-5 w-5 text-green-600" />}
                    {activity.type === 'login' && <ClockIcon className="h-5 w-5 text-gray-500" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {activity.description}
                        </p>
                        {activity.details && (
                          <p className="text-xs text-gray-500 mt-1">
                            {activity.details.code && `Mã: ${activity.details.code}`}
                            {activity.details.amount && `Số tiền: ${activity.details.amount}`}
                            {activity.details.device && `Thiết bị: ${activity.details.device}`}
                            {activity.details.field && `Trường: ${activity.details.field}`}
                          </p>
                        )}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(activity.timestamp).toLocaleString('vi-VN')}
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
