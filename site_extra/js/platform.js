class Platform {
  constructor(x, y, width = 120) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = 10;
  }

  update(speed) {
    this.x -= speed;
  }

  draw(ctx) {
    ctx.fillStyle = "#66ff99";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}
