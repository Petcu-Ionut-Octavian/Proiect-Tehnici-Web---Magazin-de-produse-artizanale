class Coin {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 18;
    this.collected = false;
  }

  update(speed) {
    this.x -= speed;
  }

  draw(ctx) {
    if (!this.collected) {
      ctx.fillStyle = "gold";
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  getBounds() {
    return { x: this.x - 9, y: this.y - 9, w: 18, h: 18 };
  }
}
