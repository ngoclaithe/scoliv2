import React, { useState } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';
import { useAuth } from '../../contexts/AuthContext';

const MatchCodeEntry = () => {
  const { enterMatchCode, loading, user } = useAuth();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!code.trim()) {
      setError('Vui lòng nhập mã trận đấu');
      return;
    }

    const result = await enterMatchCode(code);
    if (!result.success) {
      setError(result.error);
    }
    // Nếu thành công, AuthContext sẽ tự động cập nhật authType
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-600 to-blue-800 px-4">
      <div className="w-full max-w-sm bg-white rounded-lg shadow-xl">
        {/* Header */}
        <div className="text-center py-4 bg-gradient-to-r from-green-600 to-blue-600 rounded-t-lg">
          <div className="w-12 h-12 bg-white rounded-full mx-auto mb-2 flex items-center justify-center">
            <span className="text-2xl">🔑</span>
          </div>
          <h1 className="text-white text-sm font-bold">Nhập mã trận đấu</h1>
        </div>

        <div className="p-4">
          <div className="text-center mb-4">
            <p className="text-xs text-gray-600 mb-2">
              Chào <strong>{user?.name}</strong>!
            </p>
            <p className="text-xs text-gray-600">
              Để quản lý trận đấu, vui lòng nhập mã code:
            </p>
          </div>

          {error && (
            <div className="mb-3 p-2 bg-red-100 border border-red-400 text-red-700 rounded text-xs">
              {error}
            </div>
          )}

          <form className="space-y-3" onSubmit={handleSubmit}>
            <div>
              <Input
                type="text"
                placeholder="Nhập mã trận đấu"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full text-center font-mono text-sm"
                required
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              loading={loading}
              className="w-full bg-gradient-to-r from-green-500 to-blue-600 text-white font-bold py-2 rounded text-sm"
            >
              {loading ? "Đang xử lý..." : "Xác nhận"}
            </Button>
          </form>

          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <h4 className="text-xs font-medium text-blue-800 mb-2">
              💡 Hướng dẫn:
            </h4>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• Nhập mã code để truy cập quản lý trận đấu</li>
              <li>• Với tài khoản đã đăng nhập, bạn vẫn cần code để quản lý trận</li>
              <li>• Liên hệ admin để lấy mã trận đấu</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-2 bg-gray-50 rounded-b-lg">
          <a
            href="tel:0966 335 502"
            className="text-xs text-gray-600 hover:text-blue-600"
          >
            📞 Hotline: 0966 335 502
          </a>
        </div>
      </div>
    </div>
  );
};

export default MatchCodeEntry;
