/* ==========================================================================
   Raksha Bandhan Web Audio Sound Synthesizer & Music Engine
   ========================================================================== */

class SoundEngine {
  constructor() {
    this.audioCtx = null;
    this.isPlayingMusic = false;
    this.musicTimer = null;
  }

  initAudio() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContext();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  playBellChime() {
    this.initAudio();
    const now = this.audioCtx.currentTime;
    
    // Pentatonic festive chime frequency notes (Hz)
    const frequencies = [523.25, 659.25, 783.99, 1046.50, 1318.51];
    
    frequencies.forEach((freq, index) => {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + index * 0.12);
      
      gain.gain.setValueAtTime(0, now + index * 0.12);
      gain.gain.linearRampToValueAtTime(0.15, now + index * 0.12 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.12 + 1.5);
      
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      
      osc.start(now + index * 0.12);
      osc.stop(now + index * 0.12 + 1.6);
    });
  }

  playRakhiTieCelebration() {
    this.initAudio();
    const now = this.audioCtx.currentTime;

    // Golden Fanfare Notes (Indian raag inspired pentatonic scale)
    const notes = [293.66, 329.63, 369.99, 440.00, 493.88, 587.33, 659.25, 739.99, 880.00];

    notes.forEach((freq, idx) => {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = idx % 2 === 0 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.09);

      gain.gain.setValueAtTime(0.2, now + idx * 0.09);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.8);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now + idx * 0.09);
      osc.stop(now + idx * 0.09 + 0.9);
    });
  }

  playMithaiSound() {
    this.initAudio();
    const now = this.audioCtx.currentTime;
    
    // Playful bubbly sound for eating sweet
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.15);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.linearRampToValueAtTime(0, now + 0.18);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start(now);
    osc.stop(now + 0.2);
  }

  toggleBackgroundMusic() {
    this.initAudio();
    this.isPlayingMusic = !this.isPlayingMusic;

    if (this.isPlayingMusic) {
      this.startAmbientMelody();
    } else {
      this.stopAmbientMelody();
    }
    return this.isPlayingMusic;
  }

  startAmbientMelody() {
    if (!this.audioCtx) return;
    
    // Soft soothing meditative chord loop
    const melodyScale = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25];
    let noteIndex = 0;

    const playNextNote = () => {
      if (!this.isPlayingMusic) return;

      const now = this.audioCtx.currentTime;
      const freq = melodyScale[noteIndex % melodyScale.length];
      noteIndex += Math.floor(Math.random() * 3) + 1;

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.04, now + 0.5);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.5);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 3.6);

      this.musicTimer = setTimeout(playNextNote, 1800);
    };

    playNextNote();
  }

  stopAmbientMelody() {
    if (this.musicTimer) {
      clearTimeout(this.musicTimer);
      this.musicTimer = null;
    }
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.soundEngine = new SoundEngine();
});
