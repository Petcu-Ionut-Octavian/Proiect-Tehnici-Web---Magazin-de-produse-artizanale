class Obstacle {
  constructor(x, groundY, type = "spike") {
    this.type = type;

    if (type === "spike") {
      this.width = 30;
      this.height = 40;
    } else if (type === "double") {
      this.width = 60;
      this.height = 40;
    } else if (type === "wall") {
      this.width = 40;
      this.height = 50;
    }

    this.x = x;
    this.y = groundY - this.height;
  }

  update(speed) {
    this.x -= speed;
  }

  draw(ctx) {
    ctx.fillStyle = "#ff3366";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  getBounds() {
    return { x: this.x, y: this.y, w: this.width, h: this.height };
  }
}
