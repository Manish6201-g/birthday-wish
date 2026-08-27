/* ==========================================================================
   Raksha Bandhan Particle Engine (Petals, Sparkles, Fireworks, Confetti)
   ========================================================================== */

class ParticleEngine {
  constructor() {
    this.canvas = document.getElementById('particle-canvas');
    if (!this.canvas) return;
    
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.bursts = [];
    this.resize();
    
    window.addEventListener('resize', () => this.resize());
    this.initPetals();
    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  initPetals() {
    const particleCount = Math.floor(window.innerWidth < 768 ? 30 : 60);
    this.particles = [];
    
    for (let i = 0; i < particleCount; i++) {
      this.particles.push(this.createPetal(true));
    }
  }

  createPetal(randomY = false) {
    const isRose = Math.random() > 0.4;
    return {
      x: Math.random() * this.canvas.width,
      y: randomY ? Math.random() * this.canvas.height : -20,
      size: Math.random() * 8 + 6,
      speedY: Math.random() * 1.5 + 0.8,
      speedX: Math.random() * 1 - 0.5,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.03,
      opacity: Math.random() * 0.7 + 0.3,
      color: isRose ? '#E86A92' : '#FFA500', // Rose pink or Marigold orange/yellow
      type: isRose ? 'rose' : 'marigold'
    };
  }

  triggerConfettiBurst(originX, originY) {
    const colors = ['#FFD700', '#FF4500', '#E86A92', '#FFF2A1', '#FF1493', '#00FF7F'];
    const count = 100;
    
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 12 + 4;
      this.bursts.push({
        x: originX || window.innerWidth / 2,
        y: originY || window.innerHeight / 2,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 3,
        gravity: 0.25,
        size: Math.random() * 7 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.2,
        opacity: 1,
        decay: Math.random() * 0.015 + 0.01
      });
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Render Ambient Petals
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      p.y += p.speedY;
      p.x += Math.sin(p.y * 0.02) + p.speedX;
      p.rotation += p.rotationSpeed;

      if (p.y > this.canvas.height + 20) {
        this.particles[i] = this.createPetal(false);
      }

      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate(p.rotation);
      this.ctx.globalAlpha = p.opacity;
      this.ctx.fillStyle = p.color;

      this.ctx.beginPath();
      if (p.type === 'rose') {
        // Oval petal shape
        this.ctx.ellipse(0, 0, p.size, p.size * 0.6, 0, 0, Math.PI * 2);
      } else {
        // Starburst marigold petal
        this.ctx.arc(0, 0, p.size * 0.5, 0, Math.PI * 2);
      }
      this.ctx.fill();
      this.ctx.restore();
    }

    // Render Burst Particles
    for (let i = this.bursts.length - 1; i >= 0; i--) {
      const b = this.bursts[i];
      b.x += b.vx;
      b.y += b.vy;
      b.vy += b.gravity;
      b.opacity -= b.decay;
      b.rotation += b.rotationSpeed;

      if (b.opacity <= 0) {
        this.bursts.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.translate(b.x, b.y);
      this.ctx.rotate(b.rotation);
      this.ctx.globalAlpha = Math.max(0, b.opacity);
      this.ctx.fillStyle = b.color;
      this.ctx.fillRect(-b.size / 2, -b.size / 2, b.size, b.size * 1.5);
      this.ctx.restore();
    }

    requestAnimationFrame(() => this.animate());
  }
}

// Instantiate engine when DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
  window.particleEngine = new ParticleEngine();
});
