class AudioManager {
  constructor() {
    this.audioRef = null;
    this.refereeVoiceRef = null;
    this.userInteracted = false;
    this.volume = 0.7;
    this.isMuted = false;
    this.audioEnabled = true;

    this.lastRefereeVoiceTime = 0;
    this.refereeVoiceMinInterval = 50; 
    this.refereeVoiceQueue = [];
    this.isProcessingQueue = false;
    
    this.activeBlobUrls = new Set();
    
    this.supportedFormats = this.detectSupportedFormats();
    
    this.audioFiles = {
      poster: '/audio/poster.mp3',
      rasan: '/audio/rasan.mp3',
      gialap: '/audio/gialap.mp3',
    };

    this.setupUserInteractionListeners();
    
    // console.log('🎵 AudioManager initialized with supported formats:', this.supportedFormats);
  }

  detectSupportedFormats() {
    const audio = document.createElement('audio');
    const formats = {
      webm_opus: audio.canPlayType('audio/webm; codecs="opus"'),
      webm: audio.canPlayType('audio/webm'),
      ogg_opus: audio.canPlayType('audio/ogg; codecs="opus"'),
      ogg: audio.canPlayType('audio/ogg'),
      mp4: audio.canPlayType('audio/mp4'),
      wav: audio.canPlayType('audio/wav'),
      mpeg: audio.canPlayType('audio/mpeg')
    };

    // console.log('🔍 Browser audio format support:', formats);
    return formats;
  }

  getBestPlaybackFormat() {
    const formatPriority = [
      'audio/webm; codecs="opus"',
      'audio/ogg; codecs="opus"', 
      'audio/webm',
      'audio/ogg',
      'audio/wav',
      'audio/mp4',
      'audio/mpeg'
    ];

    for (const format of formatPriority) {
      const audio = document.createElement('audio');
      const support = audio.canPlayType(format);
      if (support === 'probably' || support === 'maybe') {
        console.log('🎯 Best playback format:', format, '(support:', support + ')');
        return format;
      }
    }

    console.warn('⚠️ No optimal audio format found, using fallback');
    return 'audio/wav'; 
  }

  setupUserInteractionListeners() {
    const handleUserInteraction = () => {
      console.log('🎵 User interaction detected');
      this.userInteracted = true;
      
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };

    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('keydown', handleUserInteraction);
    document.addEventListener('touchstart', handleUserInteraction);
  }

  validateAudioBlob(audioBlob, expectedMimeType = null) {
    if (!audioBlob) {
      console.error('❌ Audio blob is null or undefined');
      return false;
    }

    if (!(audioBlob instanceof Blob)) {
      console.error('❌ Provided data is not a Blob:', typeof audioBlob);
      return false;
    }

    if (audioBlob.size === 0) {
      console.error('❌ Audio blob is empty (0 bytes)');
      return false;
    }

    if (audioBlob.size < 100) { 
      console.warn('⚠️ Audio blob very small:', audioBlob.size, 'bytes - might be corrupted');
    }

    if (audioBlob.size > 10 * 1024 * 1024) { 
      console.error('❌ Audio blob too large:', audioBlob.size, 'bytes');
      return false;
    }

    const blobType = audioBlob.type || expectedMimeType;
    if (!blobType) {
      console.warn('⚠️ Audio blob has no MIME type, will attempt playback anyway');
    } else if (!blobType.startsWith('audio/')) {
      console.warn('⚠️ Audio blob MIME type suspicious:', blobType);
    } else {
      // Check if browser can play this format
      const audio = document.createElement('audio');
      const canPlay = audio.canPlayType(blobType);
      if (!canPlay || canPlay === 'no') {
        console.warn('⚠️ Browser may not support format:', blobType, '- support:', canPlay);
        return false;
      }
      console.log('✅ Format support check passed:', blobType, '- support:', canPlay);
    }

    console.log('✅ Audio blob validation passed:', {
      size: audioBlob.size,
      type: blobType || 'unknown'
    });

    return true;
  }

