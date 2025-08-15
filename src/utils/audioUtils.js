class AudioManager {
  constructor() {
    this.audioRef = null;
    this.refereeVoiceRef = null;
    this.userInteracted = false;
    this.volume = 0.7;
    this.isMuted = false;
    this.audioEnabled = true;

    // Real-time audio context for referee voice
    this.audioContext = null;
    this.gainNode = null;
    
    this.audioFiles = {
      poster: '/audio/poster.mp3',
      rasan: '/audio/rasan.mp3',
      gialap: '/audio/gialap.mp3',
    };

    this.setupUserInteractionListeners();
  }

  setupUserInteractionListeners() {
    const handleUserInteraction = () => {
      this.userInteracted = true;
      this.initAudioContext();
      
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };

    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('keydown', handleUserInteraction);
    document.addEventListener('touchstart', handleUserInteraction);
  }

  async initAudioContext() {
    if (!this.audioContext) {
      try {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.audioContext.latencyHint = 'interactive';
        
        // Create gain node for volume control
        this.gainNode = this.audioContext.createGain();
        this.gainNode.connect(this.audioContext.destination);
        this.gainNode.gain.value = this.isMuted ? 0 : this.volume;
        
        if (this.audioContext.state === 'suspended') {
          await this.audioContext.resume();
        }
      } catch (error) {
        // Silent error handling
      }
    }
  }

  setAudioEnabled(enabled) {
    this.audioEnabled = enabled;
    if (!enabled) {
      this.stopAllAudio();
    }
  }

  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
    
    // Update regular audio
    if (this.audioRef) {
      this.audioRef.volume = this.isMuted ? 0 : this.volume;
    }
    
    // Update gain node for real-time audio
    if (this.gainNode) {
      this.gainNode.gain.value = this.isMuted ? 0 : this.volume;
    }
  }

  setMuted(muted) {
    this.isMuted = muted;
    
    // Update regular audio
    if (this.audioRef) {
      this.audioRef.volume = this.isMuted ? 0 : this.volume;
    }
    
    // Update gain node for real-time audio
    if (this.gainNode) {
      this.gainNode.gain.value = this.isMuted ? 0 : this.volume;
    }
  }

  playAudio(audioKey) {
    if (!this.audioEnabled || !this.userInteracted) return;

    const audioFile = this.audioFiles[audioKey];
    if (!audioFile) return;

    this.stopRegularAudio();

    try {
      const audio = new Audio(audioFile);
      this.audioRef = audio;
      audio.volume = this.isMuted ? 0 : this.volume;

      audio.onended = () => {
        this.audioRef = null;
      };

      audio.onerror = () => {
        this.audioRef = null;
      };

      const playPromise = audio.play();
      if (playPromise) {
        playPromise.catch(() => {
          this.audioRef = null;
        });
      }

    } catch (error) {
      this.audioRef = null;
    }
  }

  // Real-time audio playback using Web Audio API for low latency
  playRefereeVoiceRealtime(audioData) {
    if (!this.audioEnabled || !this.userInteracted) return;

    this.initAudioContext().then(() => {
      try {
        // Stop any currently playing referee voice
        if (this.refereeVoiceRef) {
          try {
            this.refereeVoiceRef.stop();
          } catch (error) {
            // Silent cleanup
          }
        }

        if (!this.audioContext || this.audioContext.state === 'closed') {
          return;
        }

        // Ensure audio data is Float32Array
        let float32Data;
        if (audioData instanceof Float32Array) {
          float32Data = audioData;
        } else if (Array.isArray(audioData)) {
          float32Data = new Float32Array(audioData);
        } else {
          return;
        }

        // Create audio buffer
        const audioBuffer = this.audioContext.createBuffer(
          1, // mono
          float32Data.length,
          this.audioContext.sampleRate
        );

        // Copy audio data to buffer
        const channelData = audioBuffer.getChannelData(0);
        channelData.set(float32Data);

        // Create buffer source
        const bufferSource = this.audioContext.createBufferSource();
        bufferSource.buffer = audioBuffer;
        
        // Connect to gain node (which connects to destination)
        bufferSource.connect(this.gainNode);
        
        // Store reference for potential cleanup
        this.refereeVoiceRef = bufferSource;

        // Clean up reference when audio ends
        bufferSource.onended = () => {
          if (this.refereeVoiceRef === bufferSource) {
            this.refereeVoiceRef = null;
          }
        };

        // Start playback immediately
        bufferSource.start(0);

      } catch (error) {
        // Silent error handling
      }
    });
  }

  // Fallback method for blob-based audio (backward compatibility)
  playRefereeVoice(audioData, originalMimeType = null) {
    // Try real-time first if audioData is Float32Array or Array
    if (audioData instanceof Float32Array || Array.isArray(audioData)) {
      this.playRefereeVoiceRealtime(audioData);
      return;
    }

    // Fallback to blob-based approach for other data types
    if (!this.audioEnabled || !this.userInteracted) return;

    try {
      // Stop previous audio
      if (this.refereeVoiceRef && this.refereeVoiceRef.pause) {
        this.refereeVoiceRef.pause();
        this.refereeVoiceRef = null;
      }

      // Create blob and audio element
      let blob;
      if (audioData instanceof Blob) {
        blob = audioData;
      } else {
        // Try to create blob from data
        let arrayBuffer;
        if (audioData instanceof ArrayBuffer) {
          arrayBuffer = audioData;
        } else if (audioData instanceof Uint8Array) {
          arrayBuffer = audioData.buffer.slice(audioData.byteOffset, audioData.byteOffset + audioData.byteLength);
        } else {
          return; // Unsupported format
        }

        const mimeType = originalMimeType || 'audio/wav';
        blob = new Blob([arrayBuffer], { type: mimeType });
      }

      if (blob.size === 0) return;

      const audioUrl = URL.createObjectURL(blob);
      const audio = new Audio(audioUrl);
      audio.volume = this.isMuted ? 0 : this.volume;

      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
        if (this.refereeVoiceRef === audio) {
          this.refereeVoiceRef = null;
        }
      };

      audio.onerror = () => {
        URL.revokeObjectURL(audioUrl);
        if (this.refereeVoiceRef === audio) {
          this.refereeVoiceRef = null;
        }
      };

      this.refereeVoiceRef = audio;
      
      // Play audio
      const playPromise = audio.play();
      if (playPromise) {
        playPromise.catch(() => {
          URL.revokeObjectURL(audioUrl);
          if (this.refereeVoiceRef === audio) {
            this.refereeVoiceRef = null;
          }
        });
      }

    } catch (error) {
      // Silent error handling
    }
  }

  stopRegularAudio() {
    if (this.audioRef) {
      try {
        this.audioRef.pause();
        this.audioRef.currentTime = 0;
      } catch (error) {
        // Silent cleanup
      }
      this.audioRef = null;
    }
  }

  stopRefereeVoice() {
    if (this.refereeVoiceRef) {
      try {
        // Handle AudioBufferSource (real-time)
        if (this.refereeVoiceRef.stop) {
          this.refereeVoiceRef.stop();
        }
        // Handle HTML Audio element (fallback)
        else if (this.refereeVoiceRef.pause) {
          this.refereeVoiceRef.pause();
          this.refereeVoiceRef.currentTime = 0;
          if (this.refereeVoiceRef.src && this.refereeVoiceRef.src.startsWith('blob:')) {
            URL.revokeObjectURL(this.refereeVoiceRef.src);
          }
        }
      } catch (error) {
        // Silent cleanup
      }
      this.refereeVoiceRef = null;
    }
  }

  stopAllAudio() {
    this.stopRegularAudio();
    this.stopRefereeVoice();
  }

  destroy() {
    this.stopAllAudio();
    
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close();
      this.audioContext = null;
      this.gainNode = null;
    }
  }
}

// Create singleton instance
const audioManager = new AudioManager();

// Export simple functions for easy use
export const audioUtils = {
  playAudio: (audioKey) => audioManager.playAudio(audioKey),
  playRefereeVoice: (audioData, mimeType) => audioManager.playRefereeVoice(audioData, mimeType),
  playRefereeVoiceRealtime: (audioData) => audioManager.playRefereeVoiceRealtime(audioData),
  stopAllAudio: () => audioManager.stopAllAudio(),
  stopRegularAudio: () => audioManager.stopRegularAudio(),
  stopRefereeVoice: () => audioManager.stopRefereeVoice(),
  setAudioEnabled: (enabled) => audioManager.setAudioEnabled(enabled),
  setVolume: (volume) => audioManager.setVolume(volume),
  setMuted: (muted) => audioManager.setMuted(muted),

  // Getters
  get audioEnabled() { return audioManager.audioEnabled; },
  get volume() { return audioManager.volume; },
  get isMuted() { return audioManager.isMuted; },
  get userInteracted() { return audioManager.userInteracted; },
};

export default audioUtils;