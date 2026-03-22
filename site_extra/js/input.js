class InputHandler {
  constructor(onJump) {
    window.addEventListener("keydown", e => {
      if (e.code === "Space") onJump();
      if (e.code === "KeyF") toggleFullscreen();
    });

    window.addEventListener("mousedown", onJump);
  }
}
