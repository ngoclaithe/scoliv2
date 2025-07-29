// Audio utility functions - thay thế AudioContext
class AudioManager {
  constructor() {
    this.audioRef = null;
    this.refereeVoiceRef = null;
    this.userInteracted = false;
    this.volume = 0.7;
    this.isMuted = false;
    this.audioEnabled = true;
    
    // Static audio file mapping
    this.audioFiles = {
      poster: '/audio/poster.mp3',
      rasan: '/audio/rasan.mp3',
      gialap: '/audio/gialap.mp3',
    };

    // Setup user interaction listeners
    this.setupUserInteractionListeners();
  }

  // Setup user interaction detection
  setupUserInteractionListeners() {
    const handleUserInteraction = () => {
      console.log('🎵 User interaction detected');
      this.userInteracted = true;
      
      // Remove listeners after first interaction
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };

    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('keydown', handleUserInteraction);
    document.addEventListener('touchstart', handleUserInteraction);
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
      console.log('🎵 Creating new audio element:', audioFile);
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
            console.log('✅ Audio started playing successfully');
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

  // Play referee voice from blob
  playRefereeVoice(audioBlob) {
    console.log('🎙️ Playing referee voice');

    if (!audioBlob || audioBlob.size === 0) {
      console.error('❌ Invalid audio blob provided');
      return;
    }

    // Stop all other audio first, but not referee voice
    this.stopRegularAudio();

    try {
      // Create URL from blob
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio();

      // Set up event handlers before setting src
      audio.onloadstart = () => {
        console.log('🎙️ Referee voice loading started');
      };

      audio.oncanplay = () => {
        console.log('🎙️ Referee voice can play');
      };

      audio.onended = () => {
        console.log('✅ Referee voice playback ended');
        URL.revokeObjectURL(audioUrl);
        this.refereeVoiceRef = null;
      };

      audio.onerror = (e) => {
        console.error('❌ Referee voice playback error:', e);
        URL.revokeObjectURL(audioUrl);
        this.refereeVoiceRef = null;
      };

      // Set reference before playing
      this.refereeVoiceRef = audio;
      audio.volume = this.isMuted ? 0 : this.volume;

      // Set src and play
      audio.src = audioUrl;

      // Use a small delay to ensure proper loading
      setTimeout(() => {
        if (this.refereeVoiceRef === audio) { // Make sure it's still the current audio
          const playPromise = audio.play();
          if (playPromise) {
            playPromise
              .then(() => {
                console.log('✅ Referee voice started playing successfully');
              })
              .catch((error) => {
                console.error('❌ Failed to play referee voice:', error);
                if (this.refereeVoiceRef === audio) {
                  URL.revokeObjectURL(audioUrl);
                  this.refereeVoiceRef = null;
                }
              });
          }
        }
      }, 50);

    } catch (error) {
      console.error('❌ Error creating referee voice audio:', error);
    }
  }

  // Stop regular audio only (not referee voice)
  stopRegularAudio() {
    console.log('🔇 Stopping regular audio elements');

    // Stop regular audio
    if (this.audioRef) {
      try {
        this.audioRef.pause();
        this.audioRef.currentTime = 0;
      } catch (error) {
        console.warn('⚠️ Error stopping regular audio:', error);
      }
      this.audioRef = null;
    }

    // Stop all other audio elements on page (except referee voice)
    try {
      const allAudioElements = document.querySelectorAll('audio');
      allAudioElements.forEach((audio, index) => {
        try {
          // Skip if this is our referee voice element
          if (audio === this.refereeVoiceRef) {
            return;
          }

          if (!audio.paused) {
            console.log(`🔇 Stopping audio element ${index + 1}`);
            audio.pause();
            audio.currentTime = 0;
          }
        } catch (error) {
          console.warn(`⚠️ Error stopping audio element ${index + 1}:`, error);
        }
      });
    } catch (error) {
      console.warn('⚠️ Error finding/stopping page audio elements:', error);
    }
  }

  // Stop all audio including referee voice
  stopAllAudio() {
    console.log('🔇 Stopping all audio elements');

    // Stop regular audio first
    this.stopRegularAudio();

    // Stop referee voice
    if (this.refereeVoiceRef) {
      try {
        this.refereeVoiceRef.pause();
        this.refereeVoiceRef.currentTime = 0;
        if (this.refereeVoiceRef.src && this.refereeVoiceRef.src.startsWith('blob:')) {
          URL.revokeObjectURL(this.refereeVoiceRef.src);
        }
      } catch (error) {
        console.warn('⚠️ Error stopping referee voice:', error);
      }
      this.refereeVoiceRef = null;
    }
  }

  // Cleanup
  destroy() {
    this.stopAllAudio();
  }
}

// Create singleton instance
const audioManager = new AudioManager();

// Export simple functions for easy use
export const audioUtils = {
  playAudio: (audioKey) => audioManager.playAudio(audioKey),
  playRefereeVoice: (audioBlob) => audioManager.playRefereeVoice(audioBlob),
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
};

export default audioUtils;
