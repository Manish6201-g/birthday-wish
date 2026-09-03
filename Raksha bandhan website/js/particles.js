/* ==========================================================================
   Particle & Celebration Petal Engine (Canvas + Confetti Explosions)
   ========================================================================== */

class ParticleEngine {
  constructor() {
    this.canvas = document.getElementById('particle-canvas');
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.confetti = [];
    this.numberOfPetals = 45;

    this.init();
  }

  init() {
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());

    this.createPetals();
    this.animate();
  }

  resizeCanvas() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  createPetals() {
    const colors = ['#FFD700', '#FFA500', '#E86A92', '#FF4500', '#FFF6BD'];
    for (let i = 0; i < this.numberOfPetals; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        radius: Math.random() * 6 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedY: Math.random() * 1.5 + 0.5,
        speedX: Math.random() * 1 - 0.5,
        rotation: Math.random() * 360,
        rotationSpeed: Math.random() * 2 - 1,
        opacity: Math.random() * 0.7 + 0.3
      });
    }
  }

  triggerConfettiBurst(originX, originY) {
    const x = originX || this.canvas.width / 2;
    const y = originY || this.canvas.height / 3;
    const colors = ['#FFD700', '#FF4500', '#E86A92', '#00FFCC', '#9B51E0', '#FFF6BD'];

    for (let i = 0; i < 90; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 12 + 4;

      this.confetti.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        radius: Math.random() * 7 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        gravity: 0.25,
        rotation: Math.random() * 360,
        rotationSpeed: Math.random() * 10 - 5,
        life: 1,
        decay: Math.random() * 0.02 + 0.01
      });
    }
  }

  animate() {
    if (!this.ctx || !this.canvas) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Render Falling Rose & Marigold Petals
    this.particles.forEach(p => {
      p.y += p.speedY;
      p.x += Math.sin(p.y * 0.01) + p.speedX;
      p.rotation += p.rotationSpeed;

      if (p.y > this.canvas.height) {
        p.y = -10;
        p.x = Math.random() * this.canvas.width;
      }

      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate((p.rotation * Math.PI) / 180);
      this.ctx.globalAlpha = p.opacity;

      this.ctx.beginPath();
      this.ctx.ellipse(0, 0, p.radius, p.radius * 1.5, 0, 0, Math.PI * 2);
      this.ctx.fillStyle = p.color;
      this.ctx.fill();

      this.ctx.restore();
    });

    // Render Burst Confetti
    for (let i = this.confetti.length - 1; i >= 0; i--) {
      const c = this.confetti[i];
      c.x += c.vx;
      c.y += c.vy;
      c.vy += c.gravity;
      c.rotation += c.rotationSpeed;
      c.life -= c.decay;

      if (c.life <= 0 || c.y > this.canvas.height) {
        this.confetti.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.translate(c.x, c.y);
      this.ctx.rotate((c.rotation * Math.PI) / 180);
      this.ctx.globalAlpha = c.life;
      this.ctx.fillStyle = c.color;
      this.ctx.fillRect(-c.radius / 2, -c.radius / 2, c.radius, c.radius);
      this.ctx.restore();
    }

    requestAnimationFrame(() => this.animate());
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.particleEngine = new ParticleEngine();
});
