/* ==========================================================================
   Raksha Bandhan Main Application Controller & State Management (Multi-Page)
   ========================================================================== */

class RakshaBandhanApp {
  constructor() {
    this.state = {
      sisterName: 'Sneha',
      brotherName: 'Manish',
      customWish: 'To the sister who knows all my secrets, shares every laugh, and brings endless brightness into my life—Happy Raksha Bandhan! May your life be filled with happiness, health, and infinite treats.',
      gifts: [
        {
          id: 1,
          title: 'Rose Gold Smart Watch',
          url: 'https://www.amazon.in',
          notes: 'Color: Rose Gold',
          status: 'Requested'
        }
      ],
      fedSweetsCount: 0,
      cardTheme: 'royal'
    };

    this.init();
  }

  init() {
    this.loadState();
    this.parseUrlParams();
    this.bindDOM();
    this.bindEvents();
    this.updateNamesInDOM();
    this.highlightActiveNav();
    this.renderGiftList();
    this.typewriterEffect();
    this.updateSweetsMeter();
  }

  loadState() {
    const savedSister = localStorage.getItem('rb_sisterName');
    const savedBrother = localStorage.getItem('rb_brotherName');
    const savedWish = localStorage.getItem('rb_customWish');
    const savedGifts = localStorage.getItem('rb_giftRequests');
    const savedSweets = localStorage.getItem('rb_fedSweets');

    if (savedSister) this.state.sisterName = savedSister;
    if (savedBrother) this.state.brotherName = savedBrother;
    if (savedWish) this.state.customWish = savedWish;
    if (savedSweets) this.state.fedSweetsCount = parseInt(savedSweets, 10) || 0;
    if (savedGifts) {
      try {
        this.state.gifts = JSON.parse(savedGifts);
      } catch (e) {
        console.error('Failed to parse gifts', e);
      }
    }
  }

  saveState() {
    localStorage.setItem('rb_sisterName', this.state.sisterName);
    localStorage.setItem('rb_brotherName', this.state.brotherName);
    localStorage.setItem('rb_customWish', this.state.customWish);
    localStorage.setItem('rb_fedSweets', this.state.fedSweetsCount);
    localStorage.setItem('rb_giftRequests', JSON.stringify(this.state.gifts));
  }

  parseUrlParams() {
    const params = new URLSearchParams(window.location.search);
    if (params.has('sister')) this.state.sisterName = params.get('sister');
    if (params.has('brother')) this.state.brotherName = params.get('brother');
    if (params.has('wish')) this.state.customWish = params.get('wish');
    if (params.has('gifts')) {
      try {
        const urlGifts = JSON.parse(decodeURIComponent(params.get('gifts')));
        if (Array.isArray(urlGifts) && urlGifts.length) {
          this.state.gifts = urlGifts;
        }
      } catch (e) {}
    }
    this.saveState();
  }

  bindDOM() {
    this.envelopeModal = document.getElementById('envelope-modal');
    this.envelopeEl = document.getElementById('envelope');
    this.openEnvelopeBtn = document.getElementById('open-envelope-btn');
    
    this.sisterNameDisplays = document.querySelectorAll('.display-sister-name');
    this.brotherNameDisplays = document.querySelectorAll('.display-brother-name');
    this.customWishDisplay = document.getElementById('display-custom-wish');
    
    this.shareLinkBtn = document.getElementById('share-link-btn');
    this.downloadCardBtn = document.getElementById('download-card-btn');
    this.musicToggleBtn = document.getElementById('music-toggle-btn');
    this.soundBtnText = document.getElementById('sound-btn-text');
    
    // Virtual Rakhi Ceremony
    this.tieRakhiBtn = document.getElementById('tie-rakhi-btn');
    this.rakhiModal = document.getElementById('rakhi-modal');
    this.closeRakhiModalBtn = document.getElementById('close-rakhi-modal-btn');
    
    // Floating Petal Cannon
    this.petalCannonBtn = document.getElementById('petal-cannon-btn');

    // Gift Elements
    this.giftForm = document.getElementById('gift-form');
    this.giftTitleInput = document.getElementById('gift-title-input');
    this.giftUrlInput = document.getElementById('gift-url-input');
    this.giftNotesInput = document.getElementById('gift-notes-input');
    this.giftContainer = document.getElementById('gift-container');
    this.giftCounterBadge = document.getElementById('gift-counter-badge');
    this.sendWhatsappBtn = document.getElementById('send-whatsapp-gifts-btn');
    this.giftChips = document.querySelectorAll('.gift-chip');

    // Sweets Meter
    this.sweetsCountDisplay = document.getElementById('sweets-count-display');

    // Trivia Buttons
    this.triviaBtns = document.querySelectorAll('.trivia-btn');
    this.triviaResult = document.getElementById('trivia-result');

    // Card Theme Selector
    this.cardThemeBtns = document.querySelectorAll('.card-theme-btn');
  }

