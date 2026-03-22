class Player {
  constructor(x, groundY) {
    this.size = 30;
    this.x = x;
    this.y = groundY - this.size;

    this.velY = 0;
    this.gravity = 0.7;
    this.jumpForce = -12;

    this.isOnGround = true;
    this.groundY = groundY;
  }

  jump() {
    if (this.isOnGround) {
      this.velY = this.jumpForce;
      this.isOnGround = false;
    }
  }

  update(platforms) {
    this.velY += this.gravity;
    this.y += this.velY;

    // Ground collision
    if (this.y + this.size >= this.groundY) {
      this.y = this.groundY - this.size;
      this.velY = 0;
      this.isOnGround = true;
    }

    // Platform collision
    for (const p of platforms) {
      if (
        this.x + this.size > p.x &&
        this.x < p.x + p.width &&
        this.y + this.size <= p.y + 10 &&
        this.y + this.size >= p.y - 10 &&
        this.velY >= 0
      ) {
        this.y = p.y - this.size;
        this.velY = 0;
        this.isOnGround = true;
      }
    }
  }

  draw(ctx) {
    ctx.fillStyle = "#00e5ff";
    ctx.fillRect(this.x, this.y, this.size, this.size);
  }

  getBounds() {
    return { x: this.x, y: this.y, w: this.size, h: this.size };
  }
}
