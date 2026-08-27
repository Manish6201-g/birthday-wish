/* ==========================================================================
   Raksha Bandhan Main Application Controller & State Management
   ========================================================================== */

class RakshaBandhanApp {
  constructor() {
    this.state = {
      sisterName: 'Priya',
      brotherName: 'Manish',
      customWish: 'To the sister who knows all my secrets, shares every laugh, and brings endless brightness into my life—Happy Raksha Bandhan! May your life be filled with happiness, health, and infinite treats.',
      redeemedCount: 0,
      fedSweetsCount: 0
    };

    this.init();
  }

  init() {
    this.parseUrlHash();
    this.bindDOM();
    this.bindEvents();
    this.updateNamesInDOM();
    this.typewriterEffect();
  }

  parseUrlHash() {
    const hash = window.location.hash.substring(1);
    if (!hash) return;

    const params = new URLSearchParams(hash);
    if (params.has('sister')) this.state.sisterName = params.get('sister');
    if (params.has('brother')) this.state.brotherName = params.get('brother');
    if (params.has('wish')) this.state.customWish = params.get('wish');
  }

  bindDOM() {
    this.envelopeModal = document.getElementById('envelope-modal');
    this.envelopeEl = document.getElementById('envelope');
    this.openEnvelopeBtn = document.getElementById('open-envelope-btn');
    
    this.sisterNameDisplays = document.querySelectorAll('.display-sister-name');
    this.brotherNameDisplays = document.querySelectorAll('.display-brother-name');
    this.customWishDisplay = document.getElementById('display-custom-wish');

    this.customizeBtn = document.getElementById('customize-btn');
    this.customModal = document.getElementById('custom-modal');
    this.closeCustomModalBtn = document.getElementById('close-custom-modal-btn');
    this.saveCustomBtn = document.getElementById('save-custom-btn');
    
    this.sisterNameInput = document.getElementById('input-sister-name');
    this.brotherNameInput = document.getElementById('input-brother-name');
    this.customWishInput = document.getElementById('input-custom-wish');
    
    this.shareLinkBtn = document.getElementById('share-link-btn');
    this.downloadCardBtn = document.getElementById('download-card-btn');
    this.musicToggleBtn = document.getElementById('music-toggle-btn');
    
    this.photoUploadInput = document.getElementById('photo-upload');
  }

  bindEvents() {
    // Unboxing Envelope Click
    if (this.openEnvelopeBtn && this.envelopeEl) {
      this.openEnvelopeBtn.addEventListener('click', () => this.openEnvelope());
      this.envelopeEl.addEventListener('click', () => this.openEnvelope());
    }

    // Modal Events
    if (this.customizeBtn) {
      this.customizeBtn.addEventListener('click', () => this.openCustomizeModal());
    }

    if (this.closeCustomModalBtn) {
      this.closeCustomModalBtn.addEventListener('click', () => this.closeCustomizeModal());
    }

    if (this.saveCustomBtn) {
      this.saveCustomBtn.addEventListener('click', () => this.saveCustomization());
    }

    // Share Link
    if (this.shareLinkBtn) {
      this.shareLinkBtn.addEventListener('click', () => this.copyShareLink());
    }

    // Download Card
    if (this.downloadCardBtn) {
      this.downloadCardBtn.addEventListener('click', () => {
        if (window.cardGenerator) {
          window.cardGenerator.downloadCard(this.state.sisterName, this.state.brotherName, this.state.customWish);
        }
      });
    }

    // Music Toggle
    if (this.musicToggleBtn) {
      this.musicToggleBtn.addEventListener('click', () => {
        if (window.soundEngine) {
          const isPlaying = window.soundEngine.toggleBackgroundMusic();
          this.musicToggleBtn.innerHTML = isPlaying ? '🎵 Sound: ON' : '🔇 Sound: OFF';
          this.musicToggleBtn.classList.toggle('bg-yellow-500/20', isPlaying);
        }
      });
    }

    // Voucher Flip & Redeem
    const voucherCards = document.querySelectorAll('.voucher-card');
    voucherCards.forEach(card => {
      card.addEventListener('click', () => {
        if (!card.classList.contains('flipped')) {
          card.classList.add('flipped');
          this.state.redeemedCount++;
          if (window.particleEngine) {
            window.particleEngine.triggerConfettiBurst();
          }
          if (window.soundEngine) {
            window.soundEngine.playBellChime();
          }
        }
      });
    });

    // Mithai Item Click
    const mithaiItems = document.querySelectorAll('.mithai-item');
    const mithaiFeedback = document.getElementById('mithai-feedback');

    const sweetQuotes = [
      "Yum! Kaju Katli for the sweetest sister in the world! 🥮",
      "One Motichoor Laddu, packed with infinite love! 🟠",
      "Gulab Jamun sweetness overload! 🟤",
      "Crispy Jalebi for your twisted sense of humor! 🌀",
      "Soft Rasgulla for the soft-hearted sister! ⚪"
    ];

    mithaiItems.forEach((item, idx) => {
      item.addEventListener('click', () => {
        this.state.fedSweetsCount++;
        if (window.soundEngine) {
          window.soundEngine.playMithaiSound();
        }
        if (window.particleEngine) {
          const rect = item.getBoundingClientRect();
          window.particleEngine.triggerConfettiBurst(rect.left + rect.width / 2, rect.top);
        }
        if (mithaiFeedback) {
          mithaiFeedback.textContent = sweetQuotes[idx % sweetQuotes.length];
          mithaiFeedback.classList.remove('hidden');
          mithaiFeedback.classList.add('animate-pulse');
        }
      });
    });

    // Custom Photo Upload
    if (this.photoUploadInput) {
      this.photoUploadInput.addEventListener('change', (e) => this.handlePhotoUpload(e));
    }
  }

