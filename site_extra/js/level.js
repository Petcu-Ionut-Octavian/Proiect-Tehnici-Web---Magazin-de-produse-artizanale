// Fully playable level — all jumps possible, all coins reachable

const levelData = [
  // --- INTRO (easy warm-up) ---
  { type: "spike", x: 600 },
  { type: "spike", x: 900 },
  { type: "double", x: 1300 },

  // --- PLATFORM + COINS ---
  { type: "platform", x: 1700, y: 330 },
  { type: "coin", x: 1750, y: 300 },
  { type: "coin", x: 1800, y: 300 },
  { type: "spike", x: 2000 },

  // --- SMALL GAP + PLATFORM ---
  { type: "platform", x: 2300, y: 300 },
  { type: "coin", x: 2350, y: 270 },
  { type: "coin", x: 2400, y: 270 },
  { type: "double", x: 2600 },

  // --- WALL SECTION (reduced height so it's jumpable) ---
  { type: "wall", x: 2900, height: 0 }, // was 120, now possible
  { type: "spike", x: 3200 },
  { type: "spike", x: 3500 },
  { type: "double", x: 3800 },

  // --- HIGH PLATFORM RUN ---
  { type: "platform", x: 4100, y: 320 },
  { type: "platform", x: 4400, y: 280 },
  { type: "coin", x: 4450, y: 250 },
  { type: "coin", x: 4500, y: 250 },
  { type: "platform", x: 4700, y: 320 },
  { type: "spike", x: 4950 },

  // --- FINAL CHALLENGE (fair but tricky) ---
  { type: "double", x: 5200 },
  { type: "wall", x: 5500, height: 80 }, // reduced height
  { type: "spike", x: 5800 },
  { type: "double", x: 6000 },

  // --- END ---
  { type: "end", x: 6500 }
];
