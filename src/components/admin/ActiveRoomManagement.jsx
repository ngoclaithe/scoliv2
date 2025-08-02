import React, { useState, useEffect } from 'react';
import {
  MagnifyingGlassIcon,
  EyeIcon,
  XMarkIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  PlayIcon,
  PauseIcon,
  SignalIcon
} from '@heroicons/react/24/outline';
import adminAPI from '../../API/apiAdmin';
import Loading from '../common/Loading';
import Modal from '../common/Modal';
import Button from '../common/Button';

const ActiveRoomManagement = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadRooms();
    loadStats();
    
    // Auto refresh every 30 seconds
    const interval = setInterval(() => {
      loadRooms();
      loadStats();
    }, 30000);

    return () => clearInterval(interval);
  }, [searchTerm]);

  const loadRooms = async () => {
    try {
      setLoading(true);
      
      // Mock data for demo
      const mockData = {
        data: [
          {
            id: 1,
            roomCode: 'ABC123',
            matchTitle: 'Đội A vs Đội B',
            hostName: 'Nguyễn Văn A',
            hostEmail: 'nguyenvana@example.com',
            status: 'live',
            viewers: 45,
            maxViewers: 100,
            duration: 3600, // seconds
            startTime: '2024-01-20T14:30:00Z',
            lastActivity: '2024-01-20T15:25:00Z',
            streamUrl: 'https://stream.example.com/abc123',
            settings: {
              allowChat: true,
              isPublic: true,
              recordStream: false
            },
            participants: [
              { id: 1, name: 'User 1', joinTime: '2024-01-20T14:35:00Z', role: 'viewer' },
              { id: 2, name: 'User 2', joinTime: '2024-01-20T14:40:00Z', role: 'viewer' },
              { id: 3, name: 'User 3', joinTime: '2024-01-20T14:45:00Z', role: 'moderator' }
            ]
          },
          {
            id: 2,
            roomCode: 'XYZ789',
            matchTitle: 'Đội C vs Đội D',
            hostName: 'Trần Thị B',
            hostEmail: 'tranthib@example.com',
            status: 'paused',
            viewers: 23,
            maxViewers: 50,
            duration: 2400,
            startTime: '2024-01-20T13:00:00Z',
            lastActivity: '2024-01-20T15:20:00Z',
            streamUrl: 'https://stream.example.com/xyz789',
            settings: {
              allowChat: false,
              isPublic: true,
              recordStream: true
            },
            participants: [
              { id: 4, name: 'User 4', joinTime: '2024-01-20T13:05:00Z', role: 'viewer' },
              { id: 5, name: 'User 5', joinTime: '2024-01-20T13:10:00Z', role: 'viewer' }
            ]
          },
          {
            id: 3,
            roomCode: 'DEF456',
            matchTitle: 'Đội E vs Đội F',
            hostName: 'Lê Văn C',
            hostEmail: 'levanc@example.com',
            status: 'ended',
            viewers: 0,
            maxViewers: 150,
            duration: 5400,
            startTime: '2024-01-20T10:00:00Z',
            lastActivity: '2024-01-20T11:30:00Z',
            streamUrl: 'https://stream.example.com/def456',
            settings: {
              allowChat: true,
              isPublic: false,
              recordStream: true
            },
            participants: []
          }
        ]
      };

      setRooms(mockData.data);
    } catch (error) {
      console.error('Error loading rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      // Mock stats for demo
      const mockStats = {
        totalActiveRooms: 12,
        totalViewers: 234,
        averageViewersPerRoom: 19.5,
        peakViewersToday: 89,
        totalRoomsToday: 45
      };
      setStats(mockStats);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleCloseRoom = async () => {
    try {
      setLoading(true);
      // In production: await adminAPI.activeRooms.closeRoom(selectedRoom.id);
      
      // Mock success
      setShowCloseModal(false);
      setSelectedRoom(null);
      loadRooms();
    } catch (error) {
      console.error('Error closing room:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleKickUser = async (userId) => {
    try {
      // In production: await adminAPI.activeRooms.kickUser(selectedRoom.id, userId);
      
      // Mock success - remove user from participants
      setSelectedRoom(prev => ({
        ...prev,
        participants: prev.participants.filter(p => p.id !== userId)
      }));
      
      loadRooms();
    } catch (error) {
      console.error('Error kicking user:', error);
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      live: { label: 'Đang phát', color: 'bg-green-100 text-green-800', icon: PlayIcon },
      paused: { label: 'Tạm dừng', color: 'bg-yellow-100 text-yellow-800', icon: PauseIcon },
      ended: { label: 'Đã kết thúc', color: 'bg-gray-100 text-gray-800', icon: XMarkIcon }
    };

    const config = statusConfig[status] || statusConfig.ended;
    const IconComponent = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <IconComponent className="h-3 w-3 mr-1" />
        {config.label}
      </span>
    );
  };

  const getSignalStrength = (viewers, maxViewers) => {
    const percentage = (viewers / maxViewers) * 100;
    if (percentage >= 80) return { color: 'text-red-500', bars: 4 };
    if (percentage >= 60) return { color: 'text-yellow-500', bars: 3 };
    if (percentage >= 30) return { color: 'text-green-500', bars: 2 };
    return { color: 'text-gray-400', bars: 1 };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Phòng hoạt động</h1>
        <p className="mt-2 text-sm text-gray-700">Theo dõi và quản lý các phòng trực tiếp đang hoạt động</p>
      </div>

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

      {/* Search */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm theo mã phòng, tiêu đề..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div>
            <select className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500">
              <option value="">Tất cả trạng thái</option>
              <option value="live">Đang phát</option>
              <option value="paused">Tạm dừng</option>
              <option value="ended">Đã kết thúc</option>
            </select>
          </div>
        </div>
      </div>

      {/* Rooms table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loading size="lg" />
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
                      Host
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Người xem
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
                  {rooms.map((room) => {
                    const signal = getSignalStrength(room.viewers, room.maxViewers);
                    return (
                      <tr key={room.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{room.roomCode}</div>
                          <div className="text-sm text-gray-500 max-w-xs truncate">{room.matchTitle}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{room.hostName}</div>
                          <div className="text-sm text-gray-500">{room.hostEmail}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(room.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <SignalIcon className={`h-4 w-4 mr-2 ${signal.color}`} />
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {room.viewers}/{room.maxViewers}
                              </div>
                              <div className="w-16 bg-gray-200 rounded-full h-1.5">
                                <div
                                  className="bg-primary-600 h-1.5 rounded-full"
                                  style={{ width: `${(room.viewers / room.maxViewers) * 100}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{formatDuration(room.duration)}</div>
                          <div className="text-sm text-gray-500">{formatDate(room.startTime)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(room.lastActivity)}
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
                            {room.status !== 'ended' && (
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
                <p className="text-sm text-gray-900">{selectedRoom.roomCode}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
                <div className="mt-1">{getStatusBadge(selectedRoom.status)}</div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Tiêu đề trận đấu</label>
              <p className="text-sm text-gray-900">{selectedRoom.matchTitle}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Host</label>
                <p className="text-sm text-gray-900">{selectedRoom.hostName}</p>
                <p className="text-sm text-gray-500">{selectedRoom.hostEmail}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Số người xem</label>
                <p className="text-sm text-gray-900">{selectedRoom.viewers}/{selectedRoom.maxViewers}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Thời gian phát</label>
                <p className="text-sm text-gray-900">{formatDuration(selectedRoom.duration)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Bắt đầu lúc</label>
                <p className="text-sm text-gray-900">{formatDate(selectedRoom.startTime)}</p>
              </div>
            </div>

            {/* Settings */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cài đặt phòng</label>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedRoom.settings.allowChat}
                    disabled
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-900">Cho phép chat</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedRoom.settings.isPublic}
                    disabled
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-900">Phòng công khai</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedRoom.settings.recordStream}
                    disabled
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-900">Ghi lại stream</label>
                </div>
              </div>
            </div>

            {/* Participants */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Người tham gia ({selectedRoom.participants.length})
              </label>
              <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-md">
                {selectedRoom.participants.length > 0 ? (
                  <ul className="divide-y divide-gray-200">
                    {selectedRoom.participants.map((participant) => (
                      <li key={participant.id} className="p-3 flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{participant.name}</p>
                          <p className="text-xs text-gray-500">
                            {participant.role} • Tham gia: {formatDate(participant.joinTime)}
                          </p>
                        </div>
                        <button
                          onClick={() => handleKickUser(participant.id)}
                          className="text-red-600 hover:text-red-900 text-xs"
                        >
                          Kick
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
          {selectedRoom?.status !== 'ended' && (
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
              Bạn có chắc chắn muốn đóng phòng <span className="font-medium">{selectedRoom.roomCode}</span>? 
              Tất cả người xem sẽ bị ngắt kết nối và không thể truy cập phòng này nữa.
            </p>
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
