/* ==========================================================================
   Raksha Bandhan Virtual Rakhi Tying Ceremony & Wrist Canvas
   ========================================================================== */

class RakhiCeremony {
  constructor() {
    this.selectedRakhi = 'royal'; // 'royal', 'pearl', 'superstar'
    this.isTied = false;
    this.initElements();
    this.bindEvents();
    this.drawWristCanvas();
  }

  initElements() {
    this.wristCanvas = document.getElementById('wrist-canvas');
    if (this.wristCanvas) {
      this.ctx = this.wristCanvas.getContext('2d');
    }
    this.tieBtn = document.getElementById('tie-rakhi-btn');
    this.rakhiCards = document.querySelectorAll('.rakhi-option');
    this.blessingBanner = document.getElementById('rakhi-blessing-banner');
  }

  bindEvents() {
    if (this.rakhiCards) {
      this.rakhiCards.forEach(card => {
        card.addEventListener('click', (e) => {
          this.rakhiCards.forEach(c => c.classList.remove('border-yellow-400', 'bg-yellow-900/30'));
          card.classList.add('border-yellow-400', 'bg-yellow-900/30');
          this.selectedRakhi = card.dataset.rakhi || 'royal';
          this.drawWristCanvas();
        });
      });
    }

    if (this.tieBtn) {
      this.tieBtn.addEventListener('click', () => this.tieRakhiAction());
    }
  }

  drawWristCanvas() {
    if (!this.wristCanvas || !this.ctx) return;

    const w = this.wristCanvas.width = 340;
    const h = this.wristCanvas.height = 220;
    this.ctx.clearRect(0, 0, w, h);

    // Draw Stylized Wrist / Arm Background
    const gradient = this.ctx.createLinearGradient(0, h / 2 - 35, 0, h / 2 + 35);
    gradient.addColorStop(0, '#E8C5A5');
    gradient.addColorStop(0.5, '#F5D6B8');
    gradient.addColorStop(1, '#DDB490');

    // Arm band
    this.ctx.save();
    this.ctx.fillStyle = gradient;
    this.ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
    this.ctx.shadowBlur = 15;
    this.ctx.beginPath();
    this.ctx.roundRect(20, h / 2 - 32, w - 40, 64, 32);
    this.ctx.fill();
    this.ctx.restore();

    // Golden / Red Silk Thread across wrist
    this.ctx.save();
    this.ctx.strokeStyle = '#D4AF37';
    this.ctx.lineWidth = 4;
    this.ctx.beginPath();
    this.ctx.moveTo(10, h / 2);
    this.ctx.lineTo(w - 10, h / 2);
    this.ctx.stroke();

    this.ctx.strokeStyle = '#9D0208';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(10, h / 2 - 2);
    this.ctx.lineTo(w - 10, h / 2 - 2);
    this.ctx.stroke();
    this.ctx.restore();

    // Draw Selected Rakhi Centerpiece
    const centerX = w / 2;
    const centerY = h / 2;

    this.drawRakhiCenterpiece(centerX, centerY, this.selectedRakhi);

    if (this.isTied) {
      // Draw Sparkling Aura Around Tied Rakhi
      this.ctx.save();
      this.ctx.strokeStyle = '#FFD700';
      this.ctx.lineWidth = 2;
      this.ctx.setLineDash([6, 6]);
      this.ctx.beginPath();
      this.ctx.arc(centerX, centerY, 55, 0, Math.PI * 2);
      this.ctx.stroke();
      this.ctx.restore();
    }
  }

