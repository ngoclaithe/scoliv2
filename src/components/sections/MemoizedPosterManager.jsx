import React, { memo } from 'react';
import PosterManager from '../poster/PosterManager';

const MemoizedPosterManager = memo(({
  matchData,
  accessCode,
  initialData,
  onPosterUpdate,
  onLogoUpdate,
  onPositionChange,
  onClose
}) => {
  return (
    <PosterManager
      matchData={matchData}
      accessCode={accessCode}
      initialData={initialData}
      onPosterUpdate={onPosterUpdate}
      onLogoUpdate={onLogoUpdate}
      onPositionChange={onPositionChange}
      onClose={onClose}
    />
  );
}, (prevProps, nextProps) => {
  // Custom comparison - chỉ re-render khi thực sự cần thiết
  const matchDataChanged = JSON.stringify(prevProps.matchData) !== JSON.stringify(nextProps.matchData);
  const accessCodeChanged = prevProps.accessCode !== nextProps.accessCode;
  const initialDataChanged = JSON.stringify(prevProps.initialData) !== JSON.stringify(nextProps.initialData);
  
  // Callbacks không so sánh vì chúng có thể thay đổi reference nhưng logic giống nhau
  
  // Return true để KHÔNG re-render, false để re-render
  return !matchDataChanged && !accessCodeChanged && !initialDataChanged;
});

export default MemoizedPosterManager;