  openEnvelope() {
    if (this.envelopeEl) {
      this.envelopeEl.classList.add('open');
    }
    if (window.soundEngine) {
      window.soundEngine.playBellChime();
      window.soundEngine.startAmbientMelody();
    }
    if (window.particleEngine) {
      window.particleEngine.triggerConfettiBurst();
    }

    setTimeout(() => {
      if (this.envelopeModal) {
        this.envelopeModal.classList.add('opacity-0', 'pointer-events-none', 'transition-opacity', 'duration-700');
        setTimeout(() => {
          this.envelopeModal.style.display = 'none';
        }, 700);
      }
    }, 800);
  }

  updateNamesInDOM() {
    this.sisterNameDisplays.forEach(el => el.textContent = this.state.sisterName);
    this.brotherNameDisplays.forEach(el => el.textContent = this.state.brotherName);
    
    if (this.customWishDisplay) {
      this.customWishDisplay.textContent = this.state.customWish;
    }
  }

  typewriterEffect() {
    const el = document.getElementById('typewriter-wish');
    if (!el) return;

    el.textContent = '';
    const text = this.state.customWish;
    let index = 0;

    const timer = setInterval(() => {
      if (index < text.length) {
        el.textContent += text.charAt(index);
        index++;
      } else {
        clearInterval(timer);
      }
    }, 35);
  }

  openCustomizeModal() {
    if (this.sisterNameInput) this.sisterNameInput.value = this.state.sisterName;
    if (this.brotherNameInput) this.brotherNameInput.value = this.state.brotherName;
    if (this.customWishInput) this.customWishInput.value = this.state.customWish;
    
    if (this.customModal) {
      this.customModal.classList.remove('hidden');
      this.customModal.classList.add('flex');
    }
  }

  closeCustomizeModal() {
    if (this.customModal) {
      this.customModal.classList.add('hidden');
      this.customModal.classList.remove('flex');
    }
  }

  saveCustomization() {
    if (this.sisterNameInput && this.sisterNameInput.value.trim()) {
      this.state.sisterName = this.sisterNameInput.value.trim();
    }
    if (this.brotherNameInput && this.brotherNameInput.value.trim()) {
      this.state.brotherName = this.brotherNameInput.value.trim();
    }
    if (this.customWishInput && this.customWishInput.value.trim()) {
      this.state.customWish = this.customWishInput.value.trim();
    }

    this.updateNamesInDOM();
    this.typewriterEffect();
    this.updateUrlHash();
    this.closeCustomizeModal();

    if (window.soundEngine) {
      window.soundEngine.playBellChime();
    }
  }

  updateUrlHash() {
    const params = new URLSearchParams();
    params.set('sister', this.state.sisterName);
    params.set('brother', this.state.brotherName);
    params.set('wish', this.state.customWish);
    window.location.hash = params.toString();
  }

  copyShareLink() {
    this.updateUrlHash();
    const shareUrl = window.location.href;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        alert(`🔗 Shareable link copied to clipboard!\n\nSend this link to ${this.state.sisterName}: ${shareUrl}`);
      });
    } else {
      prompt('Copy this customized link to send:', shareUrl);
    }
  }

  handlePhotoUpload(e) {
    const files = e.target.files;
    if (!files || !files.length) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const targetImg = document.getElementById('polaroid-img-1');
      if (targetImg) {
        targetImg.src = event.target.result;
      }
    };
    reader.readAsDataURL(files[0]);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.rakshaApp = new RakshaBandhanApp();
});