  drawRakhiCenterpiece(x, y, style) {
    this.ctx.save();

    if (style === 'royal') {
      // Royal Golden Mandala
      // Outer petals
      for (let i = 0; i < 12; i++) {
        const angle = (i * Math.PI * 2) / 12;
        const px = x + Math.cos(angle) * 35;
        const py = y + Math.sin(angle) * 35;

        this.ctx.fillStyle = i % 2 === 0 ? '#9D0208' : '#FFD700';
        this.ctx.beginPath();
        this.ctx.arc(px, py, 10, 0, Math.PI * 2);
        this.ctx.fill();
      }

      // Middle Ring
      this.ctx.fillStyle = '#FFD700';
      this.ctx.beginPath();
      this.ctx.arc(x, y, 28, 0, Math.PI * 2);
      this.ctx.fill();

      // Inner Crimson Center
      this.ctx.fillStyle = '#6A040F';
      this.ctx.beginPath();
      this.ctx.arc(x, y, 18, 0, Math.PI * 2);
      this.ctx.fill();

      // Center Pearl
      this.ctx.fillStyle = '#FFFBF4';
      this.ctx.beginPath();
      this.ctx.arc(x, y, 7, 0, Math.PI * 2);
      this.ctx.fill();

    } else if (style === 'pearl') {
      // Floral Pearl Rose
      // Pearl Outer Ring
      for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI * 2) / 8;
        const px = x + Math.cos(angle) * 32;
        const py = y + Math.sin(angle) * 32;

        this.ctx.fillStyle = '#FFFBF4';
        this.ctx.strokeStyle = '#E86A92';
        this.ctx.lineWidth = 1.5;
        this.ctx.beginPath();
        this.ctx.arc(px, py, 9, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();
      }

      // Rose Pink Petals
      this.ctx.fillStyle = '#E86A92';
      this.ctx.beginPath();
      this.ctx.arc(x, y, 24, 0, Math.PI * 2);
      this.ctx.fill();

      // Golden Center Star
      this.ctx.fillStyle = '#FFD700';
      this.ctx.beginPath();
      this.ctx.arc(x, y, 12, 0, Math.PI * 2);
      this.ctx.fill();

    } else {
      // Superstar Golden Silk
      // Star points
      this.ctx.fillStyle = '#FFD700';
      this.ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const outerAngle = (i * Math.PI * 2) / 5 - Math.PI / 2;
        const innerAngle = outerAngle + Math.PI / 5;
        const ox = x + Math.cos(outerAngle) * 42;
        const oy = y + Math.sin(outerAngle) * 42;
        const ix = x + Math.cos(innerAngle) * 20;
        const iy = y + Math.sin(innerAngle) * 20;

        if (i === 0) this.ctx.moveTo(ox, oy);
        else this.ctx.lineTo(ox, oy);
        this.ctx.lineTo(ix, iy);
      }
      this.ctx.closePath();
      this.ctx.fill();

      // Center ruby gem
      this.ctx.fillStyle = '#9D0208';
      this.ctx.beginPath();
      this.ctx.arc(x, y, 14, 0, Math.PI * 2);
      this.ctx.fill();
    }

    this.ctx.restore();
  }

  tieRakhiAction() {
    this.isTied = true;
    this.drawWristCanvas();

    // Trigger Sound Effects & Fireworks Confetti
    if (window.soundEngine) {
      window.soundEngine.playRakhiTieCelebration();
      window.soundEngine.playBellChime();
    }

    if (window.particleEngine) {
      const canvasRect = this.wristCanvas.getBoundingClientRect();
      const originX = canvasRect.left + canvasRect.width / 2;
      const originY = canvasRect.top + canvasRect.height / 2;
      window.particleEngine.triggerConfettiBurst(originX, originY);
    }

    // Show Blessing Banner & Status
    if (this.blessingBanner) {
      this.blessingBanner.classList.remove('hidden');
      this.blessingBanner.classList.add('animate-bounce');
      setTimeout(() => {
        this.blessingBanner.classList.remove('animate-bounce');
      }, 1500);
    }

    if (this.tieBtn) {
      this.tieBtn.innerHTML = '✨ Rakhi Tied with Love! ✨';
      this.tieBtn.classList.remove('btn-gold');
      this.tieBtn.classList.add('bg-green-600', 'text-white', 'cursor-default');
    }
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.rakhiCeremony = new RakhiCeremony();
});