  createOptimizedBlob(audioData, originalMimeType) {
    try {
      console.log('🔧 Creating blob from:', {
        dataType: typeof audioData,
        isArrayBuffer: audioData instanceof ArrayBuffer,
        isArray: Array.isArray(audioData),
        isUint8Array: audioData instanceof Uint8Array,
        isBlob: audioData instanceof Blob,
        size: audioData?.byteLength || audioData?.length || audioData?.size || 'unknown'
      });

      // If audioData is already a Blob
      if (audioData instanceof Blob) {
        console.log('✅ Data is already a Blob');
        return audioData;
      }

      // Handle different input types
      let arrayBuffer;
      
      if (audioData instanceof ArrayBuffer) {
        console.log('✅ Data is ArrayBuffer');
        arrayBuffer = audioData;
      } else if (audioData instanceof Uint8Array) {
        console.log('✅ Data is Uint8Array');
        arrayBuffer = audioData.buffer.slice(audioData.byteOffset, audioData.byteOffset + audioData.byteLength);
      } else if (Array.isArray(audioData)) {
        console.log('✅ Data is Array, converting to Uint8Array');
        // Kiểm tra xem array có phải là valid byte array không
        const isValidByteArray = audioData.every(item => 
          typeof item === 'number' && item >= 0 && item <= 255
        );
        
        if (!isValidByteArray) {
          throw new Error('Array contains invalid byte values');
        }
        
        const uint8Array = new Uint8Array(audioData);
        arrayBuffer = uint8Array.buffer;
      } else {
        throw new Error('Unsupported audio data type: ' + typeof audioData);
      }

      // Validate that we have actual audio data
      if (!arrayBuffer || arrayBuffer.byteLength === 0) {
        throw new Error('Empty or invalid audio data');
      }

      console.log('📊 ArrayBuffer info:', {
        byteLength: arrayBuffer.byteLength,
        constructor: arrayBuffer.constructor.name
      });

      // Try to use the original MIME type first
      let mimeType = originalMimeType;
      
      // If no MIME type or unsupported, try to detect or use fallback
      if (!mimeType || !this.canPlayType(mimeType)) {
        mimeType = this.getBestPlaybackFormat();
        console.log('🔄 Using fallback MIME type:', mimeType);
      }

      // Create blob with the determined MIME type
      const blob = new Blob([arrayBuffer], { type: mimeType });
      
      console.log('✅ Created optimized blob:', {
        originalType: originalMimeType,
        finalType: mimeType,
        inputSize: arrayBuffer.byteLength,
        blobSize: blob.size,
        sizesMatch: arrayBuffer.byteLength === blob.size
      });

      // Validate the created blob
      if (blob.size === 0) {
        throw new Error('Created blob is empty');
      }

      return blob;

    } catch (error) {
      console.error('❌ Failed to create optimized blob:', {
        error: error.message,
        audioData: typeof audioData,
        originalMimeType
      });
      
      return null;
    }
  }

  // Check if browser can play type
  canPlayType(mimeType) {
    if (!mimeType) return false;
    const audio = document.createElement('audio');
    const support = audio.canPlayType(mimeType);
    return support === 'probably' || support === 'maybe';
  }

  // Safe blob URL creation
  createSafeBlobUrl(blob) {
    try {
      const url = URL.createObjectURL(blob);
      this.activeBlobUrls.add(url);
      console.log('🔗 Created blob URL:', url.substring(0, 50) + '...');
      return url;
    } catch (error) {
      console.error('❌ Failed to create blob URL:', error);
      return null;
    }
  }

  // Safe blob URL cleanup
  revokeBlobUrl(url) {
    if (!url || !url.startsWith('blob:')) {
      return;
    }

    try {
      URL.revokeObjectURL(url);
      this.activeBlobUrls.delete(url);
    } catch (error) {
      console.warn('⚠️ Error revoking blob URL:', error);
    }
  }

