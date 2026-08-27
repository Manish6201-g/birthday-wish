/* ==========================================================================
   Raksha Bandhan HD Downloadable Greeting Card Generator (Canvas)
   ========================================================================== */

class CardGenerator {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = 1080;
    this.canvas.height = 1350;
    this.ctx = this.canvas.getContext('2d');
  }

  generateCard(sisterName = 'Dearest Sister', brotherName = 'Your Loving Brother', customWish = '') {
    const w = this.canvas.width;
    const h = this.canvas.height;
    const ctx = this.ctx;

    // 1. Rich Festive Background Gradient
    const bgGrad = ctx.createRadialGradient(w / 2, h / 2, 100, w / 2, h / 2, 800);
    bgGrad.addColorStop(0, '#520516');
    bgGrad.addColorStop(0.6, '#370617');
    bgGrad.addColorStop(1, '#120106');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // 2. Ornate Golden Borders & Corner Flourishes
    ctx.save();
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 8;
    ctx.strokeRect(40, 40, w - 80, h - 80);

    ctx.strokeStyle = 'rgba(255, 215, 0, 0.4)';
    ctx.lineWidth = 3;
    ctx.strokeRect(55, 55, w - 110, h - 110);
    ctx.restore();

    // Corner Ornaments
    this.drawCornerFlourish(ctx, 60, 60, 0);
    this.drawCornerFlourish(ctx, w - 60, 60, Math.PI / 2);
    this.drawCornerFlourish(ctx, w - 60, h - 60, Math.PI);
    this.drawCornerFlourish(ctx, 60, h - 60, -Math.PI / 2);

    // 3. Title Header
    ctx.save();
    ctx.textAlign = 'center';
    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 44px "Cinzel", serif';
    ctx.fillText('HAPPY RAKSHA BANDHAN', w / 2, 160);

    ctx.fillStyle = '#FFFBF4';
    ctx.font = 'bold 64px "Playfair Display", serif';
    ctx.fillText(sisterName, w / 2, 240);
    ctx.restore();

    // 4. Detailed Centerpiece Rakhi Drawing
    this.drawCardRakhi(ctx, w / 2, 450);

    // 5. Heart-touching Message Box
    ctx.save();
    const defaultWish = customWish || "May the sacred thread of Rakhi always protect you, bring endless joy, and remind you that you'll always have a brother standing by your side!";
    
    ctx.fillStyle = 'rgba(255, 215, 0, 0.08)';
    ctx.strokeStyle = 'rgba(255, 215, 0, 0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(120, 680, w - 240, 420, 20);
    ctx.fill();
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.fillStyle = '#FFFBF4';
    ctx.font = 'italic 34px "Playfair Display", serif';

    // Wrap text into multiple lines
    this.wrapText(ctx, `"${defaultWish}"`, w / 2, 760, w - 320, 48);

    // 6. Sign Off / From Brother
    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 40px "Cinzel", serif';
    ctx.fillText(`WITH INFINITE LOVE,`, w / 2, 1160);

    ctx.fillStyle = '#FFF2A1';
    ctx.font = 'italic bold 48px "Playfair Display", serif';
    ctx.fillText(brotherName, w / 2, 1230);
    ctx.restore();

    return this.canvas.toDataURL('image/png');
  }

  drawCornerFlourish(ctx, x, y, rotation) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(40, 0);
    ctx.moveTo(0, 0);
    ctx.lineTo(0, 40);
    ctx.arc(20, 20, 20, Math.PI, Math.PI * 1.5);
    ctx.stroke();
    ctx.restore();
  }

  drawCardRakhi(ctx, x, y) {
    ctx.save();
    
    // Silk Thread
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.moveTo(x - 300, y);
    ctx.lineTo(x + 300, y);
    ctx.stroke();

    ctx.strokeStyle = '#9D0208';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(x - 300, y - 4);
    ctx.lineTo(x + 300, y - 4);
    ctx.stroke();

    // Outer Petals Mandala
    for (let i = 0; i < 16; i++) {
      const angle = (i * Math.PI * 2) / 16;
      const px = x + Math.cos(angle) * 110;
      const py = y + Math.sin(angle) * 110;

      ctx.fillStyle = i % 2 === 0 ? '#9D0208' : '#FFD700';
      ctx.beginPath();
      ctx.arc(px, py, 26, 0, Math.PI * 2);
      ctx.fill();
    }

    // Gold Center Ring
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(x, y, 90, 0, Math.PI * 2);
    ctx.fill();

    // Inner Maroon Gem
    ctx.fillStyle = '#6A040F';
    ctx.beginPath();
    ctx.arc(x, y, 60, 0, Math.PI * 2);
    ctx.fill();

    // Center Pearl
    ctx.fillStyle = '#FFFBF4';
    ctx.beginPath();
    ctx.arc(x, y, 25, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;

      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line, x, y);
        line = words[n] + ' ';
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, y);
  }

  downloadCard(sisterName, brotherName, customWish) {
    const dataUrl = this.generateCard(sisterName, brotherName, customWish);
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `Raksha_Bandhan_Wish_${sisterName.replace(/\s+/g, '_')}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}

window.cardGenerator = new CardGenerator();
