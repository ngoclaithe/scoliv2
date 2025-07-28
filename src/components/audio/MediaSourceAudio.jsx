import React, { useRef, useEffect, useState } from 'react';

const MediaSourceAudio = ({ audioFile, isEnabled = true, onEnded }) => {
  const audioRef = useRef(null);
  const mediaSourceRef = useRef(null);
  const sourceBufferRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isEnabled || !audioFile) return;

    const loadAudioWithMediaSource = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Create MediaSource
        const mediaSource = new MediaSource();
        mediaSourceRef.current = mediaSource;

        const audio = audioRef.current;
        if (!audio) return;

        // Set up MediaSource URL
        audio.src = URL.createObjectURL(mediaSource);

        mediaSource.addEventListener('sourceopen', async () => {
          try {
            // Create source buffer for audio/mpeg
            const sourceBuffer = mediaSource.addSourceBuffer('audio/mpeg');
            sourceBufferRef.current = sourceBuffer;

            // Fetch audio file
            const response = await fetch(audioFile);
            if (!response.ok) {
              throw new Error(`Failed to fetch audio: ${response.status}`);
            }

            const arrayBuffer = await response.arrayBuffer();

            // Append data to source buffer
            sourceBuffer.addEventListener('updateend', () => {
              if (!sourceBuffer.updating && mediaSource.readyState === 'open') {
                mediaSource.endOfStream();
                setIsLoading(false);
                
                // Auto-play if enabled
                audio.play().catch(err => {
                  console.warn('Auto-play failed:', err);
                });
              }
            });

            sourceBuffer.appendBuffer(arrayBuffer);

          } catch (err) {
            console.error('Error setting up MediaSource:', err);
            setError(err.message);
            setIsLoading(false);
          }
        });

        mediaSource.addEventListener('sourceended', () => {
          console.log('MediaSource ended');
        });

        // Handle audio events
        audio.addEventListener('ended', () => {
          onEnded && onEnded();
        });

        audio.addEventListener('error', (e) => {
          console.error('Audio error:', e);
          setError('Audio playback error');
          setIsLoading(false);
        });

      } catch (err) {
        console.error('Error loading audio with MediaSource:', err);
        setError(err.message);
        setIsLoading(false);
      }
    };

    loadAudioWithMediaSource();

    // Cleanup
    return () => {
      const audio = audioRef.current;
      if (audio) {
        audio.pause();
        audio.removeAttribute('src');
        audio.load();
      }

      if (mediaSourceRef.current) {
        try {
          if (mediaSourceRef.current.readyState === 'open') {
            mediaSourceRef.current.endOfStream();
          }
        } catch (err) {
          console.warn('Error closing MediaSource:', err);
        }
      }
    };
  }, [audioFile, isEnabled]);

  if (!isEnabled) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-black/20 backdrop-blur-sm rounded-lg p-2">
      <audio
        ref={audioRef}
        controls={false}
        style={{ display: 'none' }}
      />
      
      {isLoading && (
        <div className="flex items-center space-x-2 text-white text-sm">
          <div className="animate-spin">🎵</div>
          <span>Loading audio...</span>
        </div>
      )}
      
      {error && (
        <div className="flex items-center space-x-2 text-red-300 text-sm">
          <span>⚠️</span>
          <span>Audio error</span>
        </div>
      )}
    </div>
  );
};

export default MediaSourceAudio;
