export const logContextState = (contextName, state) => {
  console.group(`🔍 [${contextName}] Context State Debug`);
  
  Object.entries(state).forEach(([key, value]) => {
    if (typeof value === 'function') {
      console.log(`📞 ${key}: [Function]`);
    } else if (typeof value === 'object' && value !== null) {
      console.log(`📦 ${key}:`, value);
    } else {
      console.log(`📄 ${key}:`, value);
    }
  });
  
  console.groupEnd();
};

export const logRouteInfo = (params, location) => {
  // console.group('🛣️ [Route] Debug Info');
  // console.log('📍 Location:', location.pathname);
  // console.log('🔗 Params:', params);
  
  const hasUrlParams = Boolean(
    params.location || params.matchTitle || params.liveText || 
    params.teamALogoCode || params.teamBLogoCode || 
    params.teamAName || params.teamBName || 
    params.teamAKitColor || params.teamBKitColor || 
    params.teamAScore || params.teamBScore ||
    params.view || params.matchTime
  );
  
  // console.log('❓ Has URL Params:', hasUrlParams);
  console.groupEnd();
};

export const logSocketOperation = (operation, data, canSend, isConnected) => {
  const status = canSend && isConnected ? '✅ SENT' : '❌ BLOCKED';
  console.log(`🔌 [Socket] ${operation} - ${status}:`, {
    data,
    canSend,
    isConnected
  });
};
