/* ==========================================================================
   Web Audio API Synthesizer Engine (Festive Chimes & Ambient Tones)
   ========================================================================== */

class SoundEngine {
  constructor() {
    this.audioCtx = null;
    this.isPlayingMusic = false;
    this.ambientInterval = null;
  }

  initContext() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  playBellChime() {
    this.initContext();
    if (!this.audioCtx) return;

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime + i * 0.12);

      gain.gain.setValueAtTime(0, this.audioCtx.currentTime + i * 0.12);
      gain.gain.linearRampToValueAtTime(0.25, this.audioCtx.currentTime + i * 0.12 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + i * 0.12 + 1.2);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(this.audioCtx.currentTime + i * 0.12);
      osc.stop(this.audioCtx.currentTime + i * 0.12 + 1.3);
    });
  }

  playMithaiSound() {
    this.initContext();
    if (!this.audioCtx) return;

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440, this.audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, this.audioCtx.currentTime + 0.2);

    gain.gain.setValueAtTime(0.3, this.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.25);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start();
    osc.stop(this.audioCtx.currentTime + 0.25);
  }

  playSacredRakhiSound() {
    this.initContext();
    if (!this.audioCtx) return;

    const pentatonic = [440, 493.88, 554.37, 659.25, 739.99, 880];
    pentatonic.forEach((freq, idx) => {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime + idx * 0.15);

      gain.gain.setValueAtTime(0, this.audioCtx.currentTime + idx * 0.15);
      gain.gain.linearRampToValueAtTime(0.3, this.audioCtx.currentTime + idx * 0.15 + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + idx * 0.15 + 1.5);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(this.audioCtx.currentTime + idx * 0.15);
      osc.stop(this.audioCtx.currentTime + idx * 0.15 + 1.6);
    });
  }

  startAmbientMelody() {
    this.initContext();
    if (this.isPlayingMusic) return;

    this.isPlayingMusic = true;
    const melody = [523.25, 587.33, 659.25, 698.46, 783.99, 880.00, 987.77, 1046.50];
    let index = 0;

    this.ambientInterval = setInterval(() => {
      if (!this.isPlayingMusic) return;
      
      const freq = melody[index % melody.length];
      index++;

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

      gain.gain.setValueAtTime(0.05, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 1.8);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + 1.9);
    }, 1200);
  }

  stopAmbientMelody() {
    this.isPlayingMusic = false;
    if (this.ambientInterval) {
      clearInterval(this.ambientInterval);
      this.ambientInterval = null;
    }
  }

  toggleBackgroundMusic() {
    if (this.isPlayingMusic) {
      this.stopAmbientMelody();
      return false;
    } else {
      this.startAmbientMelody();
      return true;
    }
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.soundEngine = new SoundEngine();
});
