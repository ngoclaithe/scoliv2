import React, { useState, useEffect } from 'react';
import {
  WifiIcon,
  ClockIcon,
  ServerIcon,
  UsersIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import Loading from '../common/Loading';
import SocketAPI from '../../API/apiSocket';

const SocketStatusManagement = () => {
  const [socketStatus, setSocketStatus] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadSocketData();
    // Auto refresh mỗi 30 giây
    const interval = setInterval(loadSocketData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadSocketData = async () => {
    try {
      setError(null);
      if (!loading) setRefreshing(true);

      const [statusResponse, roomsResponse] = await Promise.allSettled([
        SocketAPI.getStatus(),
        SocketAPI.getRooms()
      ]);

      if (statusResponse.status === 'fulfilled') {
        setSocketStatus(statusResponse.value);
      } else {
        console.error('Error loading socket status:', statusResponse.reason);
      }

      if (roomsResponse.status === 'fulfilled') {
        setRooms(roomsResponse.value?.data || []);
      } else {
        console.error('Error loading rooms:', roomsResponse.reason);
      }

      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error loading socket data:', error);
      setError('Không thể tải dữ liệu trạng thái socket');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    loadSocketData();
  };

  const formatUptime = (seconds) => {
    if (!seconds) return 'N/A';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  const formatRelativeTime = (date) => {
    if (!date) return 'Chưa có';
    
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Vừa xong';
    if (minutes < 60) return `${minutes} phút trước`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} giờ trước`;
    
    const days = Math.floor(hours / 24);
    return `${days} ngày trước`;
  };

  const getStatusColor = (isConnected) => {
    return isConnected 
      ? 'text-green-600 bg-green-50 border-green-200' 
      : 'text-red-600 bg-red-50 border-red-200';
  };

  const getStatusIcon = (isConnected) => {
    return isConnected 
      ? <CheckCircleIcon className="h-5 w-5 text-green-600" />
      : <XCircleIcon className="h-5 w-5 text-red-600" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loading size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <ExclamationTriangleIcon className="h-12 w-12 text-red-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-red-800 mb-2">Lỗi tải dữ liệu</h3>
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={handleRefresh}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <ArrowPathIcon className="h-4 w-4 inline mr-2" />
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Trạng thái Server Socket</h1>
          <p className="text-gray-600 mt-1">Giám sát tình trạng kết nối và hoạt động của socket server</p>
        </div>
        <div className="flex items-center gap-3">
          {lastUpdate && (
            <span className="text-sm text-gray-500">
              Cập nhật: {formatRelativeTime(lastUpdate)}
            </span>
          )}
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <ArrowPathIcon className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Đang tải...' : 'Làm mới'}
          </button>
        </div>
      </div>

      {/* Socket Status Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Server Status */}
        <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-slate-200">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="bg-blue-50 p-3 rounded-xl">
                  <ServerIcon className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-slate-600 truncate">Server Status</dt>
                  <dd className="flex items-center mt-1">
                    {socketStatus?.success ? (
                      <span className="flex items-center text-green-600 font-semibold">
                        <CheckCircleIcon className="h-4 w-4 mr-1" />
                        Hoạt động
                      </span>
                    ) : (
                      <span className="flex items-center text-red-600 font-semibold">
                        <XCircleIcon className="h-4 w-4 mr-1" />
                        Lỗi
                      </span>
                    )}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Connected Clients */}
        <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-slate-200">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="bg-green-50 p-3 rounded-xl">
                  <UsersIcon className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-slate-600 truncate">Connections</dt>
                  <dd className="text-2xl font-bold text-slate-900">
                    {socketStatus?.data?.connections || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Active Rooms */}
        <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-slate-200">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="bg-purple-50 p-3 rounded-xl">
                  <WifiIcon className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-slate-600 truncate">Rooms</dt>
                  <dd className="text-2xl font-bold text-slate-900">
                    {socketStatus?.data?.rooms || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Uptime */}
        <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-slate-200">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="bg-orange-50 p-3 rounded-xl">
                  <ClockIcon className="h-6 w-6 text-orange-600" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-slate-600 truncate">Uptime</dt>
                  <dd className="text-lg font-bold text-slate-900">
                    {formatUptime(socketStatus?.data?.uptime)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rooms Table */}
      <div className="bg-white shadow-lg rounded-xl border border-slate-200">
        <div className="px-6 py-4 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-gray-900">Phòng hoạt động</h3>
          <p className="text-sm text-gray-600 mt-1">Danh sách các phòng socket đang hoạt động</p>
        </div>
        
        {rooms.length === 0 ? (
          <div className="p-6 text-center">
            <WifiIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Không có phòng hoạt động</h3>
            <p className="text-gray-600">Hiện tại không có phòng socket nào đang hoạt động.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phòng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Số clients
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thời gian tạo
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {rooms.map((room, index) => (
                  <tr key={room.roomId || index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8">
                          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-600">
                              {room.roomId?.charAt(0) || '#'}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {room.roomId || `Room ${index + 1}`}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{room.clientCount || 0}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(room.isActive !== false)}`}>
                        {getStatusIcon(room.isActive !== false)}
                        <span className="ml-1">
                          {room.isActive !== false ? 'Hoạt động' : 'Không hoạt động'}
                        </span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {room.createdAt ? formatRelativeTime(new Date(room.createdAt)) : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Server Details */}
      {socketStatus?.data && (
        <div className="bg-white shadow-lg rounded-xl border border-slate-200">
          <div className="px-6 py-4 border-b border-slate-200">
            <h3 className="text-lg font-semibold text-gray-900">Chi tiết Server</h3>
          </div>
          <div className="p-6">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Memory Usage</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {socketStatus.data.memoryUsage ? 
                    `${Math.round(socketStatus.data.memoryUsage.used / 1024 / 1024)} MB / ${Math.round(socketStatus.data.memoryUsage.total / 1024 / 1024)} MB` 
                    : 'N/A'
                  }
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Node.js Version</dt>
                <dd className="mt-1 text-sm text-gray-900">{socketStatus.data.nodeVersion || 'N/A'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Platform</dt>
                <dd className="mt-1 text-sm text-gray-900">{socketStatus.data.platform || 'N/A'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">CPU Usage</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {socketStatus.data.cpuUsage ? `${socketStatus.data.cpuUsage.toFixed(2)}%` : 'N/A'}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      )}
    </div>
  );
};

export default SocketStatusManagement;
