import React, { useState, useEffect } from 'react';
import {
  MagnifyingGlassIcon,
  EyeIcon,
  XMarkIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  PlayIcon,
  PauseIcon,
  SignalIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import RoomSessionAPI from '../../API/apiRoomSession';
import Loading from '../common/Loading';
import Modal from '../common/Modal';
import Button from '../common/Button';

const ActiveRoomManagement = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [stats, setStats] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    loadRooms();
    
    // Auto refresh every 60 seconds
    const interval = setInterval(() => {
      loadRooms();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const loadRooms = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await RoomSessionAPI.getRoomSessions();
      const roomsData = Array.isArray(response) ? response : (response?.data || []);
      
      console.log("Giá trị roomsData là:", roomsData[0]);
      
      // Transform and validate room data
      const transformedRooms = roomsData.map(room => ({
        id: room.id,
        roomCode: room.accessCode || room.accessCodeInfo?.code || 'N/A',
        accessCode: room.accessCode || room.accessCodeInfo?.code || 'N/A',
        matchTitle: room.matchTitle || room.title || 'Không có tiêu đề',
        title: room.matchTitle || room.title || 'Không có tiêu đề',
        status: room.status || 'inactive',
        viewers: (room.clientConnected?.length || 0) + (room.displayConnected?.length || 0),
        maxViewers: room.maxViewers || (room.clientConnected?.length || 0) + (room.displayConnected?.length || 0),
        displayConnected: room.displayConnected || [],
        clientConnected: room.clientConnected || [],
        duration: room.duration || calculateDuration(room.createdAt),
        startTime: room.createdAt,
        createdAt: room.createdAt,
        lastActivity: room.lastActivityAt || room.updatedAt,
        updatedAt: room.updatedAt,
        expiredAt: room.expiredAt,
        participants: [
          ...(room.displayConnected || []).map(id => ({
            id,
            name: `Display-${id.slice(-4)}`,
            role: 'display',
            joinTime: room.createdAt
          })),
          ...(room.clientConnected || []).map(id => ({
            id,
            name: `Client-${id.slice(-4)}`,
            role: 'viewer',
            joinTime: room.createdAt
          }))
        ],
        settings: {
          allowChat: room.allowChat || true,
          isPublic: room.isPublic || false,
          recordStream: room.recordStream || false
        }
      }));
      
      setRooms(transformedRooms);
      calculateStats(transformedRooms);
    } catch (error) {
      console.error('Error loading rooms:', error);
      setError(error.message || 'Không thể tải danh sách phòng');
      setRooms([]);
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  const calculateDuration = (startTime) => {
    if (!startTime) return 0;
    const start = new Date(startTime);
    const now = new Date();
    return Math.floor((now - start) / 1000);
  };

  const calculateStats = (roomsData) => {
    if (!roomsData || roomsData.length === 0) {
      setStats({
        totalActiveRooms: 0,
        totalViewers: 0,
        averageViewersPerRoom: 0,
        peakViewersToday: 0,
        totalRoomsToday: 0
      });
      return;
    }

    const activeRooms = roomsData.filter(room => room.status === 'live' || room.status === 'active');
    const totalViewers = roomsData.reduce((sum, room) => sum + (room.viewers || 0), 0);
    const averageViewers = activeRooms.length > 0 ? (totalViewers / activeRooms.length).toFixed(1) : 0;
    const peakViewers = Math.max(...roomsData.map(room => room.maxViewers || room.viewers || 0), 0);
    
    // Count rooms created today
    const today = new Date().toDateString();
    const roomsToday = roomsData.filter(room => {
      if (!room.startTime && !room.createdAt) return false;
      const roomDate = new Date(room.startTime || room.createdAt).toDateString();
      return roomDate === today;
    }).length;

    setStats({
      totalActiveRooms: activeRooms.length,
      totalViewers,
      averageViewersPerRoom: parseFloat(averageViewers),
      peakViewersToday: peakViewers,
      totalRoomsToday: roomsToday
    });
  };

  const handleCloseRoom = async () => {
    try {
      setLoading(true);
      await RoomSessionAPI.deleteRoomSessionById(selectedRoom.id);
      
      setShowCloseModal(false);
      setSelectedRoom(null);
      await loadRooms();
    } catch (error) {
      console.error('Error closing room:', error);
      setError('Không thể đóng phòng: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKickUser = async (userId) => {
    try {
      setSelectedRoom(prev => ({
        ...prev,
        participants: prev.participants?.filter(p => p.id !== userId) || [],
        viewers: Math.max(0, (prev.viewers || 0) - 1)
      }));
      
      // await RoomSessionAPI.kickUser(selectedRoom.id, userId);
      // await loadRooms();
    } catch (error) {
      console.error('Error kicking user:', error);
      setError('Không thể loại bỏ người dùng: ' + error.message);
    }
  };

  const openDetailModal = (room) => {
    setSelectedRoom(room);
    setShowDetailModal(true);
  };

  const openCloseModal = (room) => {
    setSelectedRoom(room);
    setShowCloseModal(true);
  };

  const formatDuration = (seconds) => {
    if (!seconds || seconds <= 0) return '0s';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    try {
      return new Date(dateString).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'N/A';
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      live: { label: 'Đang phát', color: 'bg-green-100 text-green-800', icon: PlayIcon },
      active: { label: 'Đang hoạt động', color: 'bg-green-100 text-green-800', icon: PlayIcon },
      paused: { label: 'Tạm dừng', color: 'bg-yellow-100 text-yellow-800', icon: PauseIcon },
      ended: { label: 'Đã kết thúc', color: 'bg-gray-100 text-gray-800', icon: XMarkIcon },
      inactive: { label: 'Không hoạt động', color: 'bg-gray-100 text-gray-800', icon: XMarkIcon },
      expired: { label: 'Hết hạn', color: 'bg-red-100 text-red-800', icon: XMarkIcon }
    };

    const config = statusConfig[status] || statusConfig.inactive;
    const IconComponent = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <IconComponent className="h-3 w-3 mr-1" />
        {config.label}
      </span>
    );
  };

  const getSignalStrength = (viewers, maxViewers) => {
    if (!maxViewers || maxViewers === 0) return { color: 'text-gray-400', bars: 1 };
    
    const percentage = (viewers / maxViewers) * 100;
    if (percentage >= 80) return { color: 'text-red-500', bars: 4 };
    if (percentage >= 60) return { color: 'text-yellow-500', bars: 3 };
    if (percentage >= 30) return { color: 'text-green-500', bars: 2 };
    return { color: 'text-gray-400', bars: 1 };
  };

  const filteredRooms = rooms.filter(room => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = !searchTerm ||
      (room.roomCode || room.accessCode || '').toLowerCase().includes(searchLower) ||
      (room.matchTitle || room.title || '').toLowerCase().includes(searchLower) ||
      room.id.toString().includes(searchLower);

    const matchesStatus = !statusFilter || room.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Tính toán phân trang
  const totalPages = Math.ceil(filteredRooms.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRooms = filteredRooms.slice(startIndex, endIndex);

  // Reset trang khi filter thay đổi
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Phòng hoạt động</h1>
        <p className="mt-2 text-sm text-gray-700">Theo dõi và quản lý các phòng trực tiếp đang hoạt động</p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Có lỗi xảy ra</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
              <div className="mt-4">
                <div className="-mx-2 -my-1.5 flex">
                  <button
                    type="button"
                    onClick={loadRooms}
                    className="bg-red-50 px-2 py-1.5 rounded-md text-sm font-medium text-red-800 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-50 focus:ring-red-600"
                  >
                    Thử lại
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats cards */}
      {stats && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ChatBubbleLeftRightIcon className="h-6 w-6 text-blue-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Phòng hoạt động</dt>
                    <dd className="text-2xl font-semibold text-gray-900">{stats.totalActiveRooms}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <UserGroupIcon className="h-6 w-6 text-green-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Tổng người xem</dt>
                    <dd className="text-2xl font-semibold text-gray-900">{stats.totalViewers}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <SignalIcon className="h-6 w-6 text-purple-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">TB người xem/phòng</dt>
                    <dd className="text-2xl font-semibold text-gray-900">{stats.averageViewersPerRoom}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <UserGroupIcon className="h-6 w-6 text-orange-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Peak hôm nay</dt>
                    <dd className="text-2xl font-semibold text-gray-900">{stats.peakViewersToday}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ChatBubbleLeftRightIcon className="h-6 w-6 text-indigo-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Phòng hôm nay</dt>
                    <dd className="text-2xl font-semibold text-gray-900">{stats.totalRoomsToday}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search và Controls */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm theo mã phòng, ID, tiêu đề,..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div>
            <select
              className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">Tất cả trạng thái</option>
              <option value="live">Đang phát</option>
              <option value="active">Đang hoạt động</option>
              <option value="paused">Tạm dừng</option>
              <option value="ended">Đã kết thúc</option>
              <option value="inactive">Không hoạt động</option>
              <option value="expired">Hết hạn</option>
            </select>
          </div>
          <div>
            <button
              onClick={loadRooms}
              disabled={loading}
              className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Đang tải...
                </>
              ) : (
                <>
                  <svg className="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Làm mới
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Rooms table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loading size="lg" />
          </div>
        ) : currentRooms.length === 0 ? (
          <div className="text-center py-12">
            <ChatBubbleLeftRightIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              {rooms.length === 0 ? 'Chưa có phòng nào' : 'Không tìm thấy phòng nào'}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {rooms.length === 0 
                ? 'Hiện tại chưa có phòng nào được tạo.'
                : 'Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác.'
              }
            </p>
            {rooms.length === 0 && (
              <div className="mt-6">
                <button
                  type="button"
                  onClick={loadRooms}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Làm mới
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phòng
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kết nối
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thời gian
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hoạt động cuối
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentRooms.map((room) => {
                    const signal = getSignalStrength(room.viewers || 0, room.maxViewers || room.viewers || 1);
                    return (
                      <tr key={room.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {room.roomCode || room.accessCode || 'N/A'}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {room.id}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(room.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <SignalIcon className={`h-4 w-4 mr-2 ${signal.color}`} />
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                Tổng: {room.viewers || 0}
                              </div>
                              <div className="text-xs text-gray-500">
                                Display: {room.displayConnected?.length || 0} | Client: {room.clientConnected?.length || 0}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {formatDuration(room.duration)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {formatDate(room.startTime || room.createdAt)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(room.lastActivity || room.updatedAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => openDetailModal(room)}
                              className="text-primary-600 hover:text-primary-900"
                              title="Xem chi tiết"
                            >
                              <EyeIcon className="h-4 w-4" />
                            </button>
                            {room.status !== 'ended' && room.status !== 'inactive' && room.status !== 'expired' && (
                              <button
                                onClick={() => openCloseModal(room)}
                                className="text-red-600 hover:text-red-900"
                                title="Đóng phòng"
                              >
                                <XMarkIcon className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Phân trang */}
            {totalPages > 1 && (
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Trước
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Sau
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Hiển thị{' '}
                      <span className="font-medium">{startIndex + 1}</span>
                      {' '}đến{' '}
                      <span className="font-medium">{Math.min(endIndex, filteredRooms.length)}</span>
                      {' '}trong{' '}
                      <span className="font-medium">{filteredRooms.length}</span>
                      {' '}kết quả
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="sr-only">Trang trước</span>
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
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
                      ))}
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="sr-only">Trang sau</span>
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Detail Modal */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title="Chi tiết phòng"
        size="lg"
      >
        {selectedRoom && (
          <div className="space-y-6">
            {/* Room info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Mã phòng</label>
                <p className="text-sm text-gray-900">
                  {selectedRoom.roomCode || selectedRoom.accessCode || 'N/A'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">ID</label>
                <p className="text-sm text-gray-900">{selectedRoom.id}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
                <div className="mt-1">{getStatusBadge(selectedRoom.status)}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Hết hạn</label>
                <p className="text-sm text-gray-900">
                  {selectedRoom.expiredAt ? formatDate(selectedRoom.expiredAt) : 'Không giới hạn'}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Kết nối</label>
                <div className="text-sm text-gray-900">
                  <p>Tổng: {selectedRoom.viewers || 0}</p>
                  <p className="text-xs text-gray-500">
                    Display: {selectedRoom.displayConnected?.length || 0}
                  </p>
                  <p className="text-xs text-gray-500">
                    Client: {selectedRoom.clientConnected?.length || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Thời gian hoạt động</label>
                <p className="text-sm text-gray-900">{formatDuration(selectedRoom.duration)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Tạo lúc</label>
                <p className="text-sm text-gray-900">
                  {formatDate(selectedRoom.startTime || selectedRoom.createdAt)}
                </p>
              </div>
            </div>

            {/* Connection Details */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Chi tiết kết nối</label>
              <div className="space-y-3">
                {selectedRoom.displayConnected && selectedRoom.displayConnected.length > 0 && (
                  <div>
                    <h4 className="text-xs font-medium text-gray-600 uppercase">Display Connected</h4>
                    <div className="mt-1 max-h-24 overflow-y-auto">
                      {selectedRoom.displayConnected.map((id, index) => (
                        <div key={id} className="text-xs text-gray-500 font-mono">
                          {index + 1}. {id}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedRoom.clientConnected && selectedRoom.clientConnected.length > 0 && (
                  <div>
                    <h4 className="text-xs font-medium text-gray-600 uppercase">Client Connected</h4>
                    <div className="mt-1 max-h-24 overflow-y-auto">
                      {selectedRoom.clientConnected.map((id, index) => (
                        <div key={id} className="text-xs text-gray-500 font-mono">
                          {index + 1}. {id}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Settings */}
            {selectedRoom.settings && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cài đặt phòng</label>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedRoom.settings.allowChat || false}
                      disabled
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 text-sm text-gray-900">Cho phép chat</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedRoom.settings.isPublic || false}
                      disabled
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 text-sm text-gray-900">Phòng công khai</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedRoom.settings.recordStream || false}
                      disabled
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 text-sm text-gray-900">Ghi lại stream</label>
                  </div>
                </div>
              </div>
            )}

            {/* Participants - Updated to show actual connected users */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Người tham gia ({selectedRoom.participants?.length || 0})
              </label>
              <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-md">
                {selectedRoom.participants && selectedRoom.participants.length > 0 ? (
                  <ul className="divide-y divide-gray-200">
                    {selectedRoom.participants.map((participant) => (
                      <li key={participant.id} className="p-3 flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{participant.name}</p>
                          <p className="text-xs text-gray-500">
                            {participant.role} • ID: {participant.id}
                          </p>
                        </div>
                        <button
                          onClick={() => handleKickUser(participant.id)}
                          className="text-red-600 hover:text-red-900 text-xs"
                          disabled={participant.role === 'display'}
                          title={participant.role === 'display' ? 'Không thể kick display' : 'Kick user'}
                        >
                          {participant.role === 'display' ? 'Display' : 'Kick'}
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="p-3 text-sm text-gray-500 text-center">Không có người tham gia</p>
                )}
              </div>
            </div>
          </div>
        )}
        <div className="mt-6 flex justify-end space-x-3">
          <Button variant="outline" onClick={() => setShowDetailModal(false)}>
            Đóng
          </Button>
          {selectedRoom?.status !== 'ended' && selectedRoom?.status !== 'inactive' && selectedRoom?.status !== 'expired' && (
            <Button variant="danger" onClick={() => openCloseModal(selectedRoom)}>
              Đóng phòng
            </Button>
          )}
        </div>
      </Modal>

      {/* Close Room Modal */}
      <Modal
        isOpen={showCloseModal}
        onClose={() => setShowCloseModal(false)}
        title="Đóng phòng"
      >
        {selectedRoom && (
          <div>
            <p className="text-sm text-gray-500">
              Bạn có chắc chắn muốn đóng phòng{' '}
              <span className="font-medium">
                {selectedRoom.roomCode || selectedRoom.accessCode}
              </span>{' '}
              (ID: {selectedRoom.id})? 
              Tất cả người xem sẽ bị ngắt kết nối và không thể truy cập phòng này nữa.
            </p>
            {selectedRoom.viewers > 0 && (
              <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-sm text-yellow-800">
                  <strong>Cảnh báo:</strong> Hiện tại có {selectedRoom.viewers} kết nối đang hoạt động 
                  ({selectedRoom.displayConnected?.length || 0} display, {selectedRoom.clientConnected?.length || 0} client).
                </p>
              </div>
            )}
          </div>
        )}
        <div className="mt-6 flex justify-end space-x-3">
          <Button variant="outline" onClick={() => setShowCloseModal(false)}>
            Hủy
          </Button>
          <Button variant="danger" onClick={handleCloseRoom}>
            Đóng phòng
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default ActiveRoomManagement;