  bindEvents() {
    // Unboxing Envelope
    if (this.openEnvelopeBtn && this.envelopeEl) {
      this.openEnvelopeBtn.addEventListener('click', () => this.openEnvelope());
      this.envelopeEl.addEventListener('click', () => this.openEnvelope());
      this.envelopeEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.openEnvelope();
        }
      });
    }

    // Virtual Rakhi Tying Ceremony
    if (this.tieRakhiBtn) {
      this.tieRakhiBtn.addEventListener('click', () => this.triggerRakhiCeremony());
    }

    if (this.closeRakhiModalBtn && this.rakhiModal) {
      this.closeRakhiModalBtn.addEventListener('click', () => {
        this.rakhiModal.classList.add('hidden');
        this.rakhiModal.classList.remove('flex');
      });
    }

    // Floating Petal Cannon
    if (this.petalCannonBtn) {
      this.petalCannonBtn.addEventListener('click', () => {
        if (window.particleEngine) window.particleEngine.triggerConfettiBurst();
        if (window.soundEngine) window.soundEngine.playBellChime();
      });
    }

    // Trivia Buttons
    this.triviaBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        btn.classList.add('bg-yellow-500', 'text-maroon-950');
        if (window.soundEngine) window.soundEngine.playMithaiSound();
        if (window.particleEngine) window.particleEngine.triggerConfettiBurst();
        if (this.triviaResult) this.triviaResult.classList.remove('hidden');
      });
    });

    // Card Theme Selector
    this.cardThemeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const theme = btn.getAttribute('data-theme');
        this.state.cardTheme = theme;
        this.cardThemeBtns.forEach(b => b.classList.replace('text-yellow-200', 'text-yellow-300/70'));
        btn.classList.replace('text-yellow-300/70', 'text-yellow-200');
        if (window.soundEngine) window.soundEngine.playMithaiSound();
      });
    });

    // Share Link
    if (this.shareLinkBtn) {
      this.shareLinkBtn.addEventListener('click', () => this.copyShareLink());
    }

    // Download Card
    if (this.downloadCardBtn) {
      this.downloadCardBtn.addEventListener('click', () => {
        if (window.cardGenerator) {
          window.cardGenerator.downloadCard(
            this.state.sisterName, 
            this.state.brotherName, 
            this.state.customWish, 
            this.state.cardTheme || 'royal'
          );
        }
      });
    }

    // Music Toggle
    if (this.musicToggleBtn) {
      this.musicToggleBtn.addEventListener('click', () => {
        if (window.soundEngine) {
          const isPlaying = window.soundEngine.toggleBackgroundMusic();
          if (this.soundBtnText) {
            this.soundBtnText.textContent = isPlaying ? 'Sound: ON' : 'Sound: OFF';
          }
          this.musicToggleBtn.classList.toggle('bg-yellow-500/30', isPlaying);
        }
      });
    }

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
      const feedAction = () => {
        this.state.fedSweetsCount++;
        this.saveState();
        this.updateSweetsMeter();

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
      };

      item.addEventListener('click', feedAction);
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          feedAction();
        }
      });
    });

    // Quick Gift Suggestion Chips
    this.giftChips.forEach(chip => {
      chip.addEventListener('click', () => {
        const title = chip.getAttribute('data-title');
        const url = chip.getAttribute('data-url');
        const notes = chip.getAttribute('data-notes');

        if (this.giftTitleInput) this.giftTitleInput.value = title || '';
        if (this.giftUrlInput) this.giftUrlInput.value = url || '';
        if (this.giftNotesInput) this.giftNotesInput.value = notes || '';

        if (window.soundEngine) window.soundEngine.playMithaiSound();
      });
    });

    // Gift Form Submit
    if (this.giftForm) {
      this.giftForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.addGiftRequest();
      });
    }

    if (this.sendWhatsappBtn) {
      this.sendWhatsappBtn.addEventListener('click', () => this.sendGiftsViaWhatsapp());
    }
  }

  triggerRakhiCeremony() {
    if (window.soundEngine) window.soundEngine.playSacredRakhiSound();
    if (window.particleEngine) window.particleEngine.triggerConfettiBurst();

    if (this.rakhiModal) {
      this.rakhiModal.classList.remove('hidden');
      this.rakhiModal.classList.add('flex');
    }
  }

  updateSweetsMeter() {
    if (this.sweetsCountDisplay) {
      this.sweetsCountDisplay.textContent = `${this.state.fedSweetsCount} Treats 🍬`;
    }
  }

  addGiftRequest() {
    const title = this.giftTitleInput ? this.giftTitleInput.value.trim() : '';
    const url = this.giftUrlInput ? this.giftUrlInput.value.trim() : '';
    const notes = this.giftNotesInput ? this.giftNotesInput.value.trim() : '';

    if (!title) {
      alert('Please enter a gift title!');
      return;
    }

    const newGift = {
      id: Date.now(),
      title: title,
      url: url.startsWith('http') ? url : (url ? `https://${url}` : ''),
      notes: notes,
      status: 'Requested'
    };

    this.state.gifts.push(newGift);
    this.saveState();
    this.renderGiftList();

    if (this.giftTitleInput) this.giftTitleInput.value = '';
    if (this.giftUrlInput) this.giftUrlInput.value = '';
    if (this.giftNotesInput) this.giftNotesInput.value = '';

    if (window.particleEngine) window.particleEngine.triggerConfettiBurst();
    if (window.soundEngine) window.soundEngine.playBellChime();
  }

  toggleGiftStatus(id) {
    const gift = this.state.gifts.find(g => g.id === id);
    if (gift) {
      gift.status = gift.status === 'Requested' ? 'Brother Promised ✅' : 'Requested';
      this.saveState();
      this.renderGiftList();
    }
  }

  deleteGift(id) {
    this.state.gifts = this.state.gifts.filter(g => g.id !== id);
    this.saveState();
    this.renderGiftList();
  }

  renderGiftList() {
    if (this.giftCounterBadge) {
      this.giftCounterBadge.textContent = `${this.state.gifts.length} ${this.state.gifts.length === 1 ? 'Item' : 'Items'}`;
    }

    if (!this.giftContainer) return;

    if (!this.state.gifts || this.state.gifts.length === 0) {
      this.giftContainer.innerHTML = `
        <div class="col-span-full text-center py-10 text-yellow-200/60">
          No gift requests added yet! Click any quick suggestion idea chip or fill out the form above 🎁
        </div>
      `;
      return;
    }

    this.giftContainer.innerHTML = this.state.gifts.map(gift => `
      <div class="festive-glass-card p-6 rounded-2xl flex flex-col justify-between border border-yellow-500/30">
        <div>
          <div class="flex items-center justify-between gap-2 mb-3">
            <span class="px-3 py-1 rounded-full text-xs font-semibold ${gift.status.includes('Promised') ? 'bg-green-500/20 text-green-300 border border-green-500/40' : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/40'}">
              ${gift.status}
            </span>
            <button onclick="window.rakshaApp.deleteGift(${gift.id})" class="text-red-400 hover:text-red-300 text-xs font-semibold px-2 py-1 rounded hover:bg-red-500/10">
              Delete
            </button>
          </div>

          <h3 class="text-xl font-bold text-yellow-100 mb-2">${this.escapeHtml(gift.title)}</h3>
          
          ${gift.notes ? `<p class="text-xs text-yellow-200/80 italic mb-4">"${this.escapeHtml(gift.notes)}"</p>` : ''}
        </div>

        <div class="space-y-3 mt-4 pt-4 border-t border-yellow-500/20">
          ${gift.url ? `
            <a href="${gift.url}" target="_blank" rel="noopener noreferrer" class="btn-gold w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5">
              <span>View Item Link 🔗</span>
            </a>
          ` : '<span class="text-xs text-yellow-300/50 block text-center">No URL attached</span>'}

          <button onclick="window.rakshaApp.toggleGiftStatus(${gift.id})" class="btn-outline-gold w-full py-2 rounded-xl text-xs font-semibold">
            ${gift.status.includes('Promised') ? 'Mark as Pending' : 'Brother Mark as Promised ✅'}
          </button>
        </div>
      </div>
    `).join('');
  }

  sendGiftsViaWhatsapp() {
    if (!this.state.gifts.length) {
      alert('Please add at least one gift item first!');
      return;
    }

    let text = `Hi ${this.state.brotherName}! Here is my Raksha Bandhan Gift Wishlist 🎁:\n\n`;
    this.state.gifts.forEach((g, idx) => {
      text += `${idx + 1}. ${g.title}\n`;
      if (g.notes) text += `   Note: ${g.notes}\n`;
      if (g.url) text += `   Link: ${g.url}\n`;
      text += `\n`;
    });

    const shareUrl = `${window.location.origin}${window.location.pathname}?sister=${encodeURIComponent(this.state.sisterName)}&brother=${encodeURIComponent(this.state.brotherName)}&gifts=${encodeURIComponent(JSON.stringify(this.state.gifts))}`;
    text += `Open & View my Wishlist on Site:\n${shareUrl}`;

    const waUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
  }

  escapeHtml(str) {
    return str.replace(/[&<>"']/g, function(m) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m];
    });
  }

  openEnvelope() {
    if (this.envelopeEl) {
      this.envelopeEl.classList.add('open');
    }
    if (window.soundEngine) {
      window.soundEngine.playBellChime();
      window.soundEngine.startAmbientMelody();
      if (this.soundBtnText) {
        this.soundBtnText.textContent = 'Sound: ON';
      }
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

    const navLinks = document.querySelectorAll('a[data-nav]');
    navLinks.forEach(link => {
      const hrefBase = link.getAttribute('href').split('?')[0];
      link.setAttribute('href', `${hrefBase}?sister=${encodeURIComponent(this.state.sisterName)}&brother=${encodeURIComponent(this.state.brotherName)}`);
    });
  }

  highlightActiveNav() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('a[data-nav]');

    navLinks.forEach(link => {
      const linkPath = link.getAttribute('href').split('?')[0];
      if (linkPath === currentPath || (currentPath === '' && linkPath === 'index.html')) {
        link.classList.add('text-yellow-400', 'font-bold', 'border-b-2', 'border-yellow-400');
        link.classList.remove('text-yellow-200/80');
      } else {
        link.classList.remove('text-yellow-400', 'font-bold', 'border-b-2', 'border-yellow-400');
        link.classList.add('text-yellow-200/80');
      }
    });
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

  copyShareLink() {
    const baseUrl = window.location.origin + window.location.pathname;
    const shareUrl = `${baseUrl}?sister=${encodeURIComponent(this.state.sisterName)}&brother=${encodeURIComponent(this.state.brotherName)}&gifts=${encodeURIComponent(JSON.stringify(this.state.gifts))}`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        alert(`🔗 Shareable link copied to clipboard!\n\nSend this link to ${this.state.sisterName}: ${shareUrl}`);
      });
    } else {
      prompt('Copy this customized link to send:', shareUrl);
    }
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.rakshaApp = new RakshaBandhanApp();
});
