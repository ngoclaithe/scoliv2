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
  const matchDataChanged = JSON.stringify(prevProps.matchData) !== JSON.stringify(nextProps.matchData);
  const accessCodeChanged = prevProps.accessCode !== nextProps.accessCode;
  const initialDataChanged = JSON.stringify(prevProps.initialData) !== JSON.stringify(nextProps.initialData);
  return !matchDataChanged && !accessCodeChanged && !initialDataChanged;
});

export default MemoizedPosterManager;