  // Set audio enabled/disabled
  setAudioEnabled(enabled) {
    this.audioEnabled = enabled;
    if (!enabled) {
      this.stopAllAudio();
    }
  }

  // Set volume
  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
    
    // Update current audio elements
    if (this.audioRef) {
      this.audioRef.volume = this.isMuted ? 0 : this.volume;
    }
    if (this.refereeVoiceRef) {
      this.refereeVoiceRef.volume = this.isMuted ? 0 : this.volume;
    }
  }

  // Toggle mute
  setMuted(muted) {
    this.isMuted = muted;
    
    // Update current audio elements
    if (this.audioRef) {
      this.audioRef.volume = this.isMuted ? 0 : this.volume;
    }
    if (this.refereeVoiceRef) {
      this.refereeVoiceRef.volume = this.isMuted ? 0 : this.volume;
    }
  }

  // Play regular audio
  playAudio(audioKey) {
    console.log('🎵 Play audio request:', { audioKey, audioEnabled: this.audioEnabled });

    if (!this.audioEnabled) {
      console.log('🔇 Audio disabled globally');
      return;
    }

    if (!this.userInteracted) {
      console.log('⏳ User hasn\'t interacted yet, skipping audio');
      return;
    }

    const audioFile = this.audioFiles[audioKey];
    if (!audioFile) {
      console.error('❌ Audio file not found:', audioKey);
      return;
    }

    // Stop current regular audio before playing new one (but keep referee voice)
    this.stopRegularAudio();

    try {
      // console.log('🎵 Creating new audio element:', audioFile);
      const audio = new Audio(audioFile);
      this.audioRef = audio;
      audio.volume = this.isMuted ? 0 : this.volume;

      audio.onended = () => {
        console.log('✅ Audio playback ended');
        this.audioRef = null;
      };

      audio.onerror = (e) => {
        console.error('❌ Audio playback error:', e);
        this.audioRef = null;
      };

      const playPromise = audio.play();
      if (playPromise) {
        playPromise
          .then(() => {
            // console.log('✅ Audio started playing successfully');
          })
          .catch((error) => {
            console.error('❌ Failed to play audio:', error);
            this.audioRef = null;
          });
      }

    } catch (error) {
      console.error('❌ Error creating audio:', error);
      this.audioRef = null;
    }
  }

  // Enhanced referee voice playback with multiple format attempts
  playRefereeVoice(audioData, originalMimeType = null) {
    console.log('🎙️ Playing referee voice request', {
      dataType: typeof audioData,
      originalMimeType,
      dataSize: audioData?.size || audioData?.length || audioData?.byteLength || 'unknown'
    });

    if (!this.audioEnabled) {
      console.log('🔇 Audio disabled globally');
      return;
    }

    // Create optimized blob
    const audioBlob = this.createOptimizedBlob(audioData, originalMimeType);
    if (!audioBlob) {
      console.error('❌ Failed to create audio blob');
      return;
    }

    // Validate the blob
    if (!this.validateAudioBlob(audioBlob, originalMimeType)) {
      return;
    }

    // Throttle check
    const now = Date.now();
    if (now - this.lastRefereeVoiceTime < this.refereeVoiceMinInterval) {
      console.log('🔄 Throttling referee voice - adding to queue');
      this.addToRefereeVoiceQueue(audioBlob);
      return;
    }

    this.lastRefereeVoiceTime = now;
    this.executePlayRefereeVoice(audioBlob);
  }

  // Queue management
  addToRefereeVoiceQueue(audioBlob) {
    // Keep only the latest audio to minimize latency
    this.refereeVoiceQueue = [audioBlob];
    this.processRefereeVoiceQueue();
  }

  async processRefereeVoiceQueue() {
    if (this.isProcessingQueue || this.refereeVoiceQueue.length === 0) {
      return;
    }

    this.isProcessingQueue = true;

    while (this.refereeVoiceQueue.length > 0) {
      const audioBlob = this.refereeVoiceQueue.shift();
      const now = Date.now();

      if (now - this.lastRefereeVoiceTime >= this.refereeVoiceMinInterval) {
        this.lastRefereeVoiceTime = now;
        this.executePlayRefereeVoice(audioBlob);
        await new Promise(resolve => setTimeout(resolve, this.refereeVoiceMinInterval));
      } else {
        const waitTime = this.refereeVoiceMinInterval - (now - this.lastRefereeVoiceTime);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        this.lastRefereeVoiceTime = Date.now();
        this.executePlayRefereeVoice(audioBlob);
      }
    }

    this.isProcessingQueue = false;
  }

  // Enhanced playback execution with fallback formats
  executePlayRefereeVoice(audioBlob) {
    console.log('🎙️ Executing referee voice playback');

    // Stop previous referee voice
    if (this.refereeVoiceRef) {
      try {
        this.refereeVoiceRef.pause();
        if (this.refereeVoiceRef.src) {
          this.revokeBlobUrl(this.refereeVoiceRef.src);
        }
      } catch (error) {
        console.warn('⚠️ Error stopping previous referee voice:', error);
      }
      this.refereeVoiceRef = null;
    }

    // Create URL from blob
    const audioUrl = this.createSafeBlobUrl(audioBlob);
    if (!audioUrl) {
      console.error('❌ Failed to create blob URL');
      return;
    }

    const audio = new Audio();
    
    // Set up comprehensive event handlers
    audio.onloadstart = () => {
      console.log('🎙️ Referee voice loading started');
    };

    audio.oncanplay = () => {
      console.log('🎙️ Referee voice can play');
    };

    audio.onloadeddata = () => {
      console.log('🎙️ Referee voice data loaded, duration:', audio.duration);
    };

    audio.onended = () => {
      console.log('✅ Referee voice playback ended');
      this.revokeBlobUrl(audioUrl);
      if (this.refereeVoiceRef === audio) {
        this.refereeVoiceRef = null;
      }
    };

    audio.onerror = (e) => {
      console.error('❌ Referee voice playback error:', {
        error: e,
        audioError: audio.error,
        readyState: audio.readyState,
        networkState: audio.networkState,
        src: audio.src?.substring(0, 50) + '...',
        duration: audio.duration,
        currentTime: audio.currentTime
      });

      // Detailed error logging
      if (audio.error) {
        const errorMessages = {
          1: 'MEDIA_ERR_ABORTED - playback aborted',
          2: 'MEDIA_ERR_NETWORK - network error', 
          3: 'MEDIA_ERR_DECODE - decode error',
          4: 'MEDIA_ERR_SRC_NOT_SUPPORTED - source not supported'
        };
        console.error('❌ Detailed error:', errorMessages[audio.error.code] || `Unknown error (${audio.error.code})`);
      }

      this.revokeBlobUrl(audioUrl);
      if (this.refereeVoiceRef === audio) {
        this.refereeVoiceRef = null;
      }

      // Try fallback approach if format not supported
      if (audio.error && audio.error.code === 4) {
        console.log('🔄 Attempting format fallback...');
        this.attemptFallbackPlayback(audioBlob);
      }
    };

    // Set reference and properties
    this.refereeVoiceRef = audio;
    audio.volume = this.isMuted ? 0 : this.volume;
    audio.preload = 'auto';
    
    try {
      audio.src = audioUrl;
      
      // Attempt to play with enhanced error handling
      setTimeout(() => {
        if (this.refereeVoiceRef === audio) {
          const playPromise = audio.play();
          if (playPromise) {
            playPromise
              .then(() => {
                console.log('✅ Referee voice started playing successfully');
              })
              .catch((error) => {
                console.error('❌ Failed to play referee voice:', {
                  error: error.message,
                  name: error.name,
                  code: error.code,
                  readyState: audio.readyState,
                  networkState: audio.networkState
                });
                
                if (this.refereeVoiceRef === audio) {
                  this.revokeBlobUrl(audioUrl);
                  this.refereeVoiceRef = null;
                  
                  // Try fallback
                  this.attemptFallbackPlayback(audioBlob);
                }
              });
          }
        }
      }, 10);

    } catch (error) {
      console.error('❌ Error setting up referee voice audio:', error);
      this.revokeBlobUrl(audioUrl);
      if (this.refereeVoiceRef === audio) {
        this.refereeVoiceRef = null;
      }
    }
  }

  // Fallback playback with different format
  attemptFallbackPlayback(originalBlob) {
    console.log('🔄 Attempting fallback playback with WAV format');
    
    try {
      // Try creating a new blob with WAV MIME type as fallback
      const fallbackBlob = new Blob([originalBlob], { type: 'audio/wav' });
      
      // Don't call executePlayRefereeVoice again to avoid infinite loop
      // Instead, create a simple audio element for fallback
      const audioUrl = this.createSafeBlobUrl(fallbackBlob);
      if (!audioUrl) return;
      
      const fallbackAudio = new Audio(audioUrl);
      fallbackAudio.volume = this.isMuted ? 0 : this.volume;
      
      fallbackAudio.onended = () => {
        this.revokeBlobUrl(audioUrl);
      };
      
      fallbackAudio.onerror = () => {
        console.error('❌ Fallback playback also failed');
        this.revokeBlobUrl(audioUrl);
      };
      
      fallbackAudio.play()
        .then(() => console.log('✅ Fallback playback successful'))
        .catch(() => console.error('❌ Fallback playback failed'));
        
    } catch (error) {
      console.error('❌ Fallback attempt failed:', error);
    }
  }

  // Stop regular audio only (not referee voice)
  stopRegularAudio() {
    if (this.audioRef) {
      try {
        this.audioRef.pause();
        this.audioRef.currentTime = 0;
      } catch (error) {
        console.warn('⚠️ Error stopping regular audio:', error);
      }
      this.audioRef = null;
    }
  }

  // Stop all audio including referee voice
  stopAllAudio() {
    console.log('🔇 Stopping all audio elements');

    this.stopRegularAudio();

    if (this.refereeVoiceRef) {
      try {
        this.refereeVoiceRef.pause();
        this.refereeVoiceRef.currentTime = 0;
        if (this.refereeVoiceRef.src) {
          this.revokeBlobUrl(this.refereeVoiceRef.src);
        }
      } catch (error) {
        console.warn('⚠️ Error stopping referee voice:', error);
      }
      this.refereeVoiceRef = null;
    }
  }

  // Cleanup all blob URLs
  cleanupAllBlobUrls() {
    console.log('🗑️ Cleaning up all blob URLs');
    this.activeBlobUrls.forEach(url => {
      try {
        URL.revokeObjectURL(url);
      } catch (error) {
        console.warn('⚠️ Error revoking blob URL during cleanup:', error);
      }
    });
    this.activeBlobUrls.clear();
  }

  // Cleanup
  destroy() {
    this.stopAllAudio();
    this.cleanupAllBlobUrls();
  }
}

// Create singleton instance
const audioManager = new AudioManager();

// Export simple functions for easy use
export const audioUtils = {
  playAudio: (audioKey) => audioManager.playAudio(audioKey),
  playRefereeVoice: (audioData, mimeType) => audioManager.playRefereeVoice(audioData, mimeType),
  stopAllAudio: () => audioManager.stopAllAudio(),
  stopRegularAudio: () => audioManager.stopRegularAudio(),
  setAudioEnabled: (enabled) => audioManager.setAudioEnabled(enabled),
  setVolume: (volume) => audioManager.setVolume(volume),
  setMuted: (muted) => audioManager.setMuted(muted),

  // Getters
  get audioEnabled() { return audioManager.audioEnabled; },
  get volume() { return audioManager.volume; },
  get isMuted() { return audioManager.isMuted; },
  get userInteracted() { return audioManager.userInteracted; },
  get supportedFormats() { return audioManager.supportedFormats; },
};

export default audioUtils;