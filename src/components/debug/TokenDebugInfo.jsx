import React from 'react';
import TokenUtils from '../../utils/tokenUtils';

const TokenDebugInfo = () => {
  const userToken = TokenUtils.getUserToken();
  const adminToken = TokenUtils.getAdminToken();
  const isUserAuth = TokenUtils.isUserAuthenticated();
  const isAdminAuth = TokenUtils.isAdminAuthenticated();

  return (
    <div className="fixed bottom-4 right-4 bg-gray-900 text-white p-3 rounded-lg text-xs max-w-sm opacity-75 hover:opacity-100 transition-opacity">
      <div className="font-bold mb-2">🔍 Token Debug Info</div>
      <div className="space-y-1">
        <div>
          <span className="text-blue-300">User Token:</span> 
          <span className="ml-1">{userToken ? '✅ Có' : '❌ Không'}</span>
        </div>
        <div>
          <span className="text-purple-300">Admin Token:</span> 
          <span className="ml-1">{adminToken ? '✅ Có' : '❌ Không'}</span>
        </div>
        <div className="mt-2 pt-2 border-t border-gray-700">
          <div>
            <span className="text-green-300">User Auth:</span> 
            <span className="ml-1">{isUserAuth ? '✅' : '❌'}</span>
          </div>
          <div>
            <span className="text-orange-300">Admin Auth:</span> 
            <span className="ml-1">{isAdminAuth ? '✅' : '❌'}</span>
          </div>
        </div>
        <div className="mt-2 pt-2 border-t border-gray-700 text-gray-400">
          <div>Route: {window.location.pathname}</div>
        </div>
      </div>
    </div>
  );
};

export default TokenDebugInfo;
