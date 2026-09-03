/* ==========================================================================
   HD Canvas Greeting Card Generator (1080x1350 PNG Exporter with Multi-Theme)
   ========================================================================== */

class CardGenerator {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = 1080;
    this.canvas.height = 1350;
    this.ctx = this.canvas.getContext('2d');
  }

  downloadCard(sisterName, brotherName, customWish, theme = 'royal') {
    if (!this.ctx) return;

    // Background Themes
    if (theme === 'sunset') {
      const grad = this.ctx.createLinearGradient(0, 0, 1080, 1350);
      grad.addColorStop(0, '#7A1C08');
      grad.addColorStop(0.5, '#4A0818');
      grad.addColorStop(1, '#1A0208');
      this.ctx.fillStyle = grad;
    } else if (theme === 'emerald') {
      const grad = this.ctx.createLinearGradient(0, 0, 1080, 1350);
      grad.addColorStop(0, '#064E3B');
      grad.addColorStop(0.5, '#2D030E');
      grad.addColorStop(1, '#0F172A');
      this.ctx.fillStyle = grad;
    } else {
      // Royal Maroon (Default)
      const grad = this.ctx.createRadialGradient(540, 675, 50, 540, 675, 750);
      grad.addColorStop(0, '#52091A');
      grad.addColorStop(0.6, '#2D030E');
      grad.addColorStop(1, '#120105');
      this.ctx.fillStyle = grad;
    }
    this.ctx.fillRect(0, 0, 1080, 1350);

    // Golden Outer Border
    this.ctx.strokeStyle = '#FFD700';
    this.ctx.lineWidth = 14;
    this.ctx.strokeRect(50, 50, 980, 1250);

    this.ctx.strokeStyle = '#D4AF37';
    this.ctx.lineWidth = 4;
    this.ctx.strokeRect(70, 70, 940, 1210);

    // Corner Filigree Ornaments
    this.drawCornerFiligree(90, 90);
    this.drawCornerFiligree(990, 90, true, false);
    this.drawCornerFiligree(90, 1260, false, true);
    this.drawCornerFiligree(990, 1260, true, true);

    // Top Header Badge
    this.ctx.fillStyle = '#FFD700';
    this.ctx.font = 'bold 36px serif';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('✨ RAKSHA BANDHAN CELEBRATION ✨', 540, 180);

    // Main Diya Icon
    this.ctx.font = '72px serif';
    this.ctx.fillText('🪔', 540, 270);

    // Greeting Title
    this.ctx.fillStyle = '#FFF6BD';
    this.ctx.font = 'bold 64px serif';
    this.ctx.fillText(`Happy Raksha Bandhan,`, 540, 370);

    this.ctx.fillStyle = '#FFD700';
    this.ctx.font = 'italic bold 80px serif';
    this.ctx.fillText(`${sisterName}! 🌸`, 540, 480);

    // Divider Line
    this.ctx.strokeStyle = 'rgba(255, 215, 0, 0.5)';
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    this.ctx.moveTo(340, 530);
    this.ctx.lineTo(740, 530);
    this.ctx.stroke();

    // Heartfelt Message Box
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    this.ctx.font = 'italic 42px serif';
    
    const lines = this.wrapText(customWish || 'Wishing you a joyful, blessed, and love-filled Raksha Bandhan!', 800);
    let startY = 620;
    lines.forEach(line => {
      this.ctx.fillText(`"${line}"`, 540, startY);
      startY += 60;
    });

    // Brother Signature
    this.ctx.fillStyle = '#FFF6BD';
    this.ctx.font = '32px sans-serif';
    this.ctx.fillText('With Endless Love & Protection,', 540, 1020);

    this.ctx.fillStyle = '#FFD700';
    this.ctx.font = 'bold 64px serif';
    this.ctx.fillText(`- ${brotherName} 💖`, 540, 1110);

    // Bottom Decorative Footer
    this.ctx.fillStyle = 'rgba(255, 215, 0, 0.7)';
    this.ctx.font = '24px sans-serif';
    this.ctx.fillText('Sacred Bond of Brother & Sister', 540, 1220);

    // Download Canvas PNG Link
    const link = document.createElement('a');
    link.download = `Raksha_Bandhan_${sisterName}.png`;
    link.href = this.canvas.toDataURL('image/png');
    link.click();
  }

  drawCornerFiligree(x, y, flipX = false, flipY = false) {
    this.ctx.save();
    this.ctx.translate(x, y);
    this.ctx.scale(flipX ? -1 : 1, flipY ? -1 : 1);

    this.ctx.strokeStyle = '#FFD700';
    this.ctx.lineWidth = 4;
    this.ctx.beginPath();
    this.ctx.arc(0, 0, 40, 0, Math.PI / 2);
    this.ctx.stroke();

    this.ctx.restore();
  }

  wrapText(text, maxWidth) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const width = this.ctx.measureText(currentLine + ' ' + word).width;
      if (width < maxWidth) {
        currentLine += ' ' + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    lines.push(currentLine);
    return lines;
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.cardGenerator = new CardGenerator();
});
